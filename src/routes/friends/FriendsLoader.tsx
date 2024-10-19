import ContentLoader from 'react-content-loader';

export function FavoriteFriendListLoader() {
  return (
    <>
      {[...Array(3)].map((_, index) => {
        const key = `favorite_friend_item_loader_${index}`;
        return <FavoriteFriendItemLoader key={key} />;
      })}
    </>
  );
}

export function FavoriteFriendItemLoader() {
  return (
    <ContentLoader width={113} height={150}>
      <circle cx="56.5" cy="41.28" r="41.28" />
      <rect x="15" y="95" rx="6" ry="6" width="83" height="15" />
      <rect x="0" y="122" rx="6" ry="6" width="113" height="15" />
    </ContentLoader>
  );
}

export function AllFriendListLoader() {
  return (
    <>
      {[...Array(10)].map((_, index) => {
        const key = `all_friend_item_loader_${index}`;
        return <AllFriendItemLoader key={key} />;
      })}
    </>
  );
}

export function AllFriendItemLoader() {
  return (
    <ContentLoader height={50}>
      <circle cx="38" cy="22" r="22" />
      <rect x="64" y="10" rx="3" ry="3" width="88" height="8" />
      <rect x="64" y="26" rx="3" ry="3" width="130" height="8" />
      <rect x="16" y="48" width="300" height="1" />
    </ContentLoader>
  );
}
