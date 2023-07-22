import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Font, Layout, SvgIcon } from '@design-system';
import { HeaderWrapper } from './TitleHeader.styled';

type TitleHeaderType = 'MAIN' | 'SUB';
interface TitleHeaderProps {
  title?: string | null;
  type?: TitleHeaderType;
  onGoBack?: () => void;
  RightComponent?: React.ReactNode;
}

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
        pv={10}
      >
        <Layout.LayoutBase w={36} h={36}>
          <button type="button" onClick={handleGoBack}>
            <SvgIcon name="arrow_left" size={36} color="BASIC_BLACK" />
          </button>
        </Layout.LayoutBase>
        {title && (
          <Font.Display type={type === 'MAIN' ? '24_bold' : '20_bold'} textAlign="center">
            {title}
          </Font.Display>
        )}
        <Layout.LayoutBase w={title && !RightComponent ? 36 : undefined}>
          {RightComponent && RightComponent}
        </Layout.LayoutBase>
      </Layout.FlexRow>
    </HeaderWrapper>
  );
}

export default TitleHeader;
