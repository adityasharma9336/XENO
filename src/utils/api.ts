import type { Customer, Order, Segment, Campaign, Communication, ActivityLog } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'Bypass-Tunnel-Reminder': 'true',
      ...options?.headers
    },
    ...options
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  getCustomers: () => request<Customer[]>('/customers'),
  
  addCustomer: (customer: { name: string; email: string; phone: string; age?: number; city?: string }) => 
    request<Customer>('/customers', {
      method: 'POST',
      body: JSON.stringify(customer)
    }),
  
  getOrders: () => request<Order[]>('/orders'),
  
  getSegments: () => request<Segment[]>('/segments'),
  
  parseSegment: (prompt: string) => 
    request<{ 
      name: string; 
      description: string; 
      query_sql: string; 
      matchedCount: number; 
      previewCustomers: Customer[] 
    }>('/segments/parse', {
      method: 'POST',
      body: JSON.stringify({ prompt })
    }),
    
  saveSegment: (segment: { name: string; description: string; query_sql: string }) => 
    request<Segment>('/segments', {
      method: 'POST',
      body: JSON.stringify(segment)
    }),
    
  getCampaigns: () => request<Campaign[]>('/campaigns'),
  
  getCampaignDetails: (id: number) => 
    request<{ 
      campaign: Campaign; 
      metrics: any; 
      communications: Communication[] 
    }>(`/campaigns/${id}`),
    
  createCampaign: (campaign: { name: string; segment_id: number; channel: string; message_template: string }) => 
    request<Campaign>('/campaigns', {
      method: 'POST',
      body: JSON.stringify(campaign)
    }),
    
  launchCampaign: (id: number) => 
    request<{ success: boolean; message: string; sentCount: number }>(`/campaigns/${id}/launch`, {
      method: 'POST'
    }),
    
  getActivityLogs: () => request<ActivityLog[]>('/activity-logs'),
  
  generateAIMessage: (campaignGoal: string, segmentDesc: string, offerDetail: string) => 
    request<{ message: string }>('/ai/message', {
      method: 'POST',
      body: JSON.stringify({ campaignGoal, segmentDesc, offerDetail })
    }),
    
  recommendChannel: (segmentDesc: string, campaignGoal: string) => 
    request<{ channel: 'whatsapp' | 'sms' | 'email' | 'rcs'; confidence: number; reasoning: string }>('/ai/channel-recommend', {
      method: 'POST',
      body: JSON.stringify({ segmentDesc, campaignGoal })
    }),
    
  getCampaignInsights: (id: number) => 
    request<{ insights: string }>(`/campaigns/${id}/insights`)
};
export default api;
