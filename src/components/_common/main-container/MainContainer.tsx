import { ReactNode } from 'react';
import { Layout } from '@design-system';
import { RootContainer } from '@styles/wrappers';

interface MainContainerProps {
  children: ReactNode;
}
function MainContainer({ children }: MainContainerProps) {
  return (
    <Layout.FlexRow justifyContent="center" bgColor="BLACK" h="100vh" w="100%">
      <RootContainer w="100%" h="100vh" bgColor="BASIC_WHITE">
        {children}
      </RootContainer>
    </Layout.FlexRow>
  );
}

export default MainContainer;
