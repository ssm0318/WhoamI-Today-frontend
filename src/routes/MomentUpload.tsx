import MainContainer from '@components/_common/main-container/MainContainer';
import MomentUploadSteps from '@components/moment-upload/moment-upload-steps/MomentUploadSteps';
import { Layout } from '@design-system';

function MomentUpload() {
  return (
    <MainContainer>
      <Layout.Absolute bgColor="BASIC_BLACK" b={0} t={0} l={0} r={0}>
        <MomentUploadSteps />
      </Layout.Absolute>
    </MainContainer>
  );
}

export default MomentUpload;
