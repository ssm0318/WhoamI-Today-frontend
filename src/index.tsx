import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Colors } from '@design-system';
import { useGetAppMessage } from '@hooks/useAppMessage';
import { useBoundStore } from '@stores/useBoundStore';
import GlobalStyle from '@styles/global-styles';
import { checkIfSignIn } from '@utils/apis/user';
import { ChatRoom } from 'src/routes/chat-room/ChatRoom';
import ErrorPage from './components/error-page/ErrorPage';
import './i18n';
import SpotifyManager from './libs/SpotifyManager';
import reportWebVitals from './reportWebVitals';
import AllQuestions from './routes/AllQuestions';
import Chats from './routes/Chats';
import CheckInEdit from './routes/check-in/CheckInEdit';
import MusicSearch from './routes/check-in/MusicSearch';
import ForgotPassword from './routes/ForgotPassword';
import FriendPage from './routes/FriendPage';
import EditFriends from './routes/friends/EditFriends';
import ExploreFriends from './routes/friends/ExploreFriends';
import Friends from './routes/friends/Friends';
import Intro from './routes/Intro';
import My from './routes/My';
import AllNotes from './routes/notes/AllNotes';
import NoteDetail from './routes/notes/NoteDetail';
import Notifications from './routes/Notifications';
import ShortAnswerResponse from './routes/response/ShortAnswerResponse';
import ResponseDetailContainer from './routes/response-detail/ResponseDetailContainer';
import ResponseHistory from './routes/ResponseHistory';
import Root from './routes/Root';
import ConfirmPassword from './routes/settings/ConfirmPassword';
import DeleteAccount from './routes/settings/DeleteAccount';
import EditProfile from './routes/settings/EditProfile';
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
        children: [{ path: ':roomId', element: <ChatRoom /> }],
      },
      {
        path: 'my',
        element: <My />,
      },
      {
        path: 'friends',
        children: [
          { path: '', element: <Friends /> },
          { path: 'explore', element: <ExploreFriends /> },
          { path: 'edit', element: <EditFriends /> },
        ],
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
  { path: 'responses/:responseId', element: <ResponseDetailContainer />, loader: checkIfSignIn },
  {
    path: 'notifications',
    element: <Notifications />,
  },
  {
    path: 'users/:username',
    loader: checkIfSignIn,
    element: <FriendPage />,
  },
  {
    path: 'check-in',
    loader: checkIfSignIn,
    children: [
      { path: 'edit', element: <CheckInEdit /> },
      { path: 'search-music', element: <MusicSearch /> },
    ],
  },
  {
    path: 'notes',
    loader: checkIfSignIn,
    children: [
      { path: '', element: <AllNotes /> },
      { path: ':noteId', element: <NoteDetail /> },
    ],
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

function App() {
  const spotifyManager = SpotifyManager.getInstance();

  const { setAppNotiPermission } = useBoundStore((state) => ({
    setAppNotiPermission: state.setAppNotiPermission,
  }));

  useGetAppMessage({
    cb: ({ value }) => {
      setAppNotiPermission(value);
    },
    key: 'SET_NOTI_PERMISSION',
  });

  useEffect(() => {
    reportWebVitals();
    spotifyManager.initialize();
  }, [spotifyManager]);

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
