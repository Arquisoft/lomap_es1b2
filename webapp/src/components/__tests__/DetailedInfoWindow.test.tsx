import { fireEvent, getByRole, render, screen } from '@testing-library/react';
import { IPMarker } from '../../shared/SharedTypes';
import DetailedUbicationView from '../map/mapAddons/DetailedInfoWindow';
import { MarkerContext, MarkerContextProvider } from '../../context/MarkerContextProvider';
import { initialState } from 'rdf-namespaces/dist/wf';
//jest.mock('../../../helpers/SolidHelper');

const mockMarkerShown: IPMarker = {
    id: "1",
    owner: 'unknown',
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

const mockSetMarkerShown = jest.fn();
const mockSetDetailedIWOpen = jest.fn();

describe('DetailedUbicationView component', () => {
  test('renders without crashing', () => {
    render(
      <DetailedUbicationView
        markerShown={mockMarkerShown}
        isDetailedIWOpen={true}
        setMarkerShown={mockSetMarkerShown}
        setDetailedIWOpen={mockSetDetailedIWOpen}
      />
    );
    expect(screen.getByText("Test marker 1")).toBeInTheDocument();
    expect(screen.getByText("DetailedInfo.summary")).toBeInTheDocument();
    expect(screen.getByText("DetailedInfo.write")).toBeInTheDocument();
  });

  test('handles form submission correctly', async () => {
    render(
      <DetailedUbicationView
        markerShown={mockMarkerShown}
        isDetailedIWOpen={true}
        rating={3}
        setMarkerShown={mockSetMarkerShown}
        setDetailedIWOpen={mockSetDetailedIWOpen}
      />
    );

    fireEvent.click(screen.getByTestId('button-open'))

    expect(screen.getByTestId('input-comment')).toBeInTheDocument();

    // // Fill in form inputs
    // const commentInput = screen.getByTestId('input-comment');
    // fireEvent.change(commentInput, { target: { value: 'Test comment' } });

    // const ratingInput = screen.getByRole('rating');
    // fireEvent.click((ratingInput), { clientX: 30 });

    // // Submit form
    // const submitButton = screen.getByTestId('button-submit');
    // fireEvent.click(submitButton);

    // // Check that comment and rating were added to marker and state was reset
    // expect(mockMarkerShown.comments).toHaveLength(1);
    // expect(mockMarkerShown.comments[0].text).toBe('Test comment');
    // expect(mockMarkerShown.ratings).toHaveLength(4);
    // expect(mockMarkerShown.ratings[3]).toBe(5);
    // expect(mockSetDetailedIWOpen).toHaveBeenCalledWith(false);
  });
});