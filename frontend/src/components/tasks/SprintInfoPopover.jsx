import React from 'react';
import { createPortal } from 'react-dom';

const SprintInfoPopover = ({ isOpen, onClose, anchorRef }) => {
  if (!isOpen || !anchorRef.current) return null;

  const rect = anchorRef.current.getBoundingClientRect();
  const top = rect.bottom + 8;
  const right = window.innerWidth - rect.right;

  return createPortal(
    <div className="fixed inset-0 z-[9999]" onClick={onClose}>
      <div 
        className="absolute bg-white border border-outline-variant shadow-2xl rounded-xl p-5 w-64 animate-in fade-in slide-in-from-top-2 duration-200"
        style={{ top, right }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-bold text-on-surface">SCRUM Sprint 1</h3>
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-orange-600 font-medium">4 days left</span>
              <div className="flex-1 h-1 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 w-[70%]" />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 border-t border-outline-variant pt-4">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-outline font-bold uppercase">Start date</span>
              <span className="text-[12px] text-on-surface">Jun 18, 2026</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-outline font-bold uppercase">End date</span>
              <span className="text-[12px] text-on-surface">Jul 2, 2026</span>
            </div>
          </div>

          <div className="bg-surface-container-low rounded-lg p-3 flex flex-col gap-2">
             <div className="flex justify-between items-center">
                <span className="text-[11px] text-on-surface-variant">Completed issues</span>
                <span className="text-[11px] font-bold text-green-700">1</span>
             </div>
             <div className="flex justify-between items-center">
                <span className="text-[11px] text-on-surface-variant">Open issues</span>
                <span className="text-[11px] font-bold text-orange-700">10</span>
             </div>
          </div>
        </div>
        
        {/* Pointer arrow */}
        <div 
          className="absolute -top-1.5 right-4 w-3 h-3 bg-white border-l border-t border-outline-variant rotate-45"
        />
      </div>
    </div>,
    document.body
  );
};

export default SprintInfoPopover;
