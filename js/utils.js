/**
 * Handle the coordinates received from geolocation and convert them to city.
 * Uses Open Street Map Api reverse geolocation api.
 * Documentation can be found here https://nominatim.org/release-docs/develop/api/Reverse/
 * @param {GeolocationPosition} position;
 * @return {void}
 *  */
async function reverseGeoCode(position) {
    const coords = position.coords;
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`);
    data = await response.json();
    return data;
}