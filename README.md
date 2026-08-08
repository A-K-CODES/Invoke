# Invoke

Simple chat assistant (frontend + Node backend) using Groq and Tavily SDKs.

## Repo layout
- frontend/ — static UI (index.html, script.js)
- chatBot.js — core generation logic (Groq/Tavily clients)
- server.js — Express API exposing /chat
- package.json — scripts & deps
- .env — environment variables (NOT committed)

## Requirements
- Node.js 18+
- npm

## Install
From project root:
```bash
npm install
```

## Environment
Create a `.env` file in the project root (never commit this file):

```text
GROQ_API_KEY=your_groq_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
```

- Do not wrap values in quotes.
- Trim whitespace.
- If keys were exposed publicly, revoke and regenerate them.

## Run backend
Start server (server.js preloads dotenv via the start script):
```bash
npm start
# or
node -r dotenv/config server.js
```
Default port: 3001

API:
- POST /chat
  - body: { message: string, threadId: string }
  - response: { message: string }

## Run frontend
Quick open:
- Double-click `frontend/index.html` or:
```powershell
start "" "c:\Users\dell\Desktop\Invoke\frontend\index.html"
```
Recommended (static server):
```bash
npx http-server ./frontend -p 3000
# open http://localhost:3000
```

## Troubleshooting
- Invalid/expired API key: regenerate in provider dashboard, update `.env`, restart server.
- Ensure dotenv is loaded before creating clients (start script uses `-r dotenv/config`).
- Add debug logs in `chatBot.js` to confirm keys:
```js
console.log('GROQ_API_KEY present:', !!process.env.GROQ_API_KEY);
```

## Notes
- Do not commit `.env` or API keys.
- Rotate keys immediately if exposed.

License: ISC