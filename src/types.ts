export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  age: number;
  city: string;
  total_spent: number;
  last_order_date: string | null;
  created_at: string;
}

export interface Order {
  id: number;
  customer_id: number;
  customer_name?: string;
  amount: number;
  product: string;
  order_date: string;
  campaign_id: number | null;
}

export interface Segment {
  id: number;
  name: string;
  description: string;
  query_sql: string;
  created_at: string;
}

export interface Campaign {
  id: number;
  name: string;
  segment_id: number;
  segment_name: string;
  query_sql: string;
  channel: 'whatsapp' | 'sms' | 'email' | 'rcs';
  message_template: string;
  status: 'draft' | 'sending' | 'completed';
  created_at: string;
  
  // Flattened metrics
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  converted: number;
  failed: number;
}

export interface Communication {
  id: number;
  campaign_id: number;
  customer_id: number;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  channel: 'whatsapp' | 'sms' | 'email' | 'rcs';
  status: 'SENT' | 'DELIVERED' | 'OPENED' | 'READ' | 'CLICKED' | 'CONVERTED' | 'FAILED';
  sent_at: string | null;
  delivered_at: string | null;
  opened_at: string | null;
  clicked_at: string | null;
  failed_at: string | null;
  conversion_order_id: number | null;
  updated_at: string;
}

export interface CampaignMetrics {
  id: number;
  campaign_id: number;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  converted: number;
  failed: number;
}

export interface ActivityLog {
  id: number;
  timestamp: string;
  level: 'INFO' | 'ERROR' | 'WARN';
  message: string;
  details?: string | null;
}
