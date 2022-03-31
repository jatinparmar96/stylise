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


/** src: https://www.geodatasource.com/developers/javascript */
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//:::                                                                         :::
//:::  This routine calculates the distance between two points (given the     :::
//:::  latitude/longitude of those points). It is being used to calculate     :::
//:::  the distance between two locations using GeoDataSource (TM) prodducts  :::
//:::                                                                         :::
//:::  Definitions:                                                           :::
//:::    South latitudes are negative, east longitudes are positive           :::
//:::                                                                         :::
//:::  Passed to function:                                                    :::
//:::    lat1, lon1 = Latitude and Longitude of point 1 (in decimal degrees)  :::
//:::    lat2, lon2 = Latitude and Longitude of point 2 (in decimal degrees)  :::
//:::    unit = the unit you desire for results                               :::
//:::           where: 'M' is statute miles (default)                         :::
//:::                  'K' is kilometers                                      :::
//:::                  'N' is nautical miles                                  :::
//:::                                                                         :::
//:::  Worldwide cities and other features databases with latitude longitude  :::
//:::  are available at https://www.geodatasource.com                         :::
//:::                                                                         :::
//:::  For enquiries, please contact sales@geodatasource.com                  :::
//:::                                                                         :::
//:::  Official Web site: https://www.geodatasource.com                       :::
//:::                                                                         :::
//:::               GeoDataSource.com (C) All Rights Reserved 2022            :::
//:::                                                                         :::
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

/**
 * @description Calculate the distance between 2 location data
 * @param {float} lat1
 * @param {float} lon1
 * @param {float} lat2
 * @param {float} lon2
 * @param {string} unit
 * @return {float} distance
 * @async
 */
function distanceBetweenCoords(lat1, lon1, lat2, lon2, unit) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    } else {

        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var theta = lon1 - lon2;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit == "K") { dist = dist * 1.609344 }
        if (unit == "N") { dist = dist * 0.8684 }
        return dist;
    }
}
// Functions for showing and hiding loader

function showLoader() {
    document.getElementById('loader').classList.remove('dn');
}
function hideLoader() {
    document.getElementById('loader').classList.add('dn');
}

/**
 * Toggle Side bar Menu
 */
function toggleMenu() {
    const navMenu = document.getElementById('navigation-menu');
    navMenu.classList.toggle('show');
}


function getProgressBar() {
    const progressBarParent = document.querySelector('#progress-bar')
    progressBarParent.classList.remove('hide');
    const progressBar = document.querySelector('#progress-bar .ldBar');
    const bar = new ldBar(progressBar);
    bar.set(0);
    return bar
}

function setProgressBar(bar, value) {
    bar.set(value)
}

function hideProgressBar(bar) {
    const progressBarParent = document.querySelector('#progress-bar')
    bar.set(100);
    setTimeout(() => { progressBarParent.classList.add('hide'); bar.set(0) }, 300);
}