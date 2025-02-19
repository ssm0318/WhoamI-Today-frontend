import { ReactElement } from 'react';
import { Layout, Typo } from '@design-system';
import { HeaderWrapper } from './Header.styled';

interface MainHeaderProps {
  title: string;
  rightButtons: ReactElement;
}
/**
 * 좌측에 title, 우측에 버튼(들)이 있는 헤더
 */
function MainHeader({ title, rightButtons }: MainHeaderProps) {
  return (
    <HeaderWrapper>
      <Layout.FlexRow justifyContent="space-between" w="100%" h="100%" alignItems="center">
        <Layout.FlexRow>
          <Typo type="head-line">{title}</Typo>
        </Layout.FlexRow>
        <Layout.FlexRow gap={8} alignItems="center">
          {rightButtons}
        </Layout.FlexRow>
      </Layout.FlexRow>
    </HeaderWrapper>
  );
}

export default MainHeader;
