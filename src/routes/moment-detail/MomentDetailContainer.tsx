import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader } from '@components/_common/loader/Loader.styled';
import MainContainer from '@components/_common/main-container/MainContainer';
import TitleHeader from '@components/title-header/TitleHeader';
import { TITLE_HEADER_HEIGHT } from '@constants/layout';
import { Layout } from '@design-system';
import { FetchState } from '@models/api/common';
import { GetMomentDetailResponse } from '@models/api/moment';
import { getMoment } from '@utils/apis/moment';
import MomentDetail from './MomentDetail';

function MomentDetailContainer() {
  const { momentId } = useParams();
  const [momentState, setMomentState] = useState<FetchState<GetMomentDetailResponse>>({
    state: 'loading',
  });

  const getMomentDetail = useCallback(() => {
    if (!momentId) return;
    getMoment(momentId)
      .then((data) => {
        if (data) setMomentState({ state: 'hasValue', data });
        else setMomentState({ state: 'hasError' });
      })
      .catch(() => setMomentState({ state: 'hasError' }));
  }, [momentId]);
  useEffect(getMomentDetail, [getMomentDetail]);

  return (
    <MainContainer>
      <TitleHeader title="moment" />
      <Layout.FlexCol w="100%" pv={28} ph={24} gap={14} mt={TITLE_HEADER_HEIGHT}>
        {/* TODO: not found page */}
        {momentState.state === 'hasError' ? (
          <>NotFound</>
        ) : (
          <>
            {momentState.state === 'loading' && <Loader />}
            {momentState.state === 'hasValue' && <MomentDetail moment={momentState.data} />}
          </>
        )}
      </Layout.FlexCol>
    </MainContainer>
  );
}

export default MomentDetailContainer;
