import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';
import TypewriterEffect from '../components/TypewriterEffect';
import FeatureCard from '../components/FeatureCard';

const features = [
  { icon: '✨', title: 'Lightning Fast', desc: 'Get instant answers to your questions' },
  { icon: '🔮', title: 'AI-Powered', desc: 'Powered by advanced artificial intelligence' },
  { icon: '🎯', title: 'Accurate Results', desc: 'Precise and relevant information' }
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/search', { state: { query: searchQuery } });
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl mx-auto text-center">
        <div className="mb-12">
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-8">
            VedX
          </h2>
          <div className="h-16 flex items-center justify-center">
            <TypewriterEffect />
          </div>
        </div>

        <form onSubmit={handleSearch} className="relative mb-12">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-zinc-900 rounded-2xl border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
              placeholder="Ask anything..."
            />
          </div>
          
          <button
            type="submit"
            className="mt-6 px-8 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-medium rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto group"
          >
            Ask Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
      <div className="absolute bottom-4 right-4">
        <div className="animate-pulse">
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent font-medium">
            Developed by HackOps
          </span>
        </div>
      </div>
    </div>
  );
}