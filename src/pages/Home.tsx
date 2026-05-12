import {
  makeStyles,
  tokens,
  Title1,
  Body1,
  Card,
  CardHeader,
  Button,
  Text,
} from '@fluentui/react-components'

const useStyles = makeStyles({
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    marginBottom: tokens.spacingVerticalXXL,
  },
  cardsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: tokens.spacingHorizontalXL,
    marginTop: tokens.spacingVerticalXXL,
  },
  card: {
    height: '100%',
  },
  title: {
    display: 'block',
  },
})

export const Home: React.FC = () => {
  const styles = useStyles()

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title1 className={styles.title}>Hello, world!</Title1>
        <Body1>
          This is a React application built with Fluent UI React v9 components.
          It includes routing, navigation, and sample pages.
        </Body1>
      </div>
      <div className={styles.cardsContainer}>
        <Card className={styles.card}>
          <CardHeader header={<Text weight="bold">Counter</Text>} />
          <Body1>
            Click the button to increment a counter. Demonstrates state management
            and Fluent UI Button component.
          </Body1>
          <Button appearance="subtle" as="a" href="/counter">
            Go to Counter →
          </Button>
        </Card>

        <Card className={styles.card}>
          <CardHeader header={<Text weight="bold">Weather Forecast</Text>} />
          <Body1>
            View sample weather data. Shows how to fetch and display data using
            React hooks and Fluent UI Table component.
          </Body1>
          <Button appearance="subtle" as="a" href="/weather">
            View Weather →
          </Button>
        </Card>
      </div>
    </div>
  )
}