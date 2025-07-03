# TaskFlow - Task Management Application

A modern, responsive task management application built with Next.js, React, and Tailwind CSS. Features a complete user flow from landing page to dashboard with authentication and task management capabilities.

## Quick Start

### Docker Deployment (Recommended)

The easiest way to get TaskFlow running is with Docker:

**Production:**
```bash
docker-compose up --build -d
```

**Development:**
```bash
docker-compose --profile dev up --build
```

Access the application at `http://localhost:3000` (production) or `http://localhost:3001` (development).

For detailed Docker deployment instructions, see [DOCKER.md](./DOCKER.md).

### Local Development

**Prerequisites:**
- Node.js 18+
- npm or yarn

**Installation:**
```bash
npm install
npm run dev
```

## Contributions

For steps on local deployment, development, and code contribution, please see [CONTRIBUTING](./CONTRIBUTING.md).

## Dependencies overview

- Next.js
- Chakra UI
- State management:
  - SWR for server and blockchain state (fetching and caching)
  - XState for complex flows
- Web3 stuff:
  - wagmi for connection management
