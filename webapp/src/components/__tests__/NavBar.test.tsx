import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NavBar } from '../NavBar';

describe('NavBar component', () => {
  it('renders the logo and links correctly', () => {
    render(<NavBar lang="en" setLang={() => {}} />);
    const logo = screen.getByAltText('logo');
    const mapLink = screen.getByText('Map');
    const aboutUsLink = screen.getByText('About Us');
    expect(logo).toBeInTheDocument();
    expect(mapLink).toHaveAttribute('href', '/map');
    expect(aboutUsLink).toHaveAttribute('href', '/aboutus');
  });

  it('changes language when select value changes', () => {
    const setLangMock = jest.fn();
    render(<NavBar lang="en" setLang={setLangMock} />);
    const select = screen.getByRole('combobox');
    userEvent.selectOptions(select, 'es');
    expect(setLangMock).toHaveBeenCalledWith('es');
  });

  it('shows login form when user clicks the open button', () => {
    render(<NavBar lang="en" setLang={() => {}} />);
    const openButton = screen.getByText('Open');
    userEvent.click(openButton);
    const usernameInput = screen.getByLabelText('Username');
    expect(usernameInput).toBeInTheDocument();
  });

  it('shows user name and photo when user is logged in', () => {
    const personData = {
      name: 'John Doe',
      photo: '/john-doe.png',
    };
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: () => Promise.resolve(personData),
    } as Response);
    render(<NavBar lang="en" setLang={() => {}} isLoggedIn={true} />);
    const profilePic = screen.getByAltText('profile picture');
    expect(profilePic).toHaveAttribute('src', personData.photo);
    expect(screen.getByText(personData.name)).toBeInTheDocument();
  });
});
