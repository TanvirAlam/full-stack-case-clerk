# Full Stack Todo App - Case Study

> A simple, fast, and intuitive Todo application focused on usability and clean code.

## 🎯 Project Objectives

**Build a Todo App** – simple, fast, and intuitive, without login.

**Focus on Usability & Clean Code** – it should feel polished to use and easy to maintain.

**Meet Functional Requirements (MVP)** – create, update, delete tasks, add subtasks, set priority, mark as done/restore, persist data locally.

**Ensure Good Usability** – clear empty state, inline feedback (toasts), undo for destructive actions, keyboard support, proper focus management, responsive layout.

**Information Architecture & UI** – task list with priority indicators, filters (All, Active, Done), sorting, search, optional bulk actions and drag-and-drop.

**Non-Functional Goals** – use any frontend tech stack (TypeScript is a plus), persistence in LocalStorage, proper build/run scripts.

**Edge Cases Handling** – empty titles, long notes, no tasks or no search results, rapid input, persistence corruption.

**Documentation** – provide a concise README with run instructions, usage walkthrough, design choices.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm, yarn, or pnpm

### Installation & Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Build & Preview
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📋 Feature Checklist

### Core Functionality (MVP)
- [ ] Create, update, and delete tasks
- [ ] Task fields: Title, Subtitle, Notes, Priority (Low/Med/High)
- [ ] Mark tasks as done / restore to active
- [ ] Subtasks with the same done behavior
- [ ] LocalStorage persistence (survives refresh/reopen)
- [ ] Runs locally without backend/login

### Usability Requirements
- [ ] Clear empty state with call-to-action
- [ ] Inline feedback with toast notifications
- [ ] Undo functionality for destructive actions
- [ ] Keyboard support (Enter, Esc, Tab, Arrow keys)
- [ ] Focus management with visible focus rings
- [ ] Mobile-first responsive design

### Information Architecture
- [ ] Task list with visual priority indicators
- [ ] Filters: All, Active, Done
- [ ] Sorting by priority or latest updated
- [ ] Search across title/subtitle/notes
- [ ] Bulk actions (optional)
- [ ] Drag-and-drop reordering

### Edge Cases
- [ ] Handle empty titles gracefully
- [ ] Clamp long notes/titles in list view
- [ ] Empty states for no tasks/search results
- [ ] Prevent duplicates from rapid input
- [ ] Graceful handling of corrupted persistence

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Styled-Components with glassmorphism design
- **State Management**: React useState hooks (simplified)
- **Persistence**: LocalStorage with error handling
- **Icons**: Custom SVG logo

## 🎨 Design Principles

- **Simplicity First**: Clean, uncluttered interface with glassmorphism
- **Mobile-First**: Touch-friendly, responsive design
- **Visual Appeal**: Gradient backgrounds with floating animations
- **Performance**: Fast interactions, smooth animations
- **Feedback**: Clear visual feedback with hover effects

## 🔧 Development

This project uses:
- React 19 with TypeScript
- Vite for fast development and building
- Styled-Components for styling
- ESLint for code quality
- Modern JavaScript/TypeScript features

### Simplified Project Structure
```
src/
├── App.tsx           # Main application component
├── main.tsx          # React entry point
├── index.css         # Global CSS reset
└── assets/
    └── logo.svg      # Custom logo
```
