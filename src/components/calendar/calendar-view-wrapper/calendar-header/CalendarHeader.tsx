import { Font, Layout, SvgIcon } from '@design-system';

interface CalendarHeaderProps {
  title: string;
  onClickPrevBtn: () => void;
  onClickNextBtn: () => void;
}

function CalendarHeader({ title, onClickPrevBtn, onClickNextBtn }: CalendarHeaderProps) {
  return (
    <Layout.FlexRow w="100%" justifyContent="space-between" alignItems="center">
      <Font.Body type="20_semibold">{title}</Font.Body>
      <Layout.FlexRow justifyContent="space-between" alignItems="center">
        <button type="button" onClick={onClickPrevBtn}>
          <SvgIcon name="arrow_left" size={36} />
        </button>
        <button type="button" onClick={onClickNextBtn}>
          <SvgIcon name="arrow_right" size={36} />
        </button>
      </Layout.FlexRow>
    </Layout.FlexRow>
  );
}

export default CalendarHeader;
