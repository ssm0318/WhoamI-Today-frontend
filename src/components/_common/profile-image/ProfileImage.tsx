import { Layout, SvgIcon } from '@design-system';
import { NonShrinkWrapper } from './ProfileImage.styled';

interface ProfileImageProps {
  imageUrl?: string | null;
  size?: number;
  username?: string;
  className?: string;
  /**
   * 프로필 이미지 변경 시에도 동일한 이미지 이름의 소스를 사용하기 때문에 e.g {username}.png
   * 강제로 이미지 업데이트가 필요한 경우 사용(e.g 설정>프로필 이미지 변경 이후 설정 페이지로 돌아온 경우)
   */
  ts?: number;
}

function ProfileImage({ imageUrl, username, className, ts, size = 36 }: ProfileImageProps) {
  return (
    <NonShrinkWrapper>
      <Layout.LayoutBase w={size} h={size} rounded={size / 2} className={className}>
        {imageUrl ? (
          <img
            src={ts ? `${imageUrl}?ts=${ts}` : imageUrl}
            width={size}
            height={size}
            alt={`${username ?? 'user'}-profile`}
          />
        ) : (
          <SvgIcon name="default_profile" size={size} />
        )}
      </Layout.LayoutBase>
    </NonShrinkWrapper>
  );
}

export default ProfileImage;
