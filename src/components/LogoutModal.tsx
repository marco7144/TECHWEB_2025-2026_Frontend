interface LogoutModalProps {
  onClose: () => void;
  onConfirm: () => void;
  isGuest: boolean;
}

export default function LogoutModal({ onClose, onConfirm, isGuest }: LogoutModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-body-md">
      {/* Modal Card */}
      <div className="max-w-md w-full bg-white border-4 border-on-background p-8 rounded-xl shadow-[8px_8px_0px_0px_#111111] text-center flex flex-col gap-6 relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center border-2 border-on-background rounded-full bg-secondary-container hover:bg-secondary-fixed active:translate-y-[2px] transition-all cursor-pointer font-black text-sm"
        >
          ✕
        </button>

        <h1 className="text-3xl font-black uppercase tracking-tight">
          {isGuest ? 'Esci dal gioco?' : 'Vuoi disconnetterti?'}
        </h1>
        
        <p className="text-sm font-semibold text-on-surface-variant">
          {isGuest 
            ? 'Uscendo perderai la tua sessione ospite attuale.' 
            : 'Dovrai reinserire le tue credenziali per accedere nuovamente al gioco.'}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          <button 
            onClick={onConfirm}
            className="flex-1 bg-error text-white border-4 border-on-background rounded-lg py-3 font-bold text-lg shadow-[4px_4px_0px_0px_#111111] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none active:translate-y-[4px] active:translate-x-[4px] transition-all cursor-pointer"
          >
            {isGuest ? 'Sì, Esci' : 'Sì, Scollegati'}
          </button>
          
          <button 
            onClick={onClose}
            className="flex-1 bg-secondary-container text-on-background border-4 border-on-background rounded-lg py-3 font-bold text-lg shadow-[4px_4px_0px_0px_#111111] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-none active:translate-y-[4px] active:translate-x-[4px] transition-all cursor-pointer"
          >
            Annulla
          </button>
        </div>
      </div>
    </div>
  );
}
