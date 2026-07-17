import { Plus, Trash2 } from 'lucide-react';

interface ArrayInputProps {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

function ArrayInput({ label, values, onChange, placeholder }: ArrayInputProps) {
  const handleChangeItem = (index: number, value: string) => {
    const updated = [...values];
    updated[index] = value;
    onChange(updated);
  };

  const handleAdd = () => onChange([...values, '']);

  const handleRemove = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
        {label}
      </label>
      <div className="space-y-2">
        {values.map((value, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={value}
              onChange={(e) => handleChangeItem(index, e.target.value)}
              placeholder={placeholder}
              className="input-field flex-1"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={handleAdd}
        className="mt-2 flex items-center gap-1.5 text-sm font-medium text-primary-600 dark:text-primary-400"
      >
        <Plus className="w-4 h-4" /> Tambah item
      </button>
    </div>
  );
}

export default ArrayInput;