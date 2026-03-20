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
    // Single-select: clicking an option selects only that one
    onChange([value]);
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
