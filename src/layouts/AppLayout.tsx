import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';
import LogoutModal from '../components/LogoutModal';
import raccoonAvatar from '../assets/raccoon.png';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isGuest, username, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const triggerLogoutConfirm = () => {
    setIsLogoutModalOpen(true);
  };

  return (
    <div className="bg-background text-on-background font-body-md text-body-md overflow-x-hidden min-h-screen flex flex-col md:flex-row">
      
      {/* Mobile TopBar (Mobile only: < md) */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-primary border-b-4 border-on-background shadow-[0px_4px_0px_0px_#111111] px-4 py-3 flex items-center justify-between">
        <Link to="/home" className="flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary-fixed text-[28px] font-bold">brush</span>
          <span className="text-xl font-black text-white uppercase italic tracking-tight">Quicksketch</span>
        </Link>

        <div className="flex items-center gap-2">
          {isGuest ? (
            <button 
              onClick={() => setIsAuthModalOpen(true)} 
              className="bg-secondary-container text-on-secondary-fixed border-2 border-on-background rounded-lg px-2.5 py-1 text-xs font-bold shadow-[2px_2px_0px_0px_#111111] active:translate-y-0.5 flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">login</span>
              Accedi
            </button>
          ) : (
            <button 
              onClick={triggerLogoutConfirm} 
              className="bg-error text-white border-2 border-on-background rounded-lg px-2.5 py-1 text-xs font-bold shadow-[2px_2px_0px_0px_#111111] active:translate-y-0.5 flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              Esci
            </button>
          )}

          <Link 
            to="/profile" 
            className="w-9 h-9 rounded-full border-2 border-on-background bg-white flex items-center justify-center overflow-hidden shadow-[2px_2px_0px_0px_#111111] active:translate-y-0.5"
            title={isGuest ? 'Profilo Ospite' : `Profilo di ${username}`}
          >
            <img 
              alt="Avatar utente" 
              className="w-full h-full object-cover" 
              src={raccoonAvatar} 
            />
          </Link>
        </div>
      </header>

      {/* SideNavBar (Desktop only: md and up) */}
      <nav className="hidden md:flex flex-col h-screen fixed left-0 top-0 z-40 bg-primary border-r-4 border-on-background shadow-[4px_0px_0px_0px_#111111] w-64">
        <div className="p-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary-fixed text-[32px] font-bold">brush</span>
          <span className="text-2xl font-black text-white">Quicksketch</span>
        </div>
        
        <div className="px-4 mb-6">
          <Link to="/profile" className="bg-white/20 p-2 rounded-lg border-2 border-on-background hard-shadow flex items-center gap-2">
            <div className="w-10 h-10 rounded-full border-2 border-secondary-fixed bg-white flex items-center justify-center overflow-hidden">
              <img 
                alt="Avatar utente" 
                className="w-full h-full object-cover" 
                src={raccoonAvatar} 
              />
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                {isGuest ? 'Ospite' : username || 'Utente'}
              </div>
            </div>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-1 flex flex-col gap-1">
          <Link 
            to="/home" 
            className="flex items-center gap-2 px-4 py-2 bg-secondary-fixed text-on-secondary-fixed border-2 border-on-background shadow-[2px_2px_0px_0px_#111111] m-2 rounded-lg transition-colors group"
          >
            <span className="material-symbols-outlined text-[24px] group-hover:scale-110 transition-transform">gallery_thumbnail</span>
            <span className="text-sm font-bold">Galleria</span>
          </Link>
          <Link 
            to="/draw" 
            className="flex items-center gap-2 px-4 py-2 bg-secondary-fixed text-on-secondary-fixed border-2 border-on-background shadow-[2px_2px_0px_0px_#111111] m-2 rounded-lg transition-colors group"
          >
            <span className="material-symbols-outlined text-[24px] group-hover:scale-110 transition-transform">brush</span>
            <span className="text-sm font-bold">Disegno</span>
          </Link>
          <Link 
            to="/leaderboard" 
            className="flex items-center gap-2 px-4 py-2 bg-secondary-fixed text-on-secondary-fixed border-2 border-on-background shadow-[2px_2px_0px_0px_#111111] m-2 rounded-lg transition-colors group"
          >
            <span className="material-symbols-outlined text-[24px] group-hover:scale-110 transition-transform">leaderboard</span>
            <span className="text-sm font-bold">Classifiche</span>
          </Link>
        </div>

        <div className="p-4 mt-auto">
          {/* Mostra il tasto di login solo se l'utente è un Ospite (Guest) */}
          {isGuest ? (
            <button 
              onClick={() => setIsAuthModalOpen(true)} 
              className="w-full bg-secondary-container text-on-secondary-fixed border-2 border-on-background rounded-lg py-2 px-4 text-sm font-bold hard-shadow hard-shadow-hover hard-shadow-active flex items-center justify-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">login</span>
              Accedi / Registrati
            </button>
          ) : (
            <button 
              onClick={triggerLogoutConfirm} 
              className="w-full bg-error text-white border-2 border-on-background rounded-lg py-2 px-4 text-sm font-bold hard-shadow hard-shadow-hover hard-shadow-active flex items-center justify-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              Logout
            </button>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 ml-0 md:ml-64 p-4 sm:p-6 md:p-8 pt-20 md:pt-8 pb-24 md:pb-8 min-h-screen bg-background-2 bg-sketch-grid flex flex-col gap-6">
        {children}
      </main>

      {/* Mobile Bottom Navigation Bar (Mobile only: < md) */}
      <nav aria-label="Navigazione mobile" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t-4 border-on-background shadow-[0px_-4px_0px_0px_#111111] px-2 py-1.5 flex justify-around items-center">
        <Link 
          to="/home" 
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg border-2 transition-all ${
            location.pathname === '/home' 
              ? 'bg-secondary-container border-on-background shadow-[2px_2px_0px_0px_#111111] font-black' 
              : 'border-transparent text-on-surface-variant font-bold hover:bg-surface-variant'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">gallery_thumbnail</span>
          <span className="text-[11px] leading-tight">Galleria</span>
        </Link>

        <Link 
          to="/draw" 
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg border-2 transition-all ${
            location.pathname === '/draw' 
              ? 'bg-secondary-container border-on-background shadow-[2px_2px_0px_0px_#111111] font-black' 
              : 'border-transparent text-on-surface-variant font-bold hover:bg-surface-variant'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">brush</span>
          <span className="text-[11px] leading-tight">Disegno</span>
        </Link>

        <Link 
          to="/leaderboard" 
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg border-2 transition-all ${
            location.pathname === '/leaderboard' 
              ? 'bg-secondary-container border-on-background shadow-[2px_2px_0px_0px_#111111] font-black' 
              : 'border-transparent text-on-surface-variant font-bold hover:bg-surface-variant'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">leaderboard</span>
          <span className="text-[11px] leading-tight">Classifiche</span>
        </Link>

        <Link 
          to="/profile" 
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg border-2 transition-all ${
            location.pathname === '/profile' 
              ? 'bg-secondary-container border-on-background shadow-[2px_2px_0px_0px_#111111] font-black' 
              : 'border-transparent text-on-surface-variant font-bold hover:bg-surface-variant'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">person</span>
          <span className="text-[11px] leading-tight">Profilo</span>
        </Link>
      </nav>

      {isAuthModalOpen && (
        <AuthModal 
          onClose={() => setIsAuthModalOpen(false)} 
          onSuccess={() => setIsAuthModalOpen(false)}
        />
      )}

      {isLogoutModalOpen && (
        <LogoutModal 
          isGuest={isGuest}
          onClose={() => setIsLogoutModalOpen(false)}
          onConfirm={() => {
            setIsLogoutModalOpen(false);
            handleLogout();
          }}
        />
      )}
    </div>
  );
}
