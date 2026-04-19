import React, { useState } from 'react';
import { Leaf, ShieldCheck, Zap, Droplets, Trash2, Eye, EyeOff, AlertCircle, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const QUICK = [
  { group: 'Admin',  email: 'john@campus.edu',      pw: 'admin123', label: 'Sustainability Officer', icon: <ShieldCheck size={16} /> },

  { group: 'Energy', email: 'mike@energy.edu',      pw: 'pass123', label: 'Energy Technician', icon: <Zap size={16} /> },
  { group: 'Energy', email: 'alex@energy.edu',      pw: 'pass123', label: 'NMC Member', icon: <Zap size={16} /> },

  { group: 'Water',  email: 'tom@water.edu',        pw: 'pass123', label: 'Plumbing Specialist', icon: <Droplets size={16} /> },
  { group: 'Water',  email: 'irr@water.edu',        pw: 'pass123', label: 'Irrigation Manager', icon: <Droplets size={16} /> },

  { group: 'Waste',  email: 'manager@waste.edu',    pw: 'pass123', label: 'Waste Manager', icon: <Trash2 size={16} /> },
  { group: 'Waste',  email: 'sanitation@waste.edu', pw: 'pass123', label: 'Sanitation Officer', icon: <Trash2 size={16} /> },
];

const GROUPS = [...new Set(QUICK.map(q => q.group))];

const ADMIN_PORTAL_PASSWORD = '1234';

const Login = () => {
  const { login } = useAuth();

const [loadingUser, setLoadingUser] = useState(null);
  // Admin states
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [adminPw, setAdminPw] = useState('');
  const [showAdminPw, setShowAdminPw] = useState(false);
  const [adminPwError, setAdminPwError] = useState('');
  
  // Per-user password states: { [email]: { value, show, error } }
  const [userPws, setUserPws] = useState(() =>
    Object.fromEntries(QUICK.filter(q => q.group !== 'Admin').map(q => [q.email, { value: '', show: false, error: '' }]))
  );

  const setUserPwField = (email, field, val) =>
    setUserPws(prev => ({ ...prev, [email]: { ...prev[email], [field]: val } }));

  const doLogin = async (em, pw) => {
  setLoadingUser(em);
  try {
    await login(em, pw);
  } finally {
    setLoadingUser(null);
  }
};

  const handleRoleLogin = async (q) => {
    const entered = userPws[q.email]?.value || '';
    if (entered !== q.pw) {
      setUserPwField(q.email, 'error', 'Incorrect password');
      return;
    }
    setUserPwField(q.email, 'error', '');
    await doLogin(q.email, q.pw);
  };

  const unlockAdmin = () => {
    if (adminPw === ADMIN_PORTAL_PASSWORD) {
      setAdminUnlocked(true);
      setAdminPwError('');
    } else {
      setAdminPwError('Incorrect admin portal password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-emerald-950 flex items-center justify-center p-4">

      {/* Centered panel */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-6 space-y-5">

        {/* Header */}
        <div className="text-center text-white mb-2">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Leaf size={28} />
          </div>
          <h1 className="text-xl font-bold">Eco-Efficiency Tracker</h1>
          <p className="text-white/50 text-xs">Smart Campus Resource Management</p>
        </div>

        {/* Admin */}
        <div>
          <p className="text-white/50 text-xs font-bold uppercase mb-2">Admin</p>

          {!adminUnlocked ? (
            <div className="bg-white/10 border border-white/20 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-white/70 text-sm font-semibold">
                <Lock size={14} className="text-amber-400" />
                Admin Portal — Enter Access Password
              </div>

              {adminPwError && (
                <p className="text-red-400 text-xs">{adminPwError}</p>
              )}

              <div className="relative">
                <input
                  type={showAdminPw ? 'text' : 'password'}
                  value={adminPw}
                  onChange={e => setAdminPw(e.target.value)}
                  placeholder="Admin password"
                  className="w-full px-4 py-2.5 pr-9 bg-white/10 border border-white/20 rounded-xl text-white text-sm outline-none"
                />
                <button
                  onClick={() => setShowAdminPw(!showAdminPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40"
                >
                  {showAdminPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              <button
                onClick={unlockAdmin}
                className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-sm rounded-xl"
              >
                Unlock Admin Access
              </button>
            </div>
          ) : (
            <button
onClick={() => doLogin('john@campus.edu', 'admin123')}              className="w-full flex items-center gap-3 px-4 py-3 bg-amber-500/20 border border-amber-400/40 rounded-2xl"
            >
              <ShieldCheck size={16} className="text-amber-400" />
              <div>
                <p className="text-white text-sm font-semibold">Sustainability Officer</p>
                <p className="text-white/40 text-xs">john@campus.edu</p>
              </div>
            </button>
          )}
        </div>

        {/* Roles */}
        {GROUPS.filter(g => g !== 'Admin').map(g => (
          <div key={g}>
            <p className="text-white/50 text-xs font-bold uppercase mb-2">{g}</p>

            <div className="space-y-2">
              {QUICK.filter(q => q.group === g).map(q => {
                const pw = userPws[q.email] || { value: '', show: false, error: '' };
                return (
                  <div key={q.email} className="bg-white/10 border border-white/20 rounded-2xl p-3 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-white/60">{q.icon}</span>
                      <div>
                        <p className="text-white text-sm font-semibold">{q.label}</p>
                        <p className="text-white/40 text-xs">{q.email}</p>
                      </div>
                    </div>

                    {pw.error && (
                      <p className="text-red-400 text-xs flex items-center gap-1">
                        <AlertCircle size={11} />{pw.error}
                      </p>
                    )}

                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type={pw.show ? 'text' : 'password'}
                          value={pw.value}
                          onChange={e => setUserPwField(q.email, 'value', e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleRoleLogin(q)}
                          placeholder="Password"
                          className="w-full px-3 py-2 pr-8 bg-white/10 border border-white/20 rounded-xl text-white text-xs outline-none placeholder:text-white/30"
                        />
                        <button
                          onClick={() => setUserPwField(q.email, 'show', !pw.show)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40"
                        >
                          {pw.show ? <EyeOff size={12} /> : <Eye size={12} />}
                        </button>
                      </div>
                      <button
  onClick={() => handleRoleLogin(q)}
  disabled={loadingUser === q.email}
  className="px-3 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all"
>
  {loadingUser === q.email ? 'Logging...' : 'Login'}
</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default Login;