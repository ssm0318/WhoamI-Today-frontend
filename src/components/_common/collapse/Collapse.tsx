import { ReactElement, useState } from 'react';
import Icon from '@components/_common/icon/Icon';
import { Layout, Typo } from '@design-system';

interface CollapseProps {
  title: string;
  collapsedItem: ReactElement;
}

function Collapse({ title, collapsedItem }: CollapseProps) {
  const [open, setOpen] = useState(true);

  const toggleCollapse = () => {
    setOpen((prev) => !prev);
  };

  return (
    <>
      <Layout.FlexRow
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        pv={12}
        pl={16}
        pr={10}
      >
        <Typo type="title-medium">{title}</Typo>
        {open ? (
          <Icon name="expand_close" size={28} onClick={toggleCollapse} />
        ) : (
          <Icon name="expand_open" size={28} onClick={toggleCollapse} />
        )}
      </Layout.FlexRow>
      {open && collapsedItem}
    </>
  );
}

export default Collapse;
