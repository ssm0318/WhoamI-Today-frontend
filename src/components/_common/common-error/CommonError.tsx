import { useTranslation } from 'react-i18next';
import NoContents from '@components/_common/no-contents/NoContents';

export default function CommonError() {
  const [t] = useTranslation('translation', { keyPrefix: 'no_contents.error' });
  return <NoContents title={t('title')} text={t('text')} />;
}
