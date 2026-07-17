import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, LogIn, AlertCircle } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-8 md:p-10 w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center shadow-lg shadow-primary-600/30 group-hover:scale-105 transition-transform">
                <img
                  src={logoKpKp}
                  alt="Logo Kelurahan Borimasunggu"
                  className="w-8 h-8 object-contain"
                />

              </div>
            </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Kelurahan</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Masuk untuk mengelola konten website
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                placeholder="admin@borimasunggu.go.id"
                className="input-field pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="••••••••"
                className="input-field pl-10"
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </motion.div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading ? 'Memproses...' : 'Masuk'}
            <LogIn className="w-4 h-4" />
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default Login;