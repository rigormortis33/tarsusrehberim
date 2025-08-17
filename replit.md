# Overview

TarsusGo is a mobile-first city guide application for Tarsus, Turkey, designed to serve both local residents and tourists. The application provides essential daily services including transportation tracking, business directory, community forums, and emergency contacts. Built as a Progressive Web App (PWA) with a modular architecture, it aims to start as an MVP focusing on core transportation and business directory features, then expand to include advanced features like AR tours and local marketplace functionality.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: shadcn/ui component library built on Radix UI primitives with Tailwind CSS
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Mobile-First Design**: Responsive design optimized for mobile devices with bottom navigation and card-based layouts
- **Progressive Web App**: Configured for mobile app-like experience with proper viewport settings

## Backend Architecture
- **Runtime**: Node.js with Express.js server framework
- **Development Server**: Vite middleware integration for hot module replacement in development
- **API Design**: RESTful API with structured route handlers for businesses, transportation, community, and emergency services
- **Error Handling**: Centralized error handling middleware with proper HTTP status codes
- **Logging**: Custom request/response logging with performance metrics

## Data Storage & Schema
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Design**: Well-structured tables for users, businesses, bus routes, emergency contacts, announcements, and community posts
- **Database Migration**: Drizzle Kit for schema migrations and database management
- **Development Storage**: In-memory storage implementation for rapid prototyping and testing

## Component Architecture
- **Layout Components**: Reusable header, navigation, and page layouts
- **Feature Components**: Specialized components for business cards, transport info, community posts
- **UI System**: Comprehensive design system with consistent styling and theming
- **Modular Structure**: Feature-based component organization for scalability

## External Dependencies

- **Database Provider**: Neon Database (PostgreSQL-compatible serverless database)
- **UI Component Library**: Radix UI for accessible, unstyled components
- **Styling**: Tailwind CSS for utility-first styling with custom design tokens
- **Form Handling**: React Hook Form with Zod validation schemas
- **Icons**: Lucide React for consistent iconography
- **Date Handling**: date-fns for date manipulation and formatting
- **Development Tools**: ESBuild for production builds, TypeScript for type safety
- **Font Loading**: Google Fonts integration for typography (Roboto, DM Sans, Geist Mono)

The application follows a modern full-stack architecture with strong typing throughout, optimized for rapid development and deployment on Replit with consideration for future scaling to production environments.