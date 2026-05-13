import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FilePlus, Edit3, Trash2, FileText, Eye, Copy,
  MoreVertical, Check, X, Search, Calendar, Layers,
} from 'lucide-react';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar';
import CVPreview from '../../components/builder/CVPreview';
import PreviewModal from '../../components/builder/PreviewModal';
import DownloadMenu from '../../components/ui/DownloadMenu';
import { useAuth } from '../../context/AuthContext';
import { useBuilder } from '../../context/BuilderContext';
import {
  loadLibrary, deleteCV, duplicateCV, renameCV, setActiveCV,
} from '../../services/cvLibrary';
import type { SavedCV } from '../../types/resume';
import { TEMPLATES } from '../../components/templates';

// ── Helpers ────────────────────────────────────────────────────────────────────
function relativeDate(iso: string) {
  const d    = new Date(iso);
  const days = Math.floor((Date.now() - d.getTime()) / 86_400_000);
  if (days === 0) return 'Updated today';
  if (days === 1) return 'Updated yesterday';
  if (days < 7)  return `Updated ${days}d ago`;
  return `Updated ${d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`;
}

// ── Toggle ─────────────────────────────────────────────────────────────────────
function Toggle({ active, onToggle }: { active: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      role="switch"
      aria-checked={active}
      className="relative shrink-0 transition-colors"
      style={{ width: 44, height: 24, borderRadius: 12, background: active ? '#58AF24' : '#D1D5DB' }}
    >
      <span
        className="absolute top-[3px] w-[18px] h-[18px] bg-white rounded-full shadow-sm transition-all"
        style={{ left: active ? 23 : 3 }}
      />
    </button>
  );
}

// ── CV Row ─────────────────────────────────────────────────────────────────────
function CVRow({
  cv, isSelected, onSelect, onEdit, onDelete, onDuplicate, onRename,
}: {
  cv: SavedCV; isSelected: boolean;
  onSelect: () => void; onEdit: () => void; onDelete: () => void;
  onDuplicate: () => void; onRename: (name: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing,  setEditing]  = useState(false);
  const [draft,    setDraft]    = useState(cv.name);
  const inputRef = useRef<HTMLInputElement>(null);
  const menuRef  = useRef<HTMLDivElement>(null);

  const templateInfo = TEMPLATES.find(t => t.id === cv.templateId) ?? TEMPLATES[0];

  useEffect(() => {
    if (!menuOpen) return;
    const h = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [menuOpen]);

  useEffect(() => { if (editing) inputRef.current?.focus(); }, [editing]);

  const commit = () => {
    const t = draft.trim();
    if (t && t !== cv.name) onRename(t); else setDraft(cv.name);
    setEditing(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      onClick={onSelect}
      className="flex items-center gap-3 px-4 cursor-pointer transition-all"
      style={{
        height: 76, borderRadius: 8,
        background: isSelected ? 'rgba(104,174,36,0.06)' : '#ffffff',
        border: `1.5px solid ${isSelected ? 'rgba(104,174,36,0.3)' : '#E5E7EB'}`,
      }}
    >
      <div
        className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
        style={{ background: isSelected ? 'rgba(104,174,36,0.12)' : '#F3F4F6' }}
      >
        <FileText className="w-4 h-4" style={{ color: isSelected ? '#68AE24' : '#9CA3AF' }} />
      </div>

      <div className="flex-1 min-w-0">
        {editing ? (
          <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
            <input
              ref={inputRef}
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onBlur={commit}
              onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setDraft(cv.name); setEditing(false); } }}
              className="flex-1 text-sm font-semibold border-b border-[#68AE24] focus:outline-none bg-transparent pb-0.5"
              style={{ fontSize: 'max(16px, 0.875em)' }}
            />
            <button onClick={commit} className="text-[#68AE24] shrink-0"><Check className="w-3.5 h-3.5" /></button>
          </div>
        ) : (
          <p
            className="text-sm font-semibold text-gray-900 truncate"
            onDoubleClick={e => { e.stopPropagation(); setEditing(true); }}
          >
            {cv.name}
          </p>
        )}
        <p className="text-[11px] text-gray-400 truncate mt-0.5">
          {templateInfo.name} · {relativeDate(cv.updatedAt)}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 px-2 sm:px-3 text-white text-xs font-semibold hover:opacity-90 transition-opacity"
          style={{ background: '#68AE24', borderRadius: 6, height: 34, minWidth: 32 }}
        >
          <Edit3 className="w-3 h-3 shrink-0" />
          <span className="hidden sm:inline">Edit</span>
        </button>
        <button
          onClick={onDelete}
          className="flex items-center gap-1.5 px-2 sm:px-3 text-white text-xs font-semibold hover:opacity-90 transition-opacity"
          style={{ background: '#F30000', borderRadius: 6, height: 34, minWidth: 32 }}
        >
          <Trash2 className="w-3 h-3 shrink-0" />
          <span className="hidden sm:inline">Delete</span>
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                className="absolute right-0 top-8 z-30 bg-white rounded-xl shadow-lg border border-gray-100 py-1 w-36"
              >
                <button onClick={() => { setMenuOpen(false); setEditing(true); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50">
                  <Edit3 className="w-3 h-3 text-gray-400" /> Rename
                </button>
                <button onClick={() => { setMenuOpen(false); onDuplicate(); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50">
                  <Copy className="w-3 h-3 text-gray-400" /> Duplicate
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// ── Dashed Create Box ──────────────────────────────────────────────────────────
function CreateNewBox({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-full flex items-center justify-center gap-2 transition-colors"
      style={{
        height: 76, borderRadius: 7,
        border: `2px dashed ${hovered ? '#68AE24' : '#D1D5DB'}`,
        background: hovered ? 'rgba(104,174,36,0.04)' : 'transparent',
      }}
    >
      <FilePlus className="w-4 h-4" style={{ color: hovered ? '#68AE24' : '#9CA3AF' }} />
      <span className="text-sm font-medium" style={{ color: hovered ? '#68AE24' : '#9CA3AF' }}>
        Create New CV
      </span>
    </button>
  );
}

// ── CV Detail Panel ────────────────────────────────────────────────────────────
function CVDetailPanel({
  cv, onEdit, onPreview, onChangeTemplate, printRef,
}: {
  cv: SavedCV;
  onEdit: () => void;
  onPreview: () => void;
  onChangeTemplate: () => void;
  printRef: React.RefObject<HTMLElement | null>;
}) {
  const templateInfo = TEMPLATES.find(t => t.id === cv.templateId) ?? TEMPLATES[0];

  const attrs: { label: string; green: boolean }[] = [
    { label: templateInfo.name, green: true },
    { label: templateInfo.tag,  green: true },
    ...(cv.skills?.length          ? [{ label: `${cv.skills.length} skills`,  green: false }] : []),
    ...(cv.workExperience?.length  ? [{ label: `${cv.workExperience.length} jobs`, green: false }] : []),
    ...(cv.education?.length       ? [{ label: `${cv.education.length} edu`,  green: false }] : []),
  ];

  return (
    <motion.div
      key={cv.id}
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-2xl flex flex-col"
      style={{ border: '1.5px solid #E5E7EB', minHeight: 440 }}
    >
      {/* Thumbnail — overflow-hidden here only, not on the outer card */}
      <div
        className="relative overflow-hidden bg-gray-50 cursor-pointer group flex-shrink-0 rounded-t-2xl"
        style={{ height: 280 }}
        onClick={onPreview}
      >
        <div
          className="pointer-events-none select-none absolute"
          style={{
            transform: 'scale(0.32)',
            transformOrigin: 'top center',
            width: 794,
            top: 0,
            left: '50%',
            marginLeft: -397,
          }}
        >
          <CVPreview
            data={cv}
            scale={1}
            templateId={cv.templateId}
            customizations={cv.templateCustomizations as Record<string, any>}
          />
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 text-sm font-medium text-gray-700 shadow">
            <Eye className="w-4 h-4" /> Full Preview
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="px-5 pt-4 pb-5 flex flex-col gap-3">
        {/* Name + dates */}
        <div>
          <h3 className="text-base font-bold text-gray-900 truncate">{cv.name}</h3>
          <p className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {relativeDate(cv.updatedAt)}
          </p>
        </div>

        {/* Attribute badges */}
        <div className="flex flex-wrap gap-1.5">
          {attrs.map(({ label, green }) => (
            <span
              key={label}
              className="text-[11px] font-medium px-3 py-1"
              style={{ borderRadius: 12.5, background: green ? '#EDF2E9' : '#E5E7EB', color: green ? '#3a7c10' : '#6B7280' }}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Actions row */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 px-4 py-2 text-white text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity"
            style={{ background: '#68AE24' }}
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit CV
          </button>

          <button
            onClick={onChangeTemplate}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors hover:bg-gray-50"
            style={{ borderColor: '#E5E7EB', color: '#374151' }}
          >
            <Layers className="w-3.5 h-3.5" /> Change Template
          </button>

          {/* Download with format picker */}
          <DownloadMenu
            printRef={printRef}
            filename={cv.name}
            label="Download"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors hover:bg-gray-50"
            triggerStyle={{ borderColor: '#E5E7EB', color: '#374151', border: '1.5px solid #E5E7EB' }}
          />
        </div>
      </div>
    </motion.div>
  );
}

// ── Toggle Row ─────────────────────────────────────────────────────────────────
function ToggleRow({ label, description, active, onToggle }: { label: string; description: string; active: boolean; onToggle: () => void }) {
  return (
    <div
      className="flex items-center justify-between px-5"
      style={{ height: 76, background: '#ffffff', borderRadius: 8, border: '1.5px solid #E5E7EB' }}
    >
      <div>
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        <p className="text-[11px] text-gray-400 mt-0.5">{description}</p>
      </div>
      <Toggle active={active} onToggle={onToggle} />
    </div>
  );
}

// ── Delete Modal ───────────────────────────────────────────────────────────────
function DeleteModal({ name, onConfirm, onCancel }: { name: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full"
      >
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-6 h-6 text-red-500" />
        </div>
        <h3 className="text-base font-bold text-gray-900 text-center mb-1">Delete CV?</h3>
        <p className="text-sm text-gray-500 text-center mb-6">
          "<span className="font-medium text-gray-700">{name}</span>" will be permanently removed.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity" style={{ background: '#F30000' }}>Delete</button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Empty State ────────────────────────────────────────────────────────────────
function EmptyState({ onCreateNew }: { onCreateNew: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5" style={{ background: '#F3F4F6' }}>
        <FileText className="w-10 h-10 text-gray-300" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">No CVs yet</h2>
      <p className="text-gray-500 text-sm mb-8 max-w-xs">
        Create your first CV and we'll save it here so you can manage, edit, and download it any time.
      </p>
      <button
        onClick={onCreateNew}
        className="flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity shadow-lg"
        style={{ background: '#68AE24', boxShadow: '0 8px 20px rgba(104,174,36,0.25)' }}
      >
        <FilePlus className="w-4 h-4" /> Create Your First CV
      </button>
    </div>
  );
}

// ── Dashboard Page ─────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const navigate     = useNavigate();
  const { user }     = useAuth();
  const { dispatch } = useBuilder();

  const [cvs,          setCVs]          = useState<SavedCV[]>([]);
  const [selectedId,   setSelectedId]   = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SavedCV | null>(null);
  const [previewCV,    setPreviewCV]    = useState<SavedCV | null>(null);
  const [search,       setSearch]       = useState('');

  // Hidden print/download ref (full-scale CV for the selected CV)
  const printRef = useRef<HTMLDivElement>(null);

  // Preferences
  const [autoSave,  setAutoSave]  = useState(() => localStorage.getItem('rym_pref_autosave') !== 'false');
  const [showHints, setShowHints] = useState(() => localStorage.getItem('rym_pref_hints')    !== 'false');

  useEffect(() => { localStorage.setItem('rym_pref_autosave', String(autoSave)); }, [autoSave]);
  useEffect(() => { localStorage.setItem('rym_pref_hints',    String(showHints)); }, [showHints]);

  useEffect(() => {
    const lib = loadLibrary();
    setCVs(lib);
    if (lib.length > 0) setSelectedId(lib[0].id);
  }, []);

  const firstName  = user?.fullName?.split(' ')[0] ?? 'there';
  const selectedCV = cvs.find(c => c.id === selectedId) ?? null;

  const filtered = search
    ? cvs.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.templateId.toLowerCase().includes(search.toLowerCase()))
    : cvs;

  // ── Handlers ──────────────────────────────────────────────────────────────────
  const handleCreateNew = () => { dispatch({ type: 'NEW_CV' }); navigate('/builder'); };

  const handleEdit = (cv: SavedCV) => {
    dispatch({ type: 'LOAD_CV', payload: cv });
    setActiveCV(cv.id);
    navigate('/builder');
  };

  const handleChangeTemplate = (cv: SavedCV) => {
    dispatch({ type: 'LOAD_CV', payload: cv });
    setActiveCV(cv.id);
    navigate('/dashboard/templates');
  };

  const handleDuplicate = (id: string) => {
    const copy = duplicateCV(id);
    if (copy) { setCVs(loadLibrary()); setSelectedId(copy.id); }
  };

  const handleRename = (id: string, name: string) => {
    renameCV(id, name);
    setCVs(prev => prev.map(c => c.id === id ? { ...c, name } : c));
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteCV(deleteTarget.id);
    const updated = loadLibrary();
    setCVs(updated);
    if (selectedId === deleteTarget.id) setSelectedId(updated[0]?.id ?? null);
    setDeleteTarget(null);
  };

  // ── Stats ──────────────────────────────────────────────────────────────────────
  const statsItems = cvs.length > 0 ? [
    { icon: <FileText className="w-4 h-4" />, label: 'Total CVs',       value: cvs.length,                                         text: false },
    { icon: <Layers   className="w-4 h-4" />, label: 'Templates Used',  value: new Set(cvs.map(c => c.templateId)).size,            text: false },
    { icon: <Calendar className="w-4 h-4" />, label: 'Last Updated',
      value: new Date(Math.max(...cvs.map(c => new Date(c.updatedAt).getTime())))
               .toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),                                                    text: true  },
  ] : [];

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#F3F4F6' }}>
      <DashboardSidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="px-6 py-7 space-y-6 max-w-[1280px]">

          {/* ── Header ───────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {firstName} 👋</h1>
              <p className="text-gray-500 text-sm mt-0.5">
                {cvs.length === 0
                  ? 'Create your first CV to get started'
                  : `You have ${cvs.length} CV${cvs.length !== 1 ? 's' : ''} in your library`}
              </p>
            </div>
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 text-white font-semibold px-5 py-2.5 rounded-xl text-sm shrink-0 hover:opacity-90 transition-opacity"
              style={{ background: '#68AE24', boxShadow: '0 4px 14px rgba(104,174,36,0.3)' }}
            >
              <FilePlus className="w-4 h-4" /> New CV
            </button>
          </div>

          {/* ── Stats strip — TOP of content ─────────────────────── */}
          {statsItems.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {statsItems.map(({ icon, label, value, text }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 px-4 py-4"
                  style={{ background: '#ffffff', borderRadius: 10, border: '1.5px solid #E5E7EB' }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: '#EDF2E9', color: '#58AF24' }}
                  >
                    {icon}
                  </div>
                  <div>
                    <p className={`font-bold text-gray-900 leading-tight ${text ? 'text-sm' : 'text-xl'}`}>{value}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Empty State ───────────────────────────────────────── */}
          {cvs.length === 0 ? (
            <EmptyState onCreateNew={handleCreateNew} />
          ) : (
            <>
              {/* ── Search ──────────────────────────────────────── */}
              {cvs.length > 2 && (
                <div className="relative max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search CVs…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-white border border-gray-200 focus:border-[#68AE24] focus:outline-none text-sm text-gray-800"
                  />
                  {search && (
                    <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}

              {/* ── Two-column: CV list + detail ────────────────── */}
              <div className="flex flex-col lg:flex-row gap-5">

                {/* Left: list */}
                <div className="lg:w-[45%] xl:w-[42%] shrink-0 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Your CVs</p>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: '#EDF2E9', color: '#3a7c10' }}
                    >
                      {filtered.length}
                    </span>
                  </div>

                  <AnimatePresence>
                    {filtered.map(cv => (
                      <CVRow
                        key={cv.id}
                        cv={cv}
                        isSelected={selectedId === cv.id}
                        onSelect={() => setSelectedId(cv.id)}
                        onEdit={() => handleEdit(cv)}
                        onDelete={() => setDeleteTarget(cv)}
                        onDuplicate={() => handleDuplicate(cv.id)}
                        onRename={name => handleRename(cv.id, name)}
                      />
                    ))}
                  </AnimatePresence>

                  {filtered.length === 0 && search && (
                    <p className="text-sm text-gray-400 text-center py-4">No CVs matching "<strong className="text-gray-600">{search}</strong>"</p>
                  )}

                  {!search && <CreateNewBox onClick={handleCreateNew} />}
                </div>

                {/* Right: detail */}
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
                    {selectedCV ? 'CV Preview' : 'Select a CV'}
                  </p>
                  <AnimatePresence mode="wait">
                    {selectedCV ? (
                      <CVDetailPanel
                        key={selectedCV.id}
                        cv={selectedCV}
                        printRef={printRef as React.RefObject<HTMLElement | null>}
                        onEdit={() => handleEdit(selectedCV)}
                        onPreview={() => setPreviewCV(selectedCV)}
                        onChangeTemplate={() => handleChangeTemplate(selectedCV)}
                      />
                    ) : (
                      <div
                        className="flex items-center justify-center rounded-2xl"
                        style={{ height: 260, background: '#ffffff', border: '1.5px solid #E5E7EB' }}
                      >
                        <p className="text-sm text-gray-400">Select a CV to preview</p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* ── Preferences / Toggle rows ────────────────────── */}
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Preferences</p>
                <div className="space-y-3">
                  <ToggleRow
                    label="Auto-save drafts"
                    description="Automatically save your progress while building a CV"
                    active={autoSave}
                    onToggle={() => setAutoSave(v => !v)}
                  />
                  <ToggleRow
                    label="Show builder hints"
                    description="Display helpful tips and suggestions in the CV builder"
                    active={showHints}
                    onToggle={() => setShowHints(v => !v)}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* ── Hidden full-scale element for downloads ──────────────── */}
      {selectedCV && (
        <div
          ref={printRef}
          aria-hidden="true"
          style={{ position: 'fixed', top: -9999, left: 0, width: 794, pointerEvents: 'none' }}
        >
          <CVPreview
            data={selectedCV}
            scale={1}
            templateId={selectedCV.templateId}
            customizations={selectedCV.templateCustomizations as Record<string, any>}
          />
        </div>
      )}

      {deleteTarget && (
        <DeleteModal name={deleteTarget.name} onConfirm={handleDeleteConfirm} onCancel={() => setDeleteTarget(null)} />
      )}

      {previewCV && (
        <PreviewModal
          data={previewCV}
          templateId={previewCV.templateId}
          customizations={previewCV.templateCustomizations as Record<string, any>}
          onClose={() => setPreviewCV(null)}
        />
      )}
    </div>
  );
}
