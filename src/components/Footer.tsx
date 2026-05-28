import { useEffect, useState } from 'react';
import { useAppState } from "../contexts/AppStateContext";
import { makeStyles, tokens, Text } from "@fluentui/react-components";
import { nowPlaying } from "../services/MetadataService";
import { useServices } from "../contexts/ServicesContext";

const useStyles = makeStyles({
  footer: {
    textAlign: "center",
    padding: tokens.spacingVerticalM,
    backgroundColor: tokens.colorNeutralBackground1,
    borderTop: `1px solid ${tokens.colorNeutralStroke1}`,
    width: "100%",
    flexShrink: 0,
  },
  link: {
    color: tokens.colorNeutralForeground1,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
});

const defaultTitle = "© 2026 Radio Browser";

const searchUrl = (title: string) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(title)}`;

export const Footer = () => {
  const styles = useStyles();
  const { state } = useAppState();
  const [title, setTitle] = useState(defaultTitle);
  const { historyDataAccess } = useServices();

  useEffect(() => {
    if (!state.selectedStation) {
      setTitle(defaultTitle);
      return;
    }

    nowPlaying.trackStream(state.selectedStation.urlResolved);

    const subscription = nowPlaying.subscribe((info) => {
      if (info.error) {
        console.error("Error receiving metadata:", info.error);
        setTitle(defaultTitle);
        return;
      }
      setTitle(info.title);
      // Сохранение в историю
      if (state.selectedStation && info.title && info.title !== defaultTitle) {
        historyDataAccess.add({
          startTime: new Date(),
          title: info.title,
          stationName: state.selectedStation.name,
        }).catch(console.error);
      }
    });

    return () => subscription.unsubscribe();
  }, [state.selectedStation]);

  const displayText = state.selectedStation && title !== defaultTitle ? title : defaultTitle;
  const isLink = state.selectedStation && title !== defaultTitle;

  return (
    <div className={styles.footer}>
      <Text size={200}>
        {isLink ? (
          <a href={searchUrl(title)} target="_blank" rel="noopener noreferrer" className={styles.link} title="Search on YouTube">
            {displayText}
          </a>
        ) : (
          displayText
        )}
      </Text>
    </div>
  );
};