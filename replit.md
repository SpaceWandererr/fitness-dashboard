# WebDev Fitness Dashboard v2

## Overview
A personal fitness and productivity dashboard built with React, Vite, and TailwindCSS. This application helps track fitness goals, study progress, workout routines, calendars, daily planning, and photo galleries.

**Current State:** Fully functional and running in Replit environment. The app includes a modern dark/light mode interface with multiple productivity tracking features.

## Project Information
- **Name:** WebDev Fitness Dashboard
- **Version:** 2.0.0
- **Type:** React + Vite Frontend Application
- **Author:** Jay Sinh Thakur

## Technology Stack
- **Frontend Framework:** React 18.3.1
- **Build Tool:** Vite 5.4.10
- **Styling:** TailwindCSS 3.4.13
- **Routing:** React Router DOM 6.28.0
- **Charts:** Recharts 2.15.4
- **Animations:** Framer Motion 12.23.24, Lottie React 2.4.1
- **Icons:** Lucide React 0.553.0
- **Date Handling:** DayJS 1.11.13
- **Weather:** OpenMeteo 1.2.2

## Key Features
1. **Home Dashboard** - Futuristic dashboard with goals, quotes, calendar summary, and streak tracking
2. **Syllabus/Study** - MERN + DSA learning tracker with milestones
3. **Gym** - Workout tracking and progress monitoring
4. **Calendar** - Task scheduling and date management
5. **Planner** - Daily task organization
6. **Goals** - Pomodoro timer for focused work sessions
7. **Gallery** - Photo management
8. **Dark/Light Mode** - Toggle between themes

## Project Structure
```
├── public/              # Static assets
│   ├── icon.svg
│   └── syllabus.html
├── src/
│   ├── assets/          # Weather animations (Lottie JSON)
│   ├── components/      # React components (Calendar, Gym, Planner, etc.)
│   ├── data/            # Static data (syllabus.json)
│   ├── styles/          # CSS files
│   ├── utils/           # Utility functions (localStorage)
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # Application entry point
│   └── styles.css       # Global styles
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # TailwindCSS configuration
└── package.json         # Dependencies and scripts
```

## Development Setup
- **Dev Server:** Runs on port 5000 (configured for Replit)
- **Host:** 0.0.0.0 (allows external access)
- **HMR:** Enabled with proper proxy configuration
- **File Watching:** Uses polling for better compatibility

## Running the Application
The application runs automatically via the "Start application" workflow:
```bash
npm run dev
```

## Build for Production
```bash
npm run build
```
The build outputs to the `dist/` directory.

## Deployment Configuration
- **Type:** Static site deployment
- **Build Command:** npm run build
- **Public Directory:** dist
- **Deployment Target:** Autoscale (static)

## Data Storage
The application uses browser localStorage for persisting:
- Dark mode preference (`wd_dark`)
- User data and preferences

## Recent Changes
- **Nov 19, 2025:** Imported from GitHub and configured for Replit environment
  - Changed Vite port from 5173 to 5000 for Replit compatibility
  - Configured workflow for automatic startup
  - Set up static deployment configuration
  - Verified all features working correctly

## Future Enhancements
Potential areas for expansion:
- Backend integration for data persistence
- User authentication
- Cloud storage for photos
- Mobile app version
- Social features for sharing progress
