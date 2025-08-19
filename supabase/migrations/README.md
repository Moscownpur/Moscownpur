# Database Schema Migration

## Overview

This directory contains SQL migration files for the Supabase database. The `init.sql` file defines the initial database schema with all tables required for the application.

## Using the Schema

### With Docker (Local Development)

If you have Docker installed and running, you can use the Supabase CLI to apply this schema:

```bash
npm run supabase:db:reset
```

Or directly with the Supabase CLI:

```bash
npx supabase db reset
```

### Without Docker (Remote Development)

If you don't have Docker or prefer to work directly with the remote Supabase instance:

1. Log in to your Supabase dashboard: https://supabase.com/dashboard/project/rqhyepbqlokrccsrpnlc
2. Navigate to the SQL Editor
3. Copy the contents of `init.sql`
4. Paste into the SQL Editor and execute

## Schema Structure

The database schema includes the following tables:

- **ai_chat_logs**: Stores chat interactions between users and AI characters
- **blog_categories**: Categories for blog posts
- **blog_tags**: Tags for blog posts
- **blog_posts**: Main blog post content
- **blog_post_tags**: Junction table linking posts to tags
- **blog_views**: Tracks views on blog posts
- **worlds**: Fictional worlds in the application
- **regions**: Regions within worlds
- **characters**: Characters that exist within worlds
- **chapters**: Chapters of stories within worlds
- **scenes**: Scenes within chapters
- **scene_characters**: Junction table linking scenes to characters
- **scene_lines**: Dialog lines within scenes
- **timeline_events**: Events on world timelines
- **entity_summaries**: Summaries of various entities
- **memory_tags**: Tags for memory system
- **memory_analytics**: Analytics data for the memory system
- **memory_visualizations**: Visualization data for memories
- **context_templates**: Templates for context generation
- **user_roles**: User role assignments

## Creating New Migrations

When you need to make changes to the database schema, create a new migration file rather than modifying `init.sql` directly:

```bash
npm run supabase:migration:new your_migration_name
```

This will create a new timestamped migration file that you can edit to add your schema changes.

## Applying Migrations

To apply migrations to your database:

```bash
npm run supabase:migration:up
```

Or directly with the Supabase CLI:

```bash
npx supabase migration up
```

## Notes

- All tables use UUID primary keys with `gen_random_uuid()` as the default value
- Most tables include `created_at` and `updated_at` timestamp fields
- Foreign key relationships are defined with appropriate cascade delete rules
- The schema uses the `public` schema in Supabase