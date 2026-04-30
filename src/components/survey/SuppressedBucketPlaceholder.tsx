import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { PlaceholderWrapper } from '@components/profile/placeholders/Placeholder.styled';
import { Colors, Typo } from '@design-system';
import { SuppressedReason } from '@models/survey';

const Wrapper = styled(PlaceholderWrapper)`
  padding: 16px;
  border-color: ${Colors.LIGHT_GRAY};
  width: 100%;
`;

const REASON_TO_KEY: Record<NonNullable<SuppressedReason>, string> = {
  too_few_friends: 'reasons.too_few_friends',
  too_few_responders: 'reasons.too_few_responders',
  too_few_close_friends: 'reasons.too_few_close_friends',
  delta_too_small: 'reasons.delta_too_small',
};

interface Props {
  reason: SuppressedReason;
}

export function SuppressedBucketPlaceholder({ reason }: Props) {
  const { t } = useTranslation('translation', { keyPrefix: 'surveys' });
  if (!reason) return null;
  return (
    <Wrapper>
      <Typo type="body-medium" color="DARK_GRAY">
        {t(REASON_TO_KEY[reason])}
      </Typo>
    </Wrapper>
  );
}
