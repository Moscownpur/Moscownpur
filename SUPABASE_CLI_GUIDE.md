# Supabase CLI Guide

This guide provides instructions on how to use the Supabase CLI with this project.

## Setup

The Supabase CLI has been installed and configured for this project. The following files have been set up:

- `supabase/config.json` - Project configuration
- `supabase/supabase.json` - Local development configuration
- `supabase/config.toml` - Detailed configuration for Supabase services

## Prerequisites

- Node.js and npm
- Docker Desktop (for local development)
  - **Important**: Docker must be running and accessible. On Windows, you may need to run your terminal/IDE with administrator privileges to connect to Docker.
- Supabase account and project

## Available Commands

The following npm scripts have been added to `package.json` for easy access to Supabase CLI commands:

```bash
# Start the local Supabase development environment
npm run supabase:start

# Check the status of your local Supabase services
npm run supabase:status

# Stop the local Supabase development environment
npm run supabase:stop

# Reset the local database to its initial state
npm run supabase:db:reset

# Create a new migration file
npm run supabase:migration:new your_migration_name

# Apply all pending migrations
npm run supabase:migration:up
```

## Common Workflows

### Local Development

1. Start the local Supabase services:
   ```bash
   npm run supabase:start
   ```

2. Access the local Supabase Studio at: http://localhost:54323

3. When finished, stop the services:
   ```bash
   npm run supabase:stop
   ```

### Working with Migrations

### Initial Schema

An initial database schema has been created in `supabase/migrations/init.sql`. This file contains the complete database schema with all tables required for the application.

### Creating New Migrations

1. Create a new migration:
   ```bash
   npm run supabase:migration:new add_new_feature
   ```

2. Edit the generated SQL file in the `supabase/migrations` directory.

3. Apply the migration:
   ```bash
   npm run supabase:migration:up
   ```

### Database Schema Structure

The database schema includes tables for:
- Blog system (posts, categories, tags, views)
- World-building (worlds, regions, characters)
- Storytelling (chapters, scenes, scene lines)
- AI interactions (chat logs, context templates)
- Memory system (entity summaries, analytics, visualizations)

See `supabase/migrations/README.md` for more details on the schema structure.

### Pushing Changes to Production

1. Make sure your local project is linked to your remote Supabase project:
   ```bash
   $env:SUPABASE_ACCESS_TOKEN="your_access_token"
   npx supabase link --project-ref your_project_ref
   ```

2. Push your local migrations to the remote project:
   ```bash
   npx supabase db push
   ```

## Environment Variables

The following environment variables are used:

- `VITE_SUPABASE_URL` - The URL of your Supabase project
- `VITE_SUPABASE_ANON_KEY` - The anonymous key for your Supabase project
- `SUPABASE_ACCESS_TOKEN` - Your Supabase access token (for CLI operations)

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)