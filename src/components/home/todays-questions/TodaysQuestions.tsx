import { Button, Font, Layout, SvgIcon } from '@design-system';

const shortAnswer = `Let's talk about your own way to get refreshed.`;
const multipleChoices = ['as I am introverted.', 'kl I am introverted.', 'jj I am introverted.'];

function TodaysQuestions() {
  return (
    <Layout.FlexCol w="100%" bgColor="BACKGROUND_COLOR" ph="default" pt={22} pb={100}>
      {/* 타이틀 */}
      <Layout.FlexRow w="100%" justifyContent="space-between" alignItems="center">
        <SvgIcon name="arrow_left" size={36} />
        <Font.Display type="18_bold">{`Today's Questions`}</Font.Display>
        <SvgIcon name="arrow_right" size={36} />
      </Layout.FlexRow>
      {/* 컨텐츠 */}
      {/* Short Answer */}
      <Layout.FlexRow mb={10} mt={32} justifyContent="space-between" w="100%" alignItems="center">
        <Font.Display type="14_regular" color="GRAY_3">
          Short Answer
        </Font.Display>
        <Button.Small text="See all" type="white_fill" status="normal" />
      </Layout.FlexRow>
      <Layout.LayoutBase bgColor="GRAY_2" w="100%" ph={16} pv={14} rounded={10}>
        <Font.Body type="18_regular" textAlign="center">
          {shortAnswer}
        </Font.Body>
      </Layout.LayoutBase>
      {/* Multiple Choice */}
      <Layout.FlexRow mt={20} mb={8} justifyContent="flex-start" w="100%" alignItems="center">
        <Font.Display type="14_regular" color="GRAY_3">
          Multiple Choice
        </Font.Display>
      </Layout.FlexRow>
      <Layout.LayoutBase bgColor="GRAY_2" w="100%" ph={16} pv={14} rounded={10} alignItems="center">
        {multipleChoices.map((c, index) => (
          <Font.Body type="18_regular" textAlign="center" key={c}>
            {index + 1}. {c}
          </Font.Body>
        ))}
      </Layout.LayoutBase>
    </Layout.FlexCol>
  );
}

export default TodaysQuestions;
