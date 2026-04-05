import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import BottomModal from '@components/_common/bottom-modal/BottomModal';
import Icon from '@components/_common/icon/Icon';
import { Layout, SvgIcon, Typo } from '@design-system';
import { MyProfile } from '@models/api/user';
import { ALL_CATEGORIES, normalizeChipText } from '@models/chips';
import { UserProfile } from '@models/user';
import CategoryChip from '../chip/CategoryChip';

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

  const showChips = isMyPage || !user?.interests_friends_only;
  const allUserChips = showChips
    ? [
        ...(user?.user_interests ?? []).map((i) => i.replace(/^#+/, '')),
        ...(user?.user_personas ?? []).map((p) => p.replace(/^#+/, '')),
      ]
    : [];

  // Group chips by category
  const groupedByCategory = ALL_CATEGORIES.map((cat) => ({
    category: cat,
    chips: allUserChips.filter((chip) =>
      cat.chips.some((c) => normalizeChipText(c) === normalizeChipText(chip)),
    ),
  })).filter((group) => group.chips.length > 0);

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

        {/* Chips grouped by category */}
        {groupedByCategory.map(({ category, chips }) => (
          <Layout.FlexCol key={category.key} gap={6}>
            <Typo type="label-medium" color="MEDIUM_GRAY">
              {category.label}
            </Typo>
            <Layout.FlexRow w="100%" gap={8} style={{ flexWrap: 'wrap' }}>
              {chips.map((chip) => (
                <CategoryChip key={chip} label={chip} category={category.key} isSelected />
              ))}
            </Layout.FlexRow>
          </Layout.FlexCol>
        ))}
      </Layout.FlexCol>
    </BottomModal>
  );
}

export default MoreAboutBottomSheet;
