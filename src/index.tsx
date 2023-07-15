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
import AllQuestions from './routes/AllQuestions';
import ForgotPassword from './routes/ForgotPassword';
import Friends from './routes/Friends';
import Home from './routes/Home';
import Intro from './routes/Intro';
import MomentDetailContainer from './routes/moment-detail/MomentDetailContainer';
import MomentUpload from './routes/MomentUpload';
import My from './routes/My';
import MyDetail from './routes/my-detail/MyDetail';
import Notifications from './routes/Notifications';
import ShortAnswerResponse from './routes/response/ShortAnswerResponse';
import ResponseHistory from './routes/ResponseHistory';
import Root from './routes/Root';
import ConfirmPassword from './routes/settings/ConfirmPassword';
import DeleteAccount from './routes/settings/DeleteAccount';
import EditProfile from './routes/settings/EditProfile';
import ResetPassword from './routes/settings/ResetPassword';
import Settings from './routes/settings/Settings';
import Email from './routes/sign-up/Email';
import Password from './routes/sign-up/Password';
import ProfileImage from './routes/sign-up/ProfileImage';
import ResearchConsentForm from './routes/sign-up/ResearchConsentForm';
import ResearchIntro from './routes/sign-up/ResearchIntro';
import UserName from './routes/sign-up/UserName';
import SignIn from './routes/SignIn';
import SignUp from './routes/SignUp';

const router = createBrowserRouter([
  { path: '', element: <Intro /> },
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: checkIfSignIn,
    children: [
      {
        path: 'home',
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
    ],
  },
  { path: 'signin', element: <SignIn /> },
  {
    path: 'signup',
    element: <SignUp />,
    children: [
      { path: 'email', element: <Email /> },
      { path: 'password', element: <Password /> },
      { path: 'research-intro', element: <ResearchIntro /> },
      { path: 'research-consent-form', element: <ResearchConsentForm /> },
      { path: 'username', element: <UserName /> },
      { path: 'profile-image', element: <ProfileImage /> },
    ],
  },
  { path: 'forgot-password', element: <ForgotPassword /> },
  { path: 'response-history/:questionId', element: <ResponseHistory /> },
  {
    path: 'questions',
    children: [
      { path: '', element: <AllQuestions /> },
      { path: ':questionId/short-answer', element: <ShortAnswerResponse /> },
    ],
  },
  {
    path: 'moment-upload',
    element: <MomentUpload />,
  },
  { path: 'my/detail/:detailDate', element: <MyDetail />, loader: checkIfSignIn },
  { path: 'moments/:momentId', element: <MomentDetailContainer />, loader: checkIfSignIn },
  {
    path: 'notifications',
    element: <Notifications />,
  },
  {
    path: 'settings',
    loader: checkIfSignIn,
    children: [
      { path: '', element: <Settings /> },
      { path: 'edit-profile', element: <EditProfile /> },
      { path: 'confirm-password', element: <ConfirmPassword /> },
      { path: 'reset-password', element: <ResetPassword /> },
      { path: 'delete-account', element: <DeleteAccount /> },
    ],
  },
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
