import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function TaskManagement() {
  const navigate = useNavigate();
  const [view, setView] = useState('list');
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [isSprintExpanded, setIsSprintExpanded] = useState(true);
  const [tasks, setTasks] = useState([
    { id: "TM-104", title: "Infrastructure setup", assignee: "Alex Rivera", pts: 4, status: "New", priority: "High", date: "Jun 24, 2026" },
    { id: "TM-301", title: "API Documentation update", assignee: "Sarah Chen", pts: 3, status: "In Progress", priority: "Medium", date: "Jun 28, 2026" },
    { id: "TM-89", title: "Checkout flow mobile fix", assignee: "Jordan Smith", pts: 5, status: "In Testing", priority: "High", date: "Jul 02, 2026" },
    { id: "TM-102", title: "Security Protocols Audit", assignee: "Alex Rivera", pts: 8, status: "Done", priority: "High", date: "Jun 20, 2026" },
    { id: "TM-212", title: "SSO Authentication implementation", assignee: "Sarah Chen", pts: 2, status: "In Progress", priority: "Medium", date: "Jun 25, 2026" },
    { id: "TM-105", title: "API Integration & Testing", assignee: "Jordan Smith", pts: 3, status: "Pending Review", priority: "High", date: "Jul 05, 2026" },
    { id: "TM-402", title: "User Feedback UI Refactor", assignee: "Alex Rivera", pts: 2, status: "Need Revision", priority: "Low", date: "Jul 10, 2026" },
    { id: "TM-505", title: "Database Migration Script", assignee: "Sarah Chen", pts: 5, status: "New", priority: "High", date: "Jul 12, 2026" },
    { id: "TM-610", title: "Dashboard Charts optimization", assignee: "Jordan Smith", pts: 3, status: "In Testing", priority: "Medium", date: "Jul 15, 2026" },
    { id: "TM-701", title: "Mobile App Performance Tuning", assignee: "Jordan Smith", pts: 4, status: "In Testing", priority: "Medium", date: "Jul 18, 2026" },
    { id: "TM-802", title: "Push Notification Service", assignee: "Sarah Chen", pts: 3, status: "New", priority: "High", date: "Jul 20, 2026" },
  ]);

  const toggleAll = () => {
    if (selectedTasks.length === tasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(tasks.map(t => t.id));
    }
  };

  const toggleTask = (id) => {
    setSelectedTasks(prev =>
      prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
    );
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const updatedTasks = Array.from(tasks);
    const taskIndex = updatedTasks.findIndex(t => t.id === draggableId);

    if (taskIndex !== -1) {
      updatedTasks[taskIndex] = {
        ...updatedTasks[taskIndex],
        status: destination.droppableId
      };
      setTasks(updatedTasks);
    }
  };

  const switchView = (newView) => {
    setView(newView);
  };

  return (
    <div className="px-6 pb-6 pt-10 flex flex-col bg-background text-on-surface" style={{ height: '100%', overflow: 'hidden', position: 'relative' }} id="app-canvas">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">
            <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => navigate('/mainlayout')}>Tasks</span>
            <i className="w-3 h-3 mx-2 text-gray-400 material-symbols-outlined text-[12px]">chevron_right</i>
            <span className="hover:text-primary cursor-pointer transition-colors" onClick={() => navigate('/mainlayout')}>Space Management</span>
          </div>
          <h1 className="text-base font-bold text-[#5e4db2]">Task Management</h1>
        </div>
        <div className="flex items-center gap-3 bg-surface-container-low p-1 rounded-lg border border-outline-variant">
          <button
            className={`flex items-center gap-2 px-2.5 py-1 rounded text-xs font-medium transition-colors ${view === 'list' ? 'bg-[#cdddff] text-[#003d9b]' : 'text-gray-500'}`}
            onClick={() => switchView('list')}
          >
            <span className="material-symbols-outlined text-[16px]">list</span>
            List
          </button>
          <button
            className={`flex items-center gap-2 px-2.5 py-1 rounded text-xs font-medium transition-colors ${view === 'board' ? 'bg-[#cdddff] text-[#003d9b]' : 'text-gray-500'}`}
            onClick={() => switchView('board')}
          >
            <span className="material-symbols-outlined text-[16px]">grid_view</span>
            Board
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-outline text-[20px]">search</span>
            <input
              className="pl-10 pr-4 py-1.5 bg-white border border-outline-variant rounded text-[11px] w-[220px] focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              placeholder="Filter by ID or title..."
              type="text"
            />
          </div>
          {/* Status Filter */}
          <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-outline-variant rounded hover:bg-surface-container transition-colors shadow-sm cursor-pointer">
              <span className="text-xs font-bold text-[#5e4db2]">Status</span>
              <span className="material-symbols-outlined text-[#5e4db2] text-[14px]">expand_more</span>
            </button>
            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-outline-variant rounded-xl shadow-2xl hidden group-hover:block z-50 overflow-hidden">
              {['New', 'In Progress', 'In Testing', 'Pending Review', 'Need Revision', 'Done', 'Cancelled'].map(status => (
                <div key={status} className="px-4 py-2 text-[11px] hover:bg-surface-container transition-colors cursor-pointer text-on-surface">
                  {status}
                </div>
              ))}
            </div>
          </div>
          {/* Priority Filter */}
          <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-outline-variant rounded hover:bg-surface-container transition-colors shadow-sm cursor-pointer">
              <span className="text-xs font-bold text-[#5e4db2]">Priority</span>
              <span className="material-symbols-outlined text-[#5e4db2] text-[14px]">expand_more</span>
            </button>
            <div className="absolute top-full left-0 mt-2 w-40 bg-white border border-outline-variant rounded-xl shadow-2xl hidden group-hover:block z-50 overflow-hidden">
              {['High', 'Medium', 'Low'].map(priority => (
                <div key={priority} className="px-4 py-2 text-[11px] hover:bg-surface-container transition-colors cursor-pointer text-on-surface">
                  {priority}
                </div>
              ))}
            </div>
          </div>
          {/* Assignee Filter */}
          <div className="relative group">
            <button className="flex items-center ml-2 hover:opacity-80 transition-opacity">
              <div className="flex -space-x-1">
                <div className="w-7 h-7 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[10px] font-bold">PT</div>
                <div className="w-7 h-7 rounded-full bg-orange-500 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white">HH</div>
                <div className="w-7 h-7 rounded-full bg-teal-500 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white">TN</div>
              </div>
            </button>
            <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-outline-variant rounded-xl shadow-2xl hidden group-hover:block z-50 overflow-hidden">
              <div className="py-1">
                {[
                  { name: 'Unassigned', initial: '', color: 'bg-gray-100', icon: 'person' },
                  { name: 'Pham Tien', initial: 'PT', color: 'bg-[#cdddff]' },
                  { name: 'Hoang Hoa', initial: 'HH', color: 'bg-orange-500', textColor: 'text-white' },
                  { name: 'Trong Nghia', initial: 'TN', color: 'bg-teal-500', textColor: 'text-white' }
                ].map(user => (
                  <div key={user.name} className="flex items-center gap-3 px-4 py-2 text-[11px] text-on-surface hover:bg-surface-container transition-colors cursor-pointer">
                    <div className={`w-6 h-6 rounded-full ${user.color} flex items-center justify-center text-[9px] font-bold ${user.textColor || 'text-on-surface'}`}>
                      {user.initial || <span className="material-symbols-outlined text-[14px]">{user.icon}</span>}
                    </div>
                    {user.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Sprint Actions */}
          {view === 'board' && (
            <div className="flex items-center gap-2">
              <button className="px-4 py-1.5 bg-[#f0edff] text-[#5e4db2] rounded text-[13px] font-semibold hover:bg-[#e6e1ff] transition-colors">
                Complete sprint
              </button>
              <button className="flex items-center justify-center w-[36px] h-[36px] border border-outline-variant rounded hover:bg-surface-container transition-colors shadow-sm">
                <span className="material-symbols-outlined text-[20px] text-on-surface">insights</span>
              </button>
            </div>
          )}

          {/* Date Filter */}
          <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-outline-variant rounded hover:bg-surface-container transition-colors shadow-sm">
              <span className="material-symbols-outlined text-[#5e4db2] text-[16px]">calendar_month</span>
              <span className="text-[11px] font-bold text-[#5e4db2]">Date</span>
            </button>

            {/* Calendar Dropdown */}
            <div className="absolute top-full right-0 mt-2 w-[280px] bg-white border border-outline-variant rounded-xl shadow-2xl hidden group-hover:block z-50 overflow-hidden">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[12px] font-bold text-[#5e4db2]">June 2026</span>
                  <div className="flex gap-1">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <span key={day} className="text-[10px] font-bold text-outline uppercase">{day}</span>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 30 }).map((_, i) => {
                    const day = i + 1;
                    const isToday = day === 24;
                    return (
                      <button
                        key={day}
                        className={`h-7 w-7 flex items-center justify-center rounded-lg text-[10px] transition-colors ${isToday ? 'bg-[#5e4db2] text-white font-bold' : 'hover:bg-surface-container text-on-surface'
                          }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOARD VIEW */}
      {view === 'board' && (
        <div style={{ flex: '1 1 0', minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-4 pb-4 scrollbar-hide" id="board-view-container" style={{ flex: '1 1 0', minHeight: 0, overflowX: 'auto', overflowY: 'hidden', alignItems: 'stretch' }}>
              {['New', 'In Progress', 'In Testing', 'Pending Review', 'Need Revision', 'Done', 'Cancelled'].map(status => (
                <KanbanColumn
                  key={status}
                  title={status}
                  tasks={tasks.filter(t => t.status === status)}
                  setTasks={setTasks}
                  color={status === 'Need Revision' ? 'error' : status === 'Done' ? 'green' : status === 'Cancelled' ? 'grey' : 'outline'}
                />
              ))}
            </div>
          </DragDropContext>
        </div>
      )}

      {/* LIST VIEW */}
      {view === 'list' && (
        <>
          <div className="bg-white border border-outline-variant rounded-lg flex flex-col h-[calc(100vh-440px)] overflow-hidden shadow-sm" id="list-view-container">
            <div className="px-6 py-2 border-b border-outline-variant bg-surface-container-low/30 flex items-center justify-between flex-none">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="w-3.5 h-3.5 rounded border-outline-variant cursor-pointer accent-primary"
                  checked={selectedTasks.length === tasks.length && tasks.length > 0}
                  onChange={toggleAll}
                />
                <span
                  className="material-symbols-outlined text-[18px] text-outline cursor-pointer transition-transform duration-200"
                  style={{ transform: isSprintExpanded ? 'rotate(0deg)' : 'rotate(-90deg)' }}
                  onClick={() => setIsSprintExpanded(!isSprintExpanded)}
                >
                  expand_more
                </span>
                <span className="text-[12px] font-bold text-on-surface">SCRUM Sprint 1</span>
                <span className="text-[11px] text-outline">18 Jun – 2 Jul</span>
                <span className="text-[11px] text-outline">({tasks.length} work items)</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex gap-1">
                  <span className="px-1.5 py-0.5 bg-gray-200 text-[10px] font-bold rounded text-outline">
                    {tasks.filter(t => t.status === 'New' || t.status === 'Cancelled').length}
                  </span>
                  <span className="px-1.5 py-0.5 bg-[#ADC4FF] text-[10px] font-bold rounded text-[#003d9b]">
                    {tasks.filter(t => ['In Progress', 'In Testing', 'Pending Review', 'Need Revision'].includes(t.status)).length}
                  </span>
                  <span className="px-1.5 py-0.5 bg-[#C2FFD9] text-[10px] font-bold rounded text-[#006D3A]">
                    {tasks.filter(t => t.status === 'Done').length}
                  </span>
                </div>
                <button className="px-3 py-1 bg-[#f0edff] text-[#5e4db2] border border-[#e6e1ff] rounded text-[11px] font-bold hover:bg-[#e6e1ff] transition-colors shadow-sm">
                  Complete sprint
                </button>
                <span className="material-symbols-outlined text-[18px] text-outline cursor-pointer hover:text-on-surface transition-colors">more_horiz</span>
              </div>
            </div>
            {isSprintExpanded && (
              <div className="flex-1 overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-surface-container-low border-b border-outline-variant sticky top-0 z-10">
                    <tr className="text-[11px] text-outline uppercase tracking-wider">
                      <th className="px-2 py-3 font-bold text-center">Task ID</th>
                      <th className="px-6 py-3 font-bold">Title</th>
                      <th className="px-6 py-3 font-bold">Assignee</th>
                      <th className="px-6 py-3 font-bold text-center">Priority</th>
                      <th className="px-6 py-3 font-bold">Status</th>
                      <th className="px-6 py-3 font-bold">Due Date</th>
                      <th className="px-6 py-3 font-bold text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {tasks.map(task => (
                      <TaskRow
                        key={task.id}
                        {...task}
                        isSelected={selectedTasks.includes(task.id)}
                        isAnySelected={selectedTasks.length > 0}
                        onToggle={() => toggleTask(task.id)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* BACKLOG SECTION */}
          <div className="mt-4 flex flex-col gap-2" id="backlog-section">
            <div className="flex items-center justify-between bg-surface-container-low/30 p-2 rounded-t-lg border-x border-t border-outline-variant">
              <div className="flex items-center gap-3">
                <input type="checkbox" className="w-3.5 h-3.5 rounded border-outline-variant" />
                <span className="material-symbols-outlined text-[18px] text-outline cursor-pointer">expand_more</span>
                <span className="text-[12px] font-bold text-on-surface">Backlog</span>
                <span className="text-[11px] text-outline">(0 work items)</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex gap-1">
                  <span className="px-1.5 py-0.5 bg-gray-200 text-[10px] font-bold rounded text-outline">0</span>
                  <span className="px-1.5 py-0.5 bg-[#ADC4FF] text-[10px] font-bold rounded text-[#003d9b]">0</span>
                  <span className="px-1.5 py-0.5 bg-[#C2FFD9] text-[10px] font-bold rounded text-[#006D3A]">0</span>
                </div>
                <button className="px-3 py-1 bg-white border border-outline-variant rounded text-[11px] font-bold hover:bg-surface-container transition-colors shadow-sm">
                  Create sprint
                </button>
              </div>
            </div>

            <div className="border border-dashed border-outline-variant rounded-b-lg p-6 flex flex-col items-center justify-center bg-surface-container-lowest">
              <span className="text-[11px] text-outline italic">Your backlog is empty.</span>
            </div>

            <button className="flex items-center gap-2 mt-1 px-1 text-outline hover:text-primary transition-colors group w-fit">
              <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">add</span>
              <span className="text-[12px] font-medium">Create</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function KanbanColumn({ title, tasks, setTasks, color = 'outline' }) {
  const headerClass = `bg-[#E0E8FF] border-[#ADC4FF] ${title === 'Need Revision' ? 'text-[#BA1A1A]' :
    title === 'Done' ? 'text-[#006D3A]' :
      title === 'Cancelled' ? 'text-[#475467]' :
        'text-[#003d9b]'
    }`;

  return (
    <div className="kanban-column group flex flex-col bg-surface-container-low/30 border border-outline-variant/50 rounded-xl p-2 min-w-[300px]" style={{ height: '100%', maxHeight: '100%', flex: '0 0 300px' }}>
      <div className={`flex justify-between items-center px-4 py-2 rounded-xl border-b-2 ${headerClass} mb-1`}>
        <span className="text-[11px] font-bold uppercase tracking-wider">{title}</span>
      </div>
      <Droppable droppableId={title}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`space-y-3 px-0.5 transition-colors ${snapshot.isDraggingOver ? 'bg-primary/5' : ''}`}
            style={{ flex: '1 1 0', minHeight: '50px', overflowY: 'auto', overflowX: 'visible', scrollbarWidth: 'thin' }}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} totalCount={tasks.length} setTasks={setTasks} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <button className="hidden group-hover:flex items-center gap-2 px-3 py-2 mt-2 text-outline hover:text-on-surface transition-all w-full rounded hover:bg-surface-container/50">
        <span className="material-symbols-outlined text-[20px]">add</span>
        <span className="text-[13px] tracking-wide">Create</span>
      </button>
    </div>
  );
}

function TaskCard({ task, index, totalCount, setTasks }) {
  const { id, title, date, pts, priority } = task;
  const [isEditing, setIsEditing] = React.useState(false);
  const [tempPts, setTempPts] = React.useState(pts);
  const [showMenu, setShowMenu] = React.useState(false);
  const [showMoveSubMenu, setShowMoveSubMenu] = React.useState(false);
  const [showStatusSubMenu, setShowStatusSubMenu] = React.useState(false);
  const [menuPos, setMenuPos] = React.useState({ top: 0, left: 0 });
  const btnRef = useRef(null);
  const menuRef = useRef(null);

  const statuses = ['New', 'In Progress', 'In Testing', 'Pending Review', 'Need Revision', 'Done', 'Cancelled'];

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    if (!showMenu) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) &&
          btnRef.current && !btnRef.current.contains(e.target)) {
        setShowMenu(false);
        setShowMoveSubMenu(false);
        setShowStatusSubMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  const handleMenuToggle = (e) => {
    e.stopPropagation();
    if (showMenu) {
      setShowMenu(false);
      setShowMoveSubMenu(false);
      setShowStatusSubMenu(false);
      return;
    }
    // Tính toán tọa độ fixed dựa trên vị trí nút ...
    const rect = btnRef.current.getBoundingClientRect();
    // Menu rộng 192px (w-48), ưu tiên mở sang trái nếu không đủ chỗ bên phải
    const menuWidth = 192;
    let left = rect.right - menuWidth;
    if (left < 8) left = rect.left;
    setMenuPos({ top: rect.bottom + 4, left });
    setShowMenu(true);
  };

  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{ ...provided.draggableProps.style }}
          className={`relative bg-surface-container-lowest p-2.5 border border-outline-variant rounded shadow-sm hover:bg-surface-container-low transition-all group ${snapshot.isDragging ? 'shadow-xl ring-2 ring-primary/20 scale-[1.02] z-50' : ''}`}
        >
          <div className="flex justify-between items-start mb-2 gap-2">
            <div className="text-[11px] font-medium text-on-surface group-hover:text-primary leading-snug flex items-center gap-1.5 flex-wrap">
              {title}
              <span className="material-symbols-outlined text-[14px] text-outline opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:text-primary">edit</span>
            </div>
            <div>
              <button
                ref={btnRef}
                onClick={handleMenuToggle}
                className={`p-0.5 hover:bg-surface-container rounded cursor-pointer shrink-0 transition-opacity ${showMenu ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
              >
                <span className="material-symbols-outlined text-[18px] text-outline">more_horiz</span>
              </button>
            </div>
          </div>

          {/* Portal Menu - nổi lên trên mọi thứ với position:fixed */}
          {showMenu && createPortal(
            <div
              ref={menuRef}
              style={{ position: 'fixed', top: menuPos.top, left: menuPos.left, zIndex: 9999 }}
              className="bg-white border border-outline-variant shadow-2xl rounded-lg py-2 w-48"
            >
              {/* Move work item */}
              <div
                className="relative"
                onMouseEnter={() => { setShowMoveSubMenu(true); setShowStatusSubMenu(false); }}
                onMouseLeave={() => setShowMoveSubMenu(false)}
              >
                <button
                  className={`w-full flex items-center justify-between px-4 py-2.5 hover:bg-surface-container transition-colors text-[13px] text-left ${showMoveSubMenu ? 'bg-surface-container text-primary font-medium' : 'text-on-surface'}`}
                >
                  <span>Move work item</span>
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
                {showMoveSubMenu && (
                  <div
                    className="absolute top-0 left-full ml-1 bg-white border border-outline-variant shadow-2xl rounded-lg py-2 w-[160px]"
                    style={{ zIndex: 10000 }}
                  >
                    {index > 0 && (
                      <>
                        <button className="w-full px-4 py-2.5 hover:bg-surface-container transition-colors text-[13px] text-left text-on-surface">To the top</button>
                        <button className="w-full px-4 py-2.5 hover:bg-surface-container transition-colors text-[13px] text-left text-on-surface">Up</button>
                      </>
                    )}
                    {index < totalCount - 1 && (
                      <>
                        <button className="w-full px-4 py-2.5 hover:bg-surface-container transition-colors text-[13px] text-left text-on-surface">Down</button>
                        <button className="w-full px-4 py-2.5 hover:bg-surface-container transition-colors text-[13px] text-left text-on-surface">To the bottom</button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Change status */}
              <div
                className="relative"
                onMouseEnter={() => { setShowStatusSubMenu(true); setShowMoveSubMenu(false); }}
                onMouseLeave={() => setShowStatusSubMenu(false)}
              >
                <button
                  className={`w-full flex items-center justify-between px-4 py-2.5 hover:bg-surface-container transition-colors text-[13px] text-left ${showStatusSubMenu ? 'bg-surface-container text-primary font-medium' : 'text-on-surface'}`}
                >
                  <span>Change status</span>
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
                {showStatusSubMenu && (
                  <div
                    className="absolute top-0 left-full ml-1 bg-white border border-outline-variant shadow-2xl rounded-lg py-2 w-[160px]"
                    style={{ zIndex: 10000 }}
                  >
                    {statuses.map(s => (
                      <button
                        key={s}
                        onClick={() => {
                          setTasks(prev => prev.map(t => t.id === id ? { ...t, status: s } : t));
                          setShowMenu(false);
                          setShowStatusSubMenu(false);
                        }}
                        className="w-full px-4 py-2.5 hover:bg-surface-container transition-colors text-[13px] text-left text-on-surface"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>,
            document.body
          )}

          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-surface-container text-on-surface-variant">
              <span className="material-symbols-outlined text-[14px]">calendar_month</span>
              <span className="text-[11px] font-semibold">{date}</span>
            </div>
          </div>
          <div className="flex justify-between items-center mt-auto">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-outline font-bold uppercase">{id}</span>
              {!isEditing ? (
                <span
                  className="px-1 py-0.5 bg-surface-container rounded-sm text-[9px] font-bold text-outline cursor-pointer hover:bg-primary/10 hover:text-primary"
                  onClick={() => setIsEditing(true)}
                >
                  {pts} pts
                </span>
              ) : (
                <div className="flex flex-col gap-1 bg-white border border-primary rounded p-1 shadow-lg absolute z-20 -translate-y-2 translate-x-12">
                  <input
                    type="number"
                    className="w-12 h-6 text-[11px] border border-outline-variant rounded px-1 outline-none focus:border-primary"
                    value={tempPts}
                    onChange={(e) => setTempPts(parseInt(e.target.value))}
                    autoFocus
                  />
                  <div className="flex justify-between border-t border-outline-variant pt-1 mt-1">
                    <button className="hover:bg-green-100 rounded p-0.5" onClick={() => setIsEditing(false)}>
                      <span className="material-symbols-outlined text-[14px] text-green-600">done</span>
                    </button>
                    <button className="hover:bg-red-100 rounded p-0.5" onClick={() => setIsEditing(false)}>
                      <span className="material-symbols-outlined text-[14px] text-red-600">close</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {priority === 'High' ? (
                <span className="material-symbols-outlined text-[#BA1A1A] text-[20px] font-bold">keyboard_arrow_up</span>
              ) : priority === 'Medium' ? (
                <span className="material-symbols-outlined text-orange-500 text-[20px] font-bold">keyboard_double_arrow_up</span>
              ) : (
                <span className="material-symbols-outlined text-blue-500 text-[20px] font-bold">keyboard_arrow_down</span>
              )}
              <div className="w-6 h-6 rounded-full bg-gray-200 border border-outline-variant"></div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}

function TaskRow({ id, title, assignee, pts, status, date, priority, isSelected, isAnySelected, onToggle }) {
  const statusClass = status === 'Need Revision'
    ? 'bg-[#FFF0F0] text-[#BA1A1A]'
    : status === 'Done'
      ? 'bg-[#E6FFF0] text-[#006D3A]'
      : status === 'Cancelled' || status === 'New'
        ? 'bg-[#F2F4F7] text-[#475467]'
        : 'bg-[#E0E8FF] text-[#003d9b]';

  return (
    <tr
      className={`hover:bg-surface-container-low/50 transition-colors cursor-pointer ${isSelected ? 'bg-[#e6f0ff]' : ''}`}
      onClick={onToggle}
    >
      <td className="px-2 py-2">
        <div className="flex items-center justify-center gap-3">
          <input
            type="checkbox"
            className={`w-3.5 h-3.5 rounded border-outline-variant cursor-pointer accent-primary transition-opacity ${isAnySelected ? 'visible' : 'invisible'}`}
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onToggle();
            }}
          />
          <span className="text-[11px] font-medium text-outline">{id}</span>
          <span className="px-1 py-0.5 bg-surface-container rounded text-[9px] font-bold text-outline">{pts}</span>
        </div>
      </td>
      <td className={`px-4 py-2 font-semibold text-[11px] ${isSelected ? 'text-blue-700' : 'text-on-surface'}`}>{title}</td>
      <td className="px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-gray-200"></div>
          <span className="text-[11px]">{assignee}</span>
        </div>
      </td>
      <td className="px-4 py-2 text-center">
        {priority === 'High' ? (
          <span className="material-symbols-outlined text-[#BA1A1A] font-bold text-[16px]">keyboard_arrow_up</span>
        ) : priority === 'Medium' ? (
          <span className="material-symbols-outlined text-orange-500 font-bold text-[16px]">keyboard_double_arrow_up</span>
        ) : (
          <span className="material-symbols-outlined text-blue-500 font-bold text-[16px]">keyboard_arrow_down</span>
        )}
      </td>
      <td className="px-4 py-2">
        <span className={`px-3 py-1 rounded-full ${statusClass} text-[9px] font-bold uppercase`}>{status}</span>
      </td>
      <td className="px-4 py-2 text-[11px] text-outline">{date}</td>
      <td className="px-4 py-2 text-center">
        <span className="material-symbols-outlined text-outline hover:text-error cursor-pointer text-[16px]">delete</span>
      </td>
    </tr>
  );
}