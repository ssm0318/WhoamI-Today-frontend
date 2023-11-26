import { TextareaAutosizeProps } from 'react-textarea-autosize';
import * as S from './CheckInTextInput.styled';

interface CheckInTextInputProps extends TextareaAutosizeProps {}

function CheckInTextInput(props: CheckInTextInputProps) {
  return <S.StyledCheckInTextInput {...props} />;
}
export default CheckInTextInput;
