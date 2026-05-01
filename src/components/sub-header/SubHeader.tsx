import React from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_MARGIN, SCREEN_WIDTH } from '@constants/layout';
import { Layout, SvgIcon, Typo } from '@design-system';
import { FontType } from 'src/design-system/Font/Font.types';
import { SubHeaderWrapper } from './SubHeader.styled';

interface SubHeaderProps {
  title?: string | null;
  typo?: FontType;
  onGoBack?: () => void;
  onClickTitle?: () => void;
  RightComponent?: React.ReactNode;
  LeftComponent?: React.ReactNode;
  disablePortal?: boolean;
}
/**
 *
 * 중앙에 title이 있는 헤더
 */
function SubHeader({
  title,
  typo = 'title-large',
  onGoBack,
  onClickTitle,
  RightComponent,
  LeftComponent,
  disablePortal,
}: SubHeaderProps) {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack();
      return;
    }
    if (window.ReactNativeWebView && window.history.length <= 1) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ actionType: 'NAVIGATE_TO_BASE' }));
      return;
    }
    navigate(-1);
  };
  // iOS WebView에서 -webkit-overflow-scrolling: touch 가 켜진 MainScrollContainer
  // 안쪽의 position: fixed 가 viewport 가 아니라 컨테이너 기준으로 잡혀서
  // 노치 영역으로 헤더가 숨는 webkit 이슈가 있어, MainScrollContainer 밖
  // (#root-container) 으로 portal 해서 항상 viewport 기준으로 고정시킴.
  const portalTarget =
    typeof document !== 'undefined'
      ? document.getElementById('root-container') ?? document.body
      : null;

  const headerNode = (
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
        {title &&
          (onClickTitle ? (
            <button
              type="button"
              onClick={onClickTitle}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <Typo
                type={typo}
                textAlign="center"
                ellipsis={{ enabled: true, maxWidth: SCREEN_WIDTH - 2 * DEFAULT_MARGIN }}
              >
                {title}
              </Typo>
            </button>
          ) : (
            <Typo
              type={typo}
              textAlign="center"
              ellipsis={{ enabled: true, maxWidth: SCREEN_WIDTH - 2 * DEFAULT_MARGIN }}
            >
              {title}
            </Typo>
          ))}
        <Layout.LayoutBase w={title && !RightComponent ? 36 : undefined}>
          {RightComponent && RightComponent}
        </Layout.LayoutBase>
      </Layout.FlexRow>
    </SubHeaderWrapper>
  );

  if (disablePortal) return headerNode;

  return portalTarget ? createPortal(headerNode, portalTarget) : headerNode;
}

export default SubHeader;
