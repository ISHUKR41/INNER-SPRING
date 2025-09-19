# Overview

MindCare is a comprehensive mental health support platform designed specifically for college students. The application provides multiple channels for mental health support including AI-powered chatbot conversations, professional counselor appointments, standardized mental health assessments (PHQ-9, GAD-7, GHQ), educational resources, peer support forums, and emergency crisis intervention resources. The platform emphasizes privacy, accessibility, and immediate support availability while maintaining professional standards for mental health care.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client is built with React and TypeScript using Vite for development tooling. The application follows a feature-based folder structure where each major feature (chatbot, appointments, assessments, resources, peer support, emergency) has its own dedicated page folder containing components, hooks, and utilities. The UI is built with Shadcn/UI components on top of Radix primitives, styled with Tailwind CSS using a calming color palette optimized for mental health contexts. Navigation is handled by Wouter for lightweight client-side routing, and TanStack Query manages server state with caching and real-time updates.

## Backend Architecture  
The server uses Express.js with TypeScript in a feature-based route organization. Each feature area (auth, chat, appointments, assessments, resources, forum, emergency) has its own route module that handles related endpoints. The architecture includes comprehensive middleware for request logging, JSON parsing, and error handling. WebSocket integration enables real-time chat functionality for the AI chatbot system. The server supports both development (with Vite integration and hot reloading) and production deployment scenarios.

## Data Storage Architecture
The application uses PostgreSQL as the primary database with Drizzle ORM providing type-safe database operations. The database schema includes tables for users, chat conversations and messages, counselors and appointments, mental health assessments, educational resources, forum categories with posts and replies, and emergency contacts. All tables use UUID primary keys for security, and the schema supports both identified and anonymous user interactions for privacy protection.

## Authentication System
User authentication is implemented with bcrypt password hashing using high salt rounds (12) for security. The system supports user registration with email uniqueness validation and login with credential verification. Passwords are never returned in API responses, and the authentication system is designed to support future session management implementation.

## AI Integration
OpenAI GPT integration powers the mental health chatbot with specialized prompts for empathetic, evidence-based mental health support. The AI system includes crisis detection capabilities that can escalate conversations when users mention self-harm, suicide ideation, or other emergency situations. Assessment analysis is also AI-powered, providing intelligent interpretation of standardized mental health questionnaires with personalized recommendations.

## Real-time Communication
WebSocket server implementation enables real-time chat messaging between users and the AI chatbot. The WebSocket system includes connection management, message routing, rate limiting for security, and automatic reconnection capabilities. The frontend uses a custom useWebSocket hook for managing connections with ping/pong heartbeats and graceful error handling.

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting with WebSocket support for real-time features and automatic scaling
- **Drizzle ORM**: Type-safe database queries with automatic schema inference and migration management

## AI Services  
- **OpenAI API**: GPT-5 model integration for chatbot responses, crisis detection, and mental health assessment analysis with specialized mental health prompting

## UI Framework
- **Shadcn/UI**: Complete component library built on Radix primitives providing accessible, customizable components
- **Radix UI**: Headless UI primitives for complex interactive components with built-in accessibility features
- **Tailwind CSS**: Utility-first CSS framework with custom mental health-focused color palette and responsive design

## Development Tools
- **Vite**: Frontend build tool with hot module replacement, development server, and production optimization
- **TanStack Query**: Server state management with caching, background updates, and optimistic mutations
- **Wouter**: Lightweight client-side routing solution for React applications

## Security & Validation
- **bcrypt**: Password hashing library for secure user authentication with high salt rounds
- **Zod**: Runtime type validation for API requests and form data with comprehensive error handling

## Communication
- **WebSocket (ws)**: Real-time bidirectional communication for chat functionality with connection pooling
- **React Hook Form**: Form state management with validation integration for complex assessment forms