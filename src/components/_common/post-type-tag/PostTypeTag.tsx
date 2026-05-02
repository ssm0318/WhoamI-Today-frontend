import { useTranslation } from 'react-i18next';
import { ColorKeys, Typo } from '@design-system';

export type PostTypeTagVariant = 'mission' | 'photo' | 'question' | 'regular';

const TYPE_COLOR: Record<PostTypeTagVariant, ColorKeys> = {
  mission: 'PRIMARY',
  photo: 'TERTIARY_PINK',
  question: 'TERTIARY_BLUE',
  regular: 'DARK_GRAY',
};

const TYPE_KEY: Record<PostTypeTagVariant, string> = {
  mission: 'mission',
  photo: 'photo',
  question: 'question',
  regular: 'regular',
};

interface Props {
  variant: PostTypeTagVariant;
}

function PostTypeTag({ variant }: Props) {
  const [t] = useTranslation('translation', { keyPrefix: 'post_type' });
  return (
    <Typo type="label-medium" color={TYPE_COLOR[variant]}>
      {t(TYPE_KEY[variant])}
    </Typo>
  );
}

export default PostTypeTag;
