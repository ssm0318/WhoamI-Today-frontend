# WhoAmIToday Frontend

## 🌐 Overview

WhoAmIToday Frontend is a React web application that provides users with an innovative social platform to discover and express themselves through interactive experiences. Built with modern web technologies, it delivers a seamless and responsive user interface for both desktop and mobile web browsers.

## 🛠 Tech Stack

- **Framework**: React 18.2.0
- **Language**: TypeScript 4.9.5
- **Build Tool**: CRACO 7.1.0 (Create React App Configuration Override)
- **Styling**: Styled Components 5.3.10
- **State Management**: Zustand 4.3.8
- **HTTP Client**: Axios 1.6.2
- **Routing**: React Router DOM 6.11.1
- **Internationalization**: i18next 22.4.15 + react-i18next 12.2.2
- **Data Fetching**: SWR 2.2.5
- **Backend Integration**: Firebase 10.3.0
- **Error Tracking**: Sentry React 9.10.1
- **Code Quality**: ESLint, Prettier, Husky, lint-staged

## 🚀 Getting Started

### Prerequisites

Make sure you have the following tools installed:

- **Node.js**: v18.0.0 or later
- **Yarn**: 1.22.19 or later

### Environment Setup

#### Docker Development

The project supports containerized development with Docker Compose:

```bash
# Development environment
yarn docker:dev

# Production environment  
yarn docker:prod
```

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd WhoAmI-Today-frontend
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Firebase Configuration** (Required)
   - Add your Firebase configuration to the project
   - Configure Firebase services for authentication, database, and push notifications
   - Firebase configuration files should be properly set up for security

### Running the Application

#### Development Mode

```bash
yarn start
```

The application will start on `http://localhost:3000` with hot reloading enabled.

#### Production Build

```bash
yarn build
```

Builds the app for production to the `build` folder with optimized bundles.

#### Testing

```bash
yarn test
```

Runs the test suite using Jest and React Testing Library.

## 📁 Project Structure

```
src/
├── components/          # UI components organized by feature
│   ├── _common/        # Reusable common components
│   ├── calendar/       # Calendar-related components
│   ├── check-in/       # Check-in features
│   ├── friends/        # Friend management
│   ├── header/         # Navigation headers
│   ├── profile/        # User profiles
│   └── ...            # Other feature components
├── constants/          # App constants and configuration
├── design-system/      # Design system components
├── hooks/             # Custom React hooks
├── i18n/              # Internationalization files
├── libs/              # External library integrations
├── models/            # TypeScript type definitions
├── routes/            # Page-level route components
├── stores/            # Zustand state management
├── styles/            # Global styles and themes
└── utils/             # Utility functions and API helpers
```

## 🔧 Key Features

- **Social Platform**: Connect with friends and share daily experiences
- **Check-ins**: Daily emotional and activity tracking
- **Real-time Chat**: Instant messaging with friends
- **Notes & Responses**: Personal journaling and question responses
- **Calendar Integration**: Track activities and moments over time
- **Multi-language Support**: i18next integration for internationalization
- **Responsive Design**: Optimized for both desktop and mobile web
- **Push Notifications**: Firebase Cloud Messaging integration
- **Spotify Integration**: Music sharing and discovery features
- **Error Monitoring**: Comprehensive error tracking with Sentry

## 🎨 Design System

The project includes a custom design system with:

- **Components**: Buttons, Inputs, Layouts, Typography
- **Color System**: Consistent color palette
- **Typography**: Roboto font family with multiple weights
- **Icons**: SVG icon system
- **Responsive Utilities**: Mobile-first design approach

## 🔐 Security & Configuration

- Firebase configuration files are excluded from version control
- Sensitive API keys are handled securely
- HTTPS-only configuration for production
- Content Security Policy implementation
- Child safety and privacy policies included

## 📝 Development

### Code Quality

The project maintains high code quality through:

- **ESLint**: Airbnb style guide with TypeScript support
- **Prettier**: Automated code formatting
- **Husky**: Git hooks for pre-commit validation
- **lint-staged**: Run linters on staged files only
- **TypeScript**: Strict type checking

### Path Aliases

The project uses path aliases for cleaner imports:

```typescript
@components/*      → ./src/components/*
@common-components/* → ./src/components/_common/*
@constants/*       → ./src/constants/*
@hooks/*          → ./src/hooks/*
@stores/*         → ./src/stores/*
@utils/*          → ./src/utils/*
@design-system    → ./src/design-system/index
```

### Available Scripts

- `yarn start`: Start development server with CRACO
- `yarn build`: Build for production (CI=false for deployment)
- `yarn test`: Run Jest test suite
- `yarn docker:dev`: Run development environment in Docker
- `yarn docker:prod`: Run production environment in Docker
- `yarn prepare`: Setup Husky git hooks

## 🐳 Docker Support

The project includes multi-stage Docker configuration:

- **Development**: Hot reloading with volume mounts
- **Production**: Optimized nginx-served static files
- **Multi-stage builds**: Efficient image sizes

## 🚀 Deployment

The application uses GitHub Actions for automated deployment:

- **Docker-based**: Multi-stage Docker builds with Nginx for static file serving
- **CI/CD Pipeline**: Automated build, test, and deployment on main branch push
- **Environment Configuration**: Secure secrets management for API keys and server credentials

## 📧 Contact

For questions, contributions, or support:

- **Email**: [whoami.today.official@gmail.com](mailto:whoami.today.official@gmail.com)

