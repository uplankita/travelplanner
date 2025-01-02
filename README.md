# AI Travel Planner

An AI-powered travel itinerary generator that creates personalized travel plans based on destination, duration, and budget.

## Features

- 🌍 Destination-based itinerary generation
- 💰 Budget-aware planning
- 📅 Multi-day trip planning
- 🖼️ High-quality location images
- 📍 Detailed activity descriptions
- 💾 Local storage for itinerary history

## Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: Fastify, Node.js, TypeScript
- **AI**: Hugging Face API (Mixtral model)
- **Database**: Prisma with SQLite
- **Package Manager**: pnpm
- **Monorepo Structure**: Custom workspace setup

## Project Structure

```
├── apps/
│   ├── web/             # Next.js frontend
│   └── server/          # Fastify backend
├── packages/
│   ├── ai/             # AI integration package
│   ├── database/       # Prisma database package
│   └── shared/         # Shared types and utilities
```

## Prerequisites

- Node.js (v18 or higher)
- pnpm (v8 or higher)
- Hugging Face API key

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd travel-planner
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   # In root directory
   cp .env.example .env

   # Configure the following variables in .env:
   HUGGING_FACE_API_KEY=your_api_key
   DATABASE_URL="file:./dev.db"
   ```

4. Initialize the database:
   ```bash
   cd packages/database
   pnpm prisma generate
   pnpm prisma db push
   ```

5. Build packages:
   ```bash
   pnpm build
   ```

6. Start the development servers:
   ```bash
   # Start the backend server (port 4000)
   cd apps/server
   pnpm dev

   # In a new terminal, start the frontend (port 8000)
   cd apps/web
   pnpm dev
   ```

7. Open [http://localhost:8000](http://localhost:8000) in your browser.

## Development

### Git Workflow

1. Branch naming convention:
   - Feature: `feature/description`
   - Bug fix: `fix/description`
   - Refactor: `refactor/description`

2. Commit message format:
   ```
   type(scope): description

   [optional body]
   ```
   Types: feat, fix, docs, style, refactor, test, chore

3. Before committing:
   ```bash
   pnpm lint
   pnpm test
   ```

### Working with Packages

- Build all packages:
  ```bash
  pnpm build
  ```

- Watch mode for development:
  ```bash
  pnpm dev
  ```

### Database Management

- Create a new migration:
  ```bash
  cd packages/database
  pnpm prisma migrate dev
  ```

- Reset database:
  ```bash
  pnpm prisma migrate reset
  ```

## File Structure Details

### Frontend (`apps/web`)
```
├── app/              # Next.js app directory
├── components/       # React components
├── public/          # Static assets
└── styles/          # CSS styles
```

### Backend (`apps/server`)
```
├── src/
│   ├── routes/      # API routes
│   ├── plugins/     # Fastify plugins
│   └── index.ts     # Server entry point
```

### Shared Package
```
├── src/
│   ├── types/       # Shared TypeScript types
│   └── landmarks.ts # Image mapping utilities
```

## Environment Variables

```env
# Backend
PORT=4000
DATABASE_URL="file:./dev.db"
HUGGING_FACE_API_KEY=your_api_key
CORS_ORIGIN=http://localhost:8000

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Git Ignore Rules

The project includes specific `.gitignore` files for different components:

### Root `.gitignore`
```
node_modules/
.env
.env.*
!.env.example
```

### Package-specific `.gitignore`
```
dist/
*.tsbuildinfo
node_modules/
.env
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details
