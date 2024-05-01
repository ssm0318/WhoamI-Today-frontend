import { Layout } from '@design-system';
import ProfileImage from '../profile-image/ProfileImage';

type ProfileImageProps = {
  images: (string | null)[];
  size?: number;
  maxCount?: number;
  order?: 'asc' | 'desc';
};

function ProfileImageList({ images, size = 25, maxCount = 3, order = 'desc' }: ProfileImageProps) {
  if (!images || images.length === 0) return null;
  return (
    <Layout.FlexRow alignItems="center">
      {images.slice(0, maxCount).map((image, index) => {
        const key = `image${index}`;
        return (
          <Layout.FlexRow
            key={key}
            ml={index === 0 ? 0 : -10}
            z={order === 'asc' ? images.length - index : index}
          >
            <ProfileImage imageUrl={image} size={size} />
          </Layout.FlexRow>
        );
      })}
    </Layout.FlexRow>
  );
}

export default ProfileImageList;
