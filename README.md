# Password Generator

A lightweight web application that generates secure three-word passphrases. Built with React and Material UI, and containerized with Docker for easy deployment.

## Features

- Generate secure three-word passphrases with a single click
- Copy generated passwords to clipboard
- Responsive design with Material UI
- Lightweight and fast
- Containerized for easy deployment

## Local Development

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/password-generator.git
cd password-generator
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

## Building for Production

To build the application for production:

```bash
npm run build
```

This will create a `build` directory with optimized production files.

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

- The passphrases are generated entirely in the browser and are not transmitted over the network.
- The application does not store or log any generated passwords.
- For maximum security, consider running the application on your local network only.

## License

MIT