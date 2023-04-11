import { IPMarker, User } from '../shared/SharedTypes';

export async function getUbicaciones(): Promise<any[]> {
  const apiEndPoint = process.env.REACT_APP_API_URI || 'http://localhost:5000/api'
  let response = await fetch(apiEndPoint + '/ubicaciones/list');
  return response.json()
}

export async function addUbicacion(ubicacion: IPMarker): Promise<boolean> {
  const apiEndPoint = process.env.REACT_APP_API_URI || 'http://localhost:5000/api'
  let response = await fetch(apiEndPoint + '/ubicaciones/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      'id': ubicacion.id,
      'date': ubicacion.date,
      'lat': ubicacion.lat,
      'lng': ubicacion.lng,
      'name': ubicacion.name,
      'address': ubicacion.address,
      'category': ubicacion.category,
      'descripcion': ubicacion.description,
    })
  });
  if (response.status === 200)
    return true;
  else
    return false;
}

export async function addUser(name: string, email: string): Promise<boolean> {
  const apiEndPoint = process.env.REACT_APP_API_URI || 'http://localhost:5000/api'
  let response = await fetch(apiEndPoint + '/users/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 'name': name, 'email': email.toLowerCase() })
  });
  if (response.status === 200)
    return true;
  else
    return false;
}

export async function getUsers(): Promise<User[]> {
  const apiEndPoint = process.env.REACT_APP_API_URI || 'http://localhost:5000/api'
  let response = await fetch(apiEndPoint + '/users/list');
  //The objects returned by the api are directly convertible to User objects
  return response.json()
}

export async function getUser(userId: string): Promise<User> {
  const apiEndPoint = process.env.REACT_APP_API_URI || 'http://localhost:5000/api'
  let response = await fetch(apiEndPoint + '/users/get' + userId);
  //The objects returned by the api are directly convertible to User objects
  return response.json()
}

export async function addFriend(userId: string, friendId: string): Promise<boolean> {
  const apiEndPoint = process.env.REACT_APP_API_URI || 'http://localhost:5000/api'
  let response = await fetch(apiEndPoint + '/users/' + userId + '/add-friend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 'friendId': friendId })
  });
  if (response.status === 200)
    return true;
  else
    return false;
}

/*
export async function getUserFriends(userId: string): Promise<User[]> {
  const apiEndPoint = process.env.REACT_APP_API_URI || 'http://localhost:5000/api'
  let response = await fetch(apiEndPoint + '/users/' + userId + '/friends');
  //The objects returned by the api are directly convertible to Friend objects
  return response.json()
}
*/