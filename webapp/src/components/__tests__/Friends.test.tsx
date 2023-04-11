import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { useSession } from '@inrupt/solid-ui-react';
import { addFriendByWebId, deleteFriendByWebId } from '../../helpers/SolidHelper';
import { PersonData } from '../friends/FriendList';
import FriendsList from '../friends/Friends';

jest.mock('@inrupt/solid-ui-react', () => ({
  useSession: jest.fn(),
}));

jest.mock('../../helpers/SolidHelper', () => ({
  addFriendByWebId: jest.fn(),
  deleteFriendByWebId: jest.fn(),
}));

const mockFriendsData: PersonData[] = [
  { webId: 'https://example.com/friend1', name: 'Friend 1', photo: '', friends: [] },
  { webId: 'https://example.com/friend2', name: 'Friend 2', photo: '', friends: [] },
];

const mockSession = {
  info: { webId: 'https://example.com/me' },
};

const mockUseSession = useSession as jest.Mock;

describe('FriendsList', () => {
  beforeEach(() => {
    mockUseSession.mockReturnValue({ session: mockSession });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders the component with the "Ver amigos" button', () => {
    render(<FriendsList />);
    expect(screen.getByText('Ver amigos')).toBeInTheDocument();
  });

  it('renders the component with the friends list', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockFriendsData),
    } as any);

    render(<FriendsList />);

    fireEvent.click(screen.getByText('Ver amigos'));

    await waitFor(() => {
      expect(screen.getAllByTestId('friend-card')).toHaveLength(2);
      expect(screen.getByText('Friend 1')).toBeInTheDocument();
      expect(screen.getByText('Friend 2')).toBeInTheDocument();
    });
  });

  it('adds a friend', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockFriendsData),
    } as any);

    render(<FriendsList />);

    fireEvent.click(screen.getByText('Ver amigos'));

    await waitFor(() => {
      expect(screen.getAllByTestId('friend-card')).toHaveLength(2);
    });

    fireEvent.click(screen.getByText('Agregar amigo'));

    const input = screen.getByLabelText('WebID');
    const addButton = screen.getByText('Agregar');

    fireEvent.change(input, { target: { value: 'https://example.com/friend3' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(addFriendByWebId).toHaveBeenCalledWith(mockSession.info.webId, 'https://example.com/friend3');
      expect(screen.getAllByTestId('friend-card')).toHaveLength(3);
    });
  });
});