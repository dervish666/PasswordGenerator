# Password Generator

A lightweight web application that generates secure diceware passphrases with a "Terminal" dark theme UI. Built with React 19 and Vite, containerized with Docker for easy deployment.

## Features

- Generate secure 2-6 word passphrases from the EFF Large Diceware wordlist (7772 words)
- **Humor engine** — incongruity-based word pairing for memorable, funny passphrases
- Configurable min/max character length via sliders
- **Character requirement toggles** — capital letter, number, and special character options
- Copy to clipboard with one click
- All generation happens locally using `crypto.getRandomValues()` — nothing transmitted
- "The Terminal" dark theme — Inter + JetBrains Mono, electric cyan accent
- Responsive design with `prefers-reduced-motion` support

## Local Development

### Prerequisites

- Node.js 22+ (Vite 8 requires Node 20.19+)
- npm

### Installation

1. Clone the repository
```bash
git clone https://github.com/dervish666/PasswordGenerator.git
cd PasswordGenerator
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

### Testing

```bash
npm test          # run all tests (Vitest)
npm run test:watch # run in watch mode
```

## Building for Production

```bash
npm run build
```

This creates a `build` directory with optimized production files.

## Docker Deployment

### Building the Docker Image

```bash
docker build -t password-generator .
```

### Running the Docker Container

```bash
docker run -p 8080:80 password-generator
```

The application will be available at `http://localhost:8080`.

### Deploying to Unraid

1. Make sure you have the Docker plugin installed on your Unraid server.
2. In the Unraid web UI, go to the Docker tab and click "Add Container".
3. Fill in the following details:
   - Repository: `your-docker-registry/password-generator` (or use a local path if you built the image on Unraid)
   - Network Type: Bridge
   - Port Mappings: `80:80/tcp` (or choose a different host port if needed)
   - Name: password-generator
   - Click "Apply"
4. The container should start automatically, and the application will be available at `http://your-unraid-ip:80` (or the port you specified).

## Security Considerations

- Passphrases are generated entirely in the browser using `crypto.getRandomValues()` with rejection sampling
- Nothing is stored, logged, or transmitted
- Docker deployment includes security headers (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy)
- For maximum security, consider running on your local network only

## License

MIT
