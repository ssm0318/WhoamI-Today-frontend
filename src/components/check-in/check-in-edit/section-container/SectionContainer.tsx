import { PropsWithChildren } from 'react';
import { Layout, Typo } from '@design-system';

interface SectionContainerProps extends PropsWithChildren {
  title: string;
  description: string;
}

function SectionContainer({ children, title, description }: SectionContainerProps) {
  return (
    <Layout.FlexCol
      justifyContent="flex-start"
      w="100%"
      bgColor="WHITE"
      rounded={12}
      p={12}
      gap={8}
      style={{
        flexShrink: 0,
        minHeight: 'fit-content',
      }}
    >
      <Typo type="title-large">{title}</Typo>
      <Typo type="body-small" color="DARK_GRAY">
        {description}
      </Typo>
      {children}
    </Layout.FlexCol>
  );
}

export default SectionContainer;
