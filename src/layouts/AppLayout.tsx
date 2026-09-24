import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    <div className="bg-background text-on-background font-body-md text-body-md overflow-x-hidden min-h-screen flex flex-row">
      
      {/* SideNavBar */}
      <nav className="flex flex-col h-screen fixed left-0 top-0 z-40 bg-primary border-r-4 border-on-background shadow-[4px_0px_0px_0px_#111111] w-64">
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
      <main className="flex-1 ml-64 p-8 min-h-screen bg-background-2 bg-sketch-grid flex flex-col gap-6">
        {children}
      </main>

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
