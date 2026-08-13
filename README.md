# Codewalk

Paste a code snippet, get an animated, step-by-step walkthrough of how it runs — variables appearing, values updating, data flow arrows — built with React + Vite, deployed as a static site on AWS (S3 + CloudFront).

## How it works

- **Step breakdown**: [Groq](https://groq.com)'s free API, running `llama-3.3-70b-versatile`, called directly from the browser. It turns the pasted snippet into structured JSON (steps, variables, data-flow arrows).
- **Animation**: [Framer Motion](https://www.framer.com/motion/) drives the walkthrough — no video rendering, no server compute. It's React state transitions that look like an animated video, with play/pause/step/replay controls.
- **No backend**: this is a fully static site, same pattern as [interview.manujagrawal.com](https://interview.manujagrawal.com). The Groq API key ships in the client bundle (acceptable since it's a free-tier key with no billing risk).

## Development

```bash
npm install
cp .env.example .env.local   # add your own Groq API key from console.groq.com
npm run dev
```

## Build

```bash
npm run build
```

Outputs a static site to `dist/`.

## Deployment

Static build to an S3 bucket fronted by CloudFront, via GitHub Actions on push to `master` — same pipeline as the `AI-interview` project. Live at [codeexplain.manujagrawal.com](https://codeexplain.manujagrawal.com).
