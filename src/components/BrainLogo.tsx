import React from 'react';

interface BrainLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const BrainLogo: React.FC<BrainLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const dimensions = {
    sm: { box: 'w-8.5 h-8.5 rounded-xl p-0.5', text: 'text-lg', badge: 'text-[9px] px-1.5 py-0.2 -mt-2' },
    md: { box: 'w-11 h-11 rounded-2xl p-0.5', text: 'text-xl', badge: 'text-[10px] px-2 py-0.5 -mt-2.5' },
    lg: { box: 'w-14 h-14 rounded-2xl p-1', text: 'text-2xl', badge: 'text-xs px-2.5 py-0.5 -mt-3' },
  }[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Mint Rounded Container matching AgriLens Eco style */}
      <div
        className={`${dimensions.box} bg-[#d2f9e8] dark:bg-emerald-950/70 border border-[#a7f3d0] dark:border-emerald-800 flex items-center justify-center shadow-xs shrink-0 relative overflow-hidden`}
      >
        <img
          src="/assets/aistudio/ic_brain_e02131d1.png"
          alt="DeepCortex AI Brain Circuit"
          className="w-full h-full object-contain scale-[1.22] filter contrast-125 transition-transform"
          onError={(e) => {
            // Fallback to brain_transparent.png or vector SVG if needed
            if (!e.currentTarget.src.includes('brain_transparent.png')) {
              e.currentTarget.src = '/assets/aistudio/brain_transparent.png';
            } else {
              e.currentTarget.style.display = 'none';
            }
          }}
        />

        {/* Vector SVG Circuit Brain (Rendered if image is unavailable or as overlay) */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full text-[#0d9488] hidden only:block"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M50 16 C30 16 16 30 16 50 C16 62 21 70 28 75 C32 78 34 84 36 87 C40 89 45 89 50 88 C55 89 60 89 64 87 C66 84 68 78 72 75 C79 70 84 62 84 50 C84 30 70 16 50 16 Z"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path d="M50 20 L50 84" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3 3" />
          {/* Circuit tracks */}
          <path d="M25 45 H40 L46 36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M23 58 H35 L42 67" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M75 45 H60 L54 36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M77 58 H65 L58 67" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          {/* Synapses */}
          <circle cx="25" cy="45" r="3" fill="#0d9488" />
          <circle cx="46" cy="36" r="2.8" fill="#10b981" />
          <circle cx="75" cy="45" r="3" fill="#0d9488" />
          <circle cx="54" cy="36" r="2.8" fill="#10b981" />
          <circle cx="50" cy="52" r="3.5" fill="#0d9488" />
        </svg>
      </div>

      {showText && (
        <div className="flex items-center gap-1.5">
          <span className={`font-black tracking-tight text-slate-800 dark:text-white leading-none ${dimensions.text}`}>
            Deep<span className="text-[#0d9488]">Cortex</span>
          </span>
          {/* Separate raised rounded pill shape matching ECO badge from AgriLens */}
          <span
            className={`rounded-md bg-[#00a86b] text-white font-black tracking-wider uppercase shadow-xs inline-block leading-none ${dimensions.badge}`}
          >
            AI
          </span>
        </div>
      )}
    </div>
  );
};
