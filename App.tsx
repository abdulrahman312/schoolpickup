import React, { useState } from 'react';
import { ParentView } from './components/ParentView';
import { TeacherView } from './components/TeacherView';
import { LoginModal } from './components/LoginModal';
import { ShieldCheck } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<'parent' | 'teacher'>('parent');
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      
      {/* Decorative Background Blobs - Enhanced Colors */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-r from-blue-400/30 to-cyan-300/30 rounded-full blur-[120px] pointer-events-none mix-blend-multiply" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-l from-purple-400/30 to-pink-300/30 rounded-full blur-[120px] pointer-events-none mix-blend-multiply" />
      <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-gradient-to-b from-indigo-300/20 to-blue-200/20 rounded-full blur-[100px] pointer-events-none" />

      {view === 'parent' ? (
        <div className="flex flex-col min-h-screen relative z-10">
          {/* Main Header with Logo */}
          <header className="w-full glass-panel shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-center md:text-left">
                {/* Logo */}
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                  <img 
                    src="https://i.ibb.co/bgFrgXkW/meis.png" 
                    alt="MEIS Logo" 
                    className="relative h-20 w-auto md:h-24 drop-shadow-lg transform transition-transform group-hover:scale-105 duration-300"
                  />
                </div>
                
                {/* School Name Text */}
                <div className="flex flex-col justify-center">
                  <h1 className="text-xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-indigo-800 leading-tight pb-1">
                    مدرسة الشرق الأوسط العالمية - المروج
                  </h1>
                  <h2 className="text-sm md:text-lg font-semibold text-gray-600 tracking-wide">
                    Middle East International School - AlMuruj
                  </h2>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 flex flex-col items-center justify-start p-4 md:p-8">
            <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700">
              <ParentView />
            </div>
          </main>

          {/* Footer */}
          <footer className="py-6 text-center text-gray-500 text-sm glass-panel mt-auto">
            <div className="flex flex-col items-center gap-2">
              <p>© 2026 Middle East International School. All rights reserved.</p>
              <button
                onClick={() => setShowLogin(true)}
                className="flex items-center gap-2 px-5 py-2 rounded-full text-indigo-600 hover:text-white hover:bg-indigo-600 transition-all duration-300 text-sm font-semibold border border-indigo-200 hover:border-indigo-600 shadow-sm hover:shadow-md"
              >
                <ShieldCheck className="w-4 h-4" />
                Teacher Login
              </button>
            </div>
          </footer>

          {/* Login Modal */}
          {showLogin && (
            <LoginModal
              onLogin={() => {
                setView('teacher');
                setShowLogin(false);
              }}
              onCancel={() => setShowLogin(false)}
            />
          )}
        </div>
      ) : (
        /* Teacher View (Full Screen Dashboard) */
        <TeacherView onLogout={() => setView('parent')} />
      )}
    </div>
  );
};

export default App;