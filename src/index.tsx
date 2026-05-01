import * as Sentry from '@sentry/react';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import MainContainer from '@components/_common/main-container/MainContainer';
import ToastBar from '@components/_common/toast-bar/ToastBar';
import ErrorPage from '@components/error-page/ErrorPage';
import { UserPageContextProvider } from '@components/user-page/UserPage.context';
import VersionGuard from '@components/version-guard/VersionGuard';
import { Colors, Typo } from '@design-system';
import { useGetAppMessage } from '@hooks/useAppMessage';
import { VersionType } from '@models/api/user';
import { useBoundStore } from '@stores/useBoundStore';
import GlobalStyle from '@styles/global-styles';
import { checkIfSignIn } from '@utils/apis/user';
import AddGroupMembers from 'src/routes/chat/AddGroupMembers';
import Chat from 'src/routes/chat/Chat';
import ChatList from 'src/routes/chat/ChatList';
import ChatSearch from 'src/routes/chat/ChatSearch';
import CreateGroupChat from 'src/routes/chat/CreateGroupChat';
import GroupChat from 'src/routes/chat/GroupChat';
import { NotFound } from 'src/routes/NotFound';
import './i18n';
import PhotoOfTheDayFlow from './components/share/PhotoOfTheDayFlow';
import SpotifyManager from './libs/SpotifyManager';
import reportWebVitals from './reportWebVitals';
import ActivateEmail from './routes/ActivateEmail';
import AllQuestions from './routes/AllQuestions';
// Chats tab now uses ChatList directly
import Archive from './routes/check-in/Archive';
import CheckInEdit from './routes/check-in/CheckInEdit';
import FriendPinnedSnippets from './routes/check-in-posts/FriendPinnedSnippets';
import MySnippetsArchive from './routes/check-in-posts/MySnippetsArchive';
import NewCheckInPost from './routes/check-in-posts/NewCheckInPost';
import Discover from './routes/discover/Discover';
import EmailVerificationComplete from './routes/EmailVerificationComplete';
import ForgotPassword from './routes/ForgotPassword';
import DefaultMyFriendsList from './routes/friends/DefaultMyFriendsList';
import DefaultUserFriendsList from './routes/friends/DefaultUserFriendsList';
import EditFriends from './routes/friends/EditFriends';
import ExploreFriends from './routes/friends/ExploreFriends';
import FriendNewPosts from './routes/friends/FriendNewPosts';
import FriendPinnedFeed from './routes/friends/FriendPinnedFeed';
import FriendsFeed from './routes/friends/FriendsFeed';
import FriendsList from './routes/friends/FriendsList';
import HiddenFriends from './routes/friends/HiddenFriends';
import Intro from './routes/Intro';
import Likes from './routes/Likes';
import My from './routes/My';
import AllNotes from './routes/notes/AllNotes';
import NewNote from './routes/notes/NewNote';
import { NoteDetail } from './routes/notes/NoteDetail';
import Notifications from './routes/Notifications';
// PingList replaced by ChatList
import PinnedPosts from './routes/pinned-posts/PinnedPosts';
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
import VersionSwitchRequest from './routes/settings/VersionSwitchRequest';
import Share from './routes/share/Share';
import Email from './routes/sign-up/Email';
import Info from './routes/sign-up/Info';
import NotiSettings from './routes/sign-up/NotiSettings';
import Password from './routes/sign-up/Password';
import SignIn from './routes/SignIn';
import SignUp from './routes/SignUp';
import SuggestQuestions from './routes/SuggestQuestions';
import SurveyAnswer from './routes/surveys/SurveyAnswer';
import SurveyResults from './routes/surveys/SurveyResults';
import SurveysIndex from './routes/surveys/SurveysIndex';
import UpdateCheckin from './routes/update/UpdateCheckin';
import UserPage from './routes/UserPage';
import ViewAsPage from './routes/ViewAsPage';
import WidgetInstallGuide from './routes/widget-install-guide/WidgetInstallGuide';
import WidgetInstallGuidePreview from './routes/widget-install-guide/WidgetInstallGuidePreview';

const router = createBrowserRouter([
  // intro route
  { path: '', element: <Intro />, loader: checkIfSignIn },
  // research intro route (for research)
  { path: 'research-intro', element: <ResearchIntro /> },
  // dev preview — no auth required
  { path: 'test/widget-install-guide', element: <WidgetInstallGuidePreview /> },
  // question suggestion
  { path: 'suggest-questions', element: <SuggestQuestions /> },
  {
    // authorized routes
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: checkIfSignIn,
    children: [
      {
        path: 'chats',
        element: <ChatList />,
      },
      {
        path: 'chats/search',
        element: <ChatSearch />,
      },
      {
        path: 'chats/new-group',
        element: <CreateGroupChat />,
      },
      {
        path: 'chats/group/:roomId',
        element: <GroupChat />,
      },
      {
        path: 'chats/group/:roomId/add-members',
        element: <AddGroupMembers />,
      },
      {
        path: 'my',
        children: [
          { path: '', element: <My /> },
          { path: 'chats', element: <ChatList /> },
          { path: 'friends/list', element: <DefaultMyFriendsList /> },
          { path: 'pinned-posts', element: <PinnedPosts /> },
          { path: 'responses', element: <AllResponses from="my" /> },
          { path: 'view-as', element: <ViewAsPage /> },
        ],
      },
      {
        path: 'friends',
        children: [
          {
            path: '',
            element: (
              <VersionGuard allowedVersions={[VersionType.VER_W]}>
                <FriendsList />
              </VersionGuard>
            ),
          },
          { path: 'explore', element: <ExploreFriends /> },
          { path: 'edit', element: <EditFriends /> },
          {
            path: 'hidden',
            element: (
              <VersionGuard allowedVersions={[VersionType.VER_W]}>
                <HiddenFriends />
              </VersionGuard>
            ),
          },
          { path: ':username/new-posts', element: <FriendNewPosts /> },
        ],
      },
      {
        path: 'friends-q',
        element: <Navigate to="/feed" replace />,
      },
      {
        path: 'discover',
        element: (
          <VersionGuard allowedVersions={[VersionType.VER_W, VersionType.VER_Q]}>
            <Discover />
          </VersionGuard>
        ),
      },
      {
        path: 'feed',
        element: (
          <VersionGuard allowedVersions={[VersionType.VER_Q]}>
            <FriendsFeed />
          </VersionGuard>
        ),
      },
      {
        path: 'check-in-posts/new',
        element: (
          <VersionGuard allowedVersions={[VersionType.VER_Q]}>
            <NewCheckInPost />
          </VersionGuard>
        ),
      },
      {
        path: 'check-in-posts/archive',
        element: (
          <VersionGuard allowedVersions={[VersionType.VER_Q]}>
            <MySnippetsArchive />
          </VersionGuard>
        ),
      },
      {
        path: 'share',
        element: (
          <VersionGuard allowedVersions={[VersionType.VER_W, VersionType.VER_Q]}>
            <Outlet />
          </VersionGuard>
        ),
        children: [
          { path: '', element: <Share /> },
          { path: 'photo', element: <PhotoOfTheDayFlow /> },
        ],
      },
      {
        path: 'surveys',
        element: (
          <VersionGuard allowedVersions={[VersionType.VER_W, VersionType.VER_Q]}>
            <Outlet />
          </VersionGuard>
        ),
        children: [
          { path: '', element: <SurveysIndex /> },
          { path: ':slug/results', element: <SurveyResults /> },
          { path: ':slug/answer', element: <SurveyAnswer /> },
        ],
      },
      {
        path: 'update',
        children: [{ path: '', element: <UpdateCheckin /> }],
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
            path: 'chat',
            element: <Chat />,
          },
          {
            path: 'check-in/pinned',
            element: <FriendPinnedFeed />,
          },
          {
            path: 'snippets/pinned',
            element: <FriendPinnedSnippets />,
          },
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
              { path: ':responseId/likes', element: <Likes /> },
              {
                path: 'notes',
                children: [
                  { path: ':noteId', element: <NoteDetail /> },
                  { path: ':noteId/likes', element: <Likes /> },
                ],
              },
              { path: 'friends/list', element: <DefaultUserFriendsList /> },
              { path: 'pinned-posts', element: <PinnedPosts /> },
            ],
          },
        ],
      },
      {
        path: 'check-in',
        children: [
          // DEPRECATED: /check-in/edit is no longer linked from anywhere in the
          // app. The Check-In bottom tab (`/update`) is the supported flow.
          // Route kept only for any legacy bookmarks; do NOT navigate here.
          { path: 'edit', element: <CheckInEdit /> },
          { path: 'archive', element: <Archive /> },
        ],
      },
      {
        path: 'comments/:commentId/likes',
        element: <Likes />,
      },
      {
        path: 'notes',
        children: [
          { path: '', element: <AllNotes /> },
          { path: ':noteId', element: <NoteDetail /> },
          { path: ':noteId/likes', element: <Likes /> },
          { path: ':noteId/reactions', element: <Reactions /> },
          { path: 'new', element: <NewNote /> },
        ],
      },
      {
        path: 'responses',
        children: [
          { path: ':responseId', element: <ResponseDetail /> },
          { path: ':noteId/likes', element: <Likes /> },
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
          { path: 'version-switch-request', element: <VersionSwitchRequest /> },
        ],
      },
      {
        path: 'widget-install-guide',
        element: <WidgetInstallGuide />,
      },
      {
        path: '*',
        element: <NotFound />,
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
          { path: 'info', element: <Info /> },
          { path: 'noti-settings', element: <NotiSettings /> },
          { path: '', element: <Navigate replace to="email" /> },
        ],
      },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'activate/:uidb64/:token', element: <ActivateEmail /> },
      { path: 'email-verification-complete', element: <EmailVerificationComplete /> },
      { path: 'reset-password/:id/:token', element: <ResetPassword /> },
    ],
  },
]);

Sentry.init({
  dsn: 'https://43afe4ecf8a882b0e5cccb39f876b4b8@o4508942221705216.ingest.us.sentry.io/4509065127002112',
  integrations: (defaults) =>
    defaults.filter((integration) => integration.name !== 'BrowserTracing'),
  tracesSampleRate: 0,
  enabled: false, // Disabled to prevent unnecessary logging, enable if needed
});

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
            key={toast.id ?? toast.message}
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
