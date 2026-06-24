import React, { useState } from 'react';

export default function TaskManagement() {
  const [view, setView] = useState('list');

  const switchView = (newView) => {
    setView(newView);
  };

  return (
    <div className="p-6 h-full overflow-y-auto bg-background text-on-surface" id="app-canvas">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>

          <h1 className="text-3xl font-bold bg-clip-text text-[#003d9b]">Task Management</h1>
        </div>
        <div className="flex items-center gap-3 bg-surface-container-low p-1 rounded-lg border border-outline-variant">
          <button
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-label-md font-label-md transition-colors ${view === 'list' ? 'bg-[#cdddff] text-[#003d9b]' : ''}`}
            onClick={() => switchView('list')}
          >
            <span className="material-symbols-outlined text-[20px]">list</span>
            List
          </button>
          <button
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-label-md font-label-md transition-colors ${view === 'board' ? 'bg-[#cdddff] text-[#003d9b]' : ''}`}
            onClick={() => switchView('board')}
          >
            <span className="material-symbols-outlined text-[20px]">grid_view</span>
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
              className="pl-10 pr-4 py-2 bg-white border border-outline-variant rounded text-body-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none w-64"
              placeholder="Filter by ID or title..."
              type="text"
            />
          </div>
          {/* Status Filter */}
          <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-outline-variant rounded hover:bg-surface-container transition-colors">
              <span className="text-label-md font-bold text-primary">Status</span>
              <span className="material-symbols-outlined text-primary text-[18px]">expand_more</span>
            </button>
            <div className="absolute top-full left-0 mt-1 w-48 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-sm hidden group-hover:block z-50">
              <div className="py-1">
                {['New', 'In Progress', 'In Testing', 'Pending Review', 'Need Revision', 'Done', 'Cancelled'].map(status => (
                  <a key={status} className="block px-4 py-2 text-body-sm text-on-surface hover:bg-surface-container transition-colors" href="#">{status}</a>
                ))}
              </div>
            </div>
          </div>
          {/* Priority Filter */}
          <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-outline-variant rounded hover:bg-surface-container transition-colors">
              <span className="text-label-md font-bold text-primary">Priority</span>
              <span className="material-symbols-outlined text-primary text-[18px]">expand_more</span>
            </button>
            <div className="absolute top-full left-0 mt-1 w-48 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-sm hidden group-hover:block z-50">
              <div className="py-1">
                {['High', 'Medium', 'Low'].map(p => (
                  <a key={p} className="block px-4 py-2 text-body-sm text-on-surface hover:bg-surface-container transition-colors" href="#">{p}</a>
                ))}
              </div>
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
            <div className="absolute top-full left-0 mt-1 w-56 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-sm hidden group-hover:block z-50">
              <div className="py-1">
                {[
                  { name: 'Unassigned', initial: '', color: 'bg-gray-100', icon: 'person' },
                  { name: 'Pham Tien', initial: 'PT', color: 'bg-blue-100' },
                  { name: 'Hoang Hoa', initial: 'HH', color: 'bg-orange-500', textColor: 'text-white' },
                  { name: 'Trong Nghia', initial: 'TN', color: 'bg-teal-500', textColor: 'text-white' }
                ].map(user => (
                  <a key={user.name} className="flex items-center gap-3 px-4 py-2 text-body-sm text-on-surface hover:bg-surface-container transition-colors" href="#">
                    <div className={`w-6 h-6 rounded-full ${user.color} flex items-center justify-center text-[10px] font-bold ${user.textColor || 'text-on-surface'}`}>
                      {user.initial || <span className="material-symbols-outlined text-[14px]">{user.icon}</span>}
                    </div>
                    {user.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="relative group">
          <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-primary text-[20px]">filter_list</span>
            <span className="text-label-md font-bold text-primary">More Filters</span>
          </button>
          
          {/* More Filters Dropdown */}
          <div className="absolute top-full right-0 mt-2 w-[450px] bg-white border border-outline-variant rounded shadow-xl hidden group-hover:block z-50 overflow-hidden flex min-h-[200px]">
            {/* Left Sidebar */}
            <div className="w-[140px] border-r border-outline-variant py-2">
              {[
                { name: 'Sprint' },
                { name: 'Assignee' },
                { name: 'Status' },
                { name: 'Priority' }
              ].map((item) => (
                <div key={item.name} className="px-6 py-2.5 text-[14px] text-[#42526E] hover:bg-[#F4F5F7] cursor-pointer transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{item.name}</span>
                    {item.info && <span className="material-symbols-outlined text-[#0052CC] text-[16px]">info</span>}
                  </div>
                </div>
              ))}
            </div>
            {/* Right Content */}
            <div className="flex-1 px-8 py-10 flex flex-col items-start justify-start">
              <p className="text-[14px] text-[#42526E] leading-relaxed">Select a field to start creating a filter.</p>
            </div>
          </div>
        </div>
      </div>

      {/* BOARD VIEW */}
      {view === 'board' && (
        <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide h-[calc(100vh-280px)]" id="board-view-container">
          {/* Column: NEW */}
          <KanbanColumn title="New" />
          {/* Column: IN_PROGRESS */}
          <KanbanColumn title="In Progress" color="primary" />
          {/* Column: IN_TESTING */}
          <KanbanColumn title="In Testing" />
          {/* Column: PENDING_REVIEW */}
          <KanbanColumn title="Pending Review" />
          {/* Column: NEED_REVISION */}
          <KanbanColumn title="Need Revision" color="error" />
          {/* Column: DONE */}
          <KanbanColumn title="Done" color="green" />
          {/* Column: CANCELLED */}
          <KanbanColumn title="Cancelled" color="grey" />
        </div>
      )}

      {/* LIST VIEW */}
      {view === 'list' && (
        <div className="bg-white border border-outline-variant rounded-lg overflow-hidden" id="list-view-container">
          <div className="px-6 py-3 border-b border-outline-variant bg-surface-container-low/30">
            <span className="text-body-sm text-outline">9 tasks total</span>
          </div>
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low border-b border-outline-variant">
              <tr className="text-label-sm text-outline uppercase tracking-wider">
                <th className="px-6 py-3 font-bold">Task ID</th>
                <th className="px-6 py-3 font-bold">Title</th>
                <th className="px-6 py-3 font-bold">Assignee</th>
                <th className="px-6 py-3 font-bold text-center">Priority</th>
                <th className="px-6 py-3 font-bold">Status</th>
                <th className="px-6 py-3 font-bold">Due Date</th>
                <th className="px-6 py-3 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              <TaskRow id="TM-104" title="Infrastructure setup" assignee="Alex Rivera" pts="4" status="New" date="Oct 24, 2023" />
              <TaskRow id="TM-301" title="API Documentation update" assignee="Sarah Chen" pts="3" status="In Progress" date="Oct 28, 2023" />
              <TaskRow id="TM-89" title="Checkout flow mobile fix" assignee="Jordan Smith" pts="5" status="In Testing" date="Nov 02, 2023" />
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function KanbanColumn({ title, color = 'outline' }) {
  const headerClass = color === 'error'
    ? 'bg-[#FFF0F0] border-[#FFDADA] text-[#BA1A1A]'
    : color === 'green'
      ? 'bg-[#E6FFF0] border-[#C2FFD9] text-[#006D3A]'
      : color === 'grey'
        ? 'bg-[#F2F4F7] border-[#EAECF0] text-[#475467]'
        : 'bg-[#E0E8FF] border-[#ADC4FF] text-[#003d9b]';

  return (
    <div className="kanban-column flex flex-col gap-4 bg-surface-container-low/30 border border-outline-variant/50 rounded-xl p-2 min-w-[310px]">
      <div className={`flex justify-between items-center px-4 py-3 rounded-xl border-b-2 ${headerClass} mb-2`}>
        <span className="text-label-md font-bold uppercase tracking-wider">{title}</span>
      </div>
      <div className="space-y-3 flex-1 overflow-y-auto scrollbar-hide px-0.5">
        <TaskCard id="TM-104" title="Infrastructure setup for production environment" date="Jun 24, 2026" pts="4" priority="High" />
        <TaskCard id="TM-212" title="SSO Authentication implementation" date="Jun 25, 2026" pts="2" priority="Medium" />
      </div>
    </div>
  );
}

function TaskCard({ id, title, date, pts, priority }) {
  return (
    <div className="bg-surface-container-lowest p-3 border border-outline-variant rounded shadow-sm hover:bg-surface-container-low cursor-grab transition-all group">
      <div className="text-body-md font-medium text-on-surface group-hover:text-primary mb-3 leading-snug">{title}</div>
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-surface-container text-on-surface-variant">
          <span className="material-symbols-outlined text-[14px]">calendar_month</span>
          <span className="text-[11px] font-semibold">{date}</span>
        </div>
      </div>
      <div className="flex justify-between items-center mt-auto">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-outline font-bold uppercase">{id}</span>
          <span className="px-1.5 py-0.5 bg-surface-container rounded text-[10px] font-bold text-outline">{pts} pts</span>
        </div>
        <div className="flex items-center gap-2">
          {priority === 'High' ? (
            <span className="material-symbols-outlined text-error text-[20px] font-bold">keyboard_double_arrow_up</span>
          ) : (
            <span className="material-symbols-outlined text-orange-500 text-[20px] font-bold">keyboard_arrow_up</span>
          )}
          <div className="w-6 h-6 rounded-full bg-gray-200 border border-outline-variant"></div>
        </div>
      </div>
    </div>
  );
}

function TaskRow({ id, title, assignee, pts, status, date }) {
  return (
    <tr className="hover:bg-surface-container-low/50 transition-colors cursor-pointer">
      <td className="px-6 py-3">
        <div className="flex items-center gap-2">
          <span className="text-body-sm font-medium">{id}</span>
          <span className="px-1.5 py-0.5 bg-surface-container rounded text-[10px] font-bold text-outline">{pts}</span>
        </div>
      </td>
      <td className="px-6 py-3 font-bold text-on-surface">{title}</td>
      <td className="px-6 py-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-200"></div>
          <span className="text-body-sm">{assignee}</span>
        </div>
      </td>
      <td className="px-6 py-3 text-center">
        <span className="material-symbols-outlined text-error font-bold">keyboard_double_arrow_up</span>
      </td>
      <td className="px-6 py-3">
        <span className="px-3 py-1 rounded-full bg-surface-container text-[10px] font-bold text-primary uppercase">{status}</span>
      </td>
      <td className="px-6 py-3 text-body-sm text-outline">{date}</td>
      <td className="px-6 py-3 text-center">
        <span className="material-symbols-outlined text-outline hover:text-error cursor-pointer">delete</span>
      </td>
    </tr>
  );
}
