import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ShallowRenderer } from 'react-dom/test-utils';
import { NavBar } from '../NavBar';

test('check the navbar when its not logged in', async () => {
    render (
        <BrowserRouter>
            <NavBar/>
        </BrowserRouter>
    );
    
    const logo = screen.getByAltText('logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "/logo-no-background.png");
    expect(logo).toHaveAttribute("alt", "logo");
    expect(screen.getByText("Mapa")).toBeInTheDocument();
    expect(screen.getByText("Iniciar sesión")).toBeInTheDocument();
})

// it('renders the Mis ubicaciones and Mis amigos links when logged in', () => {
//     // mock the session object with the isLoggedIn flag set to true      
//     render(
//         <BrowserRouter>
//             <NavBar />
//         </BrowserRouter>
//     );
//     const ubicacionesLink = screen.getByText('Mis ubicaciones');
//     const amigosLink = screen.getByText('Mis amigos');
//     expect(ubicacionesLink).toBeInTheDocument();
//     expect(amigosLink).toBeInTheDocument();
// });

test('opens the login form dialog when clicking on the "Iniciar sesión" button', () => {
  render(
        <BrowserRouter>
            <NavBar />
        </BrowserRouter>
  );
  const loginButton = screen.getByText('Iniciar sesión');
  fireEvent.click(loginButton);
  const loginDialog = screen.getByRole('dialog');
  expect(loginDialog).toBeInTheDocument();
});




