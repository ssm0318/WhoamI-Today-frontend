import styled from 'styled-components';
import { Layout, Typo } from '@design-system';

interface Props {
  checked: boolean;
  onChange: (next: boolean) => void;
}

/**
 * Per-component opt-in: when checked, the editor stamps `*_archive_at = now + 24h`
 * on share so the component is hidden from other viewers after that. Lives below
 * the visibility chips inside each component editor (battery / mood / thought / song).
 */
function ArchiveAfter24hToggle({ checked, onChange }: Props) {
  return (
    <Wrapper as="label" alignItems="center" gap={8} mt={8}>
      <Checkbox type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <Typo type="label-large" color="DARK">
        Archive Check-in after 24 hours
      </Typo>
    </Wrapper>
  );
}

export default ArchiveAfter24hToggle;

const Wrapper = styled(Layout.FlexRow)`
  cursor: pointer;
  user-select: none;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  accent-color: ${({ theme }) => theme.PRIMARY};
  cursor: pointer;
  margin: 0;
`;
