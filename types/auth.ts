export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: number;
  lastLoginAt: number;
  isAdmin?: boolean;
  subscription?: {
    type: 'free' | 'premium' | 'pro';
    expiresAt?: number;
  };
  settings?: {
    defaultLanguage?: string;
    defaultVoiceId?: string;
    useBark?: boolean;
    useElevenLabs?: boolean;
  };
<<<<<<< HEAD
  // Реферальная система
  referralCode?: string;
  referredBy?: string;
  referralStats?: {
    totalReferrals: number;
    activeReferrals: number;
    totalEarnings: number;
    pendingEarnings: number;
  };
  referralHistory?: ReferralHistoryItem[];
}

export interface ReferralHistoryItem {
  id: string;
  referredUserId: string;
  referredUserEmail: string;
  referredUsername: string;
  status: 'pending' | 'active' | 'completed' | 'expired';
  createdAt: number;
  activatedAt?: number;
  earnings: number;
  commission: number;
}

export interface ReferralProgram {
  commissionRate: number; // Процент комиссии (например, 0.1 = 10%)
  minReferralsForBonus: number; // Минимум рефералов для бонуса
  bonusAmount: number; // Бонус за достижение минимума
  referralBonus: number; // Бонус за каждого реферала
  expirationDays: number; // Дни до истечения реферала
}

export interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  totalEarnings: number;
  pendingEarnings: number;
  monthlyReferrals: number;
  topReferrers: TopReferrer[];
}

export interface TopReferrer {
  userId: string;
  username: string;
  email: string;
  totalReferrals: number;
  totalEarnings: number;
=======
>>>>>>> 151f6be0d36e857431ebc82fc0dff270e5a46853
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
} 