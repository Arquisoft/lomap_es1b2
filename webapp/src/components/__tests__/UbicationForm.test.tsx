import { fireEvent, getByText, render, screen } from "@testing-library/react";
import NewUbicationForm from "../map/mapAddons/NewUbicationForm";

describe('NewUbicationForm', () => {
  const defaultProps = {
    globalLat: 0,
    globalLng: 0,
    globalName: '',
    formOpened: true,
    globalAddress: '',
    globalCategory: 'Museos',
    globalDescription: '',
    nextID: { current: '1' },
    addMarker: jest.fn(),
    setGlobalLat: jest.fn(),
    setGlobalLng: jest.fn(),
    setGlobalName: jest.fn(),
    setFormOpened: jest.fn(),
    setGlobalDescription: jest.fn(),
    setGlobalCategory: jest.fn(),
    setAcceptedMarker: jest.fn(),
  };

  it('should render the form', () => {
    render(<NewUbicationForm {...defaultProps} />);
    expect(screen.getByText('Latitud')).toBeInTheDocument();
    expect(screen.getByText('Longitud')).toBeInTheDocument();
    expect(screen.getByText('Nombre')).toBeInTheDocument();
    expect(screen.getByText('Descripción')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Museos')).toBeInTheDocument();
  });

  it('should submit the form when the "Aceptar" button is clicked', () => {
    render(<NewUbicationForm {...defaultProps} />);
    const submitButton = screen.getByText('Aceptar');
    fireEvent.click(submitButton);
    expect(defaultProps.addMarker).toHaveBeenCalled();
    expect(defaultProps.setAcceptedMarker).toHaveBeenCalledWith(true);
  });

  it('should close the form when the "Cancelar" button is clicked', () => {
    render(<NewUbicationForm {...defaultProps} />);
    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);
    expect(defaultProps.setFormOpened).toHaveBeenCalledWith(false);
  });
});
