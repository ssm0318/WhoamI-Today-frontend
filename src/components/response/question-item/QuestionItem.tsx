import { Font, Layout, SvgIcon } from '@design-system';

function QuestionItem() {
  return (
    <Layout.FlexCol
      pt={22}
      pb={20}
      ph={20}
      rounded={14.5}
      bgColor="GRAY_7"
      w="100%"
      alignItems="center"
    >
      <Font.Body type="20_regular" color="GRAY_6" textAlign="center">
        What Makes me cynical?
      </Font.Body>
      <Layout.FlexRow w="100%" alignItems="center" justifyContent="flex-end" mt={5}>
        {/* TODO 나중에 send 아이콘으로 바꾸기 */}
        <SvgIcon name="arrow_right" size={36} />
      </Layout.FlexRow>
    </Layout.FlexCol>
  );
}

export default QuestionItem;
