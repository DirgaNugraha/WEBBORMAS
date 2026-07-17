import { useState, useRef } from 'react';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { adminService } from '../../services/Adminservice';

interface ImageUploadProps {
  label: string;
  value: string | null;
  onChange: (url: string) => void;
  folder: string; // subfolder di bucket, contoh: "berita", "galeri"
}

function ImageUpload({ label, value, onChange, folder }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran gambar maksimal 5MB.');
      return;
    }

    setError('');
    setUploading(true);
    const { url, error: uploadError } = await adminService.uploadImage(file, folder);
    setUploading(false);

    if (uploadError || !url) {
      setError('Gagal upload gambar. Coba lagi.');
      return;
    }
    onChange(url);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
        {label}
      </label>

      {value ? (
        <div className="relative w-full h-40 rounded-xl overflow-hidden group">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full h-40 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-primary-400 hover:text-primary-500 transition-colors"
        >
          {uploading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-sm">Mengunggah...</span>
            </>
          ) : (
            <>
              <ImagePlus className="w-6 h-6" />
              <span className="text-sm">Klik untuk pilih gambar</span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && <p className="text-sm text-red-600 dark:text-red-400 mt-1.5">{error}</p>}
    </div>
  );
}

export default ImageUpload;