import { readMarkers } from "../../helpers/SolidHelper";

test('readMarkers returns an array of IPMarker objects', async () => {
  const markers = await readMarkers('https://uo276220.com/private/lomap/markers.json');
  expect(Array.isArray(markers)).toBe(true);
  if (markers.length > 0) {
    expect(markers[0]).toHaveProperty('name');
    expect(markers[0]).toHaveProperty('latitude');
    expect(markers[0]).toHaveProperty('longitude');
  }
});

