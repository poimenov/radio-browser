import {
  makeStyles,
  tokens,
  Toolbar,
  ToolbarButton,
} from "@fluentui/react-components";
import {
  Settings20Regular,
  WeatherMoonRegular,
  WeatherSunnyRegular,
} from "@fluentui/react-icons";

interface SidebarProps {
  isDarkMode: boolean;
  onToggle: (darkMode: boolean) => void;
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
    accentColor: tokens.colorNeutralForegroundOnBrand,
    height: "48px",
    width: "100%",
  },
});

export const Header: React.FC<SidebarProps> = ({ isDarkMode, onToggle }) => {
  const styles = useStyles();

  return (
    <div className={styles.header}>
      <div style={{ display: "flex", gap: "8px" }}>
        {/* Логотип или название приложения */}
        <span style={{ fontWeight: "bold" }}>Radio Browser</span>
      </div>

      <Toolbar aria-label="App Toolbar">
        <ToolbarButton
          appearance="primary"
          icon={isDarkMode ? <WeatherSunnyRegular /> : <WeatherMoonRegular />}
          onClick={() => onToggle(!isDarkMode)}
        />
        <ToolbarButton appearance="primary" icon={<Settings20Regular />} />
      </Toolbar>
    </div>
  );
};
