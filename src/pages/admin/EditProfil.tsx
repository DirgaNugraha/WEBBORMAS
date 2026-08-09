import { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  User as UserIcon,
  ShieldCheck,
  Mail,
  Lock,
  Loader2,
} from 'lucide-react';
import ImageUpload from '../../components/admin/Imageupload';
import { useAuth } from '../../context/AuthContext';

function EditProfil() {
  const { user, updateProfile } = useAuth();

  // Format field
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [avatarUrl, setAvatarUrl] = useState(user?.user_metadata?.avatar_url ?? '');

  // Field keamanan
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // State UI
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSaveProfile = async () => {
    setError('');
    setSuccess('');

    if (!fullName.trim()) {
      setError('Nama tidak boleh kosong.');
      return;
    }

    setSaving(true);
    const { error } = await updateProfile({
      email: email || undefined,
      full_name: fullName.trim(),
      avatar_url: avatarUrl || undefined,
    });
    setSaving(false);

    if (error) {
      setError(error);
      return;
    }
    setSuccess('Profil berhasil diperbarui.');
  };

  const handleSavePassword = async () => {
    setError('');
    setSuccess('');

    if (!newPassword) {
      setError('Password baru tidak boleh kosong.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password minimal 6 karakter.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }

    setSaving(true);
    const { error } = await updateProfile({ password: newPassword });
    setSaving(false);

    if (error) {
      setError(error);
      return;
    }

    setNewPassword('');
    setConfirmPassword('');
    setSuccess('Password berhasil diubah.');
  };

  if (!user) {
    return <p className="p-6 text-slate-500 ">Memuat profil...</p>;
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-900  mb-1">Edit Profil Admin</h1>
      <p className="text-slate-500  mb-6">
        Perbarui informasi akun dan keamanan Anda.
      </p>

      {/* Profil */}
      <div className="card p-6 space-y-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <UserIcon className="w-5 h-5 text-primary-600 " />
          <h2 className="text-lg font-semibold text-slate-900 ">Informasi Profil</h2>
        </div>

        <ImageUpload
          label="Foto Profil"
          value={avatarUrl}
          onChange={setAvatarUrl}
          folder="avatar"
        />

        <div>
          <label className="block text-sm font-medium text-slate-700  mb-1.5">Nama Tampilan</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="input-field"
            placeholder="Nama admin"
          />
        </div>

        <div>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field pl-10"
              placeholder="admin@borimasunggu.go.id"
            />
          </div>
        </div>

        <button
          onClick={handleSaveProfile}
          disabled={saving}
          className="btn-primary disabled:opacity-60"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...
            </>
          ) : (
            'Simpan Profil'
          )}
        </button>
      </div>

      {/* Keamanan */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="w-5 h-5 text-primary-600 " />
          <h2 className="text-lg font-semibold text-slate-900 ">Keamanan</h2>
        </div>

        <div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="input-field pl-10"
              placeholder="Password baru"
              minLength={6}
            />
          </div>
        </div>

        <div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-field pl-10"
              placeholder="Konfirmasi password baru"
              minLength={6}
            />
          </div>
        </div>

        <button
          onClick={handleSavePassword}
          disabled={saving || !newPassword}
          className="btn-primary disabled:opacity-60"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...
            </>
          ) : (
            'Ubah Password'
          )}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50  text-red-700  text-sm mt-6">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-green-50  text-green-700  text-sm mt-6">
          <CheckCircle2 className="w-4 h-4 shrink-0" /> {success}
        </div>
      )}
    </div>
  );
}

export default EditProfil;

