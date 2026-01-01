const BFF_BASE_URL = import.meta.env.VITE_BFF_URL || 'http://localhost:3001/api';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  message?: string;
  timestamp?: string;
}

class BFFClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = BFF_BASE_URL) {
    this.baseURL = baseURL;
    
    // Load token from localStorage on initialization
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data: ApiResponse<T> = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('BFF API request failed:', error);
      throw error;
    }
  }

  // Authentication endpoints
  async login(email: string, password: string) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }
    
    return response;
  }

  async signup(email: string, password: string, full_name?: string) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, full_name }),
    });
  }

  async logout() {
    const response = await this.request('/auth/logout', {
      method: 'POST',
    });
    
    this.setToken(null);
    return response;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async refreshToken() {
    const response = await this.request('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ token: this.token }),
    });
    
    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }
    
    return response;
  }

  // World endpoints
  async getWorlds() {
    return this.request<World[]>('/worlds');
  }

  async getWorld(id: string) {
    return this.request<World>(`/worlds/${id}`);
  }

  async createWorld(worldData: Omit<World, 'id' | 'created_at' | 'updated_at' | 'user_id'>) {
    return this.request<World>('/worlds', {
      method: 'POST',
      body: JSON.stringify(worldData),
    });
  }

  async updateWorld(id: string, worldData: Partial<World>) {
    return this.request<World>(`/worlds/${id}`, {
      method: 'PUT',
      body: JSON.stringify(worldData),
    });
  }

  async deleteWorld(id: string) {
    return this.request(`/worlds/${id}`, {
      method: 'DELETE',
    });
  }

  // Health check
  async getHealth() {
    return this.request('/api/health');
  }
}

export interface World {
  id: string;
  name: string;
  description?: string;
  user_id: string;
  created_at: string;
  updated_at?: string;
}

export const bffClient = new BFFClient();
export default bffClient;