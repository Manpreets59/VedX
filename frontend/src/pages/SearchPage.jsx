import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MessageSquare, Clock, Share2, ExternalLink } from 'lucide-react';
import { searchQuery } from '../services/api';
import { formatAnswer } from '../utils/formatters';

export default function SearchPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [response, setResponse] = useState(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [recentQueries, setRecentQueries] = useState([]);
  const [error, setError] = useState(null);

  
  
    useEffect(() => {
      const fetchSearchResults = async () => {
        if (!location.state?.query) {
          navigate('/');
          return;
        }
  
        try {
          setIsGenerating(true);
          const data = await searchQuery(location.state.query);
  
          if (data.success) {
            setResponse(data.data);
           
            setRecentQueries(prev => {
              const query = location.state.query;
              
              const filteredQueries = prev.filter(q => q !== query);
              
              return [query, ...filteredQueries].slice(0, 3);
            });
          } else {
            setError('Failed to get search results');
          }
        } catch (err) {
          setError('Failed to connect to search service');
        } finally {
          setIsGenerating(false);
        }
      };
  
      fetchSearchResults();
    }, [location.state, navigate]);

  // Ensure we have query before rendering
  if (!location.state?.query) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black flex">
      {/* Left Sidebar */}
      <div className="w-80 border-r border-zinc-800 p-4 hidden lg:block">
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent text-2xl font-bold tracking-tight"
          >
            VedX
          </button>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-2 bg-zinc-900 rounded-lg text-zinc-300">
            <MessageSquare className="w-4 h-4" />
            <span>Recent Searches</span>
          </div>
          <div>
            
      <div className="recent-searches">
        {recentQueries.map((q, index) => (
          <div 
            key={`${q}-${index}`} 
            className="flex items-center gap-2 p-2 hover:bg-zinc-900 rounded-lg text-zinc-400 cursor-pointer"
          >
            <Clock className="w-4 h-4" />
            <span>{q}</span>
          </div>
        ))}
      </div>
        </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-h-screen overflow-auto">
        {/* Query Card */}
        <div className="sticky top-0 bg-black border-b border-zinc-800 p-4">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6 p-4 bg-zinc-900 rounded-xl border border-zinc-800">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-purple-400" />
                  <span className="text-zinc-400 text-sm">Your Query</span>
                </div>
                <Share2 className="w-4 h-4 text-zinc-400 hover:text-purple-400 cursor-pointer" />
              </div>
              <p className="text-white font-medium">{location.state.query}</p>
            </div>
          </div>
        </div>

        {/* Response Section */}
        <div className="max-w-3xl mx-auto p-4">
          {isGenerating ? (
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
              <div className="h-4 bg-zinc-800 rounded w-1/2"></div>
              <div className="h-4 bg-zinc-800 rounded w-5/6"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 p-4 bg-red-500/10 rounded-lg">
              {error}
            </div>
          ) : response ? (
            <div className="space-y-6">
              {/* Answer */}
              <div className="prose prose-invert">
                <p className="text-xl text-white leading-relaxed">
                  {formatAnswer(response.answer)}
                </p>
              </div>

              {/* Search Results */}
              <div className="mt-8 space-y-4">
                <h3 className="text-white font-medium mb-4">Sources</h3>
                {response.searchResults && response.searchResults.map((result, index) => (
              <a 
              key={index}
             href={result.url}
               target="_blank"
              rel="noopener noreferrer"
               className="block p-4 bg-zinc-900 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors"
                  >
              <div className="flex items-center justify-between">
              <h4 className="text-purple-400 font-medium mb-2">{result.name}</h4>
               <ExternalLink className="w-4 h-4 text-zinc-400" />
                </div>
            <p className="text-zinc-300 text-sm">{result.snippet}</p>
             </a>
               ))}

              </div>

              {/* Related Questions */}
              <div className="mt-8">
                <h3 className="text-white font-medium mb-4">Related Questions</h3>
                <div className="grid grid-cols-1 gap-3">
                  {response.relatedQuestions && response.relatedQuestions.map((question, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        navigate('/search', { state: { query: question } });
                      }}
                      className="p-3 bg-zinc-900 rounded-lg border border-zinc-800 text-left text-zinc-300 hover:border-zinc-700 transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}