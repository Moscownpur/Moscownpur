Welcome to the Moscownpur Project 🚀
🌟 Vision
Moscownpur is a creative worldbuilding and storytelling SaaS platform.
We are building a Narrative Operating System where creators can design Worlds, Characters, Regions, Timelines, and Scenes — all interlinked to maintain story consistency.

The goal is simple:
To let users create their own comic-universe style worlds where stories, characters, and events are deeply connected — not just random chapters.

🎯 Core Concept
Worlds & Regions → Define your universe’s geography and realms.

Characters → Build rich profiles with origins, traits, and evolution.

Timeline → The backbone of the story; all events and scenes are placed here.

Scenes → Detailed moments linked to events, with:

Character roles & states

Dialogue & narration system (like comics/screenplays)

Interlinked Storytelling → No disconnected chapters; everything connects through the timeline.

💡 Current Status
✅ Admin Dashboard

Role-based access, live DB integration, full CRUD for Worlds, Characters, Timelines.

✅ Timeline & Scene Context System

Hierarchical World → Event → Scene flow

Character role/state tracking across events

Interactive timeline navigation

✅ UI/UX

Minimalist dark theme (Apple-inspired)

Glassmorphism effects & smooth transitions

Mobile-responsive design

✅ Scene Dialogue & Narration System

Character dialogue with @CharacterName format

Scene narration for descriptions and transitions

Role-based color coding and drag-and-drop reordering

✅ Updated Color Scheme

Yellow-orange gradient theme throughout the app

Consistent with Timeline Events styling

✅ Chapter Support System (Phase 1)

Chapter management with drag-and-drop reordering

Timeline events grouped under chapters

Chapter assignment for better story structure

✅ Google Gemini AI Integration

AI utility functions for text and image generation

Scene suggestions, dialogue drafting, plot continuation

Test suite for API verification

🔜 Upcoming Focus
Export tools (chronological storybook, visual timelines)

Enhanced AI integration (character generation, world building assistance)

## 🚀 Setup Instructions

### Environment Variables
Create a `.env` file in the root directory with:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Google Gemini AI Configuration
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### AI Integration Testing
1. Navigate to `/dashboard/ai-test` in the application
2. Run individual tests or use "Run All Tests" to verify API integration
3. Check environment variables are properly set
4. Test various AI features: text generation, scene suggestions, dialogue, plot continuation

🧠 Key Takeaway
We’re not building “just a writing app.”
We’re building a structured creative playground where users can design and manage their entire fictional universe — visually, interactively, and with deep connections.