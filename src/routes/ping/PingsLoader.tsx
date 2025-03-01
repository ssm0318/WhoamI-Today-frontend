import ContentLoader from 'react-content-loader';

export function PingsListLoader() {
  return (
    <>
      {[...Array(4)].map((_, index) => {
        const key = `ping_item_loader_${index}`;
        return <PingItemLoader key={key} />;
      })}
    </>
  );
}

export function PingItemLoader() {
  return (
    <ContentLoader
      height={80}
      width={200}
      style={{
        justifyContent: 'center',
        gap: 15,
      }}
    >
      {/* Message bubble */}
      <rect x="40" y="10" rx="16" ry="16" width="300" height="50" />
    </ContentLoader>
  );
}
