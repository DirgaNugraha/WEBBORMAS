import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, LogIn, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logoKpKp from "../../aset/logopkp.png";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);

    setLoading(false);

    if (error) {
      setError(error);
      return;
    }

    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50/80 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-10 w-full max-w-md shadow-xl"
      >
        {/* LOGO & TITLE */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-800 flex items-center justify-center shadow-lg shadow-blue-700/20 mb-4">
            <img
              src={logoKpKp}
              alt="Logo Kelurahan Borimasunggu"
              className="w-9 h-9 object-contain"
            />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Portal Admin Kelurahan</h1>
          <p className="text-xs text-slate-500 mt-1">
            Masuk dengan kredensial Anda untuk mengelola informasi publik.
          </p>
        </div>

        {/* FORM LOGIN */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Alamat Email *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                placeholder="admin@borimasunggu.go.id"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:border-blue-700 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Kata Sandi *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:border-blue-700 focus:outline-hidden"
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
            <span>{loading ? 'Memverifikasi...' : 'Masuk ke Dashboard'}</span>
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default Login;