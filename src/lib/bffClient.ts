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
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
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
  async login(email: string, password: string): Promise<ApiResponse<LoginResponseData>> {
    const response = await this.request<LoginResponseData>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }
    
    return response;
  }

  async signup(email: string, password: string, full_name?: string): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/signup', {
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

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/me');
  }

  async refreshToken(): Promise<ApiResponse<LoginResponseData>> {
    const response = await this.request<LoginResponseData>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ token: this.token }),
    });
    
    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }
    
    return response;
  }

  async exchangeSupabaseToken(supabaseToken: string, userId: string): Promise<ApiResponse<LoginResponseData>> {
    const response = await this.request<LoginResponseData>('/auth/exchange-supabase', {
      method: 'POST',
      body: JSON.stringify({ supabase_token: supabaseToken, user_id: userId }),
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

  // Character endpoints
  async getCharacters(worldId?: string) {
    const endpoint = worldId ? `/characters?world_id=${worldId}` : '/characters';
    return this.request<Character[]>(endpoint);
  }

  async getCharacter(id: string) {
    return this.request<Character>(`/characters/${id}`);
  }

  async createCharacter(characterData: Omit<Character, 'id' | 'created_at' | 'updated_at' | 'user_id'>) {
    return this.request<Character>('/characters', {
      method: 'POST',
      body: JSON.stringify(characterData),
    });
  }

  async updateCharacter(id: string, characterData: Partial<Character>) {
    return this.request<Character>(`/characters/${id}`, {
      method: 'PUT',
      body: JSON.stringify(characterData),
    });
  }

  async deleteCharacter(id: string) {
    return this.request(`/characters/${id}`, {
      method: 'DELETE',
    });
  }

  // Chapter endpoints
  async getChapters(worldId?: string) {
    const endpoint = worldId ? `/chapters?world_id=${worldId}` : '/chapters';
    return this.request<Chapter[]>(endpoint);
  }

  async getChapter(id: string) {
    return this.request<Chapter>(`/chapters/${id}`);
  }

  async createChapter(chapterData: Omit<Chapter, 'id' | 'created_at' | 'updated_at' | 'user_id'>) {
    return this.request<Chapter>('/chapters', {
      method: 'POST',
      body: JSON.stringify(chapterData),
    });
  }

  async updateChapter(id: string, chapterData: Partial<Chapter>) {
    return this.request<Chapter>(`/chapters/${id}`, {
      method: 'PUT',
      body: JSON.stringify(chapterData),
    });
  }

  async deleteChapter(id: string) {
    return this.request(`/chapters/${id}`, {
      method: 'DELETE',
    });
  }

  // Scene endpoints
  async getScenes(chapterId?: string) {
    const endpoint = chapterId ? `/scenes?chapter_id=${chapterId}` : '/scenes';
    return this.request<Scene[]>(endpoint);
  }

  async getScene(id: string) {
    return this.request<Scene>(`/scenes/${id}`);
  }

  async createScene(sceneData: Omit<Scene, 'id' | 'created_at' | 'updated_at' | 'user_id'>) {
    return this.request<Scene>('/scenes', {
      method: 'POST',
      body: JSON.stringify(sceneData),
    });
  }

  async updateScene(id: string, sceneData: Partial<Scene>) {
    return this.request<Scene>(`/scenes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sceneData),
    });
  }

  async deleteScene(id: string) {
    return this.request(`/scenes/${id}`, {
      method: 'DELETE',
    });
  }

  // Dialogue endpoints
  async getDialogues(sceneId?: string) {
    const endpoint = sceneId ? `/dialogues?scene_id=${sceneId}` : '/dialogues';
    return this.request<Dialogue[]>(endpoint);
  }

  async getDialogue(id: string) {
    return this.request<Dialogue>(`/dialogues/${id}`);
  }

  async createDialogue(dialogueData: Omit<Dialogue, 'id' | 'created_at' | 'updated_at' | 'user_id'>) {
    return this.request<Dialogue>('/dialogues', {
      method: 'POST',
      body: JSON.stringify(dialogueData),
    });
  }

  async updateDialogue(id: string, dialogueData: Partial<Dialogue>) {
    return this.request<Dialogue>(`/dialogues/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dialogueData),
    });
  }

  async deleteDialogue(id: string) {
    return this.request(`/dialogues/${id}`, {
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

export interface Character {
  id: string;
  name: string;
  description?: string;
  world_id: string;
  user_id: string;
  created_at: string;
  updated_at?: string;
}

export interface Chapter {
  id: string;
  name: string;
  description?: string;
  world_id: string;
  user_id: string;
  created_at: string;
  updated_at?: string;
}

export interface Scene {
  id: string;
  name: string;
  description?: string;
  chapter_id: string;
  user_id: string;
  created_at: string;
  updated_at?: string;
}

export interface Dialogue {
  id: string;
  content: string;
  character_id: string;
  scene_id: string;
  user_id: string;
  created_at: string;
  updated_at?: string;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  is_admin?: boolean;
  created_at: string;
}

export interface LoginResponseData {
  user: User;
  token: string;
}

export const bffClient = new BFFClient();
export default bffClient;