# WhoAmI-Today-frontend
# WhoAmI Frontend

## Introduction

Welcome to the WhoAmI Frontend repository. This is the front-end part of the WhoAmI service, focused on providing a seamless and interactive user interface.

### directory structure
```ts
📦src
 ┣ 📂components // 컴포넌트
 ┃ ┗ 📂_common // 공통 컴포넌트
 ┣ 📂constants // 공통 상수
 ┣ 📂hooks // 공통 훅
 ┣ 📂i18n // 다국어
 ┣ 📂models // 공통 모델 
 ┣ 📂stores // 상태
 ┣ 📂styles // 공통 스타일
 ┣ 📂utils // 공통 헬퍼
 ┗  ┗ 📂apis // api 관련 헬퍼
```

## Tech Stack

The WhoAmI Frontend is built with:

- React
- TypeScript
- Styled Components
- Axios
- Firebase
- Various testing and linting tools (ESLint, Prettier, Jest)

## Getting Started

### Prerequisites

To get started with this project, you need to have:

- Node: v18 or later

### Installation

To set up the project on your local machine:

1. Clone the repository.
2. Run `yarn install` to install all dependencies.

### Running the Application

To start the application:

- Run `yarn start` for development mode.
- For production builds, use `yarn build`.

## Additional Technical Information

- The project uses a variety of dependencies for enhanced functionality, including `axios` for API requests, `date-fns` for date operations, and `zustand` for state management.
- For internationalization, `i18next` and `react-i18next` are employed.
- The application integrates Firebase for various services including authentication and database interactions.

## Scripts

Included scripts in `package.json`:

- `"start": "craco start"` - Starts the development server.
- `"build": "craco build"` - Builds the app for production.
- `"test": "craco test"` - Runs tests.
- `"eject": "craco eject"` - Ejects the app.
- `"prepare": "husky install"` - Prepares Husky for commit hooks.

## Linting and Formatting

- The project follows the Airbnb style guide for ESLint.
- Prettier is used for code formatting.
- Husky and lint-staged are configured for pre-commit hooks to ensure code quality.

## Contact

For any questions or contributions, feel free to contact us:

- Email: [team.whoami.today@gmail.com](mailto:team.whoami.today@gmail.com)

