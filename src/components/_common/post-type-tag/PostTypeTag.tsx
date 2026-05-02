import { useTranslation } from 'react-i18next';
import { ColorKeys, Typo } from '@design-system';

export type PostTypeTagVariant = 'mission' | 'question';

// Avoid PRIMARY purple — already used heavily for nav, buttons, and mission
// composer chrome. Each variant gets its own non-purple accent color.
const TYPE_COLOR: Record<PostTypeTagVariant, ColorKeys> = {
  mission: 'TERTIARY_GREEN',
  question: 'TERTIARY_BLUE',
};

const TYPE_KEY: Record<PostTypeTagVariant, string> = {
  mission: 'mission',
  question: 'question',
};

interface Props {
  variant: PostTypeTagVariant;
}

function PostTypeTag({ variant }: Props) {
  const [t] = useTranslation('translation', { keyPrefix: 'post_type' });
  return (
    <Typo type="label-medium" color={TYPE_COLOR[variant]}>
      ✦ {t(TYPE_KEY[variant])}
    </Typo>
  );
}

export default PostTypeTag;
