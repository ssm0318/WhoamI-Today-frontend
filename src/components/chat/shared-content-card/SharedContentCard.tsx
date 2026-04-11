import styled from 'styled-components';
import { Layout, Typo } from '@design-system';
import { SharedContentPreview } from '@models/chat';

const CardWrapper = styled(Layout.FlexCol)`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  max-width: 208px;
  overflow: hidden;
  cursor: pointer;
`;

const CONTENT_TYPE_LABELS: Record<string, string> = {
  note: 'Note',
  response: 'Response',
  question: 'Question',
};

interface Props {
  preview: SharedContentPreview;
  onClick?: () => void;
}

function SharedContentCard({ preview, onClick }: Props) {
  const label = CONTENT_TYPE_LABELS[preview.type] || preview.type;

  return (
    <CardWrapper onClick={onClick}>
      {preview.image_url && (
        <img
          src={preview.image_url}
          alt="shared content"
          style={{ width: '100%', height: 100, objectFit: 'cover' }}
        />
      )}
      <Layout.FlexCol ph={10} pv={8} gap={2}>
        <Typo type="label-small" color="PRIMARY">
          {label}
        </Typo>
        {preview.title && (
          <Typo type="title-small" color="BLACK">
            {preview.title}
          </Typo>
        )}
        {preview.content && (
          <Typo type="body-small" color="DARK_GRAY">
            {preview.content.length > 80 ? `${preview.content.slice(0, 80)}...` : preview.content}
          </Typo>
        )}
        {preview.author && (
          <Typo type="label-small" color="MEDIUM_GRAY">
            by {preview.author.username}
          </Typo>
        )}
      </Layout.FlexCol>
    </CardWrapper>
  );
}

export default SharedContentCard;
