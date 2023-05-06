import { Font, Layout, SvgIcon } from '@design-system';

function TodaysQuestions() {
  return (
    <Layout.FlexCol w="100%" bgColor="BACKGROUND_COLOR" ph="default" pt={22}>
      {/* 타이틀 */}
      <Layout.FlexRow w="100%" justifyContent="space-between" alignItems="center">
        <SvgIcon name="arrow_left" size={36} />
        <Font.Display type="18_bold">{`Today's Questions`}</Font.Display>
        <SvgIcon name="arrow_right" size={36} />
      </Layout.FlexRow>
      {/* 컨텐츠 */}
    </Layout.FlexCol>
  );
}

export default TodaysQuestions;
