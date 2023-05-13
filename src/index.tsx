import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Colors } from '@design-system';
import GlobalStyle from '@styles/global-styles';
import { checkIfSignIn } from '@utils/apis/user';
import ErrorPage from './components/error-page/ErrorPage';
import './i18n';
import reportWebVitals from './reportWebVitals';
import ForgotPassword from './routes/ForgotPassword';
import Friends from './routes/Friends';
import Home from './routes/Home';
import Intro from './routes/Intro';
import My from './routes/My';
import Notification from './routes/Notification';
import Root from './routes/Root';
import SignIn from './routes/SignIn';
import SignUp from './routes/SignUp';
import Counter from './routes/ZustandExample';

const router = createBrowserRouter([
  { path: '', element: <Intro /> },
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: checkIfSignIn,
    children: [
      {
        path: '/home',
        element: <Home />,
      },
      {
        path: 'my',
        element: <My />,
      },
      {
        path: 'friends',
        element: <Friends />,
      },
      {
        path: 'notifications',
        element: <Notification />,
      },
      {
        path: 'zustand-example',
        element: <Counter />,
      },
    ],
  },
  { path: 'signin', element: <SignIn /> },
  { path: 'signup', element: <SignUp /> },
  { path: 'forgot-password', element: <ForgotPassword /> },
]);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <GlobalStyle />
    <ThemeProvider theme={Colors}>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
