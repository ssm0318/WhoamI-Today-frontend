import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Colors } from '@design-system';
import GlobalStyle from '@styles/global-styles';
import ErrorPage from './components/error-page/ErrorPage';
import reportWebVitals from './reportWebVitals';
import Friends from './routes/Friends';
import Login from './routes/Login';
import My from './routes/My';
import Notification from './routes/Notification';
import Root from './routes/Root';
import SignUp from './routes/SignUp';
import Today from './routes/Today';
import Counter from './routes/ZustandExample';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: <Today />,
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
  { path: 'login', element: <Login /> },
  { path: 'signup', element: <SignUp /> },
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
