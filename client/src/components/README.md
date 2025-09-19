# Components Directory Structure

This directory contains all reusable components organized by feature and functionality for better maintainability.

## Folder Organization Philosophy

Components are organized by their purpose and scope:
- **Feature-specific components**: Grouped by the feature they serve
- **UI components**: Reusable design system components
- **Layout components**: App-wide structural components
- **Utility components**: Common/shared functionality

This structure follows the user's requirement: "haar cheez ke liye ek folder hona chiaey" (everything should have its own folder).

## Current Component Structure

```
client/src/components/
├── layout/
│   ├── Header.tsx               # Application header with navigation
│   └── Footer.tsx               # Application footer
│
├── ui/                          # Shadcn UI components (design system)
│   ├── button.tsx
│   ├── card.tsx
│   ├── form.tsx
│   ├── input.tsx
│   └── ...                      # All other UI primitives
│
├── appointments/
│   └── CalendarView.tsx         # Calendar component for booking appointments
│
├── assessment/
│   └── AssessmentForm.tsx       # Mental health assessment form component
│
├── chat/
│   └── ChatInterface.tsx        # AI chatbot interface component
│
├── forum/
│   └── ForumPost.tsx            # Forum post display and interaction component
│
├── resources/
│   └── ResourceCard.tsx         # Resource display card component
│
├── forms/                       # Reusable form components (for future use)
│
├── cards/                       # Reusable card components (for future use)
│
└── common/                      # Shared/common components (for future use)
```

## Component Categories

### 1. Layout Components (`layout/`)
- Global app structure components
- Header, Footer, Navigation
- Used across multiple pages

### 2. UI Components (`ui/`)
- Design system components from shadcn/ui
- Reusable primitives (buttons, inputs, cards, etc.)
- Consistent styling and behavior

### 3. Feature Components (`appointments/`, `assessment/`, `chat/`, `forum/`, `resources/`)
- Components specific to particular features
- Encapsulate feature-specific logic and UI
- Can be reused within the same feature area

### 4. Utility Folders (`forms/`, `cards/`, `common/`)
- Ready for future expansion
- Will house reusable utility components
- Cross-feature shared components

## Import Patterns

Components follow consistent import patterns:

```typescript
// Layout components
import Header from "@/components/layout/Header";

// UI components (design system)
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Feature-specific components
import ChatInterface from "@/components/chat/ChatInterface";
import CalendarView from "@/components/appointments/CalendarView";
```

## Benefits of This Structure

1. **Feature Isolation**: Related components are grouped together
2. **Reusability**: Easy to identify and reuse components
3. **Scalability**: Clear place for new components
4. **Maintainability**: Logical organization makes maintenance easier
5. **Team Collaboration**: Developers can work on different features independently

## Adding New Components

When adding new components:

1. **Feature-specific**: Add to the relevant feature folder (`appointments/`, `chat/`, etc.)
2. **Reusable forms**: Add to `forms/` folder
3. **Reusable cards**: Add to `cards/` folder  
4. **General utilities**: Add to `common/` folder
5. **UI primitives**: Add to `ui/` folder (following shadcn conventions)
6. **Layout elements**: Add to `layout/` folder