import { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Eye, EyeOff, Save, Trash2, Lock, User } from 'lucide-react';
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

// ── Delete Confirm ────────────────────────────────────────────────────────────
function DeleteModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
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
        <h3 className="text-base font-bold text-gray-900 text-center mb-1">Delete Account?</h3>
        <p className="text-sm text-gray-500 text-center mb-6">
          All your CVs and data will be permanently removed. This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity" style={{ background: '#DE350B' }}>
            Delete Account
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Account Page ──────────────────────────────────────────────────────────────
export default function AccountPage() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState<Tab>('personal');

  // Personal form
  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [email,    setEmail]    = useState(user?.email ?? '');
  const [phone,    setPhone]    = useState('');
  const [location, setLocation] = useState('');
  const [bio,      setBio]      = useState('');

  // Security form
  const [currentPw,  setCurrentPw]  = useState('');
  const [newPw,      setNewPw]      = useState('');
  const [confirmPw,  setConfirmPw]  = useState('');

  const [saving,     setSaving]     = useState(false);
  const [toast,      setToast]      = useState('');
  const [showDelete, setShowDelete] = useState(false);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (tab === 'personal') {
        await updateProfile({ fullName, email });
        showToast('Profile updated successfully');
      } else {
        if (!currentPw || !newPw) { showToast('Please fill in all password fields'); setSaving(false); return; }
        if (newPw !== confirmPw)  { showToast('New passwords do not match'); setSaving(false); return; }
        await changePassword(currentPw, newPw);
        setCurrentPw(''); setNewPw(''); setConfirmPw('');
        showToast('Password changed successfully');
      }
    } catch {
      showToast('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    await deleteAccount();
    logout();
  };

  const initials = (user?.fullName ?? 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#F3F4F6' }}>
      <DashboardSidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">

          {/* ── Profile header card ────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-5"
            style={{ border: '1.5px solid #E5E7EB' }}
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                style={{ background: '#68AE24' }}
              >
                {initials}
              </div>
              <button
                className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center shadow"
                style={{ background: '#68AE24' }}
                title="Change photo"
              >
                <Camera className="w-3.5 h-3.5 text-white" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-gray-900">{user?.fullName ?? 'Job Seeker'}</h1>
              <p className="text-sm text-gray-400 mt-0.5">{user?.email ?? ''}</p>
            </div>

            {/* Edit badge */}
            <span
              className="px-4 py-2 rounded-lg text-sm font-semibold"
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
            <div className="flex border-b" style={{ borderColor: '#E5E7EB' }}>
              {([
                { id: 'personal' as Tab, label: 'Personal Info', icon: User },
                { id: 'security' as Tab, label: 'Security',      icon: Lock },
              ] as { id: Tab; label: string; icon: typeof User }[]).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className="flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-colors relative"
                  style={{
                    color: tab === id ? '#68AE24' : '#6B7280',
                    borderBottom: tab === id ? '2px solid #68AE24' : '2px solid transparent',
                    marginBottom: -1,
                  }}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>

            {/* Form body */}
            <div className="p-6">
              {tab === 'personal' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
                  <Field label="Current Password"  value={currentPw} onChange={setCurrentPw} type="password" full placeholder="••••••••" />
                  <Field label="New Password"       value={newPw}     onChange={setNewPw}     type="password" placeholder="Min 8 characters" />
                  <Field label="Confirm Password"   value={confirmPw} onChange={setConfirmPw} type="password" placeholder="Repeat new password" />
                </div>
              )}
            </div>

            {/* Divider + action bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-4 border-t" style={{ borderColor: '#DFE1E6' }}>
              {/* Delete account */}
              <button
                onClick={() => setShowDelete(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                style={{ background: 'rgba(222,53,11,0.08)', color: '#DE350B' }}
              >
                <Trash2 className="w-4 h-4" />
                Delete Account
              </button>

              {/* Cancel / Save */}
              <div className="flex gap-3 sm:ml-auto">
                <button
                  onClick={() => {
                    setFullName(user?.fullName ?? '');
                    setEmail(user?.email ?? '');
                    setPhone(''); setLocation(''); setBio('');
                    setCurrentPw(''); setNewPw(''); setConfirmPw('');
                  }}
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
        </div>
      </main>

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

      {showDelete && (
        <DeleteModal
          onConfirm={handleDeleteAccount}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </div>
  );
}
