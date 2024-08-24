import { ReactNode } from 'react';
import { BOTTOM_TABBAR_HEIGHT } from '@constants/layout';
import { Layout } from '@design-system';
import { RootContainer } from '@styles/wrappers';

interface MainContainerProps {
  children: ReactNode;
}
function MainContainer({ children }: MainContainerProps) {
  return (
    <Layout.FlexRow justifyContent="center" bgColor="BLACK" w="100%" mb={BOTTOM_TABBAR_HEIGHT}>
      <RootContainer w="100%" bgColor="WHITE">
        {children}
      </RootContainer>
    </Layout.FlexRow>
  );
}

export default MainContainer;
