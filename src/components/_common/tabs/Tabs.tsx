import { StyledTab, StyledTabs } from '@components/_common/tabs/Tabs.styled';
import { ColorKeys, Font } from '@design-system';
import { DisplayType } from 'src/design-system/Font/Font.types';

interface Tab<T> {
  key: T;
  text: string;
}

interface TabsProps<T> {
  tabList: Tab<T>[];
  selectedKey: T;
  displayFontType: DisplayType;
  bgColor?: ColorKeys;
  tabWidth?: number;
  onClick: (key: T) => void;
}

function Tabs<T extends string>({
  tabList,
  selectedKey,
  displayFontType,
  bgColor,
  tabWidth,
  onClick,
}: TabsProps<T>) {
  return (
    <StyledTabs bgColor={bgColor}>
      {tabList.map(({ key, text }) => (
        <StyledTab
          key={key}
          className={key === selectedKey ? 'active' : ''}
          w={tabWidth}
          onClick={() => onClick(key)}
        >
          <Font.Display type={displayFontType} textAlign="center">
            {text}
          </Font.Display>
        </StyledTab>
      ))}
    </StyledTabs>
  );
}

export default Tabs;
