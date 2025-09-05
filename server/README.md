Setup

1) Copy your keys into a .env file at project root or in the server process environment:

GROQ_KEY_ADMIN=...
GROQ_KEY_CHAR1=...
GROQ_KEY_CHAR2=...
GROQ_MODEL_FAST=llama-3.1-8b-instant
GROQ_MODEL_STRONG=llama-3.1-8b-instant
PORT=5175

2) Start servers

npm run server
npm run dev

Notes

- If no keys are set, the pipeline falls back to stubbed text.
- Keys are only read on the server side; the browser never sees them.





