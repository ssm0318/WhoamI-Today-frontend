import { Button, Layout } from '@design-system';

function Chats() {
  return (
    <Layout.FlexCol w="100%" justifyContent="flex-start" h="100vh" bgColor="WHITE">
      <Layout.FlexCol gap={10} ml={10} mt={10}>
        <Button.Primary status="disabled" text="Primary Disabled" />
        <Button.Primary status="normal" text="Primary Enabled" />
        <Button.Secondary status="disabled" text="Secondary Disabled" />
        <Button.Secondary status="normal" text="Secondary Enabled" />
        <Button.Tertiary status="disabled" text="Tertiary Disabled" />
        <Button.Tertiary status="normal" text="Tertiary Enabled" />
      </Layout.FlexCol>
    </Layout.FlexCol>
  );
}

export default Chats;
