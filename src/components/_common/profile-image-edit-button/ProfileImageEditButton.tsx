import { useNavigate } from 'react-router-dom';
import { Layout, SvgIcon } from '@design-system';

type ProfileImageEditButtonProps = {
  size: number;
  iconSize: number;
};

function ProfileImageEditButton({ size, iconSize }: ProfileImageEditButtonProps) {
  const navigate = useNavigate();

  return (
    <Layout.Absolute
      r={0}
      b={0}
      w={size}
      h={size}
      bgColor="DARK"
      rounded={size / 2}
      alignItems="center"
      justifyContent="center"
    >
      <SvgIcon
        name="edit_filled_white"
        size={iconSize}
        onClick={() => navigate(`/settings/edit-profile`)}
      />
    </Layout.Absolute>
  );
}

export default ProfileImageEditButton;
