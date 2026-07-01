import React, { useState, useEffect, useRef } from 'react';
import '../../styles/CreateTaskModal.css';
import RichTextEditor from '../tasks/RichTextEditor';

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const parseDateValue = (value) => {
  if (!value) return new Date(2026, 5, 1);

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date(2026, 5, 1) : date;
};

const formatDateValue = (year, month, day) => {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

function CalendarDropdown({ value, onSelect, onClose }) {
  const initialDate = parseDateValue(value);
  const [viewDate, setViewDate] = useState(new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));
  const selectedDate = value ? parseDateValue(value) : null;
  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();
  const leadingEmptyDays = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const moveCalendar = (monthDelta, yearDelta = 0) => {
    setViewDate(prev => new Date(prev.getFullYear() + yearDelta, prev.getMonth() + monthDelta, 1));
  };

  return (
    <div className="calendar-dropdown-container" onClick={(e) => e.stopPropagation()}>
      <div className="calendar-header">
        <div className="flex gap-2">
          <button type="button" className="calendar-nav-btn" onClick={() => moveCalendar(0, -1)} aria-label="Previous year">
            <i data-lucide="chevrons-left" className="w-4 h-4"></i>
          </button>
          <button type="button" className="calendar-nav-btn" onClick={() => moveCalendar(-1)} aria-label="Previous month">
            <i data-lucide="chevron-left" className="w-4 h-4"></i>
          </button>
        </div>
        <span className="font-bold text-sm">{monthNames[viewMonth]} {viewYear}</span>
        <div className="flex gap-2">
          <button type="button" className="calendar-nav-btn" onClick={() => moveCalendar(1)} aria-label="Next month">
            <i data-lucide="chevron-right" className="w-4 h-4"></i>
          </button>
          <button type="button" className="calendar-nav-btn" onClick={() => moveCalendar(0, 1)} aria-label="Next year">
            <i data-lucide="chevrons-right" className="w-4 h-4"></i>
          </button>
        </div>
      </div>
      <div className="calendar-body">
        <div className="grid grid-cols-7 text-[11px] font-bold text-gray-500 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d} className="text-center">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: leadingEmptyDays }).map((_, i) => (
            <div key={`empty-${i}`} className="calendar-day empty-day" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const isSelected = selectedDate &&
              selectedDate.getFullYear() === viewYear &&
              selectedDate.getMonth() === viewMonth &&
              selectedDate.getDate() === day;

            return (
              <button
                key={day}
                type="button"
                className={`calendar-day ${isSelected ? 'selected-day' : ''}`}
                onClick={() => {
                  onSelect(formatDateValue(viewYear, viewMonth, day));
                  onClose();
                }}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const CreateTaskModal = ({ isOpen, onClose, tasks = [], onCreateTask, currentRole = 'ADMIN' }) => {
  const statusOptions = currentRole === 'ADMIN'
    ? ['New', 'In Progress', 'In Testing', 'Pending Review', 'Need Revision', 'Done', 'Cancelled']
    : ['New', 'In Progress', 'In Testing', 'Pending Review', 'Need Revision', 'Done'];
  const [formData, setFormData] = useState({
    space: 'Task Management System (SCRUM)',
    status: 'New',
    summary: '',
    description: '',
    assignee: 'Unassigned',
    priority: 'Medium',
    createdAt: '',
    completed_at: '',
    updated_at: '',
    sprint: '',
    storyPoints: '',
    comment: '',
    createAnother: false
  });

  const [errors, setErrors] = useState({});
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [isAssigneeOpen, setIsAssigneeOpen] = useState(false);
  const [isCreatedAtOpen, setIsCreatedAtOpen] = useState(false);
  const [isCompletedAtOpen, setIsCompletedAtOpen] = useState(false);
  const [isUpdatedAtOpen, setIsUpdatedAtOpen] = useState(false);
  const [isSprintOpen, setIsSprintOpen] = useState(false);
  const [onlyShowCurrentSpace, setOnlyShowCurrentSpace] = useState(true);
  const assigneeBtnRef = useRef(null);
  const assigneeMenuRef = useRef(null);

  const availableAssignees = [
    { name: 'Pham Tien', initials: 'PT', color: '#2f3650', textColor: '#FFFFFF' },
    { name: 'Hoang Hoa', initials: 'HH', color: '#F97316', textColor: '#FFFFFF' },
    { name: 'Trong Nghia', initials: 'TN', color: '#14B8A6', textColor: '#FFFFFF' },
    { name: 'Unassigned', initials: 'UN', color: '#8e8f90', textColor: '#FFFFFF', icon: 'person' }
  ];

  useEffect(() => {
    if (isOpen && window.lucide) {
      window.lucide.createIcons();
    }
  }, [isOpen, isStatusOpen, isPriorityOpen, isCreatedAtOpen, isCompletedAtOpen, isUpdatedAtOpen, isSprintOpen, onlyShowCurrentSpace]);

  useEffect(() => {
    if (!isAssigneeOpen) return;
    const handleClickOutside = (e) => {
      if (assigneeMenuRef.current && !assigneeMenuRef.current.contains(e.target) &&
          assigneeBtnRef.current && !assigneeBtnRef.current.contains(e.target)) {
        setIsAssigneeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isAssigneeOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (name === 'summary' && value.trim()) {
      setErrors(prev => ({ ...prev, summary: null }));
    }
  };

  const handleCreate = () => {
    if (!formData.summary.trim()) {
      setErrors({ summary: 'Summary is required' });
      return;
    }
    if (onCreateTask) {
      onCreateTask(formData);
    }

    if (!formData.createAnother) {
      onClose();
    } else {
      setFormData(prev => ({ ...prev, summary: '', description: '', comment: '' }));
    }
  };

  return (
    <div className="create-task-overlay" onClick={onClose}>
      <div className="create-task-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2>Create Task</h2>
          <div className="header-actions">
            <button className="header-btn" title="Maximize">
              <i data-lucide="maximize-2" className="w-4 h-4 text-gray-500"></i>
            </button>
            <button className="header-btn" onClick={onClose} title="Close">
              <i data-lucide="x" className="w-4 h-4 text-gray-500"></i>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="modal-body">
          <p className="form-info">Required fields are marked with an asterisk <span className="required-star">*</span></p>

          {/* Space */}
          <div className="form-group">
            <label>Space <span className="required-star">*</span></label>
            <div className="space-select-wrapper">
              <div className="space-icon">
                <i data-lucide="zap" className="w-4 h-4 text-white"></i>
              </div>
              <select name="space" className="select-custom pl-10" value={formData.space} onChange={handleInputChange}>
                <option>Task Management System (SCRUM)</option>
                <option>Project Alpha (KANBAN)</option>
                <option>Web Redesign (SCRUM)</option>
              </select>
            </div>
          </div>

          {/* Status */}
          <div className="form-group">
            <label>Status</label>
            <div className="relative">
              <div 
                className="status-custom-trigger"
                onClick={() => setIsStatusOpen(!isStatusOpen)}
              >
                <span className={`status-badge-pill ${
                  formData.status === 'Need Revision' ? 'badge-revision' :
                  formData.status === 'Done' ? 'badge-done' :
                  (formData.status === 'Cancelled' || formData.status === 'New') ? 'badge-neutral' :
                  'badge-progress'
                }`}>
                  {formData.status.toUpperCase()}
                </span>
                <i data-lucide="chevron-down" className="w-4 h-4 text-gray-500"></i>
              </div>

              {isStatusOpen && (
                <div className="status-custom-dropdown">
                  {statusOptions.map(s => (
                    <div 
                      key={s} 
                      className="status-dropdown-item"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, status: s }));
                        setIsStatusOpen(false);
                      }}
                    >
                      <span className={`status-badge-pill text-[10px] ${
                        s === 'Need Revision' ? 'badge-revision' :
                        s === 'Done' ? 'badge-done' :
                        (s === 'Cancelled' || s === 'New') ? 'badge-neutral' :
                        'badge-progress'
                      }`}>
                        {s.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="form-group">
            <label>Summary <span className="required-star">*</span></label>
            <input 
              type="text" 
              name="summary" 
              placeholder="e.g. Develop login screen"
              className={`input-custom ${errors.summary ? 'input-error' : ''}`}
              value={formData.summary}
              onChange={handleInputChange}
              autoFocus
            />
            {errors.summary && (
              <div className="error-message">
                <i data-lucide="alert-circle" className="w-4 h-4"></i>
                {errors.summary}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="form-group">
            <label>Description</label>
            <RichTextEditor
              value={formData.description}
              onChange={(val) => setFormData(prev => ({ ...prev, description: val }))}
              placeholder="Type @ to mention someone or use the toolbar above."
              tasks={tasks}
            />
          </div>

          {/* Assignee */}
          <div className="form-group">
            <label>Assignee</label>
            <div className="relative">
              <button
                ref={assigneeBtnRef}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAssigneeOpen(prev => !prev);
                }}
                className="select-custom flex items-center gap-3 w-full bg-white text-left"
              >
                {(() => {
                  const selectedProfile = availableAssignees.find(user => user.name === formData.assignee) || availableAssignees[0];
                  return (
                    <>
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold"
                        style={{ backgroundColor: selectedProfile.color, color: selectedProfile.textColor || '#111' }}
                      >
                        {selectedProfile.initials || <span className="material-symbols-outlined">{selectedProfile.icon}</span>}
                      </div>
                      <span className="text-sm text-[#172B4D]">{formData.assignee}</span>
                    </>
                  );
                })()}
              </button>
              {isAssigneeOpen && (
                <div
                  ref={assigneeMenuRef}
                  className="absolute left-0 top-full z-50 mt-2 w-full rounded-[3px] border border-[#DFE1E6] bg-white shadow-2xl overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  {availableAssignees.map(user => (
                    <button
                      key={user.name}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData(prev => ({ ...prev, assignee: user.name }));
                        setIsAssigneeOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-left text-[13px] hover:bg-[#EBF0FF] transition-colors"
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold"
                        style={{ backgroundColor: user.color, color: user.textColor || '#111' }}
                      >
                        {user.initials || <span className="material-symbols-outlined">{user.icon}</span>}
                      </div>
                      <span>{user.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Priority */}
          <div className="form-group">
            <label>Priority</label>
            <div className="relative">
              <div 
                className="priority-custom-trigger"
                onClick={() => setIsPriorityOpen(!isPriorityOpen)}
              >
                <div className="flex items-center gap-2">
                  {formData.priority === 'Medium' && <span className="material-symbols-outlined text-orange-500 text-[18px]">keyboard_double_arrow_up</span>}
                  {formData.priority === 'High' && <span className="material-symbols-outlined text-red-500 text-[18px]">keyboard_arrow_up</span>}
                  {formData.priority === 'Low' && <span className="material-symbols-outlined text-blue-500 text-[18px]">keyboard_arrow_down</span>}
                  <span className="text-sm">{formData.priority}</span>
                </div>
                <i data-lucide="chevron-down" className="w-4 h-4 text-gray-500"></i>
              </div>

              {isPriorityOpen && (
                <div className="priority-custom-dropdown">
                  {[
                    { label: 'Medium', icon: 'keyboard_double_arrow_up', color: 'text-orange-500' },
                    { label: 'High', icon: 'keyboard_arrow_up', color: 'text-red-500' },
                    { label: 'Low', icon: 'keyboard_arrow_down', color: 'text-blue-500' }
                  ].map(p => (
                    <div 
                      key={p.label} 
                      className="priority-dropdown-item flex items-center gap-3"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, priority: p.label }));
                        setIsPriorityOpen(false);
                      }}
                    >
                      <span className={`material-symbols-outlined ${p.color} text-[18px]`}>{p.icon}</span>
                      <span className="text-sm">{p.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid-2">
            <div className="flex flex-col gap-4">

              {/* Created At */}
              <div className="form-group mb-0!">
                <label>Created At</label>
                <div className="relative">
                  <div
                    className="date-custom-trigger"
                    onClick={() => setIsCreatedAtOpen(!isCreatedAtOpen)}
                  >
                    <span className={formData.createdAt ? 'text-on-surface' : 'text-gray-400'}>
                      {formData.createdAt || 'Select date'}
                    </span>
                    <i data-lucide="calendar" className="w-4 h-4 text-gray-500"></i>
                  </div>

                  <p className="text-[11px] text-gray-400 mt-1 ml-1 leading-tight">
                    Allows the creation date for a piece of work to be set.
                  </p>

                  {isCreatedAtOpen && (
                    <CalendarDropdown
                      value={formData.createdAt}
                      onSelect={(date) => setFormData(prev => ({ ...prev, createdAt: date }))}
                      onClose={() => setIsCreatedAtOpen(false)}
                    />
                  )}
                </div>
              </div>

              {/* Updated At */}
              <div className="form-group mb-0!">
                <label>Updated At</label>
                <div className="relative">
                  <div
                    className="date-custom-trigger"
                    onClick={() => setIsUpdatedAtOpen(!isUpdatedAtOpen)}
                  >
                    <span className={formData.updated_at ? 'text-on-surface' : 'text-gray-400'}>
                      {formData.updated_at || 'Select date'}
                    </span>
                    <i data-lucide="calendar" className="w-4 h-4 text-gray-500"></i>
                  </div>

                  {isUpdatedAtOpen && (
                    <CalendarDropdown
                      value={formData.updated_at}
                      onSelect={(date) => setFormData(prev => ({ ...prev, updated_at: date }))}
                      onClose={() => setIsUpdatedAtOpen(false)}
                    />
                  )}
                </div>
              </div>

            </div>

            {/* Completed At */}
            <div className="form-group self-start">
              <label>Completed_at</label>

              <div className="relative">
                <div
                  className="date-custom-trigger"
                  onClick={() => setIsCompletedAtOpen(!isCompletedAtOpen)}
                >
                  <span className={formData.completed_at ? 'text-on-surface' : 'text-gray-400'}>
                    {formData.completed_at || 'Select date'}
                  </span>

                  <i data-lucide="calendar" className="w-4 h-4 text-gray-500"></i>
                </div>

                {isCompletedAtOpen && (
                  <CalendarDropdown
                    value={formData.completed_at}
                    onSelect={(date) => setFormData(prev => ({ ...prev, completed_at: date }))}
                    onClose={() => setIsCompletedAtOpen(false)}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Sprint */}
          <div className="form-group">
            <label>Sprint</label>
            <div className="relative">
              <div 
                className={`date-custom-trigger ${!formData.sprint ? 'select-placeholder' : ''}`}
                onClick={() => setIsSprintOpen(!isSprintOpen)}
              >
                <span>{formData.sprint || 'Select sprint'}</span>
                <i data-lucide="chevron-down" className="w-4 h-4 text-gray-500"></i>
              </div>

              {isSprintOpen && (
                <div className="sprint-custom-dropdown">
                  <div className="sprint-filter-zone">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={onlyShowCurrentSpace} 
                        onChange={(e) => setOnlyShowCurrentSpace(e.target.checked)}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="text-[13px] text-[#172B4D]">Only show sprints in this space (SCRUM)</span>
                    </label>
                  </div>
                  
                  <div className="sprint-list-content">
                    <div className="sprint-section-title">Active</div>
                    <div 
                      className="sprint-item-box active-item"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, sprint: 'SCRUM Sprint 1' }));
                        setIsSprintOpen(false);
                      }}
                    >
                      <div className="sprint-item-main">SCRUM Sprint 1</div>
                      <div className="sprint-item-sub">SCRUM board</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Story point estimate */}
          <div className="form-group">
            <label>Story point estimate</label>
            <input 
              type="number" 
              name="storyPoints" 
              className="input-custom" 
              placeholder="0"
              min="0"
              value={formData.storyPoints}
              onChange={handleInputChange}
            />
            <p className="text-[11px] text-gray-400 mt-1 ml-1 font-medium italic">Measurement of complexity and/or size of a requirement.</p>
          </div>


          {/* Attachment */}
          <div className="form-group">
            <label>Attachment</label>
            <div className="attachment-zone">
              <div className="flex flex-col items-center justify-center gap-2">
                <i data-lucide="upload-cloud" className="w-8 h-8 text-gray-400"></i>
                <span className="text-sm">Drop files to attach or <span className="browse-link">Browse</span></span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="modal-footer">
          <div className="footer-left">
            <input 
              type="checkbox" 
              name="createAnother" 
              id="createAnother"
              checked={formData.createAnother}
              onChange={handleInputChange}
            />
            <label htmlFor="createAnother" className="text-sm ml-2 cursor-pointer">Create another</label>
          </div>
          <div className="footer-right">
            <button className="btn-cancel" onClick={onClose}>Cancel</button>
            <button className="btn-create" onClick={handleCreate}>Create</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;
