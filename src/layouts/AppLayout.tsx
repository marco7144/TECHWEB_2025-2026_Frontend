import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate();
  const { isGuest, username, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const triggerLogoutConfirm = () => {
    handleLogout();
  };

  return (
    <div className="bg-background text-on-background font-body-md text-body-md overflow-x-hidden min-h-screen flex flex-col md:flex-row">
      
      {/* SideNavBar (Desktop) */}
      <nav className="hidden md:flex flex-col h-screen fixed left-0 top-0 z-40 bg-primary border-r-4 border-on-background shadow-[4px_0px_0px_0px_#111111] w-64">
        <div className="p-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary-fixed text-[32px] font-bold">brush</span>
          <span className="text-2xl font-black text-white">Quicksketch</span>
        </div>
        
        <div className="px-4 mb-6">
          <Link to="/profile" className="bg-white/20 p-2 rounded-lg border-2 border-on-background hard-shadow flex items-center gap-2">
            <div className="w-10 h-10 rounded-full border-2 border-secondary-fixed bg-primary-container flex items-center justify-center overflow-hidden">
              <img 
                alt="Current Player Avatar" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoDBFAVxBDKPgbfEqzZkHzMmeOziTM-LSfiTIYdVoPi6wFS7f1LBNvQHWHa3b0WInzxXzoIkKvwUdYB-CqWv6X5jK2xMCOFKGfhB_wU1cxO-P-DKqRGq4cdQQ5sCU8S_f4eaNtv8TevYwHDx0CZwepLvXN-Oa1MaU_baxJkoBywFSYkEP2HtxRqHQvlje6AGTAsuYMRyRfpz2ipF6mAmNJc4tPSBHiqIpU5K_ly_Yk4gT96GvloXZu3V6nuPj0uSKSMA6Dg-393SSj" 
              />
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                {isGuest ? 'Guest' : username || 'Username'}
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

      {/* TopAppBar (Mobile) */}
      <header className="md:hidden flex justify-between items-center w-full px-6 py-4 max-w-full z-50 bg-primary border-b-4 border-on-background shadow-[4px_4px_0px_0px_#111111] sticky top-0">
        <div className="text-2xl font-black text-white uppercase italic">Quicksketch</div>
        <div className="flex gap-4">
          <button 
            onClick={triggerLogoutConfirm}
            className="text-secondary-fixed hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all active:translate-x-1 active:translate-y-1 active:shadow-none flex items-center bg-transparent border-none p-0 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[28px]">{isGuest ? 'door_open' : 'logout'}</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 min-h-screen bg-background-2 bg-sketch-grid flex flex-col gap-6 pb-[100px] md:pb-8">
        {children}
      </main>

      {/* BottomNavBar (Mobile) */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 md:hidden bg-background border-t-4 border-on-background shadow-[0px_-4px_0px_0px_#111111]">
        <Link to="/home" className="flex flex-col items-center justify-center text-on-surface-variant p-2 hover:bg-surface-container-high active:scale-95 transition-transform rounded-lg">
          <span className="material-symbols-outlined text-[24px]">home</span>
          <span className="text-[10px] font-bold mt-1">Home</span>
        </Link>
        <Link to="/draw" className="flex flex-col items-center justify-center bg-secondary-container text-on-secondary-container border-2 border-on-background rounded-xl px-4 py-1 active:scale-95 transition-transform">
          <span className="material-symbols-outlined text-[24px] font-bold">draw</span>
          <span className="text-[10px] font-bold mt-1">Disegna</span>
        </Link>
        <Link to="/leaderboard" className="flex flex-col items-center justify-center text-on-surface-variant p-2 hover:bg-surface-container-high active:scale-95 transition-transform rounded-lg">
          <span className="material-symbols-outlined text-[24px]">military_tech</span>
          <span className="text-[10px] font-bold mt-1">Classifiche</span>
        </Link>
        <button 
          onClick={triggerLogoutConfirm} 
          className="flex flex-col items-center justify-center text-on-surface-variant p-2 hover:bg-surface-container-high active:scale-95 transition-transform rounded-lg bg-transparent border-none cursor-pointer"
        >
          <span className="material-symbols-outlined text-[24px]">{isGuest ? 'door_open' : 'logout'}</span>
          <span className="text-[10px] font-bold mt-1">{isGuest ? 'Esci' : 'Logout'}</span>
        </button>
      </nav>

      {isAuthModalOpen && (
        <AuthModal 
          onClose={() => setIsAuthModalOpen(false)} 
          onSuccess={() => {
            setIsAuthModalOpen(false);
            window.location.reload();
          }}
        />
      )}

    </div>
  );
}
