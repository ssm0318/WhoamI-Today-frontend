import { useTranslation } from 'react-i18next';
import { Layout, SvgIcon, Typo } from '@design-system';
import { PostVisibility } from '@models/post';
import { StyledCheckBoxItem } from './VisibilityMultiSelect.styled';

interface VisibilityMultiSelectProps {
  selectedVisibilities: PostVisibility[];
  onChange: (visibilities: PostVisibility[]) => void;
}

function VisibilityMultiSelect({ selectedVisibilities, onChange }: VisibilityMultiSelectProps) {
  const [t] = useTranslation('translation');

  const handleToggleVisibility = (value: PostVisibility) => {
    if (selectedVisibilities.includes(value)) {
      // 체크 해제된 경우 배열에서 제거
      if (value === PostVisibility.FRIENDS) {
        // Friends를 해제할 때는 Friends만 제거 (Close Friends는 유지)
        onChange(selectedVisibilities.filter((v) => v !== PostVisibility.FRIENDS));
        return;
      }
      onChange(selectedVisibilities.filter((v) => v !== value));
      return;
    }

    // 체크된 경우 배열에 추가
    if (value === PostVisibility.FRIENDS) {
      // Friends를 선택할 때는 Close Friends도 자동으로 선택
      const newVisibilities = [...selectedVisibilities, PostVisibility.FRIENDS];
      if (!newVisibilities.includes(PostVisibility.CLOSE_FRIENDS)) {
        newVisibilities.push(PostVisibility.CLOSE_FRIENDS);
      }
      onChange(newVisibilities);
      return;
    }

    onChange([...selectedVisibilities, value]);
  };

  return (
    <Layout.FlexCol gap={4} w="100%">
      <StyledCheckBoxItem onClick={() => handleToggleVisibility(PostVisibility.FRIENDS)}>
        <SvgIcon
          name={
            selectedVisibilities.includes(PostVisibility.FRIENDS)
              ? 'circle_check_checked'
              : 'circle_check_unchecked'
          }
          size={24}
        />
        <Typo type="label-large">{t('access_setting.friend') || ''}</Typo>
      </StyledCheckBoxItem>
      <StyledCheckBoxItem onClick={() => handleToggleVisibility(PostVisibility.CLOSE_FRIENDS)}>
        <SvgIcon
          name={
            selectedVisibilities.includes(PostVisibility.CLOSE_FRIENDS)
              ? 'circle_check_checked'
              : 'circle_check_unchecked'
          }
          size={24}
        />
        <Typo type="label-large">{t('access_setting.close_friend') || ''}</Typo>
      </StyledCheckBoxItem>
      <StyledCheckBoxItem onClick={() => handleToggleVisibility(PostVisibility.FOLLOWER)}>
        <SvgIcon
          name={
            selectedVisibilities.includes(PostVisibility.FOLLOWER)
              ? 'circle_check_checked'
              : 'circle_check_unchecked'
          }
          size={24}
        />
        <Typo type="label-large">{t('access_setting.follower') || ''}</Typo>
      </StyledCheckBoxItem>
      <StyledCheckBoxItem onClick={() => handleToggleVisibility(PostVisibility.PUBLIC)}>
        <SvgIcon
          name={
            selectedVisibilities.includes(PostVisibility.PUBLIC)
              ? 'circle_check_checked'
              : 'circle_check_unchecked'
          }
          size={24}
        />
        <Typo type="label-large">{t('access_setting.public') || ''}</Typo>
      </StyledCheckBoxItem>
    </Layout.FlexCol>
  );
}

export default VisibilityMultiSelect;
