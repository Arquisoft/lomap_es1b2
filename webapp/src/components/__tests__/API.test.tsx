
import { getUbicaciones, addUbicacion, addUser, getUsers, getUser, addFriend } from '../../api/API';
import { IPMarker, User } from '../../shared/SharedTypes';

describe('API functions', () => {
  const testLocation: IPMarker = {
    id: "1",
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

  let testUser: User = {
    id: 'test-id',
    name: 'Test User',
    email: 'test@test.com',
    friends: ['friend-id-1', 'friend-id-2']
  };

  it('should get a list of locations', async () => {
    let result = await getUbicaciones();
    expect(result).toEqual(expect.any(Array));
  });

  it('should add a location', async () => {
    let result = await addUbicacion(testLocation);
    expect(result).toBe(true);
  });

  it('should add a user', async () => {
    let result = await addUser('Test User', 'test@test.com');
    expect(result).toBe(true);
  });

  it('should get a list of users', async () => {
    let result = await getUsers();
    expect(result).toEqual(expect.any(Array));
  });

  it('should get a user by id', async () => {
    let result = await getUser(testUser.id);
    expect(result).toEqual(testUser);
  });

  it('should add a friend to a user', async () => {
    let result = await addFriend(testUser.id, 'friend-id-3');
    expect(result).toBe(true);
  });
});
