import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import Icon from '@components/_common/icon/Icon';
import { Layout, SvgIcon, Typo } from '@design-system';
import { MyProfile } from '@models/api/user';
import { UserProfile } from '@models/user';
import InterestChip from '../interest/InterestChip';
import PersonaChip from '../persona/PersonaChip';

interface MoreAboutBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  user: UserProfile | MyProfile;
  username: string;
  isMyPage: boolean;
}

function MoreAboutBottomSheet({
  visible,
  onClose,
  user,
  username,
  isMyPage,
}: MoreAboutBottomSheetProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'user_page' });
  const navigate = useNavigate();

  const handleClickEdit = () => {
    onClose();
    navigate('/settings/edit-profile');
  };

  const interests = user?.user_interests ?? [];
  const personas = user?.user_personas ?? [];

  return (
    <BottomModal visible={visible} onClose={onClose}>
      <Layout.FlexCol w="100%" ph={16} pv={16} gap={16}>
        {/* Header */}
        <Layout.FlexRow w="100%" justifyContent="space-between" alignItems="center">
          <Layout.FlexRow alignItems="center">
            <Icon name="home_indicator" />
          </Layout.FlexRow>
        </Layout.FlexRow>
        <Layout.FlexRow w="100%" justifyContent="space-between" alignItems="center">
          <Typo type="title-large">{t('more_about', { username })}</Typo>
          {isMyPage && (
            <Layout.FlexRow onClick={handleClickEdit} style={{ cursor: 'pointer' }}>
              <SvgIcon name="edit_filled" fill="DARK_GRAY" size={20} />
            </Layout.FlexRow>
          )}
        </Layout.FlexRow>

        {/* Interests */}
        {interests.length > 0 && (
          <Layout.FlexCol gap={8}>
            <Typo type="label-medium" color="MEDIUM_GRAY">
              {t('interests')}
            </Typo>
            <Layout.FlexRow w="100%" gap={8} style={{ flexWrap: 'wrap' }}>
              {interests.map((interest) => (
                <InterestChip key={interest} interest={interest} />
              ))}
            </Layout.FlexRow>
          </Layout.FlexCol>
        )}

        {/* Personas */}
        {personas.length > 0 && (
          <Layout.FlexCol gap={8}>
            <Typo type="label-medium" color="MEDIUM_GRAY">
              {t('persona')}
            </Typo>
            <Layout.FlexRow w="100%" gap={8} style={{ flexWrap: 'wrap' }}>
              {personas.map((persona) => (
                <PersonaChip key={persona} persona={persona} />
              ))}
            </Layout.FlexRow>
          </Layout.FlexCol>
        )}
      </Layout.FlexCol>
    </BottomModal>
  );
}

export default MoreAboutBottomSheet;
