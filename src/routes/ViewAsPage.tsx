import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { UserPageContextProvider } from '@components/user-page/UserPage.context';
import { PreviewModeProvider } from '@components/view-as/PreviewModeContext';
import ViewAsBanner from '@components/view-as/ViewAsBanner';
import ViewAsPicker, { ViewAsSelection } from '@components/view-as/ViewAsPicker';
import { Layout } from '@design-system';
import { useTrackEvent } from '@hooks/useTrackEvent';
import { isVisibilityTier, VisibilityTier } from '@models/viewAs';
import { useBoundStore } from '@stores/useBoundStore';
import UserPage from './UserPage';

const DEFAULT_TIER: VisibilityTier = 'public';

function ViewAsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawAs = searchParams.get('as');
  const rawUser = searchParams.get('view_as_user');

  const viewAsUser = rawUser && rawUser.trim() !== '' ? rawUser : null;
  const tier: VisibilityTier | null = viewAsUser
    ? null
    : isVisibilityTier(rawAs)
    ? rawAs
    : DEFAULT_TIER;

  const { myProfile } = useBoundStore(useShallow((state) => ({ myProfile: state.myProfile })));
  const [pickerVisible, setPickerVisible] = useState(false);
  const trackEvent = useTrackEvent();
  // Tracks distinct audiences viewed during this mount cycle (Set of
  // canonical strings: 'tier:public', 'user:alice', etc.). On unmount
  // we report the count so research can answer "how many different
  // audiences did the user check in one View-as session?" — a privacy-
  // anxiety signal that no individual event captures.
  const audiencesTriedRef = useRef<Set<string>>(new Set());
  // Lets us measure dwell PER audience switch — flushed on every audience
  // change and on unmount.
  const audienceStartedAtRef = useRef<number>(Date.now());
  const previousAudienceKeyRef = useRef<string | null>(null);

  const handleOpenPicker = () => {
    trackEvent('view_as_picker_opened');
    setPickerVisible(true);
  };
  const handleClosePicker = () => setPickerVisible(false);

  const handleSelect = (selection: ViewAsSelection) => {
    if (selection.kind === 'tier') {
      setSearchParams({ as: selection.tier }, { replace: true });
    } else {
      setSearchParams({ view_as_user: selection.username }, { replace: true });
    }
  };

  // Fire `_audience_changed` whenever the URL search params resolve to a
  // new audience (initial mount + every picker selection). Also flush a
  // dwell event for the previous audience so we can compute "time spent
  // looking at each audience's view" — a stronger engagement signal than
  // 'just opened the page once'.
  useEffect(() => {
    const audienceKey = viewAsUser ? `user:${viewAsUser}` : tier ? `tier:${tier}` : null;
    if (!audienceKey) return;
    // Skip the no-op when the resolved audience is identical to the
    // previous one (defensive — searchParam changes can re-fire).
    if (previousAudienceKeyRef.current === audienceKey) return;

    // Flush dwell for the previous audience (if any) before switching.
    if (previousAudienceKeyRef.current) {
      const duration_ms = Date.now() - audienceStartedAtRef.current;
      if (duration_ms >= 500) {
        trackEvent('view_as_audience_dwell', {
          audience_key: previousAudienceKeyRef.current,
          duration_ms,
        });
      }
    }

    audiencesTriedRef.current.add(audienceKey);
    audienceStartedAtRef.current = Date.now();
    previousAudienceKeyRef.current = audienceKey;

    trackEvent('view_as_audience_changed', {
      kind: viewAsUser ? 'user' : 'tier',
      // For tier picks the audience is just 'public' (only tier we expose);
      // for user picks, dropping the username keeps the param low-cardinality
      // for Firebase. The user-level identity isn't analytically useful
      // anyway — what matters is "user picked a specific friend" vs "public".
      ...(tier ? { tier } : {}),
    });
  }, [tier, viewAsUser, trackEvent]);

  // On unmount: flush dwell for the currently-viewed audience + emit a
  // session summary with the distinct audience count.
  useEffect(() => {
    return () => {
      if (previousAudienceKeyRef.current) {
        const duration_ms = Date.now() - audienceStartedAtRef.current;
        if (duration_ms >= 500) {
          trackEvent('view_as_audience_dwell', {
            audience_key: previousAudienceKeyRef.current,
            duration_ms,
          });
        }
      }
      // Reading .size at unmount IS the intent — the Set accumulates
      // across the mount cycle, so snapshotting it at effect-setup time
      // would always give 0.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const audiencesTried = audiencesTriedRef.current.size;
      trackEvent('view_as_session_ended', { audiences_tried: audiencesTried });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!myProfile?.username) return null;

  return (
    <PreviewModeProvider viewAs={tier} viewAsUser={viewAsUser}>
      <Layout.FlexCol w="100%">
        <ViewAsBanner tier={tier} viewAsUser={viewAsUser} onChange={handleOpenPicker} />
        <UserPageContextProvider usernameOverride={myProfile.username}>
          <UserPage usernameOverride={myProfile.username} />
        </UserPageContextProvider>
      </Layout.FlexCol>
      <ViewAsPicker visible={pickerVisible} onClose={handleClosePicker} onSelect={handleSelect} />
    </PreviewModeProvider>
  );
}

export default ViewAsPage;
