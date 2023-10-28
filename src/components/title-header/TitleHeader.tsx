import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Font, Layout, SvgIcon } from '@design-system';
import { HeaderWrapper } from './TitleHeader.styled';

type TitleHeaderType = 'MAIN' | 'SUB';
interface TitleHeaderProps {
  title?: string | null;
  type?: TitleHeaderType;
  onGoBack?: () => void;
  onClose?: () => void;
  RightComponent?: React.ReactNode;
}

function TitleHeader({
  title,
  type = 'MAIN',
  onGoBack,
  onClose,
  RightComponent,
}: TitleHeaderProps) {
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
        {onClose ? (
          <button type="button" onClick={onClose}>
            <SvgIcon name="close" size={24} color="BASIC_BLACK" />
          </button>
        ) : (
          <button type="button" onClick={handleGoBack}>
            <SvgIcon name="arrow_left" size={36} color="BASIC_BLACK" />
          </button>
        )}

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
