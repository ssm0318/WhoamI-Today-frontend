import ContentLoader from 'react-content-loader';

export function AllFriendListLoader() {
  return (
    <>
      {[...Array(10)].map((_, index) => {
        const key = `friend_item_loader_${index}`;
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
