function PageHeader({ title, subtitle, badge, children }) {
  return (
    <div className="space-y-8 animate-reveal opacity-0 pt-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 border-b border-white/5 pb-12">
        <div className="space-y-6 max-w-3xl">
          {badge && (
            <div className="inline-flex items-center gap-3 px-5 py-1.5 rounded-full bg-white/5 border border-white/5 shadow-inner group transition-all hover:border-indigo-500/50">
              <div className="w-1 h-1 bg-indigo-500 rounded-full animate-pulse group-hover:scale-150 transition-transform"></div>
              <span className="text-[8px] font-black text-indigo-500 uppercase tracking-[0.4em] italic leading-none">{badge}</span>
            </div>
          )}
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-7xl font-black tracking-[-0.05em] leading-[0.9] uppercase italic selection:text-indigo-600">
              {title.split(' ').map((word, i) => (
                <span key={i} className={i % 2 !== 0 ? "text-gradient-premium shimmer-text" : ""}>
                   {word}{' '}
                </span>
              ))}
            </h1>
            <p className="text-slate-500 text-lg sm:text-xl font-bold uppercase tracking-tight max-w-xl leading-relaxed italic opacity-50 border-l-[2px] border-indigo-500 pl-8 py-1.5">
              {subtitle}
            </p>
          </div>
        </div>
        {children && (
          <div className="lg:mb-4 lg:pt-0 pt-6 animate-reveal">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

export default PageHeader;
