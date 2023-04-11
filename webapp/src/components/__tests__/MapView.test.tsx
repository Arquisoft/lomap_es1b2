import { render, screen, fireEvent } from '@testing-library/react';
import { SessionProvider } from '@inrupt/solid-ui-react';
import { v4 as uuid } from 'uuid';
import { MarkerContextProvider } from '../../context/MarkerContextProvider';
import MapView from '../map/mapAddons/MapView';

describe('MapView component', () => {
    const session = {
        info: {
            isLoggedIn: true,
            webId: 'https://example.com/profile/card#me'
        },
        onLogout: jest.fn()
    };

    test('renders MapView component', () => {
        render(
            <MarkerContextProvider>
                <MapView />
            </MarkerContextProvider>
        );
        expect(screen.getByText('Filtros')).toBeInTheDocument();
    });

    // test('opens filter dialog', () => {
    //     render(
    //         <SessionProvider session={session}>
    //             <MarkerContextProvider>
    //                 <MapView />
    //             </MarkerContextProvider>
    //         </SessionProvider>
    //     );
    //     fireEvent.click(screen.getByText('Filtros'));
    //     expect(screen.getByText('Filtra las ubicaciones')).toBeInTheDocument();
    // });

    // test('sets filter name', () => {
    //     render(
    //         <SessionProvider session={session}>
    //             <MarkerContextProvider>
    //                 <MapView />
    //             </MarkerContextProvider>
    //         </SessionProvider>
    //     );
    //     fireEvent.click(screen.getByText('Filtros'));
    //     const input = screen.getByRole('textbox');
    //     fireEvent.change(input, { target: { value: 'test' } });
    //     expect(input.value).toBe('test');
    // });

    // test('selects filter categories', () => {
    //     render(
    //         <SessionProvider session={session}>
    //             <MarkerContextProvider>
    //                 <MapView />
    //             </MarkerContextProvider>
    //         </SessionProvider>
    //     );
    //     fireEvent.click(screen.getByText('Filtros'));
    //     fireEvent.click(screen.getByLabelText('museos'));
    //     fireEvent.click(screen.getByLabelText('parques'));
    //     expect(screen.getByLabelText('Categorías seleccionadas')).toHaveAttribute('value', 'Museos,Parques');
    // });

    // test('closes filter dialog', () => {
    //     render(
    //         <SessionProvider session={session}>
    //             <MarkerContextProvider>
    //                 <MapView />
    //             </MarkerContextProvider>
    //         </SessionProvider>
    //     );
    //     fireEvent.click(screen.getByText('Filtros'));
    //     fireEvent.click(screen.getByLabelText('Cerrar'));
    //     expect(screen.queryByText('Filtra las ubicaciones')).toBeNull();
    // });

    // test('opens new ubication form', () => {
    //     render(
    //         <SessionProvider session={session}>
    //             <MarkerContextProvider>
    //                 <MapView />
    //             </MarkerContextProvider>
    //         </SessionProvider>
    //     );
    //     fireEvent.click(screen.getByText('Agregar ubicación'));
    //     expect(screen.getByText('Agregar nueva ubicación')).toBeInTheDocument();
 });