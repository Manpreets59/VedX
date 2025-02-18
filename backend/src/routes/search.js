const express = require('express');
const router = express.Router();
const Search = require('../models/search');
const { searchWithSerper, generateAnswer,generateRelatedQuestions } = require('../utils/searchUtils');

router.post('/query', async (req, res) => {
  try {
    const { query } = req.body;
    
    // Get search results
    const searchResults = await searchWithSerper(query);
    
    // Generate answer using the search results
    const answer = await generateAnswer(query, searchResults);
    
    // Generate related questions
    const relatedQuestions = await generateRelatedQuestions(query, searchResults, answer);
    
    
    // Save search to database
    const search = new Search({
      query,
      results: searchResults,
      answer,
      relatedQuestions
    });
    await search.save();
    
    res.json({
      success: true,
      data: {
        answer,
        searchResults,
        relatedQuestions
      }
    });
  } catch (error) {
    console.error('Search route error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/history', async (req, res) => {
  try {
    const searches = await Search.find()
      .sort({ timestamp: -1 })
      .limit(10);
      
    res.json({
      success: true,
      data: searches
    });
  } catch (error) {
    console.error('History route error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});



module.exports = router;

