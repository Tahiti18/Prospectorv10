// API Configuration
export const API_BASE_URL = import.meta.env.DEV 
  ? 'https://3001-i0cpklycmklcu6n1lnlbc-de59bda9.sandbox.novita.ai/api'
  : '/api';

// API Helper Functions
export const api = {
  // Leads
  async getLeads() {
    const response = await fetch(`${API_BASE_URL}/leads`);
    if (!response.ok) throw new Error('Failed to fetch leads');
    return response.json();
  },

  async getLead(rank: number) {
    const response = await fetch(`${API_BASE_URL}/leads/${rank}`);
    if (!response.ok) throw new Error('Failed to fetch lead');
    return response.json();
  },

  async createLead(lead: any) {
    const response = await fetch(`${API_BASE_URL}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    });
    if (!response.ok) throw new Error('Failed to create lead');
    return response.json();
  },

  async updateLead(rank: number, lead: any) {
    const response = await fetch(`${API_BASE_URL}/leads/${rank}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    });
    if (!response.ok) throw new Error('Failed to update lead');
    return response.json();
  },

  async deleteLead(rank: number) {
    const response = await fetch(`${API_BASE_URL}/leads/${rank}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete lead');
    return response.json();
  },

  // Assets
  async getAssets() {
    const response = await fetch(`${API_BASE_URL}/assets`);
    if (!response.ok) throw new Error('Failed to fetch assets');
    return response.json();
  },

  async createAsset(asset: any) {
    const response = await fetch(`${API_BASE_URL}/assets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(asset),
    });
    if (!response.ok) throw new Error('Failed to create asset');
    return response.json();
  },

  async deleteAsset(id: string) {
    const response = await fetch(`${API_BASE_URL}/assets/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete asset');
    return response.json();
  },

  // Proposals
  async getProposals() {
    const response = await fetch(`${API_BASE_URL}/proposals`);
    if (!response.ok) throw new Error('Failed to fetch proposals');
    return response.json();
  },

  async createProposal(proposal: any) {
    const response = await fetch(`${API_BASE_URL}/proposals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(proposal),
    });
    if (!response.ok) throw new Error('Failed to create proposal');
    return response.json();
  },

  async deleteProposal(id: string) {
    const response = await fetch(`${API_BASE_URL}/proposals/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete proposal');
    return response.json();
  },
};
