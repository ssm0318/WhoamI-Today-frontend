import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Colors, Layout, Typo } from '@design-system';
import { WordcloudDistribution } from '@models/survey';

const Cloud = styled(Layout.FlexRow)`
  width: 100%;
  flex-wrap: wrap;
  gap: 8px 12px;
  align-items: baseline;
`;

const Token = styled.span<{ size: number; isViewer: boolean }>`
  font-size: ${({ size }) => size}px;
  font-weight: ${({ isViewer }) => (isViewer ? 600 : 500)};
  color: ${({ isViewer }) => (isViewer ? Colors.PRIMARY : Colors.DARK_GRAY)};
  line-height: 1.1;
`;

const Footnote = styled.div`
  margin-top: 12px;
  font-size: 12px;
  color: ${Colors.MEDIUM_GRAY};
`;

interface Props {
  distribution: WordcloudDistribution;
}

const MIN_SIZE = 14;
const MAX_SIZE = 32;

export function WordcloudRenderer({ distribution }: Props) {
  const { t } = useTranslation('translation', { keyPrefix: 'surveys' });

  if (distribution.tokens.length === 0) {
    return (
      <Layout.FlexCol gap={4} w="100%">
        <Typo type="body-medium" color="DARK_GRAY">
          {t('wordcloud.empty')}
        </Typo>
        {distribution.suppressed_token_count > 0 && (
          <Footnote>
            {t('wordcloud.suppressed', {
              count: distribution.suppressed_token_count,
              min: distribution.min_token_frequency,
            })}
          </Footnote>
        )}
      </Layout.FlexCol>
    );
  }

  const maxCount = Math.max(...distribution.tokens.map((entry) => entry.count));
  const minCount = Math.min(...distribution.tokens.map((entry) => entry.count));
  const range = Math.max(1, maxCount - minCount);
  const viewerSet = new Set(distribution.viewer_tokens);

  return (
    <Layout.FlexCol gap={8} w="100%">
      <Cloud>
        {distribution.tokens.map(({ token, count }) => {
          const ratio = (count - minCount) / range;
          const size = MIN_SIZE + ratio * (MAX_SIZE - MIN_SIZE);
          return (
            <Token key={token} size={size} isViewer={viewerSet.has(token)}>
              {token}
            </Token>
          );
        })}
      </Cloud>
      {distribution.suppressed_token_count > 0 && (
        <Footnote>
          {t('wordcloud.suppressed', {
            count: distribution.suppressed_token_count,
            min: distribution.min_token_frequency,
          })}
        </Footnote>
      )}
    </Layout.FlexCol>
  );
}
