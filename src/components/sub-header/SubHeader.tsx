import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_MARGIN, SCREEN_WIDTH } from '@constants/layout';
import { Layout, SvgIcon, Typo } from '@design-system';
import { FontType } from 'src/design-system/Font/Font.types';
import { SubHeaderWrapper } from './SubHeader.styled';

interface SubHeaderProps {
  title?: string | null;
  typo?: FontType;
  onGoBack?: () => void;
  RightComponent?: React.ReactNode;
  LeftComponent?: React.ReactNode;
}
/**
 *
 * 중앙에 title이 있는 헤더
 */
function SubHeader({
  title,
  typo = 'title-large',
  onGoBack,
  RightComponent,
  LeftComponent,
}: SubHeaderProps) {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <SubHeaderWrapper>
      <Layout.FlexRow
        justifyContent="space-between"
        w="100%"
        alignItems="center"
        ph="default"
        pv={4}
      >
        {LeftComponent || (
          <Layout.LayoutBase w={36} h={36}>
            <button type="button" onClick={handleGoBack}>
              <SvgIcon name="arrow_left" size={36} color="BLACK" />
            </button>
          </Layout.LayoutBase>
        )}
        {title && (
          <Typo
            type={typo}
            textAlign="center"
            ellipsis={{ enabled: true, maxWidth: SCREEN_WIDTH - 2 * DEFAULT_MARGIN }}
          >
            {title}
          </Typo>
        )}
        <Layout.LayoutBase w={title && !RightComponent ? 36 : undefined}>
          {RightComponent && RightComponent}
        </Layout.LayoutBase>
      </Layout.FlexRow>
    </SubHeaderWrapper>
  );
}

export default SubHeader;
