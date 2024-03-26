import { Layout } from '@design-system';
import ProfileImage from '../profile-image/ProfileImage';

type ProfileImageProps = {
  images: (string | null)[];
  size?: number;
  maxCount?: number;
  order?: 'asc' | 'desc';
};

function ProfileImageList({ images, size = 25, maxCount = 3, order = 'desc' }: ProfileImageProps) {
  return (
    <Layout.FlexRow alignItems="center">
      {images.slice(0, maxCount).map((image, index) => (
        <Layout.FlexRow
          key={image}
          ml={index === 0 ? 0 : -10}
          z={order === 'asc' ? images.length - index : index}
        >
          <ProfileImage imageUrl={image} size={size} />
        </Layout.FlexRow>
      ))}
    </Layout.FlexRow>
  );
}

export default ProfileImageList;