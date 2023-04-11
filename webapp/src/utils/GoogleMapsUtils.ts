export const loadMapApi = () => {
    const mapsURL = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_API_KEY_GOOGLE_MAPS}&libraries=geometry,places&language=es&region=ES&v=quarterly&callback=Function.prototype`;
    const scripts = document.getElementsByTagName('script');
    // Go through existing script tags, and return google maps api tag when found.
    for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].src.indexOf(mapsURL) === 0) {
            return scripts[i];
        }
    }

    const googleMapScript = document.createElement('script');
    googleMapScript.src = mapsURL;
    googleMapScript.async = true;
    googleMapScript.defer = true;
    window.document.body.appendChild(googleMapScript);

    return googleMapScript;
};