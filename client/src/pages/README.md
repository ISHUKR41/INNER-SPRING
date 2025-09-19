# Pages Directory Structure

This directory contains all the application pages, organized with each page in its own dedicated folder for better maintainability and organization.

## Folder Organization Philosophy

Each page has its own folder containing:
- The main page component (e.g., `Home.tsx`)
- A `components/` subfolder for page-specific components 
- A `hooks/` subfolder for page-specific custom hooks (where applicable)

This structure follows the user's requirement: "haar ek page ke liye ek folder hona chiaye" (every page should have its own folder).

## Current Page Structure

```
client/src/pages/
├── home/
│   ├── Home.tsx                 # Landing page with hero section and service overview
│   ├── components/              # Home-specific components
│   └── hooks/                   # Home-specific custom hooks
│
├── dashboard/
│   ├── Dashboard.tsx            # Student dashboard with progress tracking
│   └── components/              # Dashboard-specific components
│
├── chatbot/
│   ├── ChatBot.tsx              # AI chatbot interface with conversation management
│   └── components/              # Chat-specific components
│
├── appointments/
│   ├── Appointments.tsx         # Appointment booking system
│   └── components/              # Appointment-specific components
│
├── assessments/
│   ├── SelfAssessment.tsx       # Mental health assessment forms (PHQ-9, GAD-7, etc.)
│   └── components/              # Assessment-specific components
│
├── resources/
│   ├── Resources.tsx            # Resource library with filtering and search
│   └── components/              # Resource-specific components
│
├── peer-support/
│   ├── PeerSupport.tsx          # Community forum for peer discussions
│   └── components/              # Forum-specific components
│
├── emergency/
│   ├── Emergency.tsx            # Crisis support and emergency resources
│   └── components/              # Emergency-specific components
│
├── about/
│   ├── About.tsx                # About page with platform information
│   └── components/              # About-specific components
│
└── not-found/
    └── not-found.tsx            # 404 error page
```

## Benefits of This Structure

1. **Clear Organization**: Each page's code is contained within its own folder
2. **Scalability**: Easy to add page-specific components and hooks
3. **Maintainability**: Related code is grouped together
4. **Team Collaboration**: Easier to work on different pages simultaneously
5. **Code Reusability**: Page-specific components can be easily identified and reused

## Import Patterns

All pages follow consistent import patterns:

```typescript
// External dependencies
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// Shared components
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";

// Page-specific components (when they exist)
import PageSpecificComponent from "./components/PageSpecificComponent";
```

## Routing

All pages are registered in `client/src/App.tsx` with their new folder paths:

```typescript
import Home from "@/pages/home/Home";
import Dashboard from "@/pages/dashboard/Dashboard";
// ... other imports
```