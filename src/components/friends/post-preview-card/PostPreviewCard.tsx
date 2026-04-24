import { MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Typo } from '@design-system';
import { POST_TYPE } from '@models/post';
import { convertTimeDiffByString } from '@utils/timeHelpers';
import { CardContainer, ContentText, Thumbnail } from './PostPreviewCard.styled';

interface PostPreviewData {
  id: number;
  type: string;
  content?: string;
  preview_content?: string;
  images?: string[];
  created_at?: string;
  is_read?: boolean;
}

interface Props {
  post: PostPreviewData;
}

function PostPreviewCard({ post }: Props) {
  const navigate = useNavigate();
  const { id, type, images, created_at } = post;
  const text = post.preview_content || post.content || '';
  const hasImage = !!images?.length;
  const isUnread = post.is_read === false;

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    const path = type === POST_TYPE.RESPONSE ? `/responses/${id}` : `/notes/${id}`;
    navigate(path);
  };

  return (
    <CardContainer onClick={handleClick}>
      {hasImage && <Thumbnail src={images![0]} alt="" />}
      <Layout.FlexCol p={10} gap={6} style={{ flex: 1 }}>
        <Layout.FlexRow alignItems="center" gap={6}>
          {created_at && (
            <Typo type="label-small" color="MEDIUM_GRAY">
              {convertTimeDiffByString({ now: new Date(), day: new Date(created_at) })}
            </Typo>
          )}
          {isUnread && (
            <Layout.FlexRow bgColor="TERTIARY_BLUE" rounded={4} ph={4} pv={1}>
              <Typo type="label-small" color="WHITE" fontSize={9} fontWeight={700}>
                NEW
              </Typo>
            </Layout.FlexRow>
          )}
        </Layout.FlexRow>
        {text && <ContentText>{text}</ContentText>}
      </Layout.FlexCol>
    </CardContainer>
  );
}

export default PostPreviewCard;
