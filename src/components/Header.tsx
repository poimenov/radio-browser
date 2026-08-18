import React from 'react';
import {
  makeStyles,
  tokens,
  Toolbar,
  ToolbarButton,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
  MenuItemRadio,
  Hamburger,
} from "@fluentui/react-components";
import {
  Settings20Regular,
  WeatherMoonRegular,
  WeatherSunnyRegular,
  Color20Regular,
  RectangleLandscape20Filled,
} from "@fluentui/react-icons";
import { OfficeColor } from "../types/AppSettings";

interface HeaderProps {
  isDarkMode: boolean;
  setIsDarkMode: (darkMode: boolean) => void;
  accentColor: OfficeColor;
  setAccentColor: (color: OfficeColor) => void;
  onMobileMenuToggle?: () => void;
  mobileMenuOpen?: boolean;
}

const useStyles = makeStyles({
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: `0 ${tokens.spacingHorizontalXL}`,
    backgroundColor: tokens.colorBrandBackground,
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
    color: tokens.colorNeutralForegroundOnBrand,
    height: "48px",
    width: "100%",
    "@media (max-width: 768px)": {
      flexWrap: "wrap",
      justifyContent: "space-between",
      padding: `0 ${tokens.spacingHorizontalM}`,
      height: "auto",
      rowGap: tokens.spacingVerticalS,
    },
  },
  title: {
    fontWeight: "bold",
    fontSize: tokens.fontSizeHero900,
    color: tokens.colorBrandForeground2Hover,
    WebkitTextStroke: `1px ${tokens.colorBrandStroke2Contrast}`,
    "@media (max-width: 768px)": {
      fontSize: tokens.fontSizeBase600,
    },
  },
  savedIndicator: {
    fontSize: "12px",
    marginLeft: "8px",
    opacity: 0,
    transition: "opacity 0.3s ease",
    '&.visible': {
      opacity: 1,
    },
  },
  menuButton: {
    display: "none",
    "@media (max-width: 768px)": {
      display: "inline-flex",
    },
  },
  colorPreview: {
    marginLeft: '8px',
    width: '12px',
    height: '12px',
    borderRadius: '2px',
    display: 'inline-block',
  },
});

export const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  setIsDarkMode,
  accentColor,
  setAccentColor,
  onMobileMenuToggle,
  mobileMenuOpen,
}) => {
  const styles = useStyles();

  const officeColors: OfficeColor[] = ['Default', 'Windows', 'Word', 'Excel', 'PowerPoint', 'PowerBI', 'OneNote'];

  const getColor = (color: OfficeColor): string => {
    switch (color) {
      case 'Default':
        return "#F005B1";
      case 'Windows':
        return "#0078d4";
      case 'Word':
        return "#2b579a";
      case 'Excel':
        return "#217346";
      case 'PowerPoint':
        return "#b7472a";
      case 'PowerBI':
        return "#f2c811";
      case 'OneNote':
        return "#7719aa";
    }
  };

  const handleColorChange = (color: OfficeColor) => {
    setAccentColor(color);
  };

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  const AccentSubMenu = () => (
    <Menu>
      <MenuTrigger disableButtonEnhancement>
        <MenuItem icon={<Color20Regular />}>
          Select Accent Color
          {accentColor && (
            <span
              className={styles.colorPreview}
              style={{ backgroundColor: getColor(accentColor) }}
            />
          )}
        </MenuItem>
      </MenuTrigger>
      <MenuPopover>
        <MenuList
          checkedValues={{ accentColor: [accentColor] }}
          onCheckedValueChange={(_, data) => {
            if (data.name === 'accentColor' && data.checkedItems.length > 0) {
              handleColorChange(data.checkedItems[0] as OfficeColor);
            }
          }}
        >
          {officeColors.map(color => (
            <MenuItemRadio
              key={color}
              name="accentColor"
              value={color}
              icon={
                <RectangleLandscape20Filled
                  style={{ color: getColor(color) }}
                />
              }
            >
              {color}
            </MenuItemRadio>
          ))}
        </MenuList>
      </MenuPopover>
    </Menu>
  );

  return (
    <div className={styles.header}>
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        {onMobileMenuToggle && (
          <Hamburger
            className={styles.menuButton}
            onClick={onMobileMenuToggle}
            size="medium"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          />
        )}
        <span className={styles.title}>Radio Browser</span>
      </div>

      <Toolbar aria-label="App Toolbar">
        <Menu positioning={{ autoSize: true }}>
          <MenuTrigger disableButtonEnhancement>
            <ToolbarButton appearance="primary" icon={<Settings20Regular />} />
          </MenuTrigger>

          <MenuPopover>
            <MenuList>
              <MenuItem
                onClick={handleThemeToggle}
                icon={isDarkMode ? <WeatherSunnyRegular /> : <WeatherMoonRegular />}
              >
                {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              </MenuItem>
              <AccentSubMenu />
            </MenuList>
          </MenuPopover>
        </Menu>
      </Toolbar>
    </div>
  );
};