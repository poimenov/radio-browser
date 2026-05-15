import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  NavDrawer,
  NavDrawerHeader,
  NavDrawerBody,
  NavItem,
  Tooltip,
  Hamburger,
  makeStyles,
  tokens,
} from "@fluentui/react-components";
import {
  Home20Regular,
  Vote20Regular,
  Heart20Regular,
  CursorClick20Regular,
  Flag20Regular,
  Tag20Regular,
} from "@fluentui/react-icons";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: (collapsed: boolean) => void;
}

const useStyles = makeStyles({
  navDrawer: {
    width: "150px",
    minWidth: "150px",
    transition: "width 0.2s ease",
    flexShrink: 0,
    "@media (max-width: 768px)": {
      width: "100% !important",
      minWidth: "100% !important",
      position: "relative",
    },
  },
  navItem: {
    "& svg": {
      color: tokens.colorNeutralForeground2,
      transition: "color 0.2s ease",
    },
    "&:hover svg": {
      color: tokens.colorBrandForeground1,
    },
    "&[aria-current='page'] svg": {
      color: tokens.colorBrandForeground1,
    },
  },
});

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const styles = useStyles();
  const [selected, setSelected] = React.useState(useLocation().pathname);
  const navigate = useNavigate();

  const onNavItemChange = (data: string) => {
    setSelected(data);
    navigate(data);
  };

  const toggleSidebar = () => {
    onToggle(!isCollapsed);
  };

  const drawerWidth = isCollapsed ? "54px" : "150px";
  const positioning = "after";

  return (
    <NavDrawer
      className={styles.navDrawer}
      selectedValue={selected}
      onNavItemSelect={(_, data) => onNavItemChange(data.value)}
      open={true}
      position="start"
      type="inline"
      style={{
        width: drawerWidth,
        minWidth: drawerWidth,
      }}
    >
      <NavDrawerHeader>
        <Tooltip
          content={isCollapsed ? "Expand" : "Collapse"}
          relationship="label"
          positioning={positioning}
        >
          <Hamburger
            onClick={toggleSidebar}
            size="medium"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          />
        </Tooltip>
      </NavDrawerHeader>
      <NavDrawerBody
        style={{
          overflowX: "hidden",
        }}
      >
        <Tooltip content="Home" relationship="label" positioning={positioning}>
          <NavItem className={styles.navItem} icon={<Home20Regular />} value="/">
            Home
          </NavItem>
        </Tooltip>
        <Tooltip
          content="Favorites"
          relationship="label"
          positioning={positioning}
        >
          <NavItem className={styles.navItem} icon={<Heart20Regular />} value="/favorites">
            Favorites
          </NavItem>
        </Tooltip>
        <Tooltip
          content="Select the country to explore its radio stations"
          relationship="label"
          positioning={positioning}
        >
          <NavItem className={styles.navItem} icon={<Flag20Regular />} value="/countries">
            By Country
          </NavItem>
        </Tooltip>
        <Tooltip content="Select tags to explore radio stations" relationship="label" positioning={positioning}>
          <NavItem className={styles.navItem} icon={<Tag20Regular />} value="/tags">
            By Tag
          </NavItem>
        </Tooltip>
        <Tooltip
          content="Top Voted Stations"
          relationship="label"
          positioning={positioning}
        >
          <NavItem className={styles.navItem} icon={<Vote20Regular />} value="/stationsByVotes">
            By Votes
          </NavItem>
        </Tooltip>
        <Tooltip
          content="Top Clicked Stations"
          relationship="label"
          positioning={positioning}
        >
          <NavItem className={styles.navItem} icon={<CursorClick20Regular />} value="/stationsByClicks">
            By Clicks
          </NavItem>
        </Tooltip>
      </NavDrawerBody>
    </NavDrawer>
  );
};
