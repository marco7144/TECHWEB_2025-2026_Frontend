import { useProfile } from '../hooks/useProfile';
import raccoonAvatar from '../assets/raccoon.png';

export default function Profile() {
  const { isGuest, username, stats, isLoading, error } = useProfile();

  return (
    <>
      {/* Header Title */}
      <div>
        <h1 className="text-4xl md:text-5xl font-black text-on-background">Profilo Utente</h1>
        <p className="text-lg font-semibold text-on-surface-variant mt-1">Le tue statistiche di disegno e gioco</p>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 w-full">
          <span className="material-symbols-outlined text-primary text-5xl animate-bounce">analytics</span>
          <p className="text-lg font-bold text-on-surface-variant animate-pulse">Caricamento statistiche in corso...</p>
        </div>
      ) : isGuest ? (
        /* Guest Banner Alert */
        <div className="w-full max-w-2xl bg-secondary-container border-4 border-on-background rounded-xl p-8 shadow-[8px_8px_0px_0px_#111111] flex flex-col items-center gap-6 mt-4">
          <span className="material-symbols-outlined text-5xl text-primary animate-pulse">lock</span>
          <div className="text-center">
            <h2 className="text-2xl font-black uppercase">Statistiche bloccate</h2>
            <p className="text-sm font-semibold text-on-surface-variant mt-2 max-w-md">
              Sei attualmente connesso come Ospite. Registrati o accedi per sbloccare il monitoraggio dei disegni inviati, dei tentativi fatti e delle risposte indovinate!
            </p>
          </div>
        </div>
      ) : error ? (
        /* Error Box */
        <div className="bg-red-50 text-red-800 border-4 border-on-background p-6 rounded-xl shadow-[4px_4px_0px_0px_#111111] font-bold max-w-xl">
          {error}
        </div>
      ) : (
        /* Statistics Dashboard */
        <div className="flex flex-col gap-8 w-full max-w-4xl mt-2">
          
          {/* User Info Card */}
          <div className="bg-white border-4 border-on-background rounded-xl p-6 shadow-[6px_6px_0px_0px_#111111] flex flex-col sm:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-full border-4 border-on-background bg-white flex items-center justify-center overflow-hidden shadow-[2px_2px_0px_0px_#111111]">
              <img 
                alt="Avatar utente" 
                className="w-full h-full object-cover" 
                src={raccoonAvatar} 
              />
            </div>
            <div className="text-center sm:text-left">
              <span className="bg-secondary-container border-2 border-on-background px-3 py-1 rounded-full text-xs font-black uppercase tracking-tight shadow-[2px_2px_0px_0px_#111111]">Giocatore Attivo</span>
              <h2 className="text-3xl font-black mt-2 text-on-background">{username}</h2>
              <p className="text-sm font-semibold text-on-surface-variant mt-1">
                Pronto per scalare le classifiche di Quicksketch!
              </p>
            </div>
          </div>

          {/* Grid Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Card 1: Disegni prodotti */}
            <div className="bg-primary-fixed border-4 border-on-background rounded-xl p-6 shadow-[6px_6px_0px_0px_#111111] flex items-center gap-6">
              <div className="w-14 h-14 rounded-lg bg-white border-2 border-on-background flex items-center justify-center shadow-[3px_3px_0px_0px_#111111]">
                <span className="material-symbols-outlined text-primary text-3xl font-bold">brush</span>
              </div>
              <div>
                <div className="text-[32px] font-black leading-none">{stats?.sketches_count || 0}</div>
                <div className="text-sm font-bold text-on-surface-variant mt-1">Disegni prodotti</div>
              </div>
            </div>

            {/* Card 2: Parole indovinate */}
            <div className="bg-secondary-container border-4 border-on-background rounded-xl p-6 shadow-[6px_6px_0px_0px_#111111] flex items-center gap-6">
              <div className="w-14 h-14 rounded-lg bg-white border-2 border-on-background flex items-center justify-center shadow-[3px_3px_0px_0px_#111111]">
                <span className="material-symbols-outlined text-secondary-fixed-dim text-3xl font-bold">emoji_objects</span>
              </div>
              <div>
                <div className="text-[32px] font-black leading-none">{stats?.guessed_count || 0}</div>
                <div className="text-sm font-bold text-on-surface-variant mt-1">Parole indovinate</div>
              </div>
            </div>

            {/* Card 3: Tentativi totali */}
            <div className="bg-tertiary-fixed-dim border-4 border-on-background rounded-xl p-6 shadow-[6px_6px_0px_0px_#111111] flex items-center gap-6">
              <div className="w-14 h-14 rounded-lg bg-white border-2 border-on-background flex items-center justify-center shadow-[3px_3px_0px_0px_#111111]">
                <span className="material-symbols-outlined text-tertiary-container text-3xl font-bold">track_changes</span>
              </div>
              <div>
                <div className="text-[32px] font-black leading-none">{stats?.attempts_count || 0}</div>
                <div className="text-sm font-bold text-on-surface-variant mt-1">Tentativi totali effettuati</div>
              </div>
            </div>

            {/* Card 4: Parole non indovinate */}
            <div className="bg-white border-4 border-on-background rounded-xl p-6 shadow-[6px_6px_0px_0px_#111111] flex items-center gap-6">
              <div className="w-14 h-14 rounded-lg bg-red-100 border-2 border-on-background flex items-center justify-center shadow-[3px_3px_0px_0px_#111111]">
                <span className="material-symbols-outlined text-error text-3xl font-bold">cancel</span>
              </div>
              <div>
                <div className="text-[32px] font-black leading-none">{stats?.unguessed_count || 0}</div>
                <div className="text-sm font-bold text-on-surface-variant mt-1">Parole non indovinate</div>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
