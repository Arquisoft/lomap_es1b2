import { render, screen, act } from "@testing-library/react";
import { SessionProvider } from "@inrupt/solid-ui-react";
import React from "react";
import { IPMarker } from "../../shared/SharedTypes";
import UbicationsView from "../map/mapAddons/UbicationsView";
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
  };
  const markers = [marker1, marker2];

  it("displays a list of the user's ubications", async () => {
    const dispatchMock = jest.fn();
    jest.spyOn(React, "useContext").mockImplementation(() => ({
      state: markers,
      dispatch: dispatchMock,
    }));

    await act(async () => {
      render(
        <SessionProvider sessionId="test">
          <MarkerContextProvider>
            <UbicationsView />
          </MarkerContextProvider>
        </SessionProvider>
      );
    });

    const marker1Name = screen.getByText(marker1.name);
    const marker2Name = screen.getByText(marker2.name);
    expect(marker1Name).toBeInTheDocument();
    expect(marker2Name).toBeInTheDocument();
  });

  it("displays a message when the user has no ubications", async () => {
    const dispatchMock = jest.fn();
    jest.spyOn(React, "useContext").mockImplementation(() => ({
      state: [],
      dispatch: dispatchMock,
    }));

    await act(async () => {
      render(
        <SessionProvider sessionId="test">
          <MarkerContextProvider>
            <UbicationsView />
          </MarkerContextProvider>
        </SessionProvider>
      );
    });

    expect("Aún no has creado ninguna ubicación").toBeInTheDocument();
  });
});
