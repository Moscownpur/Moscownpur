#!/usr/bin/env node

console.log('🧪 RealM BFF Test Runner');
console.log('');

// Import dependencies
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { platform } from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const bffDir = join(__dirname, '..');
const isWindows = platform() === 'win32';

// Test commands
const commands = {
  run: {
    desc: 'Run all tests',
    cmd: 'npm test',
    dir: bffDir
  },
  watch: {
    desc: 'Run tests in watch mode',
    cmd: 'npm run test:watch',
    dir: bffDir
  },
  coverage: {
    desc: 'Run tests with coverage',
    cmd: 'npm run test:coverage',
    dir: bffDir
  }
};

// Get command from arguments
const command = process.argv[2];

if (!command || !commands[command]) {
  console.log('❌ Usage: node run-tests.js <command>');
  console.log('');
  console.log('Available commands:');
  Object.entries(commands).forEach(([key, value]) => {
    console.log(`  ${key.padEnd(8)} - ${value.desc}`);
  });
  process.exit(1);
}

const { desc, cmd, dir } = commands[command];

console.log(`🔬 Running: ${desc}`);
console.log(`📁 Directory: ${dir}`);
console.log(`🚀 Command: ${cmd}`);
console.log('');

// Run the command
const child = spawn(isWindows ? 'npm.cmd' : 'npm', [cmd], {
  stdio: 'inherit',
  cwd: dir,
  shell: true
});

child.on('error', (error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});

child.on('close', (code) => {
  if (code === 0) {
    console.log('✅ Tests completed successfully!');
  } else {
    console.log(`❌ Tests failed with exit code ${code}`);
  }
  process.exit(code);
});