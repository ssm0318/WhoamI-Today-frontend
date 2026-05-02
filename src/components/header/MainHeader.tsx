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
        {/* gap=5 (down from 8) so the eye-icon entry sits visually
            grouped with notification / hamburger rather than free-floating. */}
        <Layout.FlexRow gap={5} alignItems="center">
          {rightButtons}
        </Layout.FlexRow>
      </Layout.FlexRow>
    </HeaderWrapper>
  );
}

export default MainHeader;
