import { MouseEvent, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import LinkifiedText from '@components/_common/linkified-text/LinkifiedText';
import PostFooter from '@components/_common/post-footer/PostFooter';
import PostFooterDefault from '@components/_common/post-footer/PostFooterDefault';
import PostFooterLikeOnly from '@components/_common/post-footer/PostFooterLikeOnly';
import PostTypeTag from '@components/_common/post-type-tag/PostTypeTag';
import ProfileImage from '@components/_common/profile-image/ProfileImage';
import PromptSummaryCard from '@components/_common/prompt-summary-card/PromptSummaryCard';
import CommentBottomSheet from '@components/comments/comment-bottom-sheet/CommentBottomSheet';
import { Layout, Typo } from '@design-system';
import { MissionGroupItem as MissionGroupItemModel, POST_DP_TYPE } from '@models/post';
import { useBoundStore } from '@stores/useBoundStore';
import { UserSelector } from '@stores/user';
import { classifyPathnameAsSource } from '@utils/navSource';
import { convertTimeDiffByString } from '@utils/timeHelpers';

interface MissionGroupItemProps {
  group: MissionGroupItemModel;
  displayType?: POST_DP_TYPE;
  refresh?: () => void;
  hidePromptCard?: boolean;
}

function MissionGroupItem({
  group,
  displayType = 'LIST',
  refresh,
  hidePromptCard = false,
}: MissionGroupItemProps) {
  const navigate = useNavigate();
  const { featureFlags } = useBoundStore(UserSelector);
  const [activeIndex, setActiveIndex] = useState(0);
  const [bottomSheet, setBottomSheet] = useState(false);
  const [inputFocus, setInputFocus] = useState(false);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const latestAttempt = group.attempts[group.attempts.length - 1];
  const { username, profile_image } = group.author_detail ?? {};

  if (!latestAttempt) return null;

  const navigateToProfile = (e: MouseEvent) => {
    e.stopPropagation();
    if (!username) return;
    navigate(`/users/${username}`, {
      state: { source: classifyPathnameAsSource(window.location.pathname) },
    });
  };

  const handleScroll = () => {
    const node = scrollerRef.current;
    if (!node) return;
    const card = node.querySelector('[data-mission-attempt-card="true"]') as HTMLElement | null;
    const step = card ? card.offsetWidth + 8 : node.clientWidth;
    if (step <= 0) return;
    setActiveIndex(Math.round(node.scrollLeft / step));
  };

  const scrollToAttempt = (index: number) => {
    const node = scrollerRef.current;
    if (!node) return;
    const card = node.querySelector('[data-mission-attempt-card="true"]') as HTMLElement | null;
    const step = card ? card.offsetWidth + 8 : node.clientWidth;
    node.scrollTo({ left: step * index, behavior: 'smooth' });
    setActiveIndex(index);
  };

  const footerJsx = featureFlags?.postsVerQ ? (
    <PostFooterLikeOnly
      post={latestAttempt}
      showComments={() => setBottomSheet(true)}
      setInputFocus={() => setInputFocus(true)}
      displayType={displayType}
      refresh={refresh}
    />
  ) : featureFlags?.friendList ? (
    <PostFooter
      post={latestAttempt}
      showComments={() => setBottomSheet(true)}
      setInputFocus={() => setInputFocus(true)}
      displayType={displayType}
    />
  ) : (
    <PostFooterDefault
      post={latestAttempt}
      showComments={() => setBottomSheet(true)}
      setInputFocus={() => setInputFocus(true)}
      displayType={displayType}
    />
  );

  return (
    <>
      <Layout.FlexCol w="100%" p={12} gap={8} outline="LIGHT" rounded={12}>
        <Layout.FlexRow w="100%" alignItems="center" justifyContent="space-between" h={44}>
          <Layout.FlexRow w="100%" alignItems="center" gap={8}>
            <ProfileImage
              imageUrl={profile_image}
              username={username}
              size={44}
              onClick={navigateToProfile}
            />
            <Layout.FlexCol>
              <Layout.FlexRow onClick={navigateToProfile} gap={4} alignItems="center">
                <Typo type="title-medium" ellipsis={{ enabled: true, maxWidth: 140 }}>
                  {username}
                </Typo>
              </Layout.FlexRow>
              <Layout.FlexRow alignItems="center" gap={4} style={{ flexWrap: 'wrap' }}>
                <Typo type="label-medium" color="MEDIUM_GRAY">
                  {group.created_at && convertTimeDiffByString({ day: new Date(group.created_at) })}
                </Typo>
              </Layout.FlexRow>
            </Layout.FlexCol>
          </Layout.FlexRow>
        </Layout.FlexRow>

        <Scroller ref={scrollerRef} onScroll={handleScroll}>
          {group.attempts.map((attempt) => (
            <AttemptCard
              key={attempt.id}
              data-mission-attempt-card="true"
              onClick={() => navigate(`/notes/${attempt.id}`)}
            >
              <Typo type="label-medium" color="PRIMARY" bold>
                ATTEMPT {attempt.mission_attempt_number ?? '-'} / 3
              </Typo>
              {attempt.content && (
                <Typo type="body-large" color="BLACK" pre>
                  <LinkifiedText>{attempt.content}</LinkifiedText>
                </Typo>
              )}
              {attempt.images?.[0] && <AttemptImage src={attempt.images[0]} alt="" />}
            </AttemptCard>
          ))}
        </Scroller>

        {group.attempts.length > 1 && (
          <Dots>
            {group.attempts.map((attempt, index) => (
              <Dot
                key={attempt.id}
                type="button"
                aria-label={`Show attempt ${index + 1}`}
                $active={index === activeIndex}
                onClick={(e) => {
                  e.stopPropagation();
                  scrollToAttempt(index);
                }}
              />
            ))}
          </Dots>
        )}

        {group.mission_prompt && !hidePromptCard && (
          <PromptSummaryCard
            content={group.mission_prompt}
            date={group.created_at}
            trailing={
              <>
                <Typo type="label-medium" color="MEDIUM_GRAY">
                  ·
                </Typo>
                <PostTypeTag variant="mission" />
              </>
            }
            onClick={() => {
              if (group.mission_id) navigate(`/missions/${group.mission_id}`);
            }}
          />
        )}

        {/* Likes and comments are temporarily attributed to the latest attempt. */}
        {footerJsx}
      </Layout.FlexCol>
      {bottomSheet && (
        <CommentBottomSheet
          postType="Note"
          post={latestAttempt}
          visible={bottomSheet}
          inputFocus={inputFocus}
          setInputFocus={setInputFocus}
          closeBottomSheet={() => {
            setBottomSheet(false);
            setInputFocus(false);
            refresh?.();
          }}
        />
      )}
    </>
  );
}

export default MissionGroupItem;

const Scroller = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const AttemptCard = styled.button`
  flex: 0 0 100%;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  min-height: 104px;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.LIGHT_GRAY};
  border-radius: 8px;
  background: ${({ theme }) => theme.WHITE};
  text-align: left;
`;

const AttemptImage = styled.img`
  width: 100%;
  max-height: 220px;
  object-fit: cover;
  border-radius: 8px;
`;

const Dots = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  width: 100%;
  height: 14px;
`;

const Dot = styled.button<{ $active: boolean }>`
  width: 6px;
  height: 6px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: ${({ $active, theme }) => ($active ? theme.PRIMARY : theme.LIGHT_GRAY)};
`;
