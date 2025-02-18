const axios = require('axios');

const MORE_QUESTIONS_PROMPT = `You are a helpful assistant that helps the user to ask related questions, based on user's original question and the related contexts. Please identify worthwhile topics that can be follow-ups, and write questions no longer than 20 words each. Please make sure that specifics, like events, names, locations, are included in follow up questions so they can be asked standalone. For example, if the original question asks about "the Manhattan project", in the follow up question, do not just say "the project", but use the full name "the Manhattan project". The format of giving the responses and generating the questions should be like this:
1. [Question 1]
2. [Question 2] 
3. [Question 3]
Here are the contexts of the question:
{context}
Remember, based on the original question and related contexts, suggest three such further questions. Do NOT repeat the original question. Each related question should be no longer than 20 words. Here is the original question:`;

async function searchWithSerper(query) {
  try {
    const response = await axios.post('https://google.serper.dev/search', {
      q: query,
      num: 8
    }, {
      headers: {
        'X-API-KEY': process.env.SERPER_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    const contexts = [];
    
    if (response.data.knowledgeGraph) {
      const kg = response.data.knowledgeGraph;
      if (kg.descriptionUrl || kg.website) {
        contexts.push({
          name: kg.title || "",
          url: kg.descriptionUrl || kg.website,
          snippet: kg.description
        });
      }
    }

    if (response.data.organic) {
      contexts.push(...response.data.organic.map(item => ({
        name: item.title,
        url: item.link,
        snippet: item.snippet
      })));
    }

    return contexts.slice(0, 8);
  } catch (error) {
    console.error('Search error:', error);
    throw new Error('Search engine error');
  }
}

function formatSearchContext(searchResults) {
  return searchResults
    .map((result, index) => {
      const title = result.name || '';
      const snippet = result.snippet || '';
      return `Context ${index + 1}:\nTitle: ${title}\nContent: ${snippet}\n`;
    })
    .join('\n');
}

async function generateAnswer(query, contexts) {
  try {
    const formattedContext = contexts.map((ctx, i) => 
      `[[citation:${i + 1}]] ${ctx.snippet}`
    ).join('\n\n');

    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a large language AI assistant. You are given a user question, and please write clean, concise and accurate answer to the question. You will be given a set of related contexts to the question, each starting with a reference number like [[citation:x]], where x is a number. Please use the context and cite the context at the end of each sentence if applicable.\n\nContext:\n${formattedContext}`
        },
        {
          role: "user",
          content: query
        }
      ],
      temperature: 0.5,
      max_tokens: 1024
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Answer generation error:', error);
    throw new Error('Failed to generate answer');
  }
}

async function generateRelatedQuestions(query, searchResults, answer) {
  try {
    const context = formatSearchContext(searchResults);
    const prompt = MORE_QUESTIONS_PROMPT.replace('{context}', context) + `\n${query}`;

    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates related questions based on search context."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1024
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const generatedQuestions = response.data.choices[0]?.message?.content || '';

    // Parse and format the generated questions
    const questions = generatedQuestions
      .split('\n')
      .filter(line => line.match(/^\d+\./)) // Only keep numbered lines
      .map(line => line.replace(/^\d+\.\s*/, '')) // Remove numbers
      .map(line => line.replace(/[\[\]]/g, '')) // Remove brackets
      .filter(line => line.length > 0 && line.length <= 100); // Validate length

    // Ensure we have at least some questions
    if (questions.length === 0) {
      return [
        `What are the key developments in ${query}?`,
        `How has ${query} evolved over time?`,
        `What are the main challenges associated with ${query}?`
      ];
    }

    return questions;
  } catch (error) {
    console.error('Error generating related questions:', error);
    return [
      `What are the key aspects of ${query}?`,
      `How does ${query} work in practice?`,
      `What are the future implications of ${query}?`
    ];
  }
}

module.exports = {
  searchWithSerper,
  generateAnswer,
  generateRelatedQuestions
};