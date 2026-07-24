import { useEffect, useState, FormEvent } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { Lead, LeadInput, LeadStatus, LeadPriority, LeadSource, LEAD_STATUSES, LEAD_PRIORITIES, LEAD_SOURCES } from '../types/lead';
import { validateEmail, validatePhone, validateRequired } from '../lib/validation';

interface LeadModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: LeadInput) => Promise<{ error: string | null }>;
  lead?: Lead | null;
}

const empty: LeadInput = {
  name: '',
  email: '',
  phone: '',
  company: '',
  source: 'Website',
  status: 'New',
  priority: 'Medium',
  notes: '',
};

export default function LeadModal({ open, onClose, onSubmit, lead }: LeadModalProps) {
  const [form, setForm] = useState<LeadInput>(empty);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(lead ? { ...lead } : empty);
      setErrors({});
    }
  }, [open, lead]);

  if (!open) return null;

  const set = (field: keyof LeadInput, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: '' }));
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    const nameErr = validateRequired(form.name, 'Name');
    if (nameErr) e.name = nameErr;
    if (form.email) {
      const emailErr = validateEmail(form.email);
      if (emailErr) e.email = emailErr;
    }
    if (form.phone) {
      const phoneErr = validatePhone(form.phone);
      if (phoneErr) e.phone = phoneErr;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    const { error } = await onSubmit(form);
    setSaving(false);
    if (error) return;
    onClose();
  };

  const inputClass = (field: string) =>
    `w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border ${
      errors[field] ? 'border-red-400 dark:border-red-500' : 'border-slate-200 dark:border-slate-700'
    } text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all text-sm`;

  const labelClass = 'block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-slate-200/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-t-3xl">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {lead ? 'Edit Lead' : 'Add New Lead'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Name *</label>
              <input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="John Doe" className={inputClass('name')} />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>
            <div>
              <label className={labelClass}>Company</label>
              <input value={form.company ?? ''} onChange={(e) => set('company', e.target.value)} placeholder="Acme Inc." className={inputClass('company')} />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" value={form.email ?? ''} onChange={(e) => set('email', e.target.value)} placeholder="john@acme.com" className={inputClass('email')} />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input value={form.phone ?? ''} onChange={(e) => set('phone', e.target.value)} placeholder="+1 555 000 0000" className={inputClass('phone')} />
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
            </div>
            <div>
              <label className={labelClass}>Source</label>
              <select value={form.source} onChange={(e) => set('source', e.target.value as LeadSource)} className={inputClass('source')}>
                {LEAD_SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select value={form.status} onChange={(e) => set('status', e.target.value as LeadStatus)} className={inputClass('status')}>
                {LEAD_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Priority</label>
              <select value={form.priority} onChange={(e) => set('priority', e.target.value as LeadPriority)} className={inputClass('priority')}>
                {LEAD_PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>Notes</label>
            <textarea value={form.notes ?? ''} onChange={(e) => set('notes', e.target.value)} rows={3} placeholder="Additional context…" className={inputClass('notes')} />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:translate-y-0">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {lead ? 'Save changes' : 'Create lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
