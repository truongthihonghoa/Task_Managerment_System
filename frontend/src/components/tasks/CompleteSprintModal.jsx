import React from 'react';
import { createPortal } from 'react-dom';

const CompleteSprintModal = ({ isOpen, onClose, sprintName, completedTasksCount, openTasksCount }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-outline-variant flex items-center justify-between bg-surface-container-low">
          <h2 className="text-base font-bold text-on-surface">Complete {sprintName}</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-surface-container rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-[20px] text-outline">close</span>
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col gap-4 text-[13px] text-on-surface-variant leading-relaxed">
            <p>
              This sprint contains:
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-100 p-3 rounded-lg flex flex-col items-center">
                <span className="text-2xl font-bold text-green-700">{completedTasksCount}</span>
                <span className="text-[11px] font-medium text-green-600 uppercase tracking-wider">Completed</span>
              </div>
              <div className="bg-orange-50 border border-orange-100 p-3 rounded-lg flex flex-col items-center">
                <span className="text-2xl font-bold text-orange-700">{openTasksCount}</span>
                <span className="text-[11px] font-medium text-orange-600 uppercase tracking-wider">Open issues</span>
              </div>
            </div>
            
            <div className="mt-2">
              <label className="block text-[12px] font-bold text-on-surface mb-2">
                Where should the {openTasksCount} open issues be moved?
              </label>
              <select className="w-full p-2.5 bg-white border border-outline-variant rounded-lg text-[13px] focus:ring-2 focus:ring-primary focus:border-primary outline-none cursor-pointer">
                <option value="backlog">Backlog</option>
                <option value="new-sprint">New Sprint</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-surface-container-low/50 border-t border-outline-variant flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-[13px] font-bold text-outline hover:bg-surface-container rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              // Handle completion logic here
              onClose();
            }}
            className="px-5 py-2 text-[13px] font-bold bg-[#5e4db2] text-white rounded-lg hover:bg-[#4d3e9c] shadow-md transition-all active:scale-95"
          >
            Complete Sprint
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CompleteSprintModal;