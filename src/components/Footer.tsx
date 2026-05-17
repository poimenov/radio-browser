// src/components/Footer.tsx
import { makeStyles, tokens, Text } from "@fluentui/react-components";

const useStyles = makeStyles({
  footer: {
    textAlign: "center",
    padding: tokens.spacingVerticalM,
    backgroundColor: tokens.colorNeutralBackground1,
    borderTop: `1px solid ${tokens.colorNeutralStroke1}`,
    width: "100%",
    flexShrink: 0,
  },
});

export const Footer = () => {
  const styles = useStyles();

  return (
    <div className={styles.footer}>
      <Text size={200}>© 2026 Radio Browser</Text>
    </div>
  );
};
