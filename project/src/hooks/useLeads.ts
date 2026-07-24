import { useCallback, useEffect, useState } from 'react';
import { Lead, LeadInput, LeadStatus } from '../types/lead';

const STORAGE_KEY = 'minicrm_leads';

function loadLeads(): Lead[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLeads(leads: Lead[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
}

let idCounter = Date.now();
function genId() {
  return (++idCounter).toString(36);
}

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = useCallback(() => {
    setLoading(true);
    setError(null);
    try {
      const data = loadLeads();
      data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setLeads(data);
    } catch {
      setError('Failed to load leads');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const createLead = async (input: LeadInput): Promise<{ error: string | null }> => {
    try {
      const lead: Lead = {
        ...input,
        id: genId(),
        user_id: '',
        created_at: new Date().toISOString(),
      };
      const all = loadLeads();
      all.push(lead);
      saveLeads(all);
      setLeads((prev) => [lead, ...prev]);
      return { error: null };
    } catch {
      return { error: 'Failed to create lead' };
    }
  };

  const updateLead = async (id: string, input: LeadInput): Promise<{ error: string | null }> => {
    try {
      const all = loadLeads();
      const idx = all.findIndex((l) => l.id === id);
      if (idx === -1) return { error: 'Lead not found' };
      all[idx] = { ...all[idx], ...input };
      saveLeads(all);
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...input } : l)));
      return { error: null };
    } catch {
      return { error: 'Failed to update lead' };
    }
  };

  const deleteLead = async (id: string): Promise<{ error: string | null }> => {
    try {
      const all = loadLeads();
      saveLeads(all.filter((l) => l.id !== id));
      setLeads((prev) => prev.filter((l) => l.id !== id));
      return { error: null };
    } catch {
      return { error: 'Failed to delete lead' };
    }
  };

  const updateStatus = async (id: string, status: LeadStatus): Promise<{ error: string | null }> => {
    try {
      const all = loadLeads();
      const idx = all.findIndex((l) => l.id === id);
      if (idx === -1) return { error: 'Lead not found' };
      all[idx].status = status;
      saveLeads(all);
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
      return { error: null };
    } catch {
      return { error: 'Failed to update status' };
    }
  };

  return { leads, loading, error, fetchLeads, createLead, updateLead, deleteLead, updateStatus };
}
