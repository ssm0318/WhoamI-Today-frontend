import { useState } from 'react';
import SelectPromptSheet from '@components/prompt/select-prompt-sheet/SelectPromptSheet';
import { SvgIcon } from '@design-system';
import NewPostBottomSheet from '../bottom-sheet/NewPostBottomSheet';
import { StyledFloatingButton } from './FloatingButton.styled';

function FloatingButton() {
  const [bottomSheet, setBottomSheet] = useState(false);
  const [selectPrompt, setSelectPrompt] = useState(false);

  const handleNewPost = () => {
    setBottomSheet(true);
  };

  return (
    <>
      <StyledFloatingButton onClick={handleNewPost}>
        <SvgIcon name="add_post" size={44} />
      </StyledFloatingButton>
      {bottomSheet && (
        <NewPostBottomSheet
          visible={bottomSheet}
          closeBottomSheet={() => setBottomSheet(false)}
          setSelectPrompt={setSelectPrompt}
        />
      )}
      {selectPrompt && (
        <SelectPromptSheet visible={selectPrompt} closeBottomSheet={() => setSelectPrompt(false)} />
      )}
    </>
  );
}

export default FloatingButton;
