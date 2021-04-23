import axios from 'axios';

const mapbox = 'https://api.mapbox.com';
const token = process.env.REACT_APP_MAPBOX;

const getLocationInfo = (dest) => {
  const encodeStr = encodeURI(dest);
  const encodeCountries = encodeURI('ca');
  const options = {
    method: 'get',
    url: mapbox + '/geocoding/v5/mapbox.places/' + encodeStr + '.json',
    params: {
      access_token: token,
      country: encodeCountries,
      proximity: '-73.554, 45.5088',
    },
  };
  return axios(options);
};

const getSearchResults = async (dest) => {
  try {
    const { data: res } = await getLocationInfo(dest);
    return res.features.map((feature) => ({
      label: feature.place_name,
      value: feature.place_name,
      coor: feature.center,
    }));
  } catch (e) {
    return [];
  }
};

const getDestinationCoor = async (dest) => {
  const { data: res } = await getLocationInfo(dest);
  return {
    longitude: res.features[0].center[0],
    latitude: res.features[0].center[1],
  };
};

const getAllRoutes = async (curloc, dest) => {
  const destCoor = await getDestinationCoor(dest);

  const options = {
    method: 'get',
    url:
      mapbox +
      '/directions/v5/mapbox/driving/' +
      curloc[0] +
      ',' +
      curloc[1] +
      ';' +
      destCoor.longitude +
      ',' +
      destCoor.latitude,
    params: {
      overview: 'full',
      geometries: 'geojson',
      access_token: token,
    },
  };

  const res = await axios(options);

  const route = res.data.routes[0].geometry;
  const routeInfo = {
    geojson: {
      type: 'Feature',
      geometry: route,
    },
    destCoor: destCoor,
  };
  return routeInfo;
};

const createRoutes = async (curloc, dest) => {
  const route = await getAllRoutes(curloc, dest);

  return {
    destCoor: route.destCoor,
    route: {
      type: 'FeatureCollection',
      features: [route.geojson],
    },
    routeStyle: {
      type: 'line',
      paint: {
        'line-color': '#45ffa8',
        'line-width': 5,
      },
    },
  };
};

export { createRoutes, getSearchResults };
