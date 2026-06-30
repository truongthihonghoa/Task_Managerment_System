import React, { useState, useEffect, useRef } from 'react';
import '../../styles/CreateTaskModal.css';
import RichTextEditor from './RichTextEditor';


 export default function TaskDetailModal({ task, onClose, tasks = [], onUpdateTask }) {
  const [activeTab, setActiveTab] = useState('comments');
  const [commentText, setCommentText] = useState('');
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [isCompletedOpen, setIsCompletedOpen] = useState(false);
  const [isCreatedOpen, setIsCreatedOpen] = useState(false);
  const [isStoryPointsOpen, setIsStoryPointsOpen] = useState(false);
  const [localTask, setLocalTask] = useState(task || {});
  const [isDescriptionEditing , setIsDescriptionEditing] = useState(false);
  const [tempDescription, setTempDescription] = useState(task?.description || '');
  const [pendingDescriptionAttachments, setPendingDescriptionAttachments] = useState([]);
  const [previewAttachment, setPreviewAttachment] = useState(null);
  const [previewZoom, setPreviewZoom] = useState(1);
  const [baseMax, setBaseMax] = useState({ w: Math.max(600, window.innerWidth * 0.7), h: Math.max(400, window.innerHeight * 0.7) });
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });
  const [baseWidth, setBaseWidth] = useState(null);
  const previewImgRef = React.useRef(null);
  const [isCommentEditing, setIsCommentEditing] = useState(false);
  const [tempComment, setTempComment] = useState('');
  const [replyToCommentId, setReplyToCommentId] = useState(null);
  const [editCommentId, setEditCommentId] = useState(null);
  const [deleteConfirmCommentId, setDeleteConfirmCommentId] = useState(null);
  const [isUploadAreaOpen, setIsUploadAreaOpen] = useState(false);
  const [attachments, setAttachments] = useState(task?.attachments || []);
  const [comments, setComments] = useState(task?.comments || [
    {
      id: 1,
      author: 'Peter Tan',
      date: 'Jun 22, 2026',
      text: 'Can we get more info on the validation rules for the email field?',
      parentId: null
    }
  ]);
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(task?.title || '');


  const [completedMonth, setCompletedMonth] = useState(5);
  const [completedYear, setCompletedYear] = useState(2026);
  const [createdMonth, setCreatedMonth] = useState(5);
  const [createdYear, setCreatedYear] = useState(2026);
  const uploadInputRef = useRef(null);
  const replaceInputRef = useRef(null);
  const [replaceTargetId, setReplaceTargetId] = useState(null);

  const formatFileSize = (bytes) => {
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${bytes} B`;
  };

  const createAttachmentFromFile = (file, index = 0) => {
    const isImage = file.type.startsWith('image/');
    return {
      id: Date.now() + index,
      name: file.name,
      size: formatFileSize(file.size),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      icon: file.name.endsWith('.zip') ? 'folder_zip' : file.name.endsWith('.pdf') ? 'picture_as_pdf' : isImage ? 'image' : 'upload_file',
      color: file.name.endsWith('.zip') ? '#4C2B74' : file.name.endsWith('.pdf') ? '#DE350B' : '#4C2B74',
      bg: file.name.endsWith('.zip') ? '#EBF5FF' : file.name.endsWith('.pdf') ? '#FFF5F5' : '#EEF3FF',
      type: isImage ? 'image' : 'file',
      previewUrl: isImage ? URL.createObjectURL(file) : null
    };
  };

  const syncTask = (updates) => {
    setLocalTask(prev => {
      const next = { ...prev, ...updates };
      if (onUpdateTask) onUpdateTask(next);
      return next;
    });
  };

  const addAttachments = (newAttachments, options = { persistImmediately: true }) => {
    setAttachments(prev => {
      const next = [...prev, ...newAttachments];
      if (options.persistImmediately) {
        setLocalTask(prevTask => ({ ...prevTask, attachments: next }));
        syncTask({ attachments: next });
      }
      return next;
    });
  };

  const triggerReplace = (id) => {
    setReplaceTargetId(id);
    replaceInputRef.current?.click();
  };

  const handleReplaceFile = (e) => {
    const file = e.target.files?.[0];
    if (!file || replaceTargetId == null) return;
    const newAtt = createAttachmentFromFile(file);
    setAttachments(prev => {
      const next = prev.map(a => a.id === replaceTargetId ? { ...a, name: newAtt.name, size: newAtt.size, date: newAtt.date, icon: newAtt.icon, color: newAtt.color, bg: newAtt.bg, type: newAtt.type, previewUrl: newAtt.previewUrl } : a);
      setLocalTask(prevTask => ({ ...prevTask, attachments: next }));
      syncTask({ attachments: next });
      return next;
    });
    setReplaceTargetId(null);
    e.target.value = '';
  };

  const deleteAttachment = (id) => {
    setAttachments(prev => {
      const toDelete = prev.find(a => a.id === id);
      if (toDelete && toDelete.previewUrl) {
        try { URL.revokeObjectURL(toDelete.previewUrl); } catch(_){}
      }
      const next = prev.filter(a => a.id !== id);
      // only remove from attachments list; do not alter description or comments
      setLocalTask(prevTask => {
        const updated = { ...prevTask, attachments: next };
        if (onUpdateTask) onUpdateTask(updated);
        return updated;
      });
      syncTask({ attachments: next });
      return next;
    });
  };

  const downloadAttachment = (att, e) => {
    e?.stopPropagation();
    if (!att) return;
    // If previewUrl exists (client-side file), trigger download
    if (att.previewUrl) {
      try {
        const a = document.createElement('a');
        a.href = att.previewUrl;
        a.download = att.name || 'download';
        document.body.appendChild(a);
        a.click();
        a.remove();
      } catch (err) {
        // fallback: open in new tab
        window.open(att.previewUrl, '_blank');
      }
    } else {
      // No client preview URL available — attempt to open file URL if present
      if (att.url) window.open(att.url, '_blank');
    }
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    addAttachments(files.map((file, index) => createAttachmentFromFile(file, index)));
    setIsUploadAreaOpen(false);
    event.target.value = '';
  };

  const handleFileUploadObject = (file) => {
    if (!file) return;
    const attachment = createAttachmentFromFile(file);
    if (isDescriptionEditing) {
      setPendingDescriptionAttachments(prev => [...prev, attachment]);
    } else {
      addAttachments([attachment]);
    }
  };

  const openUploadDialog = () => {
    setIsUploadAreaOpen(true);
    uploadInputRef.current?.click();
  };


  const getDaysInMonth = (year, month) => {
    const days = [];
    const startDay = new Date(year, month, 1).getDay();
    const numDays = new Date(year, month + 1, 0).getDate();
    for (let i = 0; i < startDay; i++) days.push(null);
    for (let d = 1; d <= numDays; d++) days.push(d);
    return days;
  };


  const monthAbbrs = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


  useEffect(() => {
    if (task) {
      setLocalTask(task);
      setTempDescription(task.description || '');
      setTempTitle(task.title || '');
      setComments(task.comments || [
        {
          id: 1,
          author: 'Peter Tan',
          date: 'Jun 22, 2026',
          text: 'Can we get more info on the validation rules for the email field?',
          parentId: null
        }
      ]);
      setAttachments(task.attachments || []);
      setPendingDescriptionAttachments([]);
      setReplyToCommentId(null);
      setEditCommentId(null);
      setIsDescriptionEditing(false);
      setIsTitleEditing(false);


      if (task.date) {
        const d = new Date(task.date);
        if (!isNaN(d.getTime())) {
          setCompletedMonth(d.getMonth());
          setCompletedYear(d.getFullYear());
        }
      }
      if (task.createdAt) {
        const d = new Date(task.createdAt);
        if (!isNaN(d.getTime())) {
          setCreatedMonth(d.getMonth());
          setCreatedYear(d.getFullYear());
        }
      }
    }
  }, [task]);

  // Update baseMax on resize so image fits the viewport nicely
  useEffect(() => {
    const update = () => {
      const w = Math.max(600, window.innerWidth * 0.7);
      const h = Math.max(400, window.innerHeight * 0.7);
      setBaseMax({ w, h });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);


  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);


  if (!task) return null;


  // Get initials from name
  const getInitials = (name) => {
    if (!name) return 'UN';
    const parts = name.split(' ');
    if (parts.length === 0) return 'UN';
    return parts.map(n => n ? n[0] : '').join('').toUpperCase().substring(0, 2);
  };


  const getReplies = (parentId) => comments.filter(comment => comment.parentId === parentId);


  const renderComment = (comment, level = 0) => (
    <div key={comment.id} className="flex flex-col gap-3 relative" style={{ paddingLeft: `${level * 36}px` }}>
      <div className="flex gap-3">
        <div
          className="shrink-0 flex items-center justify-center"
          style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#DFE1E6', fontSize: '11px', fontWeight: 700, color: '#42526E' }}
        >
          {comment.author.split(' ').map(n => n ? n[0] : '').join('').toUpperCase().substring(0, 2)}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2" style={{ marginBottom: '4px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#172B4D' }}>{comment.author}</span>
            <span style={{ fontSize: '11px', color: '#6B778C' }}>{comment.date}</span>
          </div>
          <p style={{ fontSize: '13px', color: '#172B4D', lineHeight: '1.5' }} dangerouslySetInnerHTML={{ __html: comment.text }} />
          <div className="flex gap-4" style={{ marginTop: '6px' }}>
            <button
              style={{ fontSize: '11px', fontWeight: 500, color: '#6B778C', background: 'none', border: 'none', cursor: 'pointer' }}
              className="hover:text-[#4C2B74]"
              onClick={() => {
                setReplyToCommentId(comment.id);
                setTempComment(`@${comment.author} `);
                setIsCommentEditing(true);
              }}
            >
              Reply
            </button>
            <button
              style={{ fontSize: '11px', fontWeight: 500, color: '#6B778C', background: 'none', border: 'none', cursor: 'pointer' }}
              className="hover:text-[#4C2B74]"
              onClick={() => {
                setTempComment(comment.text);
                setReplyToCommentId(null);
                setEditCommentId(comment.id);
                setIsCommentEditing(true);
              }}
            >
              Edit
            </button>
            <button
              style={{ fontSize: '11px', fontWeight: 500, color: '#DE350B', background: 'none', border: 'none', cursor: 'pointer' }}
              className="hover:text-[#B91C1C]"
              onClick={() => setDeleteConfirmCommentId(comment.id)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      {replyToCommentId === comment.id && (
        <div className="flex flex-col gap-3" style={{ paddingLeft: '36px' }}>
          <div style={{ fontSize: '12px', color: '#42526E' }}>Replying to {comment.author}</div>
          <RichTextEditor
            value={tempComment}
            onChange={(val) => setTempComment(val)}
            placeholder="Add a reply..."
            tasks={tasks}
            onUploadFile={handleFileUploadObject}
          />
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (tempComment.trim()) {
                  setComments(prev => [
                    {
                      id: Date.now(),
                      author: 'You',
                      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                      text: tempComment,
                      parentId: comment.id
                    },
                    ...prev
                  ]);
                }
                setIsCommentEditing(false);
                setTempComment('');
                setReplyToCommentId(null);
              }}
              style={{ padding: '6px 16px', backgroundColor: '#4C2B74', color: '#fff', border: 'none', borderRadius: '3px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}
              className="hover:opacity-90 active:scale-[0.97] transition-all"
            >
              Comment
            </button>
            <button
              onClick={() => {
                setIsCommentEditing(false);
                setTempComment('');
                setReplyToCommentId(null);
              }}
              style={{ padding: '6px 16px', background: 'none', border: 'none', borderRadius: '3px', fontSize: '14px', fontWeight: 500, color: '#42526E', cursor: 'pointer' }}
              className="hover:bg-[#EBECF0] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {editCommentId === comment.id && (
        <div className="flex flex-col gap-3" style={{ paddingLeft: '36px' }}>
          <div style={{ fontSize: '12px', color: '#42526E' }}>Editing comment</div>
          <RichTextEditor
            value={tempComment}
            onChange={(val) => setTempComment(val)}
            placeholder="Edit comment..."
            tasks={tasks}
            onUploadFile={handleFileUploadObject}
          />
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (tempComment.trim()) {
                  setComments(prev => {
                    const next = prev.map(c => c.id === comment.id ? { ...c, text: tempComment } : c);
                    syncTask({ comments: next });
                    return next;
                  });
                }
                setIsCommentEditing(false);
                setTempComment('');
                setEditCommentId(null);
              }}
              style={{ padding: '6px 16px', backgroundColor: '#4C2B74', color: '#fff', border: 'none', borderRadius: '3px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}
              className="hover:opacity-90 active:scale-[0.97] transition-all"
            >
              Comment
            </button>
            <button
              onClick={() => {
                setIsCommentEditing(false);
                setTempComment('');
                setEditCommentId(null);
              }}
              style={{ padding: '6px 16px', background: 'none', border: 'none', borderRadius: '3px', fontSize: '14px', fontWeight: 500, color: '#42526E', cursor: 'pointer' }}
              className="hover:bg-[#EBECF0] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {getReplies(comment.id).map(reply => renderComment(reply, level + 1))}
    </div>
  );


  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(9, 30, 66, 0.54)', backdropFilter: 'blur(2px)' }}
      onClick={onClose}
    >
      <div
        className="bg-white flex flex-col overflow-hidden"
        style={{
          width: '90%',
          maxWidth: '1100px',
          height: '90vh',
          borderRadius: '8px',
          boxShadow: '0 8px 16px -4px rgba(9,30,66,0.25), 0 0 0 1px rgba(9,30,66,0.08)',
          animation: 'modalFadeIn 0.2s ease-out',
          fontFamily: 'var(--font-inter)'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* ─── Header ─── */}
        <div
          className="flex justify-between items-center shrink-0"
          style={{ padding: '14px 24px', borderBottom: '2px solid #F4F5F7' }}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined " style={{ color: '#4C2B74', fontSize: '25px'}}>task_alt</span>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#5E6C84', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              {task.id} / {task.sprint || 'Development'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {/* share and more icons removed per UX request */}
            <button className="flex items-center justify-center p-1.5 rounded hover:bg-[#EBECF0] transition-colors" onClick={onClose} title="Close">
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#42526E' }}>close</span>
            </button>
          </div>
        </div>


        {/* ─── Body ─── */}
        <div className="flex flex-1 overflow-hidden">


          {/* ── Left: Main Details ── */}
          <main
            className="flex-1 overflow-y-auto custom-scrollbar"
            style={{ padding: '28px 32px', backgroundColor: '#fff' }}
          >
            {/* Title */}
            {!isTitleEditing ? (
              <h1
                onClick={() => setIsTitleEditing(true)}
                className="hover:bg-[#F4F5F7] rounded cursor-pointer transition-colors"
                style={{ fontSize: '20px', fontWeight: 500, color: '#172B4D', marginBottom: '16px', lineHeight: '1.4', padding: '4px 8px', marginLeft: '-8px' }}
              >
                {localTask.title}
              </h1>
            ) : (
              <div style={{ marginBottom: '16px' }}>
                <input
                  type="text"
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  onBlur={() => {
                    setLocalTask(prev => ({ ...prev, title: tempTitle }));
                    setIsTitleEditing(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setLocalTask(prev => ({ ...prev, title: tempTitle }));
                      setIsTitleEditing(false);
                    } else if (e.key === 'Escape') {
                      setTempTitle(localTask.title);
                      setIsTitleEditing(false);
                    }
                  }}
                  autoFocus
                  style={{
                    width: '100%',
                    fontSize: '20px',
                    fontWeight: 500,
                    color: '#172B4D',
                    padding: '4px 8px',
                    marginLeft: '-8px',
                    border: '2px solid #4C2B74',
                    borderRadius: '3px',
                    outline: 'none',
                    backgroundColor: '#fff'
                  }}
                />
              </div>
            )}


            {/* Action Buttons */}
            <div className="flex gap-2" style={{ marginBottom: '28px' }}>
              {/* Attach button removed as requested */}
            </div>


            {/* Description */}
            <div style={{ marginBottom: '28px' }}>
              <h3 style={{ fontSize: '11px', fontWeight: 600, color: '#5E6C84', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Description
              </h3>
             
              {!isDescriptionEditing ? (
                <div
                  className="group cursor-text hover:bg-[#F4F5F7] transition-colors"
                  style={{ padding: '12px 16px', border: '1px solid #DFE1E6', borderRadius: '4px', minHeight: '100px', backgroundColor: 'white' }}
                  onClick={() => setIsDescriptionEditing(true)}
                >
                  {localTask.description ? (
                    <div
                      style={{ fontSize: '14px', lineHeight: '1.6', color: '#172B4D' }}
                      dangerouslySetInnerHTML={{ __html: localTask.description }}
                    />
                  ) : (
                    <span style={{ fontSize: '14px', color: '#6B778C' }}>Add a description...</span>
                  )}
                  <div className="hidden group-hover:block" style={{ marginTop: '8px', fontSize: '12px', color: '#6B778C', fontStyle: 'italic' }}>
                    Click to edit...
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <RichTextEditor
                    value={tempDescription}
                    onChange={(val) => setTempDescription(val)}
                    placeholder="Describe this task..."
                    tasks={tasks}
                    onUploadFile={handleFileUploadObject}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const combinedAttachments = [...attachments, ...pendingDescriptionAttachments];
                        setLocalTask(prev => ({ ...prev, description: tempDescription, attachments: combinedAttachments }));
                        syncTask({ description: tempDescription, attachments: combinedAttachments });
                        setAttachments(combinedAttachments);
                        setPendingDescriptionAttachments([]);
                        setIsDescriptionEditing(false);
                      }}
                      style={{ padding: '6px 12px', backgroundColor: '#4C2B74', color: '#fff', border: 'none', borderRadius: '3px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                      className="hover:opacity-90 transition-all"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setTempDescription(localTask.description || '');
                        setIsDescriptionEditing(false);
                      }}
                      style={{ padding: '6px 12px', background: 'none', border: 'none', borderRadius: '3px', fontSize: '13px', fontWeight: 600, color: '#42526E', cursor: 'pointer' }}
                      className="hover:bg-[#EBECF0] transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>


            {/* Attachments */}
            <div style={{ marginBottom: '28px' }}>
              <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
                <h3 style={{ fontSize: '11px', fontWeight: 600, color: '#5E6C84', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Attachments ({attachments.length})
                </h3>
                <button
                  onClick={openUploadDialog}
                  style={{ fontSize: '12px', fontWeight: 600, color: '#4C2B74', background: 'none', border: 'none', cursor: 'pointer' }}
                  className="hover:text-[#2E1C54] transition-colors"
                >
                  Upload file
                </button>
                <input
                  type="file"
                  ref={uploadInputRef}
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                  multiple
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {attachments.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-3 group cursor-pointer hover:bg-[#F4F5F7] transition-colors"
                    style={{ padding: '10px 14px', border: '1px solid #DFE1E6', borderRadius: '6px' }}
                    onClick={() => {
                      if (file.type === 'image' && file.previewUrl) {
                        setPreviewAttachment(file);
                      }
                    }}
                  >
                    {file.type === 'image' && file.previewUrl ? (
                      <img
                        src={file.previewUrl}
                        alt={file.name}
                        style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #DFE1E6' }}
                      />
                    ) : (
                      <div className="flex items-center justify-center shrink-0" style={{ width: '40px', height: '40px', backgroundColor: file.bg, borderRadius: '6px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '22px', color: file.color }}>{file.icon}</span>
                      </div>
                    )}
                    <div className="flex flex-col flex-1 overflow-hidden">
                      <span className="truncate" style={{ fontSize: '13px', fontWeight: 600, color: '#172B4D' }}>{file.name}</span>
                      <span style={{ fontSize: '11px', color: '#6B778C' }}>{file.size} • {file.date}</span>
                    </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); triggerReplace(file.id); }}
                        title="Replace"
                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#6B778C', padding: 6, borderRadius: 6 }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>edit</span>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteAttachment(file.id); }}
                        title="Delete"
                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#DE350B', padding: 6, borderRadius: 6 }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                      {file.previewUrl ? (
                        <button
                          onClick={(e) => downloadAttachment(file, e)}
                          title="Download"
                          style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#42526E', padding: 6, borderRadius: 6 }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>download</span>
                        </button>
                      ) : (
                        <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity" style={{ fontSize: '18px', color: '#42526E' }}>download</span>
                      )}
                    </div>
                  </div>
                ))}
                <input type="file" ref={replaceInputRef} onChange={handleReplaceFile} style={{ display: 'none' }} />
              </div>
              {isUploadAreaOpen && (
                <div
                  className="mt-4 p-5 rounded-2xl border border-dashed border-[#DFE1E6] bg-[#FAFBFC]"
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                  onClick={openUploadDialog}
                >
                  <div
                    className="flex items-center justify-center"
                    style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: '#F4F7FA' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#4C2B74' }}>cloud_upload</span>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#172B4D' }}>Click to upload or drag and drop</div>
                    <div style={{ fontSize: '12px', color: '#6B778C', marginTop: '4px' }}>PDF, ZIP, PNG, or JPG up to 20MB</div>
                  </div>
                </div>
              )}
            </div>

            {previewAttachment && (
              <div
                className="fixed inset-0 z-[11000] flex items-center justify-center bg-black/70"
                onClick={() => {
                  setPreviewAttachment(null);
                  setPreviewZoom(1);
                }}
              >
                <div
                  className="bg-white rounded-2xl p-2"
                  style={{ position: 'relative', width: '75vw', height: '80vh', padding: 12, overflow: 'hidden' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: '8px', zIndex: 20 }}>
                    <button
                      onClick={() => setPreviewZoom(prev => Math.max(0.5, prev - 0.25))}
                      style={{ border: '1px solid #DFE1E6', background: '#fff', borderRadius: '6px', width: '34px', height: '34px', fontSize: '18px', color: '#4C2B74', cursor: 'pointer' }}
                      title="Zoom out"
                    >
                      −
                    </button>
                    <button
                      onClick={() => setPreviewZoom(prev => Math.min(2, prev + 0.25))}
                      style={{ border: '1px solid #DFE1E6', background: '#fff', borderRadius: '6px', width: '34px', height: '34px', fontSize: '18px', color: '#4C2B74', cursor: 'pointer' }}
                      title="Zoom in"
                    >
                      +
                    </button>
                    <button
                      onClick={() => {
                        setPreviewAttachment(null);
                        setPreviewZoom(1);
                      }}
                      style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#4C2B74', fontSize: '24px', lineHeight: '1' }}
                      title="Close"
                    >
                      ×
                    </button>
                  </div>
                  <div className="flex items-center justify-between mb-3" style={{ gap: '12px', minWidth: '300px' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#172B4D' }}>{previewAttachment.name}</div>
                      <div style={{ fontSize: '12px', color: '#6B778C' }}>{previewAttachment.size}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'center', overflow: 'auto', height: 'calc(80vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ display: 'inline-block' }}>
                      <img
                        ref={previewImgRef}
                        src={previewAttachment.previewUrl}
                        alt={previewAttachment.name}
                        onLoad={(e) => {
                          const iw = e.target.naturalWidth || e.target.width;
                          const ih = e.target.naturalHeight || e.target.height;
                          setNaturalSize({ w: iw, h: ih });
                          // compute fit scale to baseMax
                          const fitScale = Math.min(1, baseMax.w / iw, baseMax.h / ih);
                          const bw = Math.round(iw * fitScale);
                          setBaseWidth(bw);
                          // reset zoom to 1 when loading new image
                          setPreviewZoom(1);
                        }}
                        style={{
                          width: baseWidth ? `${Math.max(40, Math.min(baseWidth * previewZoom, baseMax.w * 4))}px` : 'auto',
                          height: 'auto',
                          maxWidth: 'none',
                          maxHeight: 'none',
                          borderRadius: '6px',
                          display: 'block'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}


            {/* ── Activity Tabs ── */}
            <div>
              <div className="flex items-center gap-6" style={{ borderBottom: '2px solid #F4F5F7', marginBottom: '20px' }}>
                <button
                  onClick={() => setActiveTab('comments')}
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: activeTab === 'comments' ? '#4C2B74' : '#5E6C84',
                    borderBottom: activeTab === 'comments' ? '2px solid #4C2B74' : '2px solid transparent',
                    padding: '10px 2px',
                    marginBottom: '-2px',
                    background: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  Comments
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: activeTab === 'history' ? '#4C2B74' : '#5E6C84',
                    borderBottom: activeTab === 'history' ? '2px solid #4C2B74' : '2px solid transparent',
                    padding: '10px 2px',
                    marginBottom: '-2px',
                    background: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  Assign History
                </button>
              </div>


              {/* Comments View */}
              {activeTab === 'comments' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {/* Comment Editor */}
                  {!replyToCommentId && !editCommentId && (
                    <div className="flex flex-col gap-3" style={{ paddingTop: '8px' }}>
                      {!isCommentEditing ? (
                        <div
                          className="flex-1 cursor-text hover:bg-[#F4F5F7] transition-colors"
                          style={{
                            padding: '10px 14px',
                            border: '2px solid #DFE1E6',
                            borderRadius: '3px',
                            fontSize: '13px',
                            color: '#6B778C',
                            backgroundColor: '#FAFBFC',
                            minHeight: '40px',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          onClick={() => {
                            setIsCommentEditing(true);
                            setReplyToCommentId(null);
                          }}
                        >
                          Add a comment...
                        </div>
                      ) : (
                        <div className="flex flex-col gap-3">
                          <RichTextEditor
                            value={tempComment}
                            onChange={(val) => setTempComment(val)}
                            placeholder="Add a comment..."
                            tasks={tasks}
                            onUploadFile={handleFileUploadObject}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                if (tempComment.trim()) {
                                  setComments(prev => [
                                    {
                                      id: Date.now(),
                                      author: 'You',
                                      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                                      text: tempComment,
                                      parentId: null
                                    },
                                    ...prev
                                  ]);
                                }
                                setIsCommentEditing(false);
                                setTempComment('');
                                setReplyToCommentId(null);
                              }}
                              style={{ padding: '6px 16px', backgroundColor: '#4C2B74', color: '#fff', border: 'none', borderRadius: '3px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}
                              className="hover:opacity-90 active:scale-[0.97] transition-all"
                            >
                              Comment
                            </button>
                            <button
                              onClick={() => {
                                setIsCommentEditing(false);
                                setTempComment('');
                                setReplyToCommentId(null);
                              }}
                              style={{ padding: '6px 16px', background: 'none', border: 'none', borderRadius: '3px', fontSize: '14px', fontWeight: 500, color: '#42526E', cursor: 'pointer' }}
                              className="hover:bg-[#EBECF0] transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}


                  {/* Existing Comments */}
                  <div className="flex flex-col gap-4">
                    {comments.filter(comment => comment.parentId === null).map(comment => renderComment(comment))}
                  </div>
                </div>
              )}


              {/* History View */}
              {activeTab === 'history' && (
                <div>
                  <div
                    className="flex items-center gap-2 flex-wrap"
                    style={{ borderLeft: '2px solid #DFE1E6', marginLeft: '16px', paddingLeft: '16px', paddingTop: '8px', paddingBottom: '8px', fontSize: '13px', color: '#172B4D' }}
                  >
                    <span style={{ fontWeight: 700 }}>John Doe</span>
                    <span style={{ color: '#5E6C84' }}>updated status to</span>
                    <span style={{
                      padding: '2px 8px',
                      backgroundColor: '#E0E8FF',
                      color: '#003d9b',
                      borderRadius: '3px',
                      fontSize: '10px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap'
                    }}>
                      {task.status}
                    </span>
                    <span className="ml-auto" style={{ fontSize: '11px', color: '#6B778C' }}>2 hours ago</span>
                  </div>
                </div>
              )}
            </div>
          </main>


          {/* ── Right Sidebar ── */}
          <aside
            className="overflow-y-auto custom-scrollbar shrink-0"
            style={{ width: '340px', borderLeft: '2px solid #F4F5F7', padding: '24px', backgroundColor: '#FAFBFC' }}
          >
            {/* Sidebar Header */}
            <h2 style={{ fontSize: '13px', fontWeight: 700, color: '#42526E', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '16px' }}>
              Task Detail
            </h2>


            <div style={{ backgroundColor: '#fff', border: '1px solid #DFE1E6', borderRadius: '6px', padding: '20px' }}>


              {/* ── Assignee ── */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#5E6C84', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Assignee
                </label>
                <div
                  className="flex items-center gap-2.5 group cursor-pointer rounded hover:bg-[#F4F5F7] transition-colors"
                  style={{ padding: '6px 4px', marginLeft: '-4px' }}
                >
                  <div
                    className="shrink-0 flex items-center justify-center"
                    style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#4C2B74', color: '#fff', fontSize: '10px', fontWeight: 700 }}
                  >
                    {getInitials(task.assignee)}
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#172B4D' }}>{task.assignee || 'Unassigned'}</span>
                  <span className="material-symbols-outlined ml-auto opacity-0 group-hover:opacity-100 transition-opacity" style={{ fontSize: '16px', color: '#6B778C' }}>edit</span>
                </div>
              </div>


              {/* ── Status ── */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#5E6C84', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Status
                </label>
                <div className="relative">
                  <div
                    className="status-custom-trigger"
                    style={{ padding: '4px 10px', border: '1px solid #DFE1E6', borderRadius: '4px', background: 'white' }}
                    onClick={() => setIsStatusOpen(!isStatusOpen)}
                  >
                    <span className={`status-badge-pill ${
                      (localTask?.status || '') === 'Need Revision' ? 'badge-revision' :
                      (localTask?.status || '') === 'Done' ? 'badge-done' :
                      ((localTask?.status || '') === 'Cancelled' || (localTask?.status || '') === 'New') ? 'badge-neutral' :
                      'badge-progress'
                    }`} style={{ fontSize: '11px' }}>
                      {(localTask?.status || 'IN PROGRESS').toUpperCase()}
                    </span>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#6B778C' }}>expand_more</span>
                  </div>


                  {isStatusOpen && (
                    <div className="status-custom-dropdown" style={{ left: 0, width: '100%' }}>
                      {['New', 'In Progress', 'In Testing', 'Pending Review', 'Need Revision', 'Done', 'Cancelled'].map(s => (
                        <div
                          key={s}
                          className="status-dropdown-item"
                          onClick={() => {
                            setLocalTask(prev => ({ ...prev, status: s }));
                            setIsStatusOpen(false);
                          }}
                        >
                          <span className={`status-badge-pill ${
                            s === 'Need Revision' ? 'badge-revision' :
                            s === 'Done' ? 'badge-done' :
                            (s === 'Cancelled' || s === 'New') ? 'badge-neutral' :
                            'badge-progress'
                          }`} style={{ fontSize: '10px' }}>
                            {s.toUpperCase()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>


              {/* ── Priority ── */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#5E6C84', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Priority
                </label>
                <div className="relative">
                  <div
                    className="priority-custom-trigger"
                    style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid #DFE1E6' }}
                    onClick={() => setIsPriorityOpen(!isPriorityOpen)}
                  >
                    <div className="flex items-center gap-2">
                      {localTask.priority === 'High' ? (
                        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#DE350B' }}>keyboard_arrow_up</span>
                      ) : localTask.priority === 'Medium' ? (
                        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#FF8B00' }}>keyboard_double_arrow_up</span>
                      ) : (
                        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#4C2B74' }}>keyboard_arrow_down</span>
                      )}
                      <span style={{ fontSize: '12px', fontWeight: 500, color: '#172B4D' }}>{localTask?.priority || 'Medium'}</span>
                    </div>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#6B778C' }}>expand_more</span>
                  </div>


                  {isPriorityOpen && (
                    <div className="priority-custom-dropdown" style={{ left: 0, width: '100%' }}>
                      {[
                        { label: 'High', icon: 'keyboard_arrow_up', color: '#DE350B' },
                        { label: 'Medium', icon: 'keyboard_double_arrow_up', color: '#FF8B00' },
                        { label: 'Low', icon: 'keyboard_arrow_down', color: '#4C2B74' }
                      ].map(p => (
                        <div
                          key={p.label}
                          className="priority-dropdown-item flex items-center gap-3"
                          onClick={() => {
                            setLocalTask(prev => ({ ...prev, priority: p.label }));
                            setIsPriorityOpen(false);
                          }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '18px', color: p.color }}>{p.icon}</span>
                          <span style={{ fontSize: '12px' }}>{p.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>


              {/* Divider */}
              <div style={{ height: '1px', backgroundColor: '#EBECF0', margin: '4px 0 20px' }}></div>


              {/* ── Story Points ── */}
              <div className="flex justify-between items-center group cursor-pointer" style={{ marginBottom: '16px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#5E6C84', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Story Points</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={localTask?.pts || 0}
                    onChange={(e) => setLocalTask(prev => ({ ...prev, pts: parseInt(e.target.value) || 0 }))}
                    className="story-points-input"
                    style={{
                      width: '45px',
                      padding: '2px 4px',
                      border: '1px solid #DFE1E6',
                      borderRadius: '3px',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#172B4D',
                      textAlign: 'center',
                      outline: 'none',
                      backgroundColor: '#F4F5F7'
                    }}
                  />
                  <style>{`
                    .story-points-input::-webkit-inner-spin-button,
                    .story-points-input::-webkit-outer-spin-button {
                      opacity: 1;
                    }
                    .story-points-input:focus {
                      background-color: #fff !important;
                      border-color: #4C2B74 !important;
                      box-shadow: 0 0 0 2px rgba(76, 43, 116, 0.2);
                    }
                  `}</style>
                </div>
              </div>


              {/* ── Sprint ── */}
              <div className="flex justify-between items-center" style={{ marginBottom: '16px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#5E6C84', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Sprint</span>
                <div className="flex items-center gap-1.5" style={{ fontSize: '12px', fontWeight: 600, color: '#4C2B74' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>sprint</span>
                  {task.sprint || 'SCRUM Sprint 1'}
                </div>
              </div>


              {/* ── Due Date ── */}
              <div className="flex justify-between items-center" style={{ marginBottom: '16px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#5E6C84', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Completed</span>
                <div className="relative">
                  <div
                    className="flex items-center gap-1.5 cursor-pointer hover:bg-[#F4F5F7] rounded px-2 py-1 transition-colors"
                    style={{ fontSize: '12px', fontWeight: 600, color: '#172B4D' }}
                    onClick={() => setIsCompletedOpen(!isCompletedOpen)}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#6B778C' }}>calendar_today</span>
                    {localTask.date || 'Jun 26, 2026'}
                  </div>


                  {isCompletedOpen && (
                    <div className="calendar-dropdown-container" style={{ right: 0, left: 'auto', top: '100%', padding: '12px', width: '280px' }}>
                      <div className="calendar-header flex items-center justify-between mb-4">
                        <div className="flex gap-2">
                          <span
                            onClick={(e) => { e.stopPropagation(); setCompletedYear(y => y - 1); }}
                            className="material-symbols-outlined cursor-pointer hover:text-[#4C2B74]"
                            style={{ fontSize: '18px' }}
                          >
                            keyboard_double_arrow_left
                          </span>
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              setCompletedMonth(m => {
                                if (m === 0) {
                                  setCompletedYear(y => y - 1);
                                  return 11;
                                }
                                return m - 1;
                              });
                            }}
                            className="material-symbols-outlined cursor-pointer hover:text-[#4C2B74]"
                            style={{ fontSize: '18px' }}
                          >
                            chevron_left
                          </span>
                        </div>
                        <span className="font-bold text-[#172B4D] text-sm">{monthNames[completedMonth]} {completedYear}</span>
                        <div className="flex gap-2">
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              setCompletedMonth(m => {
                                if (m === 11) {
                                  setCompletedYear(y => y + 1);
                                  return 0;
                                }
                                return m + 1;
                              });
                            }}
                            className="material-symbols-outlined cursor-pointer hover:text-[#4C2B74]"
                            style={{ fontSize: '18px' }}
                          >
                            chevron_right
                          </span>
                          <span
                            onClick={(e) => { e.stopPropagation(); setCompletedYear(y => y + 1); }}
                            className="material-symbols-outlined cursor-pointer hover:text-[#4C2B74]"
                            style={{ fontSize: '18px' }}
                          >
                            keyboard_double_arrow_right
                          </span>
                        </div>
                      </div>
                      <div className="calendar-body">
                        <div className="grid grid-cols-7 gap-1 text-center mb-2">
                          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                            <span key={d} style={{ fontSize: '10px', fontWeight: 700, color: '#6B778C' }}>{d}</span>
                          ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                          {getDaysInMonth(completedYear, completedMonth).map((day, i) => {
                            if (day === null) return <div key={`empty-${i}`} style={{ height: '32px' }} />;
                            // Check if current day is selected
                            const isSelected = localTask.date && (() => {
                              const d = new Date(localTask.date);
                              return !isNaN(d.getTime()) &&
                                d.getDate() === day &&
                                d.getMonth() === completedMonth &&
                                d.getFullYear() === completedYear;
                            })();
                            const isToday = day === 24 && completedMonth === 5 && completedYear === 2026;
                            return (
                              <div
                                key={i}
                                className={`calendar-day ${isToday ? 'today' : ''}`}
                                style={{
                                  height: '32px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '12px',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  color: isSelected ? '#ffffff' : '#172B4D',
                                  backgroundColor: isSelected ? '#4C2B74' : 'transparent',
                                  fontWeight: isSelected ? 700 : 400
                                }}
                                onClick={() => {
                                  const formatted = `${monthAbbrs[completedMonth]} ${day}, ${completedYear}`;
                                  setLocalTask(prev => ({ ...prev, date: formatted }));
                                  setIsCompletedOpen(false);
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


              {/* Divider */}
              <div style={{ height: '1px', backgroundColor: '#EBECF0', margin: '4px 0 16px' }}></div>


              {/* ── Timeline ── */}
              <div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#5E6C84', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '12px' }}>
                  Timeline
                </span>
                <div className="flex flex-col gap-3.5">
                  <div className="flex justify-between items-center relative">
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#5E6C84', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Created</span>
                    <span
                      className="cursor-pointer hover:text-[#4C2B74] transition-colors"
                      style={{ fontSize: '12px', fontWeight: 600, color: '#172B4D' }}
                      onClick={() => setIsCreatedOpen(!isCreatedOpen)}
                    >
                      {localTask.createdAt || 'Jun 20, 2026'}
                    </span>


                    {isCreatedOpen && (
                      <div className="calendar-dropdown-container" style={{ right: 0, top: '100%', padding: '12px', width: '280px', zIndex: 100 }}>
                        <div className="calendar-header flex items-center justify-between mb-4">
                          <div className="flex gap-2">
                            <span
                              onClick={(e) => { e.stopPropagation(); setCreatedYear(y => y - 1); }}
                              className="material-symbols-outlined cursor-pointer hover:text-[#4C2B74]"
                              style={{ fontSize: '18px' }}
                            >
                              keyboard_double_arrow_left
                            </span>
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                setCreatedMonth(m => {
                                  if (m === 0) {
                                    setCreatedYear(y => y - 1);
                                    return 11;
                                  }
                                  return m - 1;
                                });
                              }}
                              className="material-symbols-outlined cursor-pointer hover:text-[#4C2B74]"
                              style={{ fontSize: '18px' }}
                            >
                              chevron_left
                            </span>
                          </div>
                          <span className="font-bold text-[#172B4D] text-sm">{monthNames[createdMonth]} {createdYear}</span>
                          <div className="flex gap-2">
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                setCreatedMonth(m => {
                                  if (m === 11) {
                                    setCreatedYear(y => y + 1);
                                    return 0;
                                  }
                                  return m + 1;
                                });
                              }}
                              className="material-symbols-outlined cursor-pointer hover:text-[#4C2B74]"
                              style={{ fontSize: '18px' }}
                            >
                              chevron_right
                            </span>
                            <span
                              onClick={(e) => { e.stopPropagation(); setCreatedYear(y => y + 1); }}
                              className="material-symbols-outlined cursor-pointer hover:text-[#4C2B74]"
                              style={{ fontSize: '18px' }}
                            >
                              keyboard_double_arrow_right
                            </span>
                          </div>
                        </div>
                        <div className="calendar-body">
                          <div className="grid grid-cols-7 gap-1 text-center mb-2">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                              <span key={d} style={{ fontSize: '10px', fontWeight: 700, color: '#6B778C' }}>{d}</span>
                            ))}
                          </div>
                          <div className="grid grid-cols-7 gap-1">
                            {getDaysInMonth(createdYear, createdMonth).map((day, i) => {
                              if (day === null) return <div key={`empty-${i}`} style={{ height: '32px' }} />;
                              const isSelected = localTask.createdAt && (() => {
                                const d = new Date(localTask.createdAt);
                                return !isNaN(d.getTime()) &&
                                  d.getDate() === day &&
                                  d.getMonth() === createdMonth &&
                                  d.getFullYear() === createdYear;
                              })();
                              const isToday = day === 24 && createdMonth === 5 && createdYear === 2026;
                              return (
                                <div
                                  key={i}
                                  className={`calendar-day ${isToday ? 'today' : ''}`}
                                  style={{
                                    height: '32px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '12px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    color: isSelected ? '#ffffff' : '#172B4D',
                                    backgroundColor: isSelected ? '#4C2B74' : 'transparent',
                                    fontWeight: isSelected ? 700 : 400
                                  }}
                                  onClick={() => {
                                    const formatted = `${monthAbbrs[createdMonth]} ${day}, ${createdYear}`;
                                    setLocalTask(prev => ({ ...prev, createdAt: formatted }));
                                    setIsCreatedOpen(false);
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
                 
                  <div className="flex justify-between items-center">
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#5E6C84', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Updated</span>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#172B4D', paddingRight: '2px' }}>{localTask?.updated_at || '2 mins ago'}</span>
                  </div>


                  <div className="flex justify-between items-center" style={{ marginTop: '2px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#5E6C84', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Reporter</span>
                    <div className="flex items-center gap-2">
                      <div
                        className="flex items-center justify-center"
                        style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#DFE1E6', fontSize: '10px', fontWeight: 700, color: '#42526E' }}
                      >
                        {getInitials(localTask?.reporter || 'Peter Tan')}
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: '#172B4D' }}>{localTask?.reporter || 'Peter Tan'}</span>
                    </div>
                  </div>
                </div>
              </div>


            </div>
          </aside>
        </div>
      </div>
      {deleteConfirmCommentId && (
        <div className="fixed inset-0 z-[11000] flex items-center justify-center" style={{ backgroundColor: 'rgba(9, 30, 66, 0.56)' }} onClick={(e) => e.stopPropagation()}>
          <div className="bg-white rounded-2xl shadow-2xl border border-[#DFE1E6]" style={{ width: '340px', padding: '20px 22px', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setDeleteConfirmCommentId(null)}
              style={{ position: 'absolute', top: '14px', right: '14px', width: '28px', height: '28px', borderRadius: '50%', border: 'none', background: '#F4F5F7', color: '#42526E', cursor: 'pointer' }}
              className="hover:bg-[#E6E9EF] transition-colors"
              aria-label="Close delete confirmation"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px', lineHeight: 1 }}>close</span>
            </button>
            <div className="flex items-start gap-3" style={{ marginBottom: '14px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#FFEBE9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ color: '#DE350B', fontSize: '18px' }}>warning</span>
              </div>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#172B4D', marginBottom: '4px' }}>Delete this comment?</h3>
                <p style={{ fontSize: '12px', color: '#5E6C84', lineHeight: '1.4' }}>Once you delete it, it&apos;s gone for good.</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setDeleteConfirmCommentId(null)}
                style={{ padding: '8px 14px', border: '1px solid #DFE1E6', borderRadius: '8px', background: 'white', color: '#42526E', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
                className="hover:bg-[#F4F5F7] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setComments(prev => {
                    const next = prev.filter(c => c.id !== deleteConfirmCommentId);
                    syncTask({ comments: next });
                    return next;
                  });
                  setDeleteConfirmCommentId(null);
                }}
                style={{ padding: '8px 14px', borderRadius: '8px', backgroundColor: '#DE350B', color: '#fff', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
                className="hover:opacity-90 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

