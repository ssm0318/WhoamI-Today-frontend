import { Font, Layout, SvgIcon } from '@design-system';
import { CALENDAR_VIEW } from '@models/calendar';
import { useBoundStore } from '@stores/useBoundStore';
import {
  ARROW_ICON_SIZE,
  getArrowIconColor,
  getCalendarTitle,
  validateNextBtnActivation,
  validatePrevBtnActivation,
} from './CalendarHeader.helper';

interface CalendarHeaderProps {
  type: CALENDAR_VIEW;
  currentDate: Date;
  onClickPrevBtn: () => void;
  onClickNextBtn: () => void;
}

function CalendarHeader({
  type,
  currentDate,
  onClickPrevBtn,
  onClickNextBtn,
}: CalendarHeaderProps) {
  const { resetDetailDate } = useBoundStore((state) => ({
    resetDetailDate: state.resetDetailDate,
  }));

  const isPrevBtnActive = validatePrevBtnActivation(type, currentDate);
  const isNextBtnActive = validateNextBtnActivation(type, currentDate);

  const handleClickPrevBtn = () => {
    onClickPrevBtn();
    resetDetailDate();
  };

  const handleClickNextBtn = () => {
    onClickNextBtn();
    resetDetailDate();
  };

  return (
    <Layout.FlexRow w="100%" justifyContent="space-between" alignItems="center">
      <Font.Body type="20_semibold">{getCalendarTitle(type, currentDate)}</Font.Body>
      <Layout.FlexRow justifyContent="space-between" alignItems="center">
        <button type="button" onClick={handleClickPrevBtn} disabled={!isPrevBtnActive}>
          <SvgIcon
            name="arrow_left"
            size={ARROW_ICON_SIZE}
            color={getArrowIconColor(isPrevBtnActive)}
          />
        </button>
        <button type="button" onClick={handleClickNextBtn} disabled={!isNextBtnActive}>
          <SvgIcon
            name="arrow_right"
            size={ARROW_ICON_SIZE}
            color={getArrowIconColor(isNextBtnActive)}
          />
        </button>
      </Layout.FlexRow>
    </Layout.FlexRow>
  );
}

export default CalendarHeader;
