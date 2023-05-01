import './App.css';
import HomeView from './components/HomeView';
import { NavBar } from './components/NavBar';
import { IPMarker } from './shared/SharedTypes';
import { Routes, Route } from "react-router-dom";
import { useSession } from '@inrupt/solid-ui-react';
import { loadMapApi } from './utils/GoogleMapsUtils';
import FriendsList from './components/friends/Friends';
import { useContext, useEffect, useState } from 'react';
import MapView from './components/map/mapAddons/MapView';
import UbicationsView from './components/map/mapAddons/UbicationsView';
import { readFriendMarkers, readMarkers } from './helpers/SolidHelper';
import { MarkerContext, Types } from './context/MarkerContextProvider';
import AboutUs from './components/AboutUs';
import NotificationsSystem, { atalhoTheme, setUpNotifications, useNotifications } from "reapop";
import i18n from './localize/i18n';

setUpNotifications({
  defaultProps: {
    position: "top-right",
    dismissible: true,
    showDismissButton: true,
    dismissAfter: 3000,
  },
});

function App(): JSX.Element {
    const { session } = useSession();
    const { dispatch } = useContext(MarkerContext);
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const { notifications, dismissNotification } = useNotifications();
    const [lang, setLang] = useState<string>(["en", "es", "fr"].includes(i18n.language) ? i18n.language : "en");

    useEffect(() => {
      const googleMapScript = loadMapApi();
      googleMapScript.addEventListener('load', function () {
        setScriptLoaded(true);
      });
    }, []);

    session.onLogin(async () => {
      let markers = await readFriendMarkers(session.info.webId!);
      (await readMarkers(session.info.webId!)).forEach(m => markers.push(m));

      setMarkers(markers);
    })

    session.onLogout(async () => {
      setMarkers([])
      window.location.reload();
    })

    function setMarkers(markers: IPMarker[]) {
      dispatch({ type: Types.SET_MARKERS, payload: { markers: markers } });
    }

    return (
      <>
        <NavBar lang={lang} setLang={setLang} >
        </NavBar>
          <Routes>
            <Route path="/" element={
              <HomeView />
            } />
            <Route path="/map" element={scriptLoaded &&
              (<MapView />)
            } />
            <Route path="/ubications" element={
              <UbicationsView opt={true}/>
            } />
            <Route path="/friends" element={
              <FriendsList loading={true}/>
            } />
            <Route path="/aboutus" element={
              <AboutUs />
            } />
          </Routes>
          <NotificationsSystem
            notifications={notifications}
            dismissNotification={(id) => dismissNotification(id)}
            theme={atalhoTheme}
          />
      </>
    );
  }
export default App;