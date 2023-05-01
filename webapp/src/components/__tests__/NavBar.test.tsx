import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NavBar } from '../NavBar';
import { BrowserRouter } from 'react-router-dom';

const setLangMock = jest.fn();
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

i18next
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  .init({
    debug: true,
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    }
  });

test('check the navbar when its not logged in', async () => {
  render (
      <BrowserRouter>
          <NavBar lang={'en'} setLang={setLangMock}/>
      </BrowserRouter>
  );
  
  const logo = screen.getByAltText('logo');
  expect(logo).toBeInTheDocument();
  expect(logo).toHaveAttribute("src", "/logo-no-background.png");
  expect(logo).toHaveAttribute("alt", "logo");
  expect(screen.getByText("NavBar.map")).toBeInTheDocument();
  expect(screen.getByText("NavBar.open")).toBeInTheDocument();
})

// describe('NavBar component', () => {
//   it('renders the logo and links correctly', () => {
//    
//     render(<BrowserRouter><NavBar lang="en" setLang={() => {setLangMock}} /></BrowserRouter>);
//     const logo = screen.getByAltText('logo');
//     const mapLink = screen.getByText('Map');
//     const aboutUsLink = screen.getByText('About Us');
//     expect(logo).toBeInTheDocument();
//     expect(mapLink).toHaveAttribute('href', '/map');
//     expect(aboutUsLink).toHaveAttribute('href', '/aboutus');
//   });

//   it('changes language when select value changes', () => {
//     const setLangMock = jest.fn();
//     render(<BrowserRouter><NavBar lang="en" setLang={() => {setLangMock}} /></BrowserRouter>);
//     const select = screen.getByRole('combobox');
//     userEvent.selectOptions(select, 'es');
//     expect(setLangMock).toHaveBeenCalledWith('es');
//   });
// });
