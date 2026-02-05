import React, { useState } from 'react';
import { Lock, X } from 'lucide-react';

interface LoginModalProps {
  onLogin: () => void;
  onCancel: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onLogin, onCancel }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'MEIS2025') {
      onLogin();
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
      <div className="bg-white/90 w-full max-w-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden transform transition-all animate-in zoom-in-95 duration-300">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center relative">
          <button 
            onClick={onCancel}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="mx-auto w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 shadow-inner">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Teacher Access</h2>
          <p className="text-blue-100 text-sm mt-1">Please enter your authorized pin</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <input
                type="password"
                autoFocus
                placeholder="Enter Password"
                className={`w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none transition-all text-center text-lg tracking-widest ${
                  error 
                    ? 'border-red-500 focus:ring-4 focus:ring-red-500/10' 
                    : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
                }`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
              />
              {error && (
                <p className="text-red-500 text-xs mt-2 text-center font-medium animate-pulse">Incorrect password. Please try again.</p>
              )}
            </div>
            
            <button
              type="submit"
              className="w-full py-3.5 bg-gray-900 hover:bg-black text-white rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] shadow-xl shadow-gray-900/20"
            >
              Unlock Dashboard
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};