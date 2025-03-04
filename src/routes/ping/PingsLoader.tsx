import ContentLoader from 'react-content-loader';

export function PingsListLoader() {
  return (
    <>
      {[...Array(5)].map((_, index) => {
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
        gap: 10,
      }}
    >
      {/* Message bubble */}
      <rect x="0" y="0" rx="16" ry="16" width="200" height="50" />
    </ContentLoader>
  );
}
