import { useTranslation } from 'react-i18next';
import { Layout, Typo } from '@design-system';
import { MutualTrait } from '@models/user';

interface MutualTraitsPreviewProps {
  mutualTraits: MutualTrait[];
  userTraits: string[];
  onClick: () => void;
}

interface PreviewParts {
  prefix: string | null;
  content: string;
}

function MutualTraitsPreview({ mutualTraits, userTraits, onClick }: MutualTraitsPreviewProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'user_page' });

  const getPreviewParts = (): PreviewParts | null => {
    if (mutualTraits.length > 0) {
      const count = mutualTraits.length;
      const prefix = t('mutual_identities.prefix', { count });
      const firstTrait = mutualTraits[0].content;
      if (count === 1) return { prefix, content: firstTrait };
      const secondTrait = mutualTraits[1].content;
      if (count === 2)
        return { prefix, content: t('mutual_identities.content_two', { firstTrait, secondTrait }) };
      return {
        prefix,
        content: t('mutual_identities.content_others', {
          firstTrait,
          secondTrait,
          others: count - 2,
        }),
      };
    }

    if (userTraits.length === 0) return null;
    const firstTrait = userTraits[0];
    const prefix = t('identities.prefix');
    if (userTraits.length === 1) return { prefix, content: firstTrait };
    if (userTraits.length === 2) return { prefix, content: `${firstTrait}, ${userTraits[1]}` };
    return {
      prefix: t('identities.prefix'),
      content: t('identities.content_others', { firstTrait, secondTrait: userTraits[1] }),
    };
  };

  const parts = getPreviewParts();
  if (!parts) return null;

  return (
    <Layout.FlexRow alignItems="center" gap={4} onClick={onClick} style={{ cursor: 'pointer' }}>
      <Layout.FlexRow alignItems="center">
        {parts.prefix && (
          <Typo type="label-medium" color="PRIMARY">
            {`${parts.prefix} `}
          </Typo>
        )}
        <Typo type="label-medium" color="PRIMARY" underline>
          {parts.content}
        </Typo>
      </Layout.FlexRow>
    </Layout.FlexRow>
  );
}

export default MutualTraitsPreview;
