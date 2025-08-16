# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tatami is a no-code tool for accelerating Dojo Engine game development on Starknet. It enables users to create models, visualize entity relationships, and generate Cairo code for Dojo projects through an intuitive UI.

## Architecture

This is a Turborepo monorepo with two main applications:

### Frontend (`apps/frontend/`)
- **Framework**: Next.js 15 with React 19, TypeScript, TailwindCSS
- **UI Components**: shadcn/ui with Radix UI primitives
- **State Management**: Zustand for global state
- **Key Features**:
  - Visual model/entity diagram editor
  - Real-time Cairo code generation
  - GraphQL metrics interface
  - Starknet wallet integration (Cartridge, StarknetKit)
  - Multi-language support (i18next)

### Backend (`apps/backend/`)
- **Framework**: Dojo Engine (Cairo smart contracts)
- **Purpose**: Provides the underlying Dojo models and systems for project/user management
- **Key Models**: `Project`, `User` with full CRUD operations
- **Development Tools**: Katana (local devnet), Torii (indexer), Sozo (deployment)

## Development Commands

### Root Level (Turbo)
```bash
npm install              # Install all workspace dependencies
npm run dev              # Start all applications
npm run build            # Build all applications  
npm run lint             # Lint all applications
npm run dev:frontend     # Start only frontend
```

### Frontend Specific
```bash
npm run dev:clean        # Clear models cache and start dev server
npm run build            # Next.js build
npm run start            # Start production server
```

### Backend (Dojo) Specific
```bash
# Setup (in apps/backend/)
katana --dev --dev.no-fee           # Start local devnet (Terminal 1)
sozo build                          # Build Cairo contracts
sozo migrate                        # Deploy to local devnet
torii --world <WORLD_ADDRESS> --http.cors_origins "*"  # Start indexer
```

## Key Code Patterns

### Model Management
- Models are defined via TypeScript interfaces in `/types/models.tsx`
- Cairo code generation happens in `/utils/generateCairoCode.ts`
- Models support properties with data types, key fields, and traits
- State managed through Zustand stores (`useDiagramStore`, `useModelState`)

### Cairo/Dojo Integration
- All Cairo contracts follow Dojo patterns with `#[dojo::model]` and `#[dojo::contract]`
- Models include comprehensive trait implementations (`ProjectTrait`, validation, Zero patterns)
- Systems provide interfaces for CRUD operations
- Extensive test coverage with Cairo unit tests

### Frontend Architecture
- App Router structure under `/app/`
- Component organization: `/components/ui/` (primitives), `/components/` (business logic)
- Service layer in `/services/` for state management
- Utility functions in `/utils/` for code generation and entity relationship detection

### Starknet Integration
- Multiple wallet connector support (Cartridge Controller, StarknetKit)
- GraphQL integration for blockchain data querying
- Real-time metrics and transaction monitoring

## Testing

- **Cairo Tests**: Comprehensive unit tests in `apps/backend/src/tests/`
- **Frontend**: No test framework currently configured
- **Test Commands**: Use `sozo test` for Cairo contract testing

## Important File Locations

- **Model Types**: `apps/frontend/types/models.tsx`
- **Cairo Code Generation**: `apps/frontend/utils/generateCairoCode.ts`
- **Main Models**: `apps/backend/src/models/`
- **Contract Systems**: `apps/backend/src/systems/`
- **State Management**: `apps/frontend/hooks/useDiagramStore.ts`
- **UI Components**: `apps/frontend/components/ui/`

## Development Notes

- Uses Turbo for monorepo management with workspace dependencies
- Frontend runs on port 3000 by default
- Cairo development requires Dojo toolchain (katana, sozo, torii)
- Models automatically generate Cairo code with proper Dojo annotations
- Diagram state persists entity positions and active sections (code/diagram view)