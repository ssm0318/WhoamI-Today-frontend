import { SvgIcon } from '@design-system';
import { useBoundStore } from '@stores/useBoundStore';
import { MyTabItem, TabItem, TabWrapper } from './Tab.styled';

function Tab() {
  const myProfile = useBoundStore((state) => state.myProfile);

  return (
    <TabWrapper>
      <TabItem to="/friends">
        {({ isActive }) => (
          <SvgIcon name={isActive ? 'friends_active' : 'friends_inactive'} size={48} />
        )}
      </TabItem>
      <TabItem to="/home">
        {({ isActive }) => <SvgIcon name={isActive ? 'home_active' : 'home_inactive'} size={48} />}
      </TabItem>
      {myProfile?.profile_image ? (
        <MyTabItem to="/my">
          {({ isActive }) => (
            <img
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              src={myProfile.profile_image!}
              width={32}
              height={32}
              alt={`${myProfile?.username ?? 'user'}-profile`}
              className={`${isActive ? 'active' : ''}`}
            />
          )}
        </MyTabItem>
      ) : (
        <TabItem to="/my">
          {({ isActive }) => <SvgIcon name={isActive ? 'my_active' : 'my_inactive'} size={48} />}
        </TabItem>
      )}
    </TabWrapper>
  );
}

export default Tab;
