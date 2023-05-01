import { render, screen, act } from "@testing-library/react";
import { IPMarker } from "../../shared/SharedTypes";
import UbicationsView from "../map/mapAddons/UbicationsView";
import NotificationsSystem, {setUpNotifications, useNotifications} from 'reapop'
import { MarkerContextProvider } from "../../context/MarkerContextProvider";

describe("UbicationsView", () => {
  const marker1: IPMarker = {
    id: "1",
    date: new Date(),
    lat: 0,
    lng: 0,
    name: "Test marker 1",
    webId: "https://example.com/user1#me",
    address: "123 Main St",
    category: "Test",
    isPublic: false,
    ratings: [],
    comments: [],
    description: "This is a test marker",
    owner: "o1"
  };
  const marker2: IPMarker = {
    id: "2",
    date: new Date(),
    lat: 0,
    lng: 0,
    name: "Test marker 2",
    webId: "https://example.com/user2#me",
    address: "456 Main St",
    category: "Test",
    isPublic: false,
    ratings: [],
    comments: [],
    description: "This is another test marker",
    owner: "o2"
  };
  const markers = [marker1, marker2];

  setUpNotifications({
    generateId: () => 'mocked-id'
  })

  it("displays a list of the user's ubications", async () => {
    render(
      <MarkerContextProvider>
        <UbicationsView myMarkers={markers} opt={false}/>
      </MarkerContextProvider>
    );    
    
    const marker1Name = screen.getByText('Test marker 1');
    expect(marker1Name).toBeInTheDocument();
  });

  it("displays a message when the user has no ubications", async () => {
    render(
      <MarkerContextProvider>
        <UbicationsView opt={false}/>
      </MarkerContextProvider>
    );

    expect(screen.getByText("UbicationsView.notyet")).toBeInTheDocument();
  });
});
