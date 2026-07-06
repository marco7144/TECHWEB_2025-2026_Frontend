import { useLeaderboard } from '../hooks/useLeaderboard';

export default function Leaderboard() {
  const {
    activeTab,
    setActiveTab,
    players,
    artists,
    isLoading,
    error
  } = useLeaderboard();

  return (
    <>
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-on-background">Classifiche</h1>
          <p className="text-lg font-semibold text-on-surface-variant mt-1">I campioni della community di Quicksketch</p>
        </div>

        {/* Neo-brutalist Tab Controls */}
        <div className="flex bg-white border-4 border-on-background rounded-xl p-1 shadow-[4px_4px_0px_0px_#111111]">
          <button
            onClick={() => setActiveTab('players')}
            className={`px-4 py-2 text-sm font-black uppercase rounded-lg transition-colors cursor-pointer ${activeTab === 'players' ? 'bg-primary text-white border-2 border-on-background shadow-[2px_2px_0px_0px_#111111]' : 'hover:bg-surface-variant border-2 border-transparent'}`}
          >
            Top Giocatori
          </button>
          <button
            onClick={() => setActiveTab('artists')}
            className={`px-4 py-2 text-sm font-black uppercase rounded-lg transition-colors cursor-pointer ${activeTab === 'artists' ? 'bg-primary text-white border-2 border-on-background shadow-[2px_2px_0px_0px_#111111]' : 'hover:bg-surface-variant border-2 border-transparent'}`}
          >
            Top Disegnatori
          </button>
        </div>
      </div>

      {/* Content Section */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 w-full">
          <span className="material-symbols-outlined text-primary text-5xl animate-bounce">military_tech</span>
          <p className="text-lg font-bold text-on-surface-variant animate-pulse">Caricamento classifiche in corso...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-800 border-4 border-on-background p-6 rounded-xl shadow-[4px_4px_0px_0px_#111111] font-bold max-w-xl">
          {error}
        </div>
      ) : (
        <div className="w-full max-w-3xl mt-2 bg-white border-4 border-on-background rounded-xl p-6 md:p-8 shadow-[8px_8px_0px_0px_#111111]">
          <h2 className="text-2xl font-black uppercase tracking-tight mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-3xl text-secondary-fixed-dim">
              {activeTab === 'players' ? 'emoji_events' : 'palette'}
            </span>
            {activeTab === 'players' ? 'Migliori Giocatori' : 'Migliori Disegnatori'}
          </h2>

          {/* Empty States */}
          {activeTab === 'players' && players.length === 0 && (
            <p className="text-center font-bold text-on-surface-variant py-8">Nessun punteggio registrato per ora. Inizia a indovinare!</p>
          )}
          {activeTab === 'artists' && artists.length === 0 && (
            <p className="text-center font-bold text-on-surface-variant py-8">Nessun disegno ha ancora ricevuto tentativi da altri utenti.</p>
          )}

          {/* Ranking list */}
          <div className="flex flex-col gap-4">
            {activeTab === 'players'
              ? players.map((player, index) => {
                  const position = index + 1;
                  let badgeBg = 'bg-background';
                  if (position === 1) badgeBg = 'bg-[#ffd700]'; // Gold
                  if (position === 2) badgeBg = 'bg-[#e0e0e0]'; // Silver
                  if (position === 3) badgeBg = 'bg-[#cd7f32] text-white'; // Bronze

                  return (
                    <div 
                      key={player.id_user}
                      className="flex justify-between items-center border-2 border-on-background p-4 rounded-lg bg-background hover:translate-x-[2px] transition-transform shadow-[2px_2px_0px_0px_#111111]"
                    >
                      <div className="flex items-center gap-4">
                        <span className={`w-8 h-8 rounded-full border-2 border-on-background flex items-center justify-center font-black text-sm shadow-[1px_1px_0px_0px_#111111] ${badgeBg}`}>
                          {position}
                        </span>
                        <span className="font-black text-lg text-on-background">{player.username}</span>
                      </div>
                      <div className="text-right">
                        <span className="bg-secondary-container border-2 border-on-background px-3 py-1 rounded-full text-xs font-black uppercase shadow-[2px_2px_0px_0px_#111111]">
                          {player.score} {player.score === 1 ? 'Parola indovinata' : 'Parole indovinate'}
                        </span>
                      </div>
                    </div>
                  );
                })
              : artists.map((artist, index) => {
                  const position = index + 1;
                  let badgeBg = 'bg-background';
                  if (position === 1) badgeBg = 'bg-[#ffd700]';
                  if (position === 2) badgeBg = 'bg-[#e0e0e0]';
                  if (position === 3) badgeBg = 'bg-[#cd7f32] text-white';

                  return (
                    <div 
                      key={artist.id_user}
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-2 border-on-background p-4 rounded-lg bg-background gap-4 hover:translate-x-[2px] transition-transform shadow-[2px_2px_0px_0px_#111111]"
                    >
                      <div className="flex items-center gap-4">
                        <span className={`w-8 h-8 rounded-full border-2 border-on-background flex items-center justify-center font-black text-sm shadow-[1px_1px_0px_0px_#111111] ${badgeBg}`}>
                          {position}
                        </span>
                        <div>
                          <div className="font-black text-lg text-on-background leading-tight">{artist.username}</div>
                          <div className="text-xs font-bold text-on-surface-variant mt-1">
                            {artist.sketches_count} {artist.sketches_count === 1 ? 'disegno provato' : 'disegni provati'} da altri utenti
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 w-full sm:w-auto">
                        <div className="flex items-center gap-2">
                          <span className="bg-primary-fixed text-on-primary-fixed border-2 border-on-background px-3 py-1 rounded-full text-xs font-black uppercase shadow-[2px_2px_0px_0px_#111111]">
                            {artist.percentage}% Precisione
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-on-surface-variant">
                          ({artist.successful_attempts}/{artist.total_attempts} tentativi corretti)
                        </span>
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>
      )}
    </>
  );
}
