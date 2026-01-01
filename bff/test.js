#!/usr/bin/env node

console.log('🧪 RealM BFF Test Runner');
console.log('');

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const testCommands = {
  run: 'npm test',
  watch: 'npm run test:watch',
  coverage: 'npm run test:coverage'
};

const command = process.argv[2] || 'run';

if (!testCommands[command]) {
  console.log('❌ Available commands: run, watch, coverage');
  process.exit(1);
}

const cmd = testCommands[command];

console.log(`🚀 Running: ${command}`);
console.log(`📁 Directory: ${__dirname}`);
console.log('');

const child = spawn('cmd', ['/c', `cd /d "${__dirname}" && ${cmd}`], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, NODE_NO_WARNINGS: '1' }
});

child.on('error', (error) => {
  console.error('❌ Test error:', error.message);
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