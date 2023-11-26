import { PropsWithChildren } from 'react';
import { Font, Layout } from '@design-system';

interface SectionContainerProps extends PropsWithChildren {
  title: string;
  description: string;
}

function SectionContainer({ children, title, description }: SectionContainerProps) {
  return (
    <Layout.FlexCol
      justifyContent="space-between"
      w="100%"
      bgColor="BASIC_WHITE"
      rounded={12}
      p={12}
    >
      <Font.Body type="20_semibold">{title}</Font.Body>
      <Font.Body type="12_semibold" color="GRAY_3">
        {description}
      </Font.Body>
      {children}
    </Layout.FlexCol>
  );
}

export default SectionContainer;
