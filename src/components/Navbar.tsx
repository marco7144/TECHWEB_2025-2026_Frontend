export default function Navbar() {
  return (
    <header className="flex justify-between items-center w-full px-6 py-4 max-w-full z-50 bg-primary border-b-4 border-on-background shadow-[4px_4px_0px_0px_#111111] sticky top-0">
      <div className="flex items-center gap-2 cursor-pointer group hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all active:translate-x-1 active:translate-y-1 active:shadow-none">
        <span className="material-symbols-outlined text-secondary-fixed text-[32px] font-bold">brush</span>
        <span className="text-3xl text-white uppercase italic tracking-tight font-black">Quicksketch</span>
      </div>
    </header>
  );
}
