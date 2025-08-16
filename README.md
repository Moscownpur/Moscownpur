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

✅ AI Memory Engine System (Phase 2)

Advanced memory management for characters, worlds, and scenes

Memory versioning with rollback capabilities

Smart tagging system (emotions, plot, lore, relationships)

Context-aware AI responses using memory context

Character chat simulator with personality consistency

Automatic memory learning from interactions

Memory relevance scoring and analytics

🔜 Upcoming Focus
Export tools (chronological storybook, visual timelines)

Memory visualization and graph analytics

Advanced AI features (image generation, voice synthesis)

Collaborative storytelling features

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

### AI Memory Engine Features
1. Navigate to `/dashboard/ai-integration/:worldId` for the AI Integration Hub
2. Use the Memory Manager to create and manage entity memories
3. Chat with AI-powered characters using the Character Chat Simulator
4. Generate plot suggestions based on world context and memories
5. View memory analytics and relevance scores

### Analytics & Performance Monitoring
- **Vercel Analytics**: Automatic visitor and page view tracking
- **Speed Insights**: Real-time performance metrics and Core Web Vitals
- **Performance Monitoring**: Track LCP, FCP, CLS, and other performance indicators

🧠 Key Takeaway
We’re not building “just a writing app.”
We’re building a structured creative playground where users can design and manage their entire fictional universe — visually, interactively, and with deep connections.

## 👥 Contributors

- [Shashank](https://www.linkedin.com/in/s-asthanaji/?originalSubdomain=in)  
- [Bhavuk Wadhwa](https://www.linkedin.com/in/bhavukwadhwa)

## 📌 Stay Connected
Stay connected with us for updates, stories, and behind-the-scenes insights:  

- 📸 [Instagram](https://www.instagram.com/moscownpur/)  
- 💼 [LinkedIn](https://www.linkedin.com/in/moscownpur/)  
- 🐦 [X (Twitter)](https://x.com/moscownpur)  
- ▶️ [YouTube](https://www.youtube.com/@Moscownpur)
