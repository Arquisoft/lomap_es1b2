import { render, fireEvent, screen, getByTestId } from '@testing-library/react';
import NewUbicationForm from '../map/mapAddons/NewUbicationForm';

const props = {
  globalLat: 0,
  globalLng: 0,
  globalOwnr: '',
  globalName: '',
  formOpened: true,
  globalAddress: '',
  globalCategory: '',
  globalDescription: '',
  nextID: { current: '1' },
  addMarker: jest.fn(),
  setGlobalLat: jest.fn(),
  setGlobalLng: jest.fn(),
  setGlobalName: jest.fn(),
  setFormOpened: jest.fn(),
  setGlobalDescription: jest.fn(),
  setGlobalCategory: jest.fn(),
  setGlobalOwner: jest.fn(),
  setAcceptedMarker: jest.fn(),
  notify: jest.fn(),
};

describe('NewUbicationForm component', () => {
  it('should render the form fields', () => {
    render(<NewUbicationForm {...props} />);
    expect(screen.getByText('NewUbication.latitud')).toBeInTheDocument();
    expect(screen.getByText('NewUbication.longitud')).toBeInTheDocument();
    expect(screen.getByText('NewUbication.name')).toBeInTheDocument();
    expect(screen.getByText('NewUbication.descp')).toBeInTheDocument();
  });

  it('should call handleSubmit when the form is submitted', () => {
    const handleSubmit = jest.fn();
    const { getByTestId, getByText } = render(
      <NewUbicationForm {...props} />,
    );

    fireEvent.change(getByTestId('input-lat'), { target: { value: '1' } });
    fireEvent.change(getByTestId('input-lon'), { target: { value: '2' } });
    fireEvent.change(getByTestId('input-name'), { target: { value: 'Test name' } });
    fireEvent.change(getByTestId('input-descp'), { target: { value: 'Test description' } });
    fireEvent.click(getByText('NewUbication.acept'));

    expect(props.addMarker).toHaveBeenCalledTimes(1);
  });

  it('should call setFormOpened when the cancel button is clicked', () => {
    const { getByText } = render(<NewUbicationForm {...props} />);
    fireEvent.click(getByText('NewUbication.cancel'));
    expect(props.setFormOpened).toHaveBeenCalledWith(false);
  });
});
