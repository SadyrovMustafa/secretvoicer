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