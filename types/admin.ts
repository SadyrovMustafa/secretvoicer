import { User } from './auth';

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  premiumUsers: number;
  totalVoiceovers: number;
  todayVoiceovers: number;
  barkUsage: number;
  elevenlabsUsage: number;
  browserUsage: number;
}

export interface AdminUser extends User {
  isAdmin?: boolean;
  isBlocked?: boolean;
  voiceoverCount?: number;
  lastActivity?: number;
}

export interface AdminFilters {
  search: string;
  subscriptionType?: 'free' | 'premium' | 'pro' | 'all';
  status?: 'active' | 'blocked' | 'all';
  dateFrom?: Date;
  dateTo?: Date;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  type: 'free' | 'premium' | 'pro';
  price: number;
  currency: string;
  features: string[];
  limits: {
    voiceoversPerMonth: number;
    maxTextLength: number;
    prioritySupport: boolean;
  };
}

export interface AdminAction {
  id: string;
  userId: string;
  action: 'block' | 'unblock' | 'change_subscription' | 'delete_user';
  details: any;
  timestamp: number;
  adminId: string;
} 