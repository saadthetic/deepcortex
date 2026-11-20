import React, { useState, useEffect, useRef } from 'react';
import { UserCheck, ShieldCheck, User, CloudUpload } from 'lucide-react';
import { UserProfile, Language } from '../types';

interface DraggableEdgePeekTabProps {
  userProfile: UserProfile;
  language: Language;
  onOpenProfileModal: () => void;
}

export const DraggableEdgePeekTab: React.FC<DraggableEdgePeekTabProps> = ({
  userProfile,
  language,
  onOpenProfileModal,
}) => {
  // Vertical position clamped between 15% and 85% of screen height
  const [topPercent, setTopPercent] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('deepcortex_edge_tab_top');
      if (saved) return parseFloat(saved);
    } catch {}
    return 48; // default to roughly middle right
  });

  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef<number>(0);
  const startTopPercent = useRef<number>(48);
  const hasMoved = useRef<boolean>(false);

  // Handle pointer down
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    hasMoved.current = false;
    dragStartY.current = e.clientY;
    startTopPercent.current = topPercent;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const deltaY = e.clientY - dragStartY.current;
    if (Math.abs(deltaY) > 5) {
      hasMoved.current = true;
    }
    const windowH = window.innerHeight || 800;
    const deltaPercent = (deltaY / windowH) * 100;
    const newPercent = Math.max(12, Math.min(84, startTopPercent.current + deltaPercent));
    setTopPercent(newPercent);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      localStorage.setItem('deepcortex_edge_tab_top', topPercent.toString());
    } catch {}

    // If it was a simple tap without drag, trigger modal open
    if (!hasMoved.current) {
      onOpenProfileModal();
    }
  };

  const isUrdu = language === 'ur';
  const isArabic = language === 'ar';

  const guestLabel = isUrdu
    ? 'مہمان پروفائل • سنک کریں'
    : isArabic
    ? 'ملف زائر • حفظ ومزامنة'
    : 'Guest Profile (Unsaved) • Tap to Sync';

  const syncedLabel = isUrdu
    ? `محفوظ پروفائل • ${userProfile.name.split(' ')[0]}`
    : isArabic
    ? `تمت المزامنة • ${userProfile.name.split(' ')[0]}`
    : `Synced Profile • ${userProfile.name.split(' ')[0]}`;

  return (
    <div
      style={{ top: `${topPercent}%` }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className={`fixed right-0 z-40 group select-none transition-all duration-200 touch-none ${
        isDragging ? 'cursor-grabbing scale-102 shadow-2xl' : 'cursor-grab hover:shadow-xl'
      }`}
      title={userProfile.isGuest ? 'Guest Profile (Unsaved) • Tap to Open Vault' : 'Profile Synced • Tap to View'}
    >
      <div className="flex items-center rounded-l-2xl rounded-r-none bg-teal-800/95 hover:bg-teal-700 text-white border-l border-t border-b border-r-0 border-teal-500/60 shadow-lg pl-3 pr-2.5 py-1.5 transition-all duration-200 overflow-hidden backdrop-blur-sm">
        <div className="flex items-center gap-1.5">
          {userProfile.isGuest ? (
            <div className="relative">
              <User className="w-4 h-4 text-teal-200 shrink-0" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 ring-1 ring-teal-900 animate-pulse" />
            </div>
          ) : (
            <div className="relative">
              <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-teal-900" />
            </div>
          )}

          {/* Label expands gently on hover with comfortable padding */}
          <div className="max-w-0 overflow-hidden opacity-0 group-hover:max-w-xs group-hover:opacity-100 transition-all duration-300 ease-out whitespace-nowrap pl-1 pr-1.5">
            <span className="text-xs font-bold tracking-tight">
              {userProfile.isGuest ? guestLabel : syncedLabel}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
