import styled from 'styled-components';
import { SvgIcon, Typo } from '@design-system';
import { ComponentVisibility } from '@models/checkIn';

interface Props {
  value: ComponentVisibility;
  onChange: (visibility: ComponentVisibility) => void;
}

const OPTIONS: {
  value: ComponentVisibility;
  label: string;
  svgIcon?: string;
  textIcon?: string;
}[] = [
  { value: ComponentVisibility.PUBLIC, label: 'Public', svgIcon: 'share_default' },
  { value: ComponentVisibility.FRIENDS, label: 'Friends', svgIcon: 'default_friend' },
  { value: ComponentVisibility.CLOSE_FRIENDS, label: 'Close', svgIcon: 'close_friend' },
  { value: ComponentVisibility.ONLY_ME, label: 'Only Me', textIcon: '\u{1F512}' },
];

function VisibilityToggle({ value, onChange }: Props) {
  return (
    <ToggleContainer>
      {OPTIONS.map((opt) => (
        <ToggleOption
          key={opt.value}
          $isSelected={value === opt.value}
          onClick={() => onChange(opt.value)}
        >
          {opt.svgIcon ? (
            <IconWrap $muted={value !== opt.value}>
              <SvgIcon name={opt.svgIcon as any} size={12} />
            </IconWrap>
          ) : (
            <TextIcon $muted={value !== opt.value}>{opt.textIcon}</TextIcon>
          )}
          <Typo
            type="label-small"
            color={value === opt.value ? 'PRIMARY' : 'MEDIUM_GRAY'}
            fontWeight={value === opt.value ? 600 : 400}
          >
            {opt.label}
          </Typo>
        </ToggleOption>
      ))}
    </ToggleContainer>
  );
}

const ToggleContainer = styled.div`
  display: flex;
  gap: 4px;
  background-color: ${({ theme }) => theme.BACKGROUND_COLOR};
  border-radius: 8px;
  padding: 2px;
`;

const ToggleOption = styled.div<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 4px 6px;
  border-radius: 6px;
  cursor: pointer;
  background-color: ${({ $isSelected, theme }) => ($isSelected ? theme.WHITE : 'transparent')};
  border: 1px solid ${({ $isSelected, theme }) => ($isSelected ? theme.PRIMARY : 'transparent')};
  transition: all 0.15s ease;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
`;

const IconWrap = styled.span<{ $muted: boolean }>`
  display: flex;
  align-items: center;
  opacity: ${({ $muted }) => ($muted ? 0.4 : 0.7)};
  filter: ${({ $muted }) => ($muted ? 'grayscale(1)' : 'grayscale(1)')};
`;

const TextIcon = styled.span<{ $muted: boolean }>`
  font-size: 10px;
  opacity: ${({ $muted }) => ($muted ? 0.4 : 0.7)};
  filter: grayscale(1);
`;

export default VisibilityToggle;
