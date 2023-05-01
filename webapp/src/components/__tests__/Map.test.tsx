import { render, screen } from '@testing-library/react';
import { MarkerContextProvider } from '../../context/MarkerContextProvider';
import { loadMapApi } from '../../utils/GoogleMapsUtils';
import LoMap from '../map/Map';

  const props: any = {
    globalLat: 0,
    globalLng: 0,
    globalName: '',
    globalMode: '',
    globalAddress: '',
    globalCategory: '',
    acceptedMarker: false,
    globalFilterName: '',
    mapTypeControl: false,
    globalDescription: '',
    mapType: 'ROADMAP',
    globalFilterCategories: [],
    nextID: { current: '1' },
    setGlobalLat: jest.fn(),
    setGlobalLng: jest.fn(),
    setMarkerShown: jest.fn(),
    setDetailedIWOpen: jest.fn(),
    setGlobalAddress: jest.fn(),
    setAcceptedMarker: jest.fn(),
  };

  describe('Map component', () => {
    it('should render the component', () => {
      const googleMapScript = loadMapApi();
      googleMapScript.addEventListener('load', function () {
        render(<MarkerContextProvider><LoMap {...props} /></MarkerContextProvider>);
        const mapElement = screen.getByTestId('map');
        expect(mapElement).toBeInTheDocument();
      });
    });
});
