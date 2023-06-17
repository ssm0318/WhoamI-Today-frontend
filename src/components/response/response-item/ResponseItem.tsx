import { Font, Layout, SvgIcon } from '@design-system';
import { Response } from '@models/post';
import { convertTimeDiffByString } from '@utils/timeHelpers';

interface ResponseItemProps {
  response: Response;
}

function ResponseItem({ response }: ResponseItemProps) {
  const { content, created_at } = response;
  return (
    <Layout.FlexRow w="100%">
      <SvgIcon name="my_profile" size={36} />
      <Layout.FlexCol ml={10} w="100%">
        <Font.Body type="18_regular" color="GRAY_8">
          {content}
        </Font.Body>
        <Layout.FlexRow w="100%" justifyContent="flex-end">
          <Font.Body type="12_regular" color="GRAY_8">
            {convertTimeDiffByString(new Date(), new Date(created_at))}
          </Font.Body>
        </Layout.FlexRow>
      </Layout.FlexCol>
    </Layout.FlexRow>
  );
}

export default ResponseItem;
