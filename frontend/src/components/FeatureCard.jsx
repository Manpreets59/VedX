import React from 'react';

export default function FeatureCard({ icon, title, desc }) {
  return (
    <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors">
      <div className="text-2xl mb-2">{icon}</div>
      <h3 className="font-semibold mb-1 text-white">{title}</h3>
      <p className="text-sm text-zinc-400">{desc}</p>
    </div>
  );
}