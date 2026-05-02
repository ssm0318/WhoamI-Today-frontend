import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import SelectPromptSheet from '@components/prompt/select-prompt-sheet/SelectPromptSheet';
import { SvgIcon } from '@design-system';
import { useTrackEvent } from '@hooks/useTrackEvent';
import { classifyPathnameAsSource } from '@utils/navSource';
import NewPostBottomSheet from '../bottom-sheet/NewPostBottomSheet';
import { StyledFloatingButton } from './FloatingButton.styled';

function FloatingButton() {
  const [bottomSheet, setBottomSheet] = useState(false);
  const [selectPrompt, setSelectPrompt] = useState(false);
  const trackEvent = useTrackEvent();
  const location = useLocation();

  const handleNewPost = () => {
    // Compose entry distribution: which surfaces drive the most new
    // posts. screen_view tells us where the user IS, this tells us
    // where they ACT.
    trackEvent('floating_compose_tapped', {
      from: classifyPathnameAsSource(location.pathname),
    });
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
