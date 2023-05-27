import { Font, Layout, SvgIcon } from '@design-system';
import { CALENDAR_VIEW } from '@models/calendar';
import {
  ARROW_ICON_SIZE,
  getArrowIconColor,
  validateNextBtnActivation,
  validatePrevBtnActivation,
} from './CalendarHeader.helper';

interface CalendarHeaderProps {
  type: CALENDAR_VIEW;
  title: string;
  currentDate: Date;
  onClickPrevBtn: () => void;
  onClickNextBtn: () => void;
}

function CalendarHeader({
  type,
  title,
  currentDate,
  onClickPrevBtn,
  onClickNextBtn,
}: CalendarHeaderProps) {
  const isPrevBtnActive = validatePrevBtnActivation(type, currentDate);
  const isNextBtnActive = validateNextBtnActivation(currentDate);

  return (
    <Layout.FlexRow w="100%" justifyContent="space-between" alignItems="center">
      <Font.Body type="20_semibold">{title}</Font.Body>
      <Layout.FlexRow justifyContent="space-between" alignItems="center">
        <button type="button" onClick={onClickPrevBtn} disabled={!isPrevBtnActive}>
          <SvgIcon
            name="arrow_left"
            size={ARROW_ICON_SIZE}
            color={getArrowIconColor(isPrevBtnActive)}
          />
        </button>
        <button type="button" onClick={onClickNextBtn} disabled={!isNextBtnActive}>
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
