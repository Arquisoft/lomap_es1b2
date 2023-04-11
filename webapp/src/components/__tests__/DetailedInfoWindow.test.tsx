import { fireEvent, render, screen } from '@testing-library/react';
import { IPMarker } from '../../shared/SharedTypes';
import DetailedUbicationView from '../map/mapAddons/DetailedInfoWindow';
import { MarkerContext, MarkerContextProvider } from '../../context/MarkerContextProvider';
import { initialState } from 'rdf-namespaces/dist/wf';
jest.mock('../../../helpers/SolidHelper');

const markerShown: IPMarker = {
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

describe('DetailedUbicationView', () => {
  it('should render the component', () => {
    render(
      <MarkerContextProvider>
        <DetailedUbicationView
          markerShown={markerShown}
          isDetailedIWOpen={true}
          setMarkerShown={jest.fn()}
          setDetailedIWOpen={jest.fn()}
        />
      </MarkerContextProvider>
    );

    expect(screen.getByText('Test marker')).toBeInTheDocument();
    expect(screen.getByText('Dirección: test address')).toBeInTheDocument();
    expect(screen.getByText('Categoría: test')).toBeInTheDocument();
    expect(screen.getByText('Descripción: test description')).toBeInTheDocument();
    expect(screen.getByText('Resumen de reseñas')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Escribir una reseña' })).toBeInTheDocument();
  });

  it('should show the rating dialog when the button is clicked', async () => {
    render(
      <MarkerContextProvider>
        <DetailedUbicationView
          markerShown={markerShown}
          isDetailedIWOpen={true}
          setMarkerShown={jest.fn()}
          setDetailedIWOpen={jest.fn()}
        />
      </MarkerContextProvider>
    );

    const ratingButton = screen.getByRole('button', { name: 'Escribir una reseña' });
    fireEvent.click(ratingButton);

    expect(screen.getByText('Valora esta ubicación')).toBeInTheDocument();
  });
});