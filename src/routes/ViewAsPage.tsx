import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { UserPageContextProvider } from '@components/user-page/UserPage.context';
import { PreviewModeProvider } from '@components/view-as/PreviewModeContext';
import ViewAsBanner from '@components/view-as/ViewAsBanner';
import ViewAsPicker, { ViewAsSelection } from '@components/view-as/ViewAsPicker';
import { Layout } from '@design-system';
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

  const handleOpenPicker = () => setPickerVisible(true);
  const handleClosePicker = () => setPickerVisible(false);

  const handleSelect = (selection: ViewAsSelection) => {
    if (selection.kind === 'tier') {
      setSearchParams({ as: selection.tier }, { replace: true });
    } else {
      setSearchParams({ view_as_user: selection.username }, { replace: true });
    }
  };

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
