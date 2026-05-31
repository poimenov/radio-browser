import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  makeStyles,
  tokens,
  FluentProvider,
  createLightTheme,
  createDarkTheme,
  BrandVariants,
  useId,
  Toaster,
  useToastController,
  Toast,
  ToastTitle,
  ToastBody,
} from "@fluentui/react-components";
import { useServices } from "../contexts/ServicesContext";
import { AppSettings, OfficeColor } from "../types/AppSettings";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useAppState } from "../contexts/AppStateContext";
import { Player } from "../components/Player";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100dvh",
    height: "100dvh",
  },
  mainContainer: {
    display: "flex",
    flex: 1,
    minHeight: 0,
    overflow: "hidden",
    "@media (max-width: 768px)": {
      flexDirection: "column",
    },
  },
  contentWrapper: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minHeight: 0,
    overflow: "hidden",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minHeight: 0,
    overflow: "hidden",
    backgroundColor: tokens.colorNeutralBackground2,
    transition: "margin-left 0.2s ease",
  },
  outlet: {
    flex: 1,
    minHeight: 0,
    overflowY: "auto",
  },
  playerArea: {
    flexShrink: 0,
    borderTop: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground1,
    padding: tokens.spacingVerticalS,
  },
});

export const MainLayout: React.FC = () => {
  const { appSettings, appSettingsService } = useServices();
  const { state, registerAudioElement } = useAppState();
  const [localSettings, setLocalSettings] = useState(appSettings);
  const audioRef = useRef<HTMLAudioElement>(null);
  const toasterId = useId("toaster");
  const { dispatchToast } = useToastController(toasterId);

  const setAccentColor = useCallback(
    (color: OfficeColor) => {
      setLocalSettings((prev) => ({ ...prev, accentColor: color }));
    },
    [],
  );
  const setIsDarkMode = useCallback(
    (darkMode: boolean) => {
      setLocalSettings((prev) => ({ ...prev, isDarkMode: darkMode }));
    },
    [],
  );
  const setIsCollapsed = useCallback(
    (collapsed: boolean) => {
      setLocalSettings((prev) => ({ ...prev, isCollapsed: collapsed }));
    },
    [],
  );

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = useCallback(
    () => setIsMobileMenuOpen((prev) => !prev),
    [],
  );
  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const saveSettings = async () => {
      await appSettingsService.saveSettings(localSettings);
    };
    void saveSettings();
  }, [localSettings, appSettingsService]);

  // Регистрируем audio элемент в контексте
  useEffect(() => {
    if (audioRef.current) {
      registerAudioElement(audioRef.current);
    }
  }, [registerAudioElement]);

  const notifyError = useCallback(
    (message: string) => {
      dispatchToast(
        <Toast>
          <ToastTitle>Ошибка</ToastTitle>
          <ToastBody>{message}</ToastBody>
        </Toast>,
        { intent: "error" },
      );
    },
    [dispatchToast],
  );

  const getBrandTheme = useCallback((settings: AppSettings): BrandVariants => {
    switch (settings.accentColor) {
      case "Windows":
        return {
          10: "#020305",
          20: "#111723",
          30: "#17263E",
          40: "#193254",
          50: "#1B3F6B",
          60: "#1B4C83",
          70: "#18599C",
          80: "#1267B5",
          90: "#0475CF",
          100: "#3983D8",
          110: "#5A90DD",
          120: "#749EE2",
          130: "#8BACE7",
          140: "#A1BBEC",
          150: "#B7CAF0",
          160: "#CBD8F5",
        };
      case "Word":
        return {
          10: "#020305",
          20: "#121722",
          30: "#1A253C",
          40: "#1F3152",
          50: "#233D69",
          60: "#274A81",
          70: "#2B579A",
          80: "#4164A3",
          90: "#5571AB",
          100: "#687FB4",
          110: "#7A8DBD",
          120: "#8B9BC5",
          130: "#9DA9CE",
          140: "#AEB8D7",
          150: "#C0C7E0",
          160: "#D1D7E8",
        };
      case "Excel":
        return {
          10: "#020402",
          20: "#101C14",
          30: "#162E1F",
          40: "#193C27",
          50: "#1C4A2F",
          60: "#1E5937",
          70: "#20683F",
          80: "#28764A",
          90: "#40835A",
          100: "#56906B",
          110: "#6A9E7C",
          120: "#7FAB8D",
          130: "#93B89F",
          140: "#A7C6B1",
          150: "#BCD3C3",
          160: "#D1E1D5",
        };
      case "PowerPoint":
        return {
          10: "#060201",
          20: "#23130B",
          30: "#3B1C13",
          40: "#4F2417",
          50: "#642B1B",
          60: "#7A331F",
          70: "#913A23",
          80: "#A84227",
          90: "#BB4D30",
          100: "#C56144",
          110: "#CE7358",
          120: "#D7866C",
          130: "#DF9882",
          140: "#E6AA97",
          150: "#EDBDAD",
          160: "#F3CFC4",
        };
      case "PowerBI":
        return {
          10: "#040301",
          20: "#1D180B",
          30: "#302811",
          40: "#3E3313",
          50: "#4C3F15",
          60: "#5B4C17",
          70: "#6B5818",
          80: "#7A6519",
          90: "#8A731A",
          100: "#9B801A",
          110: "#AC8E19",
          120: "#BD9C19",
          130: "#CEAA17",
          140: "#E0B915",
          150: "#F1C711",
          160: "#FBD86B",
        };
      case "OneNote":
        return {
          10: "#050106",
          20: "#211029",
          30: "#37154A",
          40: "#4A1866",
          50: "#5E1984",
          60: "#7219A2",
          70: "#802CB0",
          80: "#8D40B7",
          90: "#9853BE",
          100: "#A465C5",
          110: "#AF76CC",
          120: "#BA88D3",
          130: "#C59ADA",
          140: "#D0ABE1",
          150: "#DABDE7",
          160: "#E5CFEE",
        };
      default: // Default
        return {
          10: "#060204",
          20: "#24101C",
          30: "#3F1630",
          40: "#561940",
          50: "#6D1B51",
          60: "#851C63",
          70: "#9D1C75",
          80: "#B71987",
          90: "#D1149A",
          100: "#EC08AE",
          110: "#F43FB9",
          120: "#F962C2",
          130: "#FC7ECB",
          140: "#FF97D5",
          150: "#FFB0DE",
          160: "#FFC7E7",
        };
    }
  }, []);

  const createTheme = (isDarkMode: boolean, color: OfficeColor) => {
    const brandTheme = getBrandTheme({ ...localSettings, accentColor: color });
    return isDarkMode ? createDarkTheme(brandTheme) : createLightTheme(brandTheme);
  };

  const currentTheme = useMemo(
    () => createTheme(localSettings.isDarkMode, localSettings.accentColor),
    [localSettings.isDarkMode, localSettings.accentColor],
  );

  const styles = useStyles();

  return (
    <FluentProvider theme={currentTheme}>
      <Toaster toasterId={toasterId} />
      <div className={styles.root}>
        <Header
          isDarkMode={localSettings.isDarkMode}
          setIsDarkMode={setIsDarkMode}
          accentColor={localSettings.accentColor}
          setAccentColor={setAccentColor}
          onMobileMenuToggle={toggleMobileMenu}
          mobileMenuOpen={isMobileMenuOpen}
        />
        <div className={styles.mainContainer}>
          <Sidebar
            isCollapsed={localSettings.isCollapsed}
            onToggle={setIsCollapsed}
            isMobileOpen={isMobileMenuOpen}
            onMobileClose={closeMobileMenu}
          />
          <div className={styles.contentWrapper}>
            <div className={styles.content}>
              <div className={styles.outlet}>
                <Outlet />
              </div>
            </div>
            {state.selectedStation && (
              <div className={styles.playerArea}>
                <Player
                  key={state.selectedStation.id}
                  station={state.selectedStation}
                />
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>

      {/* audio элемент для воспроизведения */}
      <audio
        ref={audioRef}
        style={{ display: "none" }}
        onError={(e) => {
          const error = e.currentTarget.error;
          notifyError(error?.message || "Ошибка воспроизведения");
        }}
      />
    </FluentProvider>
  );
};