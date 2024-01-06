import { StyledTab, StyledTabs } from '@components/_common/tabs/Tabs.styled';
import { ColorKeys, Typo } from '@design-system';
import { FontType } from 'src/design-system/Font/Font.types';

interface Tab<T> {
  key: T;
  text: string;
}

interface TabsProps<T> {
  tabList: Tab<T>[];
  selectedKey: T;
  fontType?: FontType;
  bgColor?: ColorKeys;
  tabWidth?: number;
  onClick: (key: T) => void;
}

function Tabs<T extends string>({
  tabList,
  selectedKey,
  fontType,
  bgColor = 'LIGHT_GRAY',
  tabWidth,
  onClick,
}: TabsProps<T>) {
  return (
    <StyledTabs bgColor={bgColor} justifyContent="center" alignItems="center">
      {tabList.map(({ key, text }) => {
        const isSelected = key === selectedKey;
        return (
          <StyledTab
            key={key}
            className={isSelected ? 'active' : ''}
            w={tabWidth}
            onClick={() => onClick(key)}
          >
            <Typo
              type={fontType ?? isSelected ? 'button-small' : 'label-large'}
              textAlign="center"
              color={isSelected ? 'BLACK' : 'MEDIUM_GRAY'}
            >
              {text}
            </Typo>
          </StyledTab>
        );
      })}
    </StyledTabs>
  );
}

export default Tabs;
