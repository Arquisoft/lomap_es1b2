import {
  getSolidDataset,
  getTerm,
  getThing,
  getTermAll,
  IriString,
  SolidDataset,
} from '@inrupt/solid-client'
import { foaf, vcard, owl, rdfs } from 'rdf-namespaces'

export interface PersonData {
  webId: IriString
  name: string
  friends: IriString[]
  photo: IriString
}



export const findPersonData = async (webId: IriString): Promise<PersonData> => {
  const data: PersonData = { webId: webId, name: '', photo: '', friends: [] }
  if (webId) {
    const dataset = await getSolidDataset(webId)
    const person = getThing(dataset, webId)
    if (person) {
      const friends = getTermAll(person, foaf.knows).map(a => a.value)
      data.friends = data.friends
        .concat(friends)
        .filter((a, i, data) => data.indexOf(a) === i)
      if (!data.name)
        data.name =
          getTerm(person, foaf.name)?.value ??
          getTerm(person, vcard.fn)?.value ??
          ''
      if (!data.photo)
        data.photo =
          getTerm(person, vcard.hasPhoto)?.value ??
          getTerm(person, foaf.img)?.value ??
          ''
    }

      return data
    }
  return data
}