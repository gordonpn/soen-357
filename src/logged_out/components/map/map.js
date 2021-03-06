import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import * as turf from '@turf/turf';
import React, { useEffect, useRef, useState } from 'react';
import ReactMapGL, {
  FlyToInterpolator,
  GeolocateControl,
  Layer,
  Marker,
  Popup,
  Source,
} from 'react-map-gl';
import AsyncSelect from 'react-select/async';
import { useDebouncedCallback } from 'use-debounce';
import useSupercluster from 'use-supercluster';
import { createRoutes, getSearchResults } from '../../../utils/api/mapbox.js';
import { getParkingPeriods, getParkings } from '../../../utils/api/parking.js';
import ParkingInfo from './ParkingInfo.js';

const clusterStyle = {
  color: '#fff',
  background: '#1978c8',
  borderRadius: '50%',
  padding: '10px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const Map = () => {
  const geolocateControlStyle = {
    right: '5%',
    top: '8vh',
  };

  const searchBarStyle = {
    container: () => ({
      zIndex: 10,
      position: 'relative',
      top: '10vh',
      left: '25%',
      width: '50%',
    }),
  };

  const handleClusterClick = (cluster) => {
    const expansionZoom = Math.min(supercluster.getClusterExpansionZoom(cluster.id), 20);
    const [longitude, latitude] = cluster.geometry.coordinates;
    setViewport({
      ...viewport,
      latitude,
      longitude,
      zoom: expansionZoom,
      transitionInterpolator: new FlyToInterpolator({
        speed: 2,
      }),
      transitionDuration: 'auto',
    });
  };

  const mapRef = useRef('');

  const [location, setLocation] = useState(null);
  const [currlocation, setCurrLocation] = useState(null);
  const [parkings, setParkings] = useState([]);
  const [initializeMap, setInitializeMap] = useState(true);
  const [points, setPoints] = useState([]);
  const [parkingRoute, setParkingRoute] = useState(null);
  const [parkingClicked, setParkingClicked] = useState(undefined);
  const [parkingRegulations, setParkingRegulations] = useState(undefined);

  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 45.5088,
    longitude: -73.554,
    zoom: 11,
  });

  const bounds = mapRef.current ? mapRef.current.getMap().getBounds().toArray().flat() : null;

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom: viewport.zoom,
    options: { radius: 50, maxZoom: 20, minPoints: 3 },
  });

  const handleLocationInput = useDebouncedCallback((e) => {
    const searchLocation = e;
    if (searchLocation) {
      return getSearchResults(searchLocation);
    }
  }, 100);

  const handleLocationSelect = (e) => {
    if (e) {
      setLocation({ latitude: e.coor[1], longitude: e.coor[0] });
      setViewport((prev) => {
        return { ...prev, zoom: 15, latitude: e.coor[1], longitude: e.coor[0] };
      });
    }
  };

  const getClusters = clusters.map((cluster) => {
    const { cluster: isCluster, point_count: pointCount } = cluster.properties;
    if (isCluster) {
      const [longitude, latitude] = cluster.geometry.coordinates;
      return (
        <Marker
          onClick={() => handleClusterClick(cluster)}
          key={`cluster-${cluster.id}`}
          latitude={latitude}
          longitude={longitude}
        >
          <div
            style={{
              width: `${40 + (pointCount / points.length) * 60}px`,
              height: `${40 + (pointCount / points.length) * 60}px`,
              cursor: 'pointer',
              ...clusterStyle,
            }}
          >
            {pointCount}
          </div>
        </Marker>
      );
    }

    const { nPositionCentreLongitude, nPositionCentreLatitude } = cluster.properties.parking;
    return (
      <Marker
        key={'marker' + cluster.properties.parkingId}
        longitude={nPositionCentreLongitude}
        latitude={nPositionCentreLatitude}
        offsetLeft={-10}
        offsetTop={-10}
      >
        <FiberManualRecordIcon
          style={{ color: '#38BAFF', cursor: 'pointer' }}
          fontSize="small"
          onClick={() => setParkingClicked(cluster.properties.parking)}
        />
      </Marker>
    );
  });

  useEffect(() => {
    const timer = window.setInterval(() => {
      setInitializeMap(true);
    }, 60000);
    return () => {
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const getStreetParkings = async () => {
      setParkings(await getParkings());
    };
    if (initializeMap) {
      getStreetParkings();
      setInitializeMap(false);
    }
  }, [initializeMap]);

  useEffect(() => {
    if (parkings.length) {
      const geojsonPoints = parkings.map((parking) =>
        turf.point([parking.nPositionCentreLongitude, parking.nPositionCentreLatitude], {
          cluster: false,
          parkingId: parking._id,
          parking: parking,
        })
      );
      setPoints(geojsonPoints);
    }
  }, [parkings]);

  useEffect(() => {
    const createRoute = async () => {
      const pointCollection = turf.featureCollection(points);
      const currentLoc = turf.point([currlocation.longitude, currlocation.latitude]);
      const nearestParking = turf.nearestPoint(currentLoc, pointCollection).geometry.coordinates;
      const route = await createRoutes(currentLoc.geometry.coordinates, nearestParking);
      setParkingRoute(route);
    };
    if (points.length && currlocation) {
      createRoute();
    }
  }, [points, currlocation]);

  useEffect(() => {
    const fetchParkingPeriods = async () => {
      setParkingRegulations(await getParkingPeriods(parkingClicked.sNoPlace));
    };

    if (parkingClicked) {
      fetchParkingPeriods();
    } else {
      setParkingRegulations(undefined);
    }
  }, [parkingClicked]);

  return (
    <div>
      <AsyncSelect
        styles={searchBarStyle}
        cacheOptions
        loadOptions={(e) => handleLocationInput(e)}
        onInputChange={(e) => handleLocationInput(e)}
        onChange={handleLocationSelect}
        isClearable={true}
        placeholder="Search location"
      />

      <ReactMapGL
        {...viewport}
        ref={mapRef}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
      >
        {parkings.length ? getClusters : null}
        {location ? (
          <Marker
            longitude={location.longitude}
            latitude={location.latitude}
            offsetLeft={-10}
            offsetTop={-10}
          >
            <LocationOnIcon style={{ color: 'red' }} fontSize="large" />
          </Marker>
        ) : null}

        {parkingClicked && parkingRegulations && (
          <Popup
            anchor="top"
            longitude={parkingClicked.nPositionCentreLongitude}
            latitude={parkingClicked.nPositionCentreLatitude}
            onClose={setParkingClicked}
            key={parkingClicked.sNoPlace}
            capturePointerMove
            captureScroll
          >
            <ParkingInfo info={parkingClicked} regulations={parkingRegulations} />
          </Popup>
        )}
        {parkingRoute && (
          <Source type="geojson" data={parkingRoute.route}>
            <Layer {...parkingRoute.routeStyle} />
          </Source>
        )}
        <GeolocateControl
          style={geolocateControlStyle}
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation={true}
          auto
          onGeolocate={(e) => setCurrLocation(e.coords)}
        />
      </ReactMapGL>
    </div>
  );
};

export default Map;
