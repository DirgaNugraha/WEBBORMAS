import { useState, useMemo } from 'react';
import * as Icons from 'lucide-react';
import { Search } from 'lucide-react';

// Daftar nama ikon umum yang relevan untuk konten kelurahan.
// Bisa ditambah sesuai kebutuhan — cek semua nama valid di lucide.dev/icons
const COMMON_ICONS = [
  'Users', 'Home', 'MapPin', 'Building2', 'Wheat', 'Beef', 'Fish', 'Scissors',
  'CookingPot', 'Mountain', 'Construction', 'Laptop', 'Store', 'HeartPulse',
  'Newspaper', 'CalendarDays', 'Images', 'Briefcase', 'Sprout', 'FileText',
  'FileCheck', 'ShieldCheck', 'Phone', 'Mail', 'Clock', 'Award', 'BookOpen',
  'GraduationCap', 'Stethoscope', 'Tractor', 'TreePine', 'Waves', 'Sun',
  'Droplet', 'Leaf', 'Handshake', 'TrendingUp', 'Target', 'Eye', 'Flag',
];

interface IconPickerProps {
  label: string;
  value: string;
  onChange: (iconName: string) => void;
}

function IconPicker({ label, value, onChange }: IconPickerProps) {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  const filtered = useMemo(
    () => COMMON_ICONS.filter((name) => name.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  const SelectedIcon = (Icons as any)[value] as React.ComponentType<{ className?: string }> | undefined;

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="input-field flex items-center gap-2 text-left"
      >
        {SelectedIcon ? <SelectedIcon className="w-4 h-4" /> : <Search className="w-4 h-4 text-slate-400" />}
        <span className={value ? '' : 'text-slate-400'}>{value || 'Pilih ikon...'}</span>
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg p-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari ikon..."
            autoFocus
            className="input-field mb-3 text-sm"
          />
          <div className="grid grid-cols-5 gap-2 max-h-52 overflow-y-auto">
            {filtered.map((name) => {
              const Icon = (Icons as any)[name] as React.ComponentType<{ className?: string }>;
              return (
                <button
                  key={name}
                  type="button"
                  title={name}
                  onClick={() => {
                    onChange(name);
                    setOpen(false);
                    setSearch('');
                  }}
                  className={`aspect-square rounded-lg flex items-center justify-center transition-colors ${
                    value === name
                      ? 'bg-primary-100 dark:bg-primary-950/50 text-primary-700 dark:text-primary-400'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default IconPicker;