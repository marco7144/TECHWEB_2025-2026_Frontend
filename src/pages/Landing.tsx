import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import screenImg from '../assets/screen.png';
import Navbar from '../components/Navbar';
//import AuthModal from '../components/AuthModal';

export default function Landing() {
  const navigate = useNavigate();
  //const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  return (
    <div className="bg-background-4 bg-sketch-dots text-on-background min-h-screen flex flex-col font-body-md overflow-x-hidden selection:bg-secondary-container selection:text-on-background">
      <Navbar />

      <main className="flex-1 w-[90vw] mx-auto py-[4vh] flex flex-col gap-[3vw] items-center justify-center">
        {/* Hero Section */}
        <section className="w-full flex flex-col lg:flex-row items-center gap-[4vw] bg-secondary-container border-[clamp(2px,0.25vw,4px)] border-on-background shadow-[clamp(4px,0.5vw,10px)_clamp(4px,0.5vw,10px)_0px_0px_#111111] rounded-[clamp(8px,1vw,16px)] p-[clamp(1.5rem,3.5vw,3rem)] relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-[-3vw] right-[-3vw] w-[10vw] h-[10vw] min-w-[80px] min-h-[80px] bg-surface rounded-full border-[clamp(2px,0.25vw,4px)] border-on-background z-0"></div>
          <div className="absolute bottom-[3vw] left-[3vw] w-[4vw] h-[4vw] min-w-[32px] min-h-[32px] bg-tertiary-container rounded-sm border-[clamp(2px,0.25vw,4px)] border-on-background rotate-12 z-0"></div>

          <div className="flex-1 flex flex-col items-start gap-[clamp(0.5rem,1.2vw,1.5rem)] z-10 relative">
            <span className="inline-block bg-white text-on-background border-[clamp(1px,0.15vw,2px)] border-on-background px-[clamp(8px,1vw,16px)] py-[clamp(4px,0.3vw,8px)] rounded-full text-[clamp(0.75rem,0.9vw,1.1rem)] font-bold shadow-[clamp(2px,0.15vw,4px)_clamp(2px,0.15vw,4px)_0px_0px_#111111] -rotate-2">Veloce. Caotico. Divertente.</span>
            <h1 className="text-[clamp(1.8rem,3.2vw,5rem)] font-black uppercase tracking-tighter leading-none max-w-[32vw] min-w-[280px]">
              Disegna Veloce,<br />Indovina Subito.
            </h1>
            <p className="text-[clamp(0.9rem,1.3vw,1.8rem)] font-semibold max-w-[30vw] min-w-[280px] text-on-surface-variant border-l-[clamp(3px,0.3vw,6px)] border-primary pl-[clamp(16px,1.6vw,32px)] py-[clamp(8px,0.8vw,16px)] bg-surface p-[clamp(12px,1.2vw,24px)] shadow-[clamp(3px,0.3vw,6px)_clamp(3px,0.3vw,6px)_0px_0px_#111111] rotate-1">
              Unisciti al gioco in stile Pictionary più caotico. Sfida i tuoi amici, crea capolavori (o disastri) e ridi fino alle lacrime.
            </p>
          </div>

          <div className="flex-1 w-full aspect-video bg-surface border-[clamp(2px,0.25vw,4px)] border-on-background shadow-[clamp(4px,0.5vw,10px)_clamp(4px,0.5vw,10px)_0px_0px_#111111] rounded-[clamp(6px,0.8vw,12px)] p-[0.8vw] z-10 relative flex flex-col">
            <div className="flex justify-between items-center bg-surface-variant border-[clamp(1px,0.15vw,2px)] border-on-background rounded p-[0.8vw] mb-[0.8vw]">
              <span className="text-[clamp(0.75rem,0.9vw,1.1rem)] font-bold bg-secondary-container border-[clamp(1px,0.15vw,2px)] border-on-background px-[0.8vw] py-[0.4vw] rounded text-on-background shadow-[clamp(2px,0.15vw,4px)_clamp(2px,0.15vw,4px)_0px_0px_#111111]">Parola: Procione</span>
              <span className="text-[clamp(0.75rem,0.9vw,1.1rem)] font-black text-error flex items-center">
                <span className="material-symbols-outlined mr-1 text-[clamp(1rem,1.2vw,1.5rem)]">timer</span> 0:14
              </span>
            </div>
            <div className="flex-1 border-[clamp(1px,0.15vw,2px)] border-on-background border-dashed bg-white rounded relative overflow-hidden group cursor-crosshair">
              <img
                alt="Procione con colori naturali"
                className="w-full h-full object-contain absolute inset-0 group-hover:scale-105 transition-transform duration-300"
                src={screenImg}
              />
              <div className="absolute top-1/2 left-1/2 w-[1vw] h-[1vw] min-w-[4px] min-h-[4px] bg-primary rounded-full blur-sm opacity-0 group-hover:opacity-100 mix-blend-multiply pointer-events-none transition-opacity"></div>
            </div>
          </div>
        </section>

        {/* Action Buttons Bottom */}
        <div className="w-full flex flex-col sm:flex-row gap-[1.5vw] mt-[1vw] z-10 justify-center pb-[4vh] max-w-[45vw] min-w-[280px] mx-auto">
          {/* Primary CTA */}
          <button 
            //onClick={() => setIsAuthModalOpen(true)} 
            className="flex-1 flex items-center justify-center gap-[0.5vw] bg-white text-on-background border-[clamp(2px,0.25vw,4px)] border-on-background rounded-[clamp(8px,1vw,16px)] px-[2vw] py-[1.2vw] font-bold text-[clamp(0.95rem,1.3vw,1.8rem)] shadow-[clamp(4px,0.5vw,10px)_clamp(4px,0.5vw,10px)_0px_0px_#111111] hover:-translate-y-1 hover:shadow-[clamp(6px,0.75vw,14px)_clamp(6px,0.75vw,14px)_0px_0px_#111111] transition-all active:translate-y-2 active:translate-x-2 active:shadow-none cursor-pointer"
          >
            <span className="material-symbols-outlined text-[clamp(1.2rem,1.6vw,2.2rem)]">login</span>
            Accedi / Registrati
          </button>

          {/* Secondary CTA */}
          <Link to="/home" className="flex-1 flex items-center justify-center gap-[0.5vw] bg-secondary-container text-on-background border-[clamp(2px,0.25vw,4px)] border-on-background rounded-[clamp(8px,1vw,16px)] px-[2vw] py-[1.2vw] font-bold text-[clamp(0.95rem,1.3vw,1.8rem)] shadow-[clamp(4px,0.5vw,10px)_clamp(4px,0.5vw,10px)_0px_0px_#111111] hover:-translate-y-1 hover:shadow-[clamp(6px,0.75vw,14px)_clamp(6px,0.75vw,14px)_0px_0px_#111111] transition-all active:translate-y-2 active:translate-x-2 active:shadow-none cursor-pointer">
            <span className="material-symbols-outlined text-[clamp(1.2rem,1.6vw,2.2rem)]">person</span>
            Entra come Ospite
          </Link>
        </div>
      </main>
      
      {/* {isAuthModalOpen && (
        <AuthModal 
          onClose={() => setIsAuthModalOpen(false)} 
          onSuccess={() => navigate('/home')}
        />
      )} */}
    </div>
  );
}
