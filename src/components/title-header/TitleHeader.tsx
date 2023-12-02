import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, SvgIcon, Typo } from '@design-system';
import { HeaderWrapper } from './TitleHeader.styled';

type TitleHeaderType = 'MAIN' | 'SUB';
interface TitleHeaderProps {
  title?: string | null;
  type?: TitleHeaderType;
  onGoBack?: () => void;
  RightComponent?: React.ReactNode;
}
/**
 *
 * 중앙에 title이 있는 헤더
 */
function TitleHeader({ title, type = 'MAIN', onGoBack, RightComponent }: TitleHeaderProps) {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
    onGoBack?.();
  };

  return (
    <HeaderWrapper>
      <Layout.FlexRow
        justifyContent="space-between"
        w="100%"
        alignItems="center"
        ph="default"
        pv={4}
      >
        <Layout.LayoutBase w={36} h={36}>
          <button type="button" onClick={handleGoBack}>
            <SvgIcon name="arrow_left" size={36} color="BLACK" />
          </button>
        </Layout.LayoutBase>
        {title && (
          <Typo type={type === 'MAIN' ? 'head-line' : 'title-large'} textAlign="center">
            {title}
          </Typo>
        )}
        <Layout.LayoutBase w={title && !RightComponent ? 36 : undefined}>
          {RightComponent && RightComponent}
        </Layout.LayoutBase>
      </Layout.FlexRow>
    </HeaderWrapper>
  );
}

export default TitleHeader;
