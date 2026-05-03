import { isAxiosError } from 'axios';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import CommonError from '@components/_common/common-error/CommonError';
import Loader from '@components/_common/loader/Loader';
import CheckInPostViewer from '@components/check-in-posts/CheckInPostViewer';
import SubHeader from '@components/sub-header/SubHeader';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { FetchState } from '@models/api/common';
import { CheckInPost } from '@models/checkInPost';
import { useBoundStore } from '@stores/useBoundStore';
import { getCheckInPost } from '@utils/apis/checkInPost';

function CheckInPostDetail() {
  const { id } = useParams();
  const [t] = useTranslation('translation', { keyPrefix: 'check_in_post' });
  const navigate = useNavigate();
  const openToast = useBoundStore((state) => state.openToast);
  const [postState, setPostState] = useState<FetchState<CheckInPost>>({ state: 'loading' });

  // History stack may be empty when entering via a push notification
  // launch URL — fall back to feed instead of navigate(-1) → blank tab.
  const handleClose = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/feed');
    }
  };

  useAsyncEffect(async () => {
    if (!id) {
      setPostState({ state: 'hasError' });
      return;
    }
    try {
      const data = await getCheckInPost(Number(id));
      setPostState({ state: 'hasValue', data });
    } catch (error) {
      if (isAxiosError(error) && [403, 404].includes(error.response?.status ?? 0)) {
        openToast({ message: t('archived_story_toast') ?? '' });
        handleClose();
        return;
      }
      if (isAxiosError(error)) {
        setPostState({ state: 'hasError', error });
      } else {
        setPostState({ state: 'hasError' });
      }
    }
  }, [id]);

  if (postState.state === 'hasValue') {
    return <CheckInPostViewer story={postState.data} onClose={handleClose} />;
  }

  return (
    <ErrorShell>
      <SubHeader title="" />
      {postState.state === 'loading' && <Loader />}
      {postState.state === 'hasError' && <CommonError />}
    </ErrorShell>
  );
}

const ErrorShell = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 80px;
`;

export default CheckInPostDetail;
