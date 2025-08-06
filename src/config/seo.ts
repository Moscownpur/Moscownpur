export interface SEOConfig {
  title: string;
  description: string;
  keywords: string;
  image?: string;
  type?: 'website' | 'article';
}

export const seoConfig: Record<string, SEOConfig> = {
  // Landing page
  '/': {
    title: 'MosCownpur - Fictional Universe Management App',
    description: 'Create, manage, and explore fictional universes with MosCownpur. Build worlds, characters, timelines, and stories with our comprehensive universe management platform.',
    keywords: 'fictional universe, world building, character management, story creation, timeline events, creative writing, universe management',
    type: 'website'
  },

  // Auth pages
  '/login': {
    title: 'Login - MosCownpur',
    description: 'Sign in to your MosCownpur account to access your fictional universes, worlds, and creative projects.',
    keywords: 'login, sign in, authentication, MosCownpur, fictional universe management',
    type: 'website'
  },

  '/signup': {
    title: 'Sign Up - MosCownpur',
    description: 'Create your free MosCownpur account and start building amazing fictional universes with our comprehensive world-building tools.',
    keywords: 'sign up, register, create account, MosCownpur, world building, fictional universe',
    type: 'website'
  },

  '/forgot-password': {
    title: 'Reset Password - MosCownpur',
    description: 'Reset your MosCownpur password to regain access to your fictional universes and creative projects.',
    keywords: 'reset password, forgot password, password recovery, MosCownpur',
    type: 'website'
  },

  // Admin pages
  '/admin/login': {
    title: 'Admin Login - MosCownpur',
    description: 'Administrator access to MosCownpur platform management and user administration.',
    keywords: 'admin login, administrator, platform management, MosCownpur admin',
    type: 'website'
  },

  '/admin/dashboard': {
    title: 'Admin Dashboard - MosCownpur',
    description: 'Administrative dashboard for managing MosCownpur platform, users, and system settings.',
    keywords: 'admin dashboard, platform management, user administration, system settings, MosCownpur',
    type: 'website'
  },

  // Dashboard pages
  '/dashboard': {
    title: 'Dashboard - MosCownpur',
    description: 'Your personal dashboard for managing fictional universes, worlds, characters, and creative projects.',
    keywords: 'dashboard, universe management, world building, character creation, MosCownpur',
    type: 'website'
  },

  '/dashboard/worlds': {
    title: 'World Management - MosCownpur',
    description: 'Create and manage fictional worlds with detailed settings, geography, cultures, and lore.',
    keywords: 'world management, world building, fictional worlds, geography, cultures, lore, MosCownpur',
    type: 'website'
  },

  '/dashboard/regions': {
    title: 'Region Management - MosCownpur',
    description: 'Organize your fictional worlds into regions with unique characteristics, politics, and environments.',
    keywords: 'region management, world regions, geography, political systems, environment, MosCownpur',
    type: 'website'
  },

  '/dashboard/characters': {
    title: 'Character Management - MosCownpur',
    description: 'Create and manage detailed character profiles with backgrounds, relationships, and story arcs.',
    keywords: 'character management, character creation, character profiles, relationships, story arcs, MosCownpur',
    type: 'website'
  },

  '/dashboard/timeline': {
    title: 'Timeline Events - MosCownpur',
    description: 'Build comprehensive timelines of events, plot points, and historical moments in your fictional universe.',
    keywords: 'timeline events, plot points, historical events, story timeline, MosCownpur',
    type: 'website'
  },

  '/dashboard/chapters': {
    title: 'Chapter Management - MosCownpur',
    description: 'Organize your stories into chapters with structured content management and narrative flow.',
    keywords: 'chapter management, story organization, narrative structure, content management, MosCownpur',
    type: 'website'
  },

  '/dashboard/scenes': {
    title: 'Scene Management - MosCownpur',
    description: 'Create and manage detailed scenes with dialogue, character interactions, and story progression.',
    keywords: 'scene management, dialogue, character interactions, story scenes, MosCownpur',
    type: 'website'
  },

  '/dashboard/stories': {
    title: 'Story Scenes - MosCownpur',
    description: 'View and manage your complete story collection with scene-by-scene narrative development.',
    keywords: 'story scenes, narrative development, story collection, scene management, MosCownpur',
    type: 'website'
  },

  '/dashboard/ai-test': {
    title: 'AI Test - MosCownpur',
    description: 'Test and experiment with AI-powered features for creative writing and universe building.',
    keywords: 'AI test, artificial intelligence, creative writing, AI features, MosCownpur',
    type: 'website'
  }
};

// Default SEO configuration
export const defaultSEO: SEOConfig = {
  title: 'MosCownpur - Fictional Universe Management App',
  description: 'Create, manage, and explore fictional universes with MosCownpur. Build worlds, characters, timelines, and stories with our comprehensive universe management platform.',
  keywords: 'fictional universe, world building, character management, story creation, timeline events, creative writing, universe management',
  type: 'website'
};

// Function to get SEO config for a specific path
export const getSEOConfig = (path: string): SEOConfig => {
  return seoConfig[path] || defaultSEO;
}; 