import { useState } from 'react';
import { useAuthForm } from '../hooks/useAuthForm';

interface AuthModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  
  const {
    username,
    setUsername,
    password,
    setPassword,
    error,
    success,
    isLoading,
    handleSubmit
  } = useAuthForm({ 
    mode: isLogin ? 'login' : 'signup', 
    onSuccess, 
    redirectOnSuccess: false 
  });

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Modal Card */}
      <div className="max-w-md w-full bg-white border-4 border-on-background p-8 rounded-xl shadow-[8px_8px_0px_0px_#111111] text-center flex flex-col gap-6 relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          disabled={isLoading}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center border-2 border-on-background rounded-full bg-secondary-container hover:bg-secondary-fixed active:translate-y-[2px] transition-all cursor-pointer font-black text-sm disabled:opacity-50"
        >
          ✕
        </button>

        <h1 className="text-3xl font-black uppercase tracking-tight">
          {isLogin ? 'Accedi' : 'Registrati'}
        </h1>
        
        <p className="text-sm font-semibold text-on-surface-variant">
          {isLogin 
            ? 'Inserisci le tue credenziali per entrare nel gioco!' 
            : 'Crea un account gratuito per iniziare a disegnare!'}
        </p>

        {error && (
          <div className="bg-red-50 text-red-800 border-2 border-red-300 p-3 rounded font-bold text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-800 border-2 border-green-300 p-3 rounded font-bold text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            type="text" 
            placeholder="Username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
            className="border-2 border-on-background p-3 rounded font-bold text-sm bg-background focus:outline-none focus:ring-0 focus:shadow-[2px_2px_0px_0px_#111111] transition-shadow disabled:opacity-50" 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            className="border-2 border-on-background p-3 rounded font-bold text-sm bg-background focus:outline-none focus:ring-0 focus:shadow-[2px_2px_0px_0px_#111111] transition-shadow disabled:opacity-50" 
          />

          <button 
            type="submit"
            disabled={isLoading}
            className={`border-4 border-on-background rounded-lg py-3 font-bold text-lg shadow-[4px_4px_0px_0px_#111111] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none active:translate-y-[4px] active:translate-x-[4px] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${isLogin ? 'bg-secondary-container text-on-background' : 'bg-primary text-white'}`}
          >
            {isLoading ? 'Caricamento...' : (isLogin ? 'Accedi' : 'Registrati')}
          </button>
        </form>

        <div className="text-sm font-bold text-on-surface-variant mt-2">
          {isLogin ? (
            <span>
              Non hai ancora un account?{' '}
              <button 
                onClick={toggleMode} 
                disabled={isLoading}
                className="text-primary hover:underline font-black cursor-pointer bg-transparent border-none p-0 inline disabled:opacity-50"
              >
                Registrati qui
              </button>
            </span>
          ) : (
            <span>
              Hai già un account?{' '}
              <button 
                onClick={toggleMode} 
                disabled={isLoading}
                className="text-primary hover:underline font-black cursor-pointer bg-transparent border-none p-0 inline disabled:opacity-50"
              >
                Accedi qui
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
