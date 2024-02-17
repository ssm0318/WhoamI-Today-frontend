import { TextArea } from '@design-system';
import { ValidatedTextAreaProps } from './ValidatedTextArea.helper';
import StyledValidatedTextArea from './ValidatedTextArea.styled';

function ValidatedTextArea(props: ValidatedTextAreaProps) {
  const { ...inputProps } = props;

  return (
    <StyledValidatedTextArea>
      <TextArea {...inputProps} />
    </StyledValidatedTextArea>
  );
}

export default ValidatedTextArea;
