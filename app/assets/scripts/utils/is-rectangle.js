/**
 *
 * Check if geojson feature is a rectangle.
 *
 * @param {object} feature A valid GeoJSON feature
 * @returns a boolean, true if feature is a rectangle
 */
export function isRectangle(feature) {
  try {
    // Should be Polygon type
    if (feature.type !== 'Polygon') {
      return false;
    }

    // Polygon contain only one outer ring
    if (feature.coordinates.length !== 1) {
      return false;
    }

    // Get outer ring coordinates
    const coords = feature.coordinates[0];

    // Should have five lonlat pairs
    if (coords.length !== 5) {
      return false;
    }

    // Get pairs
    const [p1, p2, p3, p4, p5] = coords;

    // First and last pairs should match
    if (p1[0] !== p5[0] || p1[0] !== p5[0]) {
      return false;
    }

    // Latitude on these corners should match
    if (p1[1] !== p2[1] || p3[1] !== p3[1]) {
      return false;
    }

    // Longitude on these corners should match
    if (p1[0] !== p4[0] || p2[0] !== p3[0]) {
      return false;
    }

    // Feature is rectangle when all conditions are satisfied
    return true;
  } catch (error) {
    // Feature must be malformed, return false
    return false;
  }
}
