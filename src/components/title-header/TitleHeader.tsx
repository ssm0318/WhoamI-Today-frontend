import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Font, Layout, SvgIcon } from '@design-system';
import { HeaderWrapper } from './TitleHeader.styled';

interface TitleHeaderProps {
  title: string;
  onGoBack?: () => void;
  RightComponent?: React.ReactNode;
}

function TitleHeader({ title, onGoBack, RightComponent }: TitleHeaderProps) {
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
            <SvgIcon name="arrow_left" size={36} />
          </button>
        </Layout.LayoutBase>
        <Font.Display type="24_bold">{title}</Font.Display>
        <Layout.LayoutBase w={36} h={36}>
          {RightComponent && RightComponent}
        </Layout.LayoutBase>
      </Layout.FlexRow>
    </HeaderWrapper>
  );
}

export default TitleHeader;
