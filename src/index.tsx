import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Colors } from '@design-system';
import { useGetAppMessage } from '@hooks/useAppMessage';
import { useBoundStore } from '@stores/useBoundStore';
import GlobalStyle from '@styles/global-styles';
import { checkIfSignIn } from '@utils/apis/user';
import ErrorPage from './components/error-page/ErrorPage';
import './i18n';
import reportWebVitals from './reportWebVitals';
import AllQuestions from './routes/AllQuestions';
import Chats from './routes/Chats';
import ForgotPassword from './routes/ForgotPassword';
import Friends from './routes/Friends';
import Intro from './routes/Intro';
import MomentDetailContainer from './routes/moment-detail/MomentDetailContainer';
import MomentUpload from './routes/MomentUpload';
import My from './routes/My';
import Notifications from './routes/Notifications';
import ShortAnswerResponse from './routes/response/ShortAnswerResponse';
import ResponseDetailContainer from './routes/response-detail/ResponseDetailContainer';
import ResponseHistory from './routes/ResponseHistory';
import Root from './routes/Root';
import ConfirmPassword from './routes/settings/ConfirmPassword';
import DeleteAccount from './routes/settings/DeleteAccount';
import EditProfile from './routes/settings/EditProfile';
import FriendsSettings from './routes/settings/FriendsSettings';
import ResetPassword from './routes/settings/ResetPassword';
import Settings from './routes/settings/Settings';
import AddProfileImage from './routes/sign-up/AddProfileImage';
import Email from './routes/sign-up/Email';
import NotiSettings from './routes/sign-up/NotiSettings';
import Password from './routes/sign-up/Password';
import ResearchConsentForm from './routes/sign-up/ResearchConsentForm';
import ResearchIntro from './routes/sign-up/ResearchIntro';
import UserName from './routes/sign-up/UserName';
import SignIn from './routes/SignIn';
import SignUp from './routes/SignUp';
import UserPage from './routes/UserPage';

const router = createBrowserRouter([
  { path: '', element: <Intro /> },
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: checkIfSignIn,
    children: [
      {
        path: 'chats',
        element: <Chats />,
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
      { path: 'profile-image', element: <AddProfileImage /> },
      { path: 'noti-settings', element: <NotiSettings /> },
      { path: '', element: <Navigate replace to="email" /> },
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
  { path: 'moments/:momentId', element: <MomentDetailContainer />, loader: checkIfSignIn },
  { path: 'responses/:responseId', element: <ResponseDetailContainer />, loader: checkIfSignIn },
  {
    path: 'notifications',
    element: <Notifications />,
  },
  {
    path: 'users/:username',
    element: <UserPage />,
    loader: checkIfSignIn,
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
      { path: 'friends', element: <FriendsSettings /> },
    ],
  },
]);

function App() {
  useEffect(() => {
    reportWebVitals();
  }, []);

  const { setAppNotiPermission } = useBoundStore((state) => ({
    setAppNotiPermission: state.setAppNotiPermission,
  }));

  useGetAppMessage({
    cb: ({ value }) => {
      setAppNotiPermission(value);
    },
    key: 'SET_NOTI_PERMISSION',
  });

  return (
    <React.StrictMode>
      <GlobalStyle />
      <ThemeProvider theme={Colors}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </React.StrictMode>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
