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


/**
 * Fetch all profile documents connected to the webId by owl:sameAs or rdfs.seeAlso
 */
const findFullPersonProfile = async (
  webId: IriString,
  visited = new Set<IriString>(),
  response: SolidDataset[] = [],
  fail = true,
  iri = webId,
): Promise<SolidDataset[]> => {
  try {
    /* uncomment if it is annoying when the below profile blocks
    if (webId === 'https://ruben.verborgh.org/profile/#me') {
      throw new Error('a blocking profile')
    }
    // */
    visited.add(iri)
    const dataset = await getSolidDataset(iri)
    const person = getThing(dataset, webId)
    if (person) {
      response.push(dataset)
      const same: string[] = getTermAll(person, owl.sameAs).map(a => a.value)
      const see: string[] = getTermAll(person, rdfs.seeAlso).map(a => a.value)

      for (const uri of [...same, ...see]) {
        //console.log('extending', uri)
        if (!visited.has(uri))
          await findFullPersonProfile(webId, visited, response, false, uri)
      }
    }
  } catch (e) {
    if (fail) throw e
  }
  return response
}

export const findPersonData = async (webId: IriString): Promise<PersonData> => {
  const data: PersonData = { webId: webId, name: '', photo: '', friends: [] }
  if (webId) {
    const dataset = await findFullPersonProfile(webId)
    dataset.reduce((data, d) => {
      const person = getThing(d, webId)
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
    }, data)
    return data
  }

  return data
}