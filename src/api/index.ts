#!/usr/bin/env node

import dotenv from 'dotenv';
import BFFServer from './server';

// Load environment variables
dotenv.config();

const PORT = process.env.BFF_PORT || 3001;

// Start the BFF server
const server = new BFFServer(parseInt(PORT.toString()));
server.start();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});