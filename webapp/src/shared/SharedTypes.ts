export type User = {
  id: string,
  name: string,
  email: string,
  friends: Array<string>
}

export interface IPMarker {
  id: string,
  owner?: string,
  date: Date,
  lat: number,
  lng: number,
  name: string,
  webId: string,
  address: string,
  category: string,
  isPublic: boolean,
  ratings: number[],
  comments: Comment[],
  description: string
}

export interface Comment {
  author: string,
  text: string,
  img?: string
}