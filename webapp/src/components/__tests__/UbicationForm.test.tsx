import { render, fireEvent, screen } from '@testing-library/react';
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
    expect(screen.getByLabelText('NewUbication.latitud')).toBeInTheDocument();
    expect(screen.getByLabelText('NewUbication.longitud')).toBeInTheDocument();
    expect(screen.getByLabelText('NewUbication.name')).toBeInTheDocument();
    expect(screen.getByLabelText('NewUbication.descp')).toBeInTheDocument();
    expect(screen.getByText('NewUbication.acept')).toBeInTheDocument();
    expect(screen.getByText('NewUbication.cancel')).toBeInTheDocument();
  });

  it('should call handleSubmit when the form is submitted', () => {
    const handleSubmit = jest.fn();
    const { getByLabelText, getByText } = render(
      <NewUbicationForm {...props} />,
    );

    fireEvent.change(getByLabelText('NewUbication.latitud'), { target: { value: '1' } });
    fireEvent.change(getByLabelText('NewUbication.longitud'), { target: { value: '2' } });
    fireEvent.change(getByLabelText('NewUbication.name'), { target: { value: 'Test name' } });
    fireEvent.change(getByLabelText('NewUbication.descp'), { target: { value: 'Test description' } });
    fireEvent.click(getByText('NewUbication.acept'));

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        preventDefault: expect.any(Function),
      }),
    );
  });

  it('should call setFormOpened when the cancel button is clicked', () => {
    const { getByText } = render(<NewUbicationForm {...props} />);
    fireEvent.click(getByText('NewUbication.cancel'));
    expect(props.setFormOpened).toHaveBeenCalledWith(false);
  });
});
