import MomentUploadSteps from '@components/moment-upload/moment-upload-steps/MomentUploadSteps';
import { Layout } from '@design-system';

function MomentUpload() {
  return (
    <Layout.AbsoluteFullScreen bgColor="BASIC_BLACK">
      <MomentUploadSteps />
    </Layout.AbsoluteFullScreen>
  );
}

export default MomentUpload;
