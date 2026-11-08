import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Eye, EyeOff, Save, Lock, User, Menu, X, LogOut, Trash2, AlertTriangle } from 'lucide-react';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar';
import { useAuth } from '../../context/AuthContext';
import { updateProfile, changePassword, deleteAccount } from '../../services/api';

type Tab = 'personal' | 'security';

// ── Field ─────────────────────────────────────────────────────────────────────
function Field({
  label, value, onChange, type = 'text', placeholder = '', full = false,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string; full?: boolean;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  return (
    <div className={full ? 'col-span-2' : ''}>
      <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
        {label}
      </label>
      <div className="relative">
        <input
          type={isPassword && !show ? 'password' : 'text'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-lg text-sm text-gray-900 focus:outline-none transition-colors focus:ring-2"
          style={{
            background: '#F7F8F6',
            border: '1.5px solid #E5E7EB',
            fontSize: 'max(16px, 0.875em)',
          }}
          onFocus={e => (e.currentTarget.style.borderColor = '#68AE24')}
          onBlur={e => (e.currentTarget.style.borderColor = '#E5E7EB')}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Delete Account Confirmation Modal ─────────────────────────────────────────
function DeleteAccountModal({
  isOpen,
  onClose,
  onConfirm,
  deleting,
  userEmail,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  deleting: boolean;
  userEmail: string;
}) {
  const [confirmText, setConfirmText] = useState('');
  const isConfirmed = confirmText === 'DELETE';

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 pt-6 pb-4 flex items-start gap-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(239,68,68,0.1)' }}
            >
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-900">Delete Account</h3>
              <p className="text-sm text-gray-500 mt-1">
                This action is permanent and cannot be undone.
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={deleting}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 pb-4 space-y-4">
            <div className="p-3 rounded-lg bg-red-50 border border-red-100">
              <p className="text-sm text-red-700 leading-relaxed">
                Deleting your account will permanently remove:
              </p>
              <ul className="mt-2 space-y-1 text-sm text-red-600">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span>Your profile and personal information</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span>All saved CVs and resumes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span>Any remaining AI credits</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span>Payment and transaction history</span>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">
                Account: <strong className="text-gray-900">{userEmail}</strong>
              </p>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                Type DELETE to confirm
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="DELETE"
                disabled={deleting}
                className="w-full px-4 py-3 rounded-lg text-sm text-gray-900 focus:outline-none transition-colors"
                style={{
                  background: '#F7F8F6',
                  border: `1.5px solid ${isConfirmed ? '#EF4444' : '#E5E7EB'}`,
                  fontSize: 'max(16px, 0.875em)',
                }}
                autoComplete="off"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 px-6 py-4 border-t" style={{ borderColor: '#E5E7EB' }}>
            <button
              onClick={onClose}
              disabled={deleting}
              className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-50"
              style={{ background: '#F7F8F6', border: '1.5px solid #E5E7EB' }}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={!isConfirmed || deleting}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: '#EF4444' }}
            >
              {deleting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-25" />
                    <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Deleting…
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Delete My Account
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Account Page ──────────────────────────────────────────────────────────────
export default function AccountPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [tab, setTab] = useState<Tab>('personal');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Build fullName from firstName + lastName, or fallback to fullName if available
  const userFullName: string = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.fullName || '' : '';
  const userPhone: string = user?.phoneNumber ?? '';
  const userLocation: string = user?.address ? `${user.address.city || ''}${user.address.county ? ', ' + user.address.county : ''}${user.address.country ? ', ' + user.address.country : ''}`.trim() : '';

  // Personal form
  const [fullName, setFullName] = useState<string>(userFullName);
  const [email,    setEmail]    = useState<string>(user?.email ?? '');
  const [phone,    setPhone]    = useState<string>(userPhone);
  const [location, setLocation] = useState<string>(userLocation);
  const [bio,      setBio]      = useState<string>('');

  // Security form
  const [currentPw,  setCurrentPw]  = useState('');
  const [newPw,      setNewPw]      = useState('');
  const [confirmPw,  setConfirmPw]  = useState('');

  const [saving,     setSaving]     = useState(false);
  const [toast,      setToast]      = useState('');

  // Delete account state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (tab === 'personal') {
        await updateProfile({ fullName, email });
        showToast('Profile updated successfully');
      } else {
        if (!currentPw || !newPw || !confirmPw) { showToast('Please fill in all password fields'); return; }
        if (newPw.length < 8) { showToast('New password must be at least 8 characters'); return; }
        if (newPw !== confirmPw) { showToast('New passwords do not match'); return; }
        if (currentPw === newPw) { showToast('New password must be different from your current password'); return; }
        await changePassword(currentPw, newPw);
        setCurrentPw(''); setNewPw(''); setConfirmPw('');
        showToast('Password changed successfully');
      }
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Logged out successfully');
      navigate('/');
    } catch {
      showToast('Error logging out. Please try again.');
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await deleteAccount();
      await logout();
      navigate('/');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to delete account. Please try again.');
      setDeleting(false);
    }
  };

  const initials = (userFullName || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#F3F4F6' }}>
      <DashboardSidebar />

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 sm:hidden"
        />
      )}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: mobileMenuOpen ? 0 : '-100%' }}
        transition={{ duration: 0.3 }}
        className="fixed left-0 top-0 h-full z-50 sm:hidden"
      >
        <DashboardSidebar isMobile={true} onItemClick={() => setMobileMenuOpen(false)} />
      </motion.div>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 w-full">
          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Account Settings</h2>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-900" />
              ) : (
                <Menu className="w-6 h-6 text-gray-900" />
              )}
            </button>
          </div>

          {/* ── Profile header card ────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center sm:items-center gap-3 sm:gap-5 mb-4 sm:mb-5"
            style={{ border: '1.5px solid #E5E7EB' }}
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              <div
                className="w-20 sm:w-24 h-20 sm:h-24 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold flex-shrink-0"
                style={{ background: '#68AE24' }}
              >
                {initials}
              </div>
              <button
                type="button"
                disabled
                aria-label="Change photo (coming soon)"
                className="absolute bottom-0 right-0 w-6 sm:w-7 h-6 sm:h-7 rounded-full flex items-center justify-center shadow opacity-60 cursor-not-allowed"
                style={{ background: '#68AE24' }}
                title="Change photo is coming soon"
              >
                <Camera className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-white" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{userFullName || 'Job Seeker'}</h1>
              <p className="text-xs sm:text-sm text-gray-400 mt-1 truncate">{user?.email ?? ''}</p>
            </div>

            {/* Edit badge */}
            <span
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap"
              style={{ background: 'rgba(104,174,36,0.1)', color: '#58AF24' }}
            >
              Edit Profile
            </span>
          </motion.div>

          {/* ── Form card ─────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl overflow-hidden"
            style={{ border: '1.5px solid #E5E7EB' }}
          >
            {/* Tabs */}
            <div className="flex border-b overflow-x-auto" style={{ borderColor: '#E5E7EB' }}>
              {([
                { id: 'personal' as Tab, label: 'Personal Info', icon: User },
                { id: 'security' as Tab, label: 'Security',      icon: Lock },
              ] as { id: Tab; label: string; icon: typeof User }[]).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold transition-colors relative whitespace-nowrap"
                  style={{
                    color: tab === id ? '#68AE24' : '#6B7280',
                    borderBottom: tab === id ? '2px solid #68AE24' : '2px solid transparent',
                    marginBottom: -1,
                  }}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sm:hidden">{label.split(' ')[0]}</span>
                </button>
              ))}
            </div>

            {/* Form body */}
            <div className="p-4 sm:p-6">
              {tab === 'personal' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <Field label="Full Name"    value={fullName}  onChange={setFullName}  placeholder="Jane Doe" />
                  <Field label="Email"        value={email}     onChange={setEmail}     placeholder="jane@example.com" />
                  <Field label="Phone Number" value={phone}     onChange={setPhone}     placeholder="+44 7700 900123" />
                  <Field label="Location"     value={location}  onChange={setLocation}  placeholder="London, UK" />
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Bio</label>
                    <textarea
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      rows={3}
                      placeholder="A short professional bio..."
                      className="w-full px-4 py-3 rounded-lg text-sm text-gray-900 focus:outline-none resize-none transition-colors"
                      style={{ background: '#F7F8F6', border: '1.5px solid #E5E7EB' }}
                      onFocus={e => (e.currentTarget.style.borderColor = '#68AE24')}
                      onBlur={e => (e.currentTarget.style.borderColor = '#E5E7EB')}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3 w-full">
                  <Field label="Current Password"  value={currentPw} onChange={setCurrentPw} type="password" full placeholder="••••••••" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="New Password"       value={newPw}     onChange={setNewPw}     type="password" placeholder="Min 8 characters" />
                    <Field label="Confirm Password"   value={confirmPw} onChange={setConfirmPw} type="password" placeholder="Repeat new password" />
                  </div>
                </div>
              )}
            </div>

            {/* Divider + action bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-4 border-t" style={{ borderColor: '#DFE1E6' }}>
              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                style={{ background: 'rgba(243,0,0,0.08)', color: '#F30000' }}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>

              {/* Cancel / Save */}
              <div className="flex gap-3 sm:ml-auto">
                <button
                  onClick={() => navigate(-1)}
                  className="px-5 py-2.5 rounded-lg text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100"
                  style={{ background: '#F7F8F6', border: '1.5px solid #E5E7EB' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                  style={{ background: '#68AE24' }}
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </div>
          </motion.div>

          {/* ── Danger Zone ─────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl overflow-hidden mt-4 sm:mt-5"
            style={{ border: '1.5px solid #FECACA' }}
          >
            <div className="px-6 py-4 border-b" style={{ borderColor: '#FECACA', background: 'rgba(239,68,68,0.03)' }}>
              <h3 className="text-sm font-bold text-red-600 uppercase tracking-wide">Danger Zone</h3>
            </div>
            <div className="px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">Delete your account</p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Permanently delete your account and all associated data including CVs, credits, and payment history. This action cannot be undone.
                </p>
              </div>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 whitespace-nowrap flex-shrink-0"
                style={{ border: '1.5px solid #FECACA' }}
              >
                <Trash2 className="w-4 h-4" />
                Delete Account
              </button>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Delete Account Confirmation Modal */}
      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => !deleting && setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        deleting={deleting}
        userEmail={user?.email ?? ''}
      />

      {/* Toast */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm font-medium px-5 py-3 rounded-xl shadow-lg z-50"
        >
          {toast}
        </motion.div>
      )}

    </div>
  );
}
