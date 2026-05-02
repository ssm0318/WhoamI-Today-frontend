import Icon from '@components/_common/icon/Icon';
import { FeatureFlagKey } from '@constants/featureFlag';
import { useTrackEvent } from '@hooks/useTrackEvent';
import { useBoundStore } from '@stores/useBoundStore';

/**
 * Header entry-point for the browse-mode picker. Renders a plain eye icon
 * (`view`) — pupil + outline, no slash. The active mode is implicitly
 * visible via which bottom tabs are filtered, so we don't double up by
 * showing the mode's emoji here.
 *
 * Sized at 35 (~80% of the standard 44 used by neighbouring icons) so the
 * eye sits a touch smaller — hit-target is still well above the 24px
 * Material guideline. Color is the icon's own (#222222) — close enough
 * to the row's black; no override needed.
 *
 * Only renders when the BROWSE_MODE feature flag is on (Ver.W). Replaces
 * the earlier sidebar entry — discoverability + 1-tap access trumps the
 * cleaner header. Headers that include this button:
 *   - CommonHeader (Discover, etc.)
 *   - FriendsHeader
 *   - ChatsHeader
 *   - CheckInHeader
 */
function BrowseModeHeaderButton() {
  const featureFlags = useBoundStore((state) => state.featureFlags);
  const openPicker = useBoundStore((state) => state.openBrowseModePicker);
  const trackEvent = useTrackEvent();

  if (!featureFlags?.[FeatureFlagKey.BROWSE_MODE]) return null;

  const handleClick = () => {
    // Source distinguishes the header entry from the auto-prompt path —
    // both end up firing browse_mode_prompt_shown but knowing which
    // entry produced more picks is useful for the placement decision.
    trackEvent('browse_mode_header_button_tapped');
    openPicker();
  };

  // `view` is a plain pupil + eye outline (no slash). `view_alt` looked
  // similar but had an additional path that read as a strikethrough.
  return <Icon name="view" size={35} onClick={handleClick} />;
}

export default BrowseModeHeaderButton;
