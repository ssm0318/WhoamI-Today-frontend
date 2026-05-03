import { isAxiosError } from 'axios';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import CommonError from '@components/_common/common-error/CommonError';
import Loader from '@components/_common/loader/Loader';
import NoContents from '@components/_common/no-contents/NoContents';
import CheckInPostViewer from '@components/check-in-posts/CheckInPostViewer';
import SubHeader from '@components/sub-header/SubHeader';
import useAsyncEffect from '@hooks/useAsyncEffect';
import { FetchState } from '@models/api/common';
import { CheckInPost } from '@models/checkInPost';
import { getCheckInPost } from '@utils/apis/checkInPost';

function CheckInPostDetail() {
  const { id } = useParams();
  const [t] = useTranslation('translation');
  const navigate = useNavigate();
  const [postState, setPostState] = useState<FetchState<CheckInPost>>({ state: 'loading' });

  useAsyncEffect(async () => {
    if (!id) {
      setPostState({ state: 'hasError' });
      return;
    }
    try {
      const data = await getCheckInPost(Number(id));
      setPostState({ state: 'hasValue', data });
    } catch (error) {
      if (isAxiosError(error)) {
        setPostState({ state: 'hasError', error });
      } else {
        setPostState({ state: 'hasError' });
      }
    }
  }, [id]);

  // History stack may be empty when entering via a push notification
  // launch URL — fall back to feed instead of navigate(-1) → blank tab.
  const handleClose = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/feed');
    }
  };

  if (postState.state === 'hasValue') {
    return <CheckInPostViewer story={postState.data} onClose={handleClose} />;
  }

  return (
    <ErrorShell>
      <SubHeader title="" />
      {postState.state === 'loading' && <Loader />}
      {postState.state === 'hasError' &&
        (!postState.error || postState.error.response?.status === 500 ? (
          <CommonError />
        ) : (
          <NoContents
            title={
              postState.error.response?.status === 403
                ? t('no_contents.forbidden_post')
                : t('no_contents.not_found_post')
            }
          />
        ))}
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
