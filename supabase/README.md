# Supabase CLI Guide

This guide explains how to use the Supabase CLI with this project.

## Prerequisites

- Node.js and npm installed
- Docker installed and running (required for local Supabase development)

## Getting Started

The Supabase CLI has been added as a dev dependency to this project. You can run Supabase commands using the npm scripts defined in `package.json`.

### Available Commands

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

## Working with Migrations

Migrations allow you to version control your database schema. Here's how to work with them:

1. Create a new migration:
   ```bash
   npm run supabase:migration:new add_new_table
   ```

2. Edit the generated SQL file in the `supabase/migrations` directory.

3. Apply the migration:
   ```bash
   npm run supabase:migration:up
   ```

## Connecting to Your Remote Supabase Project

To link your local development environment with your remote Supabase project:

```bash
npx supabase link --project-ref rqhyepbqlokrccsrpnlc
```

You'll need to provide your Supabase access token when prompted. Your access token is stored in the `.env` file as `SUPABASE_ACCESS_TOKEN`.

## Pushing Local Changes to Remote

After testing your changes locally, you can push your migrations to your remote Supabase project:

```bash
npx supabase db push
```

## Additional Resources

- [Supabase CLI Documentation](https://supabase.com/docs/reference/cli)
- [Supabase Migration Guides](https://supabase.com/docs/guides/database/migrations)