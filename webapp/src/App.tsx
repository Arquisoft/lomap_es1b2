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

function App(): JSX.Element {
  const { session } = useSession();
  const { dispatch } = useContext(MarkerContext);
  const [scriptLoaded, setScriptLoaded] = useState(false);

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
  })

  function setMarkers(markers: IPMarker[]) {
    dispatch({ type: Types.SET_MARKERS, payload: { markers: markers } });
  }

  return (
    <>
      <NavBar></NavBar>
      <Routes>
        <Route path="/" element={
          <HomeView />
        } />
        <Route path="/map" element={scriptLoaded &&
          (<MapView />)
        } />
        <Route path="/ubications" element={
          <UbicationsView />
        } />
        <Route path="/friends" element={
          <FriendsList />
        } />
      </Routes>
    </>
  );
}

export default App;