import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import { Colors, SvgIcon, Typo } from '@design-system';
import i18n from '@i18n/index';
import { useBoundStore } from '@stores/useBoundStore';
import { getTmiPlaceholder } from '@utils/apis/tmi';

const STATIC_FALLBACK_EN = "What's on your mind?";
const STATIC_FALLBACK_KO = '오늘은 어떤 하루였나요?';

function QuickShareInput() {
  const navigate = useNavigate();
  const [t] = useTranslation('translation');
  const myProfile = useBoundStore((state) => state.myProfile);
  const [placeholder, setPlaceholder] = useState<string>(
    i18n.language?.startsWith('ko') ? STATIC_FALLBACK_KO : STATIC_FALLBACK_EN,
  );

  useEffect(() => {
    let cancelled = false;
    getTmiPlaceholder(i18n.language || 'en')
      .then((text) => {
        if (!cancelled && text) setPlaceholder(text);
      })
      .catch(() => {
        // Endpoint failure is non-fatal — keep the static fallback.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleOpen = () => {
    navigate('/notes/new', { state: { fromShare: true } });
  };

  return (
    <CardWrapper
      onClick={handleOpen}
      role="button"
      aria-label={t('share_page.quick_share_aria') ?? undefined}
    >
      <ProfileImage imageUrl={myProfile?.profile_image} username={myProfile?.username} size={36} />
      <PlaceholderText type="body-medium" color="MEDIUM_GRAY" ellipsis={{ enabled: true }}>
        {placeholder}
      </PlaceholderText>
      <SvgIcon name="chat_media_image" size={22} fill="DARK_GRAY" />
    </CardWrapper>
  );
}

const CardWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 14px;
  border: 1px solid ${Colors.LIGHT_GRAY};
  background-color: ${Colors.WHITE};
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;

  &:active {
    background-color: ${Colors.LIGHT};
  }
`;

const PlaceholderText = styled(Typo)`
  flex: 1;
  min-width: 0;
`;

export default QuickShareInput;
