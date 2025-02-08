import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import MainContainer from '@components/_common/main-container/MainContainer';
import ToastBar from '@components/_common/toast-bar/ToastBar';
import ErrorPage from '@components/error-page/ErrorPage';
import { UserPageContextProvider } from '@components/user-page/UserPage.context';
import { Colors, Typo } from '@design-system';
import { useGetAppMessage } from '@hooks/useAppMessage';
import { useBoundStore } from '@stores/useBoundStore';
import GlobalStyle from '@styles/global-styles';
import { checkIfSignIn } from '@utils/apis/user';
import { ChatRoom } from 'src/routes/chat-room/ChatRoom';
import Ping from 'src/routes/ping/Ping';
import './i18n';
import SpotifyManager from './libs/SpotifyManager';
import reportWebVitals from './reportWebVitals';
import AllQuestions from './routes/AllQuestions';
import Chats from './routes/Chats';
import CheckInEdit from './routes/check-in/CheckInEdit';
import { EditChats } from './routes/edit-chats/EditChats';
import ForgotPassword from './routes/ForgotPassword';
import EditFriends from './routes/friends/EditFriends';
import ExploreFriends from './routes/friends/ExploreFriends';
import Friends from './routes/friends/Friends';
import Intro from './routes/Intro';
import My from './routes/My';
import AllNotes from './routes/notes/AllNotes';
import NewNote from './routes/notes/NewNote';
import { NoteDetail } from './routes/notes/NoteDetail';
import Notifications from './routes/Notifications';
import Reactions from './routes/Reactions';
import ReceivedPrompts from './routes/ReceivedPrompts';
import ResearchIntro from './routes/ResearchIntro';
import AllResponses from './routes/responses/AllResponses';
import NewResponse from './routes/responses/NewResponse';
import ResponseDetail from './routes/responses/ResponseDetail';
import Root from './routes/Root';
import ConfirmPassword from './routes/settings/ConfirmPassword';
import DailyNotiSetting from './routes/settings/DailyNotiSetting';
import DeleteAccount from './routes/settings/DeleteAccount';
import EditProfile from './routes/settings/EditProfile';
import ResetPassword from './routes/settings/ResetPassword';
import Settings from './routes/settings/Settings';
import Email from './routes/sign-up/Email';
import NotiSettings from './routes/sign-up/NotiSettings';
import Password from './routes/sign-up/Password';
import SignIn from './routes/SignIn';
import SignUp from './routes/SignUp';
import UserPage from './routes/UserPage';

const router = createBrowserRouter([
  // intro route
  { path: '', element: <Intro />, loader: checkIfSignIn },
  // research intro route (for research)
  { path: 'research-intro', element: <ResearchIntro /> },
  {
    // authorized routes
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: checkIfSignIn,
    children: [
      {
        path: 'chats',
        element: <Chats />,
        children: [
          { path: 'edit', element: <EditChats /> },
          { path: ':roomId', element: <ChatRoom /> },
        ],
      },
      {
        path: 'my',
        children: [
          { path: '', element: <My /> },
          { path: 'responses', element: <AllResponses from="my" /> },
        ],
      },
      {
        path: 'friends',
        children: [
          { path: '', element: <Friends /> },
          { path: 'explore', element: <ExploreFriends /> },
          { path: 'edit', element: <EditFriends /> },
        ],
      },
      {
        path: 'questions',
        children: [
          { path: '', element: <AllQuestions /> },
          { path: ':questionId/new', element: <NewResponse /> },
        ],
      },
      {
        path: 'notifications',
        children: [
          { path: '', element: <Notifications /> },
          { path: 'prompts', element: <ReceivedPrompts /> },
        ],
      },
      {
        path: 'users/:username',
        children: [
          {
            path: '',
            element: (
              <UserPageContextProvider>
                <UserPage />
              </UserPageContextProvider>
            ),
            children: [
              {
                path: 'responses',
                children: [
                  { path: '', element: <AllResponses from="user" /> },
                  { path: ':responseId', element: <ResponseDetail /> },
                ],
              },
              {
                path: 'notes',
                children: [{ path: ':noteId', element: <NoteDetail /> }],
              },
              {
                path: 'ping',
                element: <Ping />,
              },
            ],
          },
        ],
      },

      {
        path: 'check-in',
        children: [{ path: 'edit', element: <CheckInEdit /> }],
      },
      {
        path: 'notes',
        children: [
          { path: '', element: <AllNotes /> },
          { path: ':noteId', element: <NoteDetail /> },
          { path: ':noteId/reactions', element: <Reactions /> },
          { path: 'new', element: <NewNote /> },
        ],
      },
      {
        path: 'responses',
        children: [
          { path: ':responseId', element: <ResponseDetail /> },
          { path: ':responseId/reactions', element: <Reactions /> },
          { path: ':responseId/edit', element: <NewResponse /> },
        ],
      },
      {
        path: 'settings',
        children: [
          { path: '', element: <Settings /> },
          { path: 'edit-profile', element: <EditProfile /> },
          { path: 'confirm-password', element: <ConfirmPassword /> },
          { path: 'reset-password', element: <ResetPassword /> },
          { path: 'daily-noti-setting', element: <DailyNotiSetting /> },
          { path: 'delete-account', element: <DeleteAccount /> },
        ],
      },
    ],
  },
  {
    // non-authorized routes
    path: '/',
    element: (
      <MainContainer mb={0}>
        <Outlet />
      </MainContainer>
    ),
    children: [
      { path: 'signin', element: <SignIn /> },
      {
        path: 'signup',
        element: <SignUp />,
        children: [
          { path: 'email', element: <Email /> },
          { path: 'password', element: <Password /> },
          { path: 'noti-settings', element: <NotiSettings /> },
          { path: '', element: <Navigate replace to="email" /> },
        ],
      },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'reset-password/:id/:token', element: <ResetPassword /> },
    ],
  },
]);

function App() {
  const spotifyManager = SpotifyManager.getInstance();
  const { toast, closeToast } = useBoundStore((state) => ({
    toast: state.toast,
    closeToast: state.closeToast,
  }));
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
        {toast?.message && (
          <ToastBar
            text={toast.message}
            RightComponent={
              toast.action &&
              toast.actionText && (
                <button type="button" onClick={toast.action}>
                  <Typo type="title-medium">{toast.actionText}</Typo>
                </button>
              )
            }
            closeToastBar={closeToast}
          />
        )}
      </ThemeProvider>
    </React.StrictMode>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
