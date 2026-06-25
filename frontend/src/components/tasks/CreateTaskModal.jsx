import React, { useState, useEffect } from 'react';
import '../../styles/CreateTaskModal.css';

const CreateTaskModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    space: 'Task Management System (SCRUM)',
    status: 'New',
    summary: '',
    description: '',
    assignee: 'Alex Morgan', // Mặc định là user hiện tại hoặc Automatic
    priority: 'Medium',
    startDate: '',
    dueDate: '',
    sprint: '',
    storyPoints: '',
    comment: '',
    createAnother: false
  });

  const [errors, setErrors] = useState({});
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [isStartDateOpen, setIsStartDateOpen] = useState(false);
  const [isDueDateOpen, setIsDueDateOpen] = useState(false);
  const [isSprintOpen, setIsSprintOpen] = useState(false);
  const [onlyShowCurrentSpace, setOnlyShowCurrentSpace] = useState(true);

  useEffect(() => {
    if (isOpen && window.lucide) {
      window.lucide.createIcons();
    }
  }, [isOpen, isStatusOpen, isPriorityOpen, isStartDateOpen, isDueDateOpen, isSprintOpen, onlyShowCurrentSpace]);

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
    console.log('Task Created:', formData);
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
                  {['New', 'In Progress', 'In Testing', 'Pending Review', 'Need Revision', 'Done', 'Cancelled'].map(s => (
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
            <div className="description-container-fixed">
              <div className="description-toolbar-advanced">
                <div className="toolbar-group">
                  <button className="toolbar-btn-advanced flex items-center gap-1">
                    <span className="text-[15px] font-medium">Tt</span>
                    <i data-lucide="chevron-down" className="w-3 h-3"></i>
                  </button>
                </div>
                
                <div className="toolbar-divider"></div>
                
                <div className="toolbar-group">
                  <button className="toolbar-btn-advanced font-bold">B</button>
                  <button className="toolbar-btn-advanced italic">I</button>
                  <button className="toolbar-btn-advanced flex items-center gap-1">
                    <span className="underline">U</span>
                    <i data-lucide="chevron-down" className="w-3 h-3"></i>
                  </button>
                </div>

                <div className="toolbar-divider"></div>

                <div className="toolbar-group">
                  <button className="toolbar-btn-advanced flex items-center gap-1">
                    <span className="border-b-2 border-black leading-none">A</span>
                    <i data-lucide="chevron-down" className="w-3 h-3"></i>
                  </button>
                </div>

                <div className="toolbar-divider"></div>

                <div className="toolbar-group">
                  <button className="toolbar-btn-advanced flex items-center gap-1">
                    <i data-lucide="list" className="w-4 h-4"></i>
                    <i data-lucide="chevron-down" className="w-3 h-3"></i>
                  </button>
                </div>

                <div className="toolbar-divider"></div>

                <div className="toolbar-group flex items-center">
                  <button className="toolbar-btn-advanced"><i data-lucide="link" className="w-4 h-4"></i></button>
                  <button className="toolbar-btn-advanced"><i data-lucide="image" className="w-4 h-4"></i></button>
                  <button className="toolbar-btn-advanced"><i data-lucide="smile" className="w-4 h-4"></i></button>
                  <button className="toolbar-btn-advanced flex items-center gap-1">
                    <i data-lucide="plus" className="w-4 h-4"></i>
                    <i data-lucide="chevron-down" className="w-3 h-3"></i>
                  </button>
                </div>
              </div>
              <textarea 
                className="description-textarea-advanced" 
                placeholder="Type /ai for Atlassian Intelligence or @ to mention and notify someone."
                value={formData.description}
                name="description"
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Assignee */}
          <div className="form-group">
            <label>Assignee</label>
            <div className="assignee-box">
              <div className="avatar-placeholder">
                <i data-lucide="user" className="w-4 h-4 text-gray-400"></i>
              </div>
              <select name="assignee" className="assignee-select" value={formData.assignee} onChange={handleInputChange}>
                <option>Alex Morgan</option>
                <option>Unassigned</option>
              </select>
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
            {/* Start Date */}
            <div className="form-group">
              <label>Start date</label>
              <div className="relative">
                <div 
                  className="date-custom-trigger"
                  onClick={() => setIsStartDateOpen(!isStartDateOpen)}
                >
                  <span className={formData.startDate ? 'text-on-surface' : 'text-gray-400'}>
                    {formData.startDate || 'Select date'}
                  </span>
                  <i data-lucide="calendar" className="w-4 h-4 text-gray-500"></i>
                </div>
                <p className="text-[11px] text-gray-400 mt-1 ml-1 leading-tight">Allows the planned start date for a piece of work to be set.</p>
                {isStartDateOpen && (
                  <div className="calendar-dropdown-container">
                    <div className="calendar-header">
                      <div className="flex gap-2">
                        <i data-lucide="chevrons-left" className="w-4 h-4 cursor-pointer hover:text-primary"></i>
                        <i data-lucide="chevron-left" className="w-4 h-4 cursor-pointer hover:text-primary"></i>
                      </div>
                      <span className="font-bold text-sm">June 2026</span>
                      <div className="flex gap-2">
                        <i data-lucide="chevron-right" className="w-4 h-4 cursor-pointer hover:text-primary"></i>
                        <i data-lucide="chevrons-right" className="w-4 h-4 cursor-pointer hover:text-primary"></i>
                      </div>
                    </div>
                    <div className="calendar-body">
                      <div className="grid grid-cols-7 text-[11px] font-bold text-gray-500 mb-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d} className="text-center">{d}</div>)}
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: 30 }).map((_, i) => {
                          const day = i + 1;
                          const isSelected = day === 25;
                          return (
                            <div 
                              key={i} 
                              className={`calendar-day ${isSelected ? 'selected-day' : ''}`}
                              onClick={() => {
                                setFormData(prev => ({ ...prev, startDate: `2026-06-${day.toString().padStart(2, '0')}` }));
                                setIsStartDateOpen(false);
                              }}
                            >
                              {day}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Due Date */}
            <div className="form-group">
              <label>Due date</label>
              <div className="relative">
                <div 
                  className="date-custom-trigger"
                  onClick={() => setIsDueDateOpen(!isDueDateOpen)}
                >
                  <span className={formData.dueDate ? 'text-on-surface' : 'text-gray-400'}>
                    {formData.dueDate || 'Select date'}
                  </span>
                  <i data-lucide="calendar" className="w-4 h-4 text-gray-500"></i>
                </div>
                {isDueDateOpen && (
                  <div className="calendar-dropdown-container">
                    <div className="calendar-header">
                      <div className="flex gap-2">
                        <i data-lucide="chevrons-left" className="w-4 h-4 cursor-pointer hover:text-primary"></i>
                        <i data-lucide="chevron-left" className="w-4 h-4 cursor-pointer hover:text-primary"></i>
                      </div>
                      <span className="font-bold text-sm">June 2026</span>
                      <div className="flex gap-2">
                        <i data-lucide="chevron-right" className="w-4 h-4 cursor-pointer hover:text-primary"></i>
                        <i data-lucide="chevrons-right" className="w-4 h-4 cursor-pointer hover:text-primary"></i>
                      </div>
                    </div>
                    <div className="calendar-body">
                      <div className="grid grid-cols-7 text-[11px] font-bold text-gray-500 mb-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d} className="text-center">{d}</div>)}
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: 30 }).map((_, i) => {
                          const day = i + 1;
                          const isSelected = day === 25;
                          return (
                            <div 
                              key={i} 
                              className={`calendar-day ${isSelected ? 'selected-day' : ''}`}
                              onClick={() => {
                                setFormData(prev => ({ ...prev, dueDate: `2026-06-${day.toString().padStart(2, '0')}` }));
                                setIsDueDateOpen(false);
                              }}
                            >
                              {day}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
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
