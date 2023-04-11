import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Map from '../map/Map'
import IMapProps from '../map/Map'

// Mock the Google Maps API global variable
const google = {
    maps: {
      Map: jest.fn(),
      LatLng: jest.fn(),
      Marker: jest.fn(),
      InfoWindow: jest.fn(),
      event: {
        addListener: jest.fn(),
      },
      MapTypeId: {
        ROADMAP: 'roadmap',
        SATELLITE: 'satellite',
        HYBRID: 'hybrid',
        TERRAIN: 'terrain',
      },
    },
  };
  
  jest.mock('google-map-react', () => ({
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  }));
  
  // Mock the MarkerContextProvider component
  jest.mock('../../context/MarkerContextProvider', () => ({
    __esModule: true,
    Types: {},
    MarkerContext: {
      Provider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
      Consumer: jest.fn(),
    },
  }));
  
  // Mock the useSession hook
  jest.mock('@inrupt/solid-ui-react', () => ({
    __esModule: true,
    useSession: () => ({
      session: { info: { isLoggedIn: false } },
    }),
  }));
  
  describe('Map component', () => {
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
        mapType: google.maps.MapTypeId.ROADMAP,
        globalFilterCategories: [],
        nextID: { current: '' },
        setGlobalLat: jest.fn(),
        setGlobalLng: jest.fn(),
        setMarkerShown: jest.fn(),
        setDetailedIWOpen: jest.fn(),
        setGlobalAddress: jest.fn(),
        setAcceptedMarker: jest.fn(),
      };
  
    it('should render the component', () => {
      render(<Map {...props} />);
      const mapElement = screen.getByTestId('map');
      expect(mapElement).toBeInTheDocument();
    });
  
    it('should start the map when the component is mounted', () => {
      render(<Map {...props} />);
      expect(google.maps.Map).toHaveBeenCalledTimes(1);
    });
  
    it('should add a home marker when the map is loaded', () => {
      render(<Map {...props} />);
      expect(google.maps.Marker).toHaveBeenCalledTimes(1);
    });
});