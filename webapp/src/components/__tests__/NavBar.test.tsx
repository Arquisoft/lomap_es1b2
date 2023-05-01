import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NavBar } from '../NavBar';
import { BrowserRouter } from 'react-router-dom';

const setLangMock = jest.fn();

describe('NavBar component', () => {

  it('check the navbar when its not logged in', async () => {
    render (
      <BrowserRouter>
          <NavBar lang={'en'} setLang={setLangMock} opt={false} />
      </BrowserRouter>
    );
  
    const logo = screen.getByAltText('logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "/logo-no-background.png");
    expect(logo).toHaveAttribute("alt", "logo");
    expect(screen.getByText("NavBar.map")).toBeInTheDocument();
    expect(screen.getByText("NavBar.open")).toBeInTheDocument();
  });
});
