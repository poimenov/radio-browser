import { Routes, Route } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { Home } from "./pages/Home";
import { StationsByVotes } from "./pages/StationsByVotes";
import { StationsByClicks } from "./pages/StationsByClicks";
import { Favorites } from "./pages/Favorites";
import { Countries } from "./pages/Countries";
import { StationsByCountry } from "./pages/StationsByCountry";
import { ServicesProvider } from "./contexts/ServicesContext";
import { AppStateProvider } from "./contexts/AppStateContext";

function App(): React.ReactElement {
  return (
    <ServicesProvider>
      <AppStateProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="stationsByVotes" element={<StationsByVotes />} />
            <Route path="stationsByClicks" element={<StationsByClicks />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="countries" element={<Countries />} />
            <Route
              path="stationsByCountry/:code"
              element={<StationsByCountry />}
            />
          </Route>
        </Routes>
      </AppStateProvider>
    </ServicesProvider>
  );
}

export default App;
