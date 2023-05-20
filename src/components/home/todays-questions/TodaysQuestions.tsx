import { addDays, format, isAfter, isBefore, isEqual, isSameDay, subDays } from 'date-fns';
import { useState } from 'react';
import { TODAY_QUESTION_FIRST_DATE } from '@constants/question';
import { Button, Font, Layout, SvgIcon } from '@design-system';

const shortAnswer = `Let's talk about your own way to get refreshed.`;
const multipleChoices = ['as I am introverted.', 'kl I am introverted.', 'jj I am introverted.'];

function TodaysQuestions() {
  // 오늘 날짜
  const today = new Date();
  // TODAY_QUESTION_FIRST_DATE와 today를 비교 후, 더 나중 날짜를 currentDate로 set
  // TODAY_QUESTION_FIRST_DATE보다 이전에 접속하면 항상 TODAY_QUESTION_FIRST_DATE로 유지
  const [currentDate, setCurrentDate] = useState(
    isBefore(today, TODAY_QUESTION_FIRST_DATE) ? TODAY_QUESTION_FIRST_DATE : today,
  );

  const moveToPrevDate = () => {
    if (!isPrevButtonExists) return;
    setCurrentDate(subDays(currentDate, 1));
  };

  const moveToNextDate = () => {
    if (!isNextButtonExists) return;
    setCurrentDate(addDays(currentDate, 1));
  };

  const isPrevButtonExists = isAfter(currentDate, TODAY_QUESTION_FIRST_DATE);
  const isNextButtonExists = !(isAfter(currentDate, today) || isEqual(currentDate, today));

  return (
    <Layout.FlexCol w="100%" bgColor="BACKGROUND_COLOR" ph="default" pt={22} pb={100}>
      {/* 타이틀 */}
      <Layout.FlexRow w="100%" justifyContent="space-between" alignItems="center" h={38}>
        <Layout.LayoutBase onClick={moveToPrevDate} w={36} h={36}>
          {isPrevButtonExists && <SvgIcon name="arrow_left" size={36} />}
        </Layout.LayoutBase>
        <Font.Display type="18_bold">
          {isSameDay(currentDate, today) || isBefore(today, TODAY_QUESTION_FIRST_DATE)
            ? `Today's Questions`
            : format(currentDate, 'yyyy/MM/dd')}
        </Font.Display>
        <Layout.LayoutBase onClick={moveToNextDate} w={36} h={36}>
          {isNextButtonExists && <SvgIcon name="arrow_right" size={36} />}
        </Layout.LayoutBase>
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
