import { Font, Layout } from '@design-system';

function TodaysMoments() {
  return (
    <Layout.FlexCol w="100%" bgColor="BACKGROUND_COLOR" ph="default" pt={22} pb={43}>
      {/* 타이틀 */}
      <Layout.FlexRow w="100%" justifyContent="center" alignItems="center">
        <Font.Display type="18_bold">{`Today's Moments`}</Font.Display>
      </Layout.FlexRow>
      {/* 컨텐츠 */}
    </Layout.FlexCol>
  );
}

export default TodaysMoments;
