import { StyledTab, StyledTabs } from '@components/_common/tabs/Tabs.styled';
import { ColorKeys, Font } from '@design-system';

interface Tab<T> {
  key: T;
  text: string;
}

interface TabsProps<T> {
  tabList: Tab<T>[];
  selectedKey: T;
  displayFontType: Font.DisplayType;
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
      {tabList.map(({ key, text }) => {
        const isSelected = key === selectedKey;
        return (
          <StyledTab
            key={key}
            className={isSelected ? 'active' : ''}
            w={tabWidth}
            onClick={() => onClick(key)}
          >
            <Font.Display
              type={displayFontType}
              textAlign="center"
              color={isSelected ? 'BASIC_BLACK' : 'GRAY_5'}
            >
              {text}
            </Font.Display>
          </StyledTab>
        );
      })}
    </StyledTabs>
  );
}

export default Tabs;
