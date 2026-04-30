import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Colors, Layout, Typo } from '@design-system';
import { BucketResult, SuppressedReason } from '@models/survey';

import { SuppressedBucketPlaceholder } from './SuppressedBucketPlaceholder';
import { SurveyResultsChart } from './SurveyResultsChart';

const Section = styled(Layout.FlexCol)`
  width: 100%;
  gap: 8px;
  border: 1px solid ${Colors.LIGHT_GRAY};
  border-radius: 12px;
  background: ${Colors.WHITE};
  padding: 16px;
`;

interface Props {
  title: string;
  available: boolean;
  reason: SuppressedReason;
  bucket: BucketResult | null;
  interpretation?: string;
}

export function SurveyResultsBucket({ title, available, reason, bucket, interpretation }: Props) {
  const { t } = useTranslation('translation', { keyPrefix: 'surveys' });
  return (
    <Section>
      <Typo type="title-medium" color="BLACK">
        {title}
      </Typo>
      {available && bucket ? (
        <>
          <Typo type="label-large" color="DARK_GRAY">
            {t('n_responders', { n: bucket.n })}
          </Typo>
          <SurveyResultsChart distribution={bucket.distribution} />
          {bucket.user_percentile !== null && (
            <Typo type="body-medium" color="DARK_GRAY">
              {t('your_percentile', { p: Math.round(bucket.user_percentile * 100) })}
            </Typo>
          )}
          {interpretation && (
            <Typo type="body-medium" color="BLACK">
              {interpretation}
            </Typo>
          )}
        </>
      ) : (
        <SuppressedBucketPlaceholder reason={reason} />
      )}
    </Section>
  );
}
