import axios from 'axios';
// const hq = {
//     longitude: -73.745181,
//     latitude: 45.4644455,
//   };
const mapbox = 'https://api.mapbox.com';
const token = process.env.REACT_APP_MAPBOX;

const getLocationInfo = (dest) => {
  const encodeStr = encodeURI(dest);
  const encodeCountries = encodeURI('ca,us,mx');
  const options = {
    method: 'get',
    url: mapbox + '/geocoding/v5/mapbox.places/' + encodeStr + '.json',
    params: {
      access_token: token,
      country: encodeCountries,
    },
  };
  return axios(options);
};

const getSearchResults = async (dest) => {
  try {
    const { data: res } = await getLocationInfo(dest);
    return res.features.map((feature) => ({
      label: feature.place_name,
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

//need to finish refactoring hq and curloc
const getAllRoutes = async (curloc, dest) => {
  const destCoor = await getDestinationCoor(dest);

  const options = {
    method: 'get',
    url:
      mapbox +
      '/directions/v5/mapbox/driving/' +
      curloc.longitude +
      ',' +
      curloc.latitude +
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

//curloc: json object
//dest: string
const createRoutes = async (curloc, dest) => {
  const route = await getAllRoutes(curloc, dest);

  return {
    _id: dest._id,
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