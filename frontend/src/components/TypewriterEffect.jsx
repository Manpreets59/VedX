import React, { useState, useEffect } from 'react';

const translations = [
  "What do you want to ask?",
  "आप क्या पूछना चाहते हैं?",
  "ਤੁਸੀਂ ਕੀ ਪੁੱਛਣਾ ਚਾਹੁੰਦੇ ਹੋ?",
  "আপনি কি জিজ্ঞাসা করতে চান?",
  "तुम्हाला काय विचारायचे आहे?",
  "మీరు ఏమి అడగాలనుకుంటున్నారు?"
];

export default function TypewriterEffect() {
  const [text, setText] = useState('');
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    const currentPhrase = translations[currentPhraseIndex];
    const typingSpeed = isDeleting ? 50 : 100;
    const pauseTime = isDeleting ? 50 : 2000;
    
    if (!isDeleting && text === currentPhrase) {
      setTimeout(() => setIsDeleting(true), pauseTime);
      return;
    }
    
    if (isDeleting && text === '') {
      setIsDeleting(false);
      setCurrentPhraseIndex((prev) => (prev + 1) % translations.length);
      return;
    }
    
    const timeout = setTimeout(() => {
      setText(prev => {
        if (isDeleting) return prev.slice(0, -1);
        return currentPhrase.slice(0, prev.length + 1);
      });
    }, typingSpeed);
    
    return () => clearTimeout(timeout);
  }, [text, isDeleting, currentPhraseIndex]);

  return (
    <span className="text-4xl font-bold text-white">
      {text}
      <span className="animate-pulse">|</span>
    </span>
  );
}