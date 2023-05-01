import { FOAF } from "@inrupt/vocab-common-rdf";
import { IPMarker } from "../shared/SharedTypes";
import { fetch } from "@inrupt/solid-client-authn-browser"
import {
    Thing,
    getFile,
    getTerm,
    setThing,
    getThing,
    IriString,
    getUrlAll,
    buildThing,
    saveAclFor,
    getTermAll,
    overwriteFile,
    getResourceAcl,
    hasResourceAcl,
    hasFallbackAcl,
    getSolidDataset,
    hasAccessibleAcl,
    saveSolidDatasetAt,
    saveFileInContainer,
    setPublicDefaultAccess,
    getSolidDatasetWithAcl,
    setPublicResourceAccess,
    createAclFromFallbackAcl,
} from "@inrupt/solid-client";

import { foaf, vcard } from 'rdf-namespaces'

export interface PersonData {
    webId: IriString
    name: string
    friends: IriString[]
    photo: IriString
}

export async function readMarkers(webId: string) {
    let fileURL = `${parseURL(webId)}public/lomap/markers.json`;
    let markers = await readMarkersFromFile(fileURL);

    return markers;
};

async function readMarkersFromFile(fileURL: string) {
    let markers: IPMarker[] = [];

    try {
        await getFile(fileURL, { fetch: fetch })
            .then(async (file) => { markers = JSON.parse(await file.text()); })
            .catch(async () => {
                let fileType = "application/json;charset=utf-8";
                await saveFileInContainer(fileURL,
                    new Blob(undefined, { type: fileType }),
                    {
                        slug: "Markers.json",
                        contentType: fileType,
                        fetch: fetch
                    }
                );
            });
    } catch (error) {
        // console.error(error);
        console.error("Error reading the markers");
    }
    return markers;
}

export async function saveMarkers(markers: IPMarker[], webId: string) {
    let fileURL = `${parseURL(webId)}public/lomap/markers.json`;
    await saveMarkersToFile(markers, fileURL);
};

async function saveMarkersToFile(markers: IPMarker[], fileURL: string) {
    const blob = new Blob([(new TextEncoder()).encode(JSON.stringify(markers))], {
        type: "application/json;charset=utf-8"
    });
    
    try {
        await overwriteFile(fileURL, blob,
            {
                contentType: blob.type,
                fetch: fetch
            }
        );
    } catch (error) {
        // console.error(error);
        console.error("Error saving markers: ", error)
    }
}

function parseURL(webId: string) {
    return webId.split("profile")[0];
}

export async function getFriendList(webId: string) {
    let solidDataset = await getSolidDataset(webId);
    let friends = getUrlAll((getThing(solidDataset, webId) as Thing), FOAF.knows);

    return friends;
}

export async function addFriendByWebId(webId: string, friendWebId: string) {
    let solidDataset = await getSolidDataset(webId);
    let friends = getThing(solidDataset, webId) as Thing;

    friends = buildThing(friends).addUrl(FOAF.knows, friendWebId).build();
    solidDataset = setThing(solidDataset, friends);
    saveSolidDatasetAt(webId, solidDataset, { fetch: fetch })

    grantAccessToMarkers(webId, true);
}

export async function deleteFriendByWebId(webId: string, friendWebId: string) {
    let solidDataset = await getSolidDataset(webId);
    let friends = getThing(solidDataset, webId) as Thing;

    friends = buildThing(friends).removeUrl(FOAF.knows, friendWebId).build();
    solidDataset = setThing(solidDataset, friends);
    saveSolidDatasetAt(webId, solidDataset, { fetch: fetch });
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

async function grantAccessToMarkers(webId: string, access: boolean) {
    let folderURL = `${parseURL(webId)}public/lomap/`;
    let fileURL = `${folderURL}markers.json`;

    try {
        await getFile(fileURL, { fetch: fetch })
            .catch(async () => {
                const blob = new Blob(undefined, {
                    type: "application/json;charset=utf-8"
                });
                try {
                    await overwriteFile(fileURL, blob,
                        {
                            contentType: blob.type,
                            fetch: fetch
                        }
                    );
                } catch (error) {
                    // console.error(error);
                    console.error("Error overwritting the file.")
                }
            });
    } catch (error) {
        // console.error(error);
        console.error("Error accesing the markers from: ", webId)
    }

    const myDatasetWithAcl = await getSolidDatasetWithAcl(folderURL, { fetch: fetch });

    let resourceAcl;
    if (!hasResourceAcl(myDatasetWithAcl)) {
        if (!hasAccessibleAcl(myDatasetWithAcl)) {
            throw new Error(
                "The current user does not have permission to change access rights to this Resource."
            );
        }
        if (!hasFallbackAcl(myDatasetWithAcl)) {
            throw new Error(
                "The current user does not have permission to see who currently has access to this Resource."
            );
        }
        resourceAcl = createAclFromFallbackAcl(myDatasetWithAcl);
    } else {
        resourceAcl = getResourceAcl(myDatasetWithAcl);
    }

    let updatedAcl = setPublicResourceAccess(
        resourceAcl,
        { read: true, append: access, write: access, control: false },
    );
    updatedAcl = setPublicDefaultAccess(
        updatedAcl,
        { read: true, append: access, write: access, control: false }
    )

    await saveAclFor(myDatasetWithAcl, updatedAcl, { fetch: fetch });
}

export async function readFriendMarkers(webId: string) {
    let markers: IPMarker[] = [];

    (await getFriendList(webId)).forEach(async (friendWebId) => {
        let fileURL = `${parseURL(friendWebId)}public/lomap/markers.json`;

        try {
            await getFile(fileURL, { fetch: fetch })
                .then(async (file) => { (JSON.parse(await file.text())).forEach((marker: IPMarker) => markers.push(marker)); })
                .catch(async () => {
                    let fileType = "application/json;charset=utf-8";
                    await saveFileInContainer(fileURL,
                        new Blob(undefined, { type: fileType }),
                        {
                            slug: "Markers.json",
                            contentType: fileType,
                            fetch: fetch
                        }
                    );
                });
        } catch (error) {
            console.error("No ubications available from user: " + friendWebId);
        }
    });

    return markers;
}

export async function savePublicMarker(publicMarker: IPMarker, webId: string) {
    let { markers, fileURL } = await filterPublicMarker(webId, publicMarker);
    markers.push(publicMarker);

    await saveMarkersToFile(markers, fileURL);

    return markers;
}

export async function deletePublicMarker(publicMarker: IPMarker, webId: string) {
    let { markers, fileURL } = await filterPublicMarker(webId, publicMarker);

    await saveMarkersToFile(markers, fileURL);
}

async function filterPublicMarker(webId: string, publicMarker: IPMarker) {
    let fileURL = `${parseURL(webId)}public/lomap/markers.json`;
    let markers = await readMarkersFromFile(fileURL);

    if (markers.length === undefined) {
        markers = [];
    }
    markers = markers.filter((marker) => marker.id !== publicMarker.id);
    return { markers, fileURL };
}