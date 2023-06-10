import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Font, Layout } from '@design-system';

interface TheDaysWrapperProps {
  type: 'moments' | 'questions';
  children?: ReactNode;
}

function TheDaysWrapper({ type, children }: TheDaysWrapperProps) {
  const [t] = useTranslation('translation', { keyPrefix: 'the_days_detail' });

  return (
    <Layout.FlexCol w="100%">
      <Layout.FlexRow w="100%" justifyContent="center" alignItems="center">
        <Font.Display type="20_bold">{t(`${type}.title`)}</Font.Display>
      </Layout.FlexRow>
      {children}
    </Layout.FlexCol>
  );
}

export default TheDaysWrapper;
