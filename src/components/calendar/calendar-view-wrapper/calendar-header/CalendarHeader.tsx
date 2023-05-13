import { Font, Layout } from '@design-system';

interface CalendarHeaderProps {
  title: string;
  onClickPrevBtn: () => void;
  onClickNextBtn: () => void;
}

function CalendarHeader({ title, onClickPrevBtn, onClickNextBtn }: CalendarHeaderProps) {
  return (
    <Layout.FlexRow>
      <div>
        <Font.Body type="14_semibold">{title}</Font.Body>
      </div>
      <div>
        <button type="button" onClick={onClickPrevBtn}>
          {'<'}
        </button>
        <button type="button" onClick={onClickNextBtn}>
          {'>'}
        </button>
      </div>
    </Layout.FlexRow>
  );
}

export default CalendarHeader;
