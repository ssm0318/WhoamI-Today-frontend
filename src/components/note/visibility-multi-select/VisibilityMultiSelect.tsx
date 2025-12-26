import { useTranslation } from 'react-i18next';
import { Layout, SvgIcon, Typo } from '@design-system';
import { PostVisibility } from '@models/post';
import { StyledCheckBoxItem } from './VisibilityMultiSelect.styled';

interface VisibilityMultiSelectProps {
  availableVisibilities: PostVisibility[];
  selectedVisibilities: PostVisibility[];
  onChange: (visibilities: PostVisibility[]) => void;
}

function VisibilityMultiSelect({
  availableVisibilities,
  selectedVisibilities,
  onChange,
}: VisibilityMultiSelectProps) {
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
      {availableVisibilities.map((visibility) => (
        <StyledCheckBoxItem key={visibility} onClick={() => handleToggleVisibility(visibility)}>
          <SvgIcon
            name={
              selectedVisibilities.includes(visibility)
                ? 'circle_check_checked'
                : 'circle_check_unchecked'
            }
            size={24}
          />
          <Typo type="label-large">{t(`access_setting.${visibility.toLowerCase()}`) || ''}</Typo>
        </StyledCheckBoxItem>
      ))}
    </Layout.FlexCol>
  );
}

export default VisibilityMultiSelect;
