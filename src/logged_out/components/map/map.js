import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import React, { useEffect, useRef, useState } from 'react';
import AsyncSelect from 'react-select/async';
import { useDebouncedCallback } from 'use-debounce';
import { getSearchResults } from '../../../utils/api/mapbox.js';
import ReactMapGL, { Marker, Popup, GeolocateControl, FlyToInterpolator } from 'react-map-gl';
import useSupercluster from 'use-supercluster';
import { getParkings } from '../../../utils/api/parking.js';
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
    top: '10vh',
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
  const [parkings, setParkings] = useState([]);
  const [initializeMap, setInitializeMap] = useState(true);
  const [parkingClicked, setParkingClicked] = useState(null);

  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 45.5088,
    longitude: -73.554,
    zoom: 11,
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
  const points = parkings.map((parking) => ({
    type: 'Feature',
    properties: { cluster: false, parkingId: parking._id, parking: parking },
    geometry: {
      type: 'Point',
      coordinates: [
        parseFloat(parking.nPositionCentreLongitude),
        parseFloat(parking.nPositionCentreLatitude),
      ],
    },
  }));

  const bounds = mapRef.current ? mapRef.current.getMap().getBounds().toArray().flat() : null;

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom: viewport.zoom,
    options: { radius: 70, maxZoom: 20 },
  });

  const getClusters = clusters.map((cluster) => {
    const [longitude, latitude] = cluster.geometry.coordinates;
    const { cluster: isCluster, point_count: pointCount } = cluster.properties;

    if (isCluster) {
      return (
        <Marker
          onClick={() => handleClusterClick(cluster)}
          key={`cluster-${cluster.id}`}
          latitude={latitude}
          longitude={longitude}
        >
          <div
            style={{
              width: `${20 + (pointCount / points.length) * 30}px`,
              height: `${20 + (pointCount / points.length) * 30}px`,
              cursor: 'pointer',
              ...clusterStyle,
            }}
          >
            {pointCount}
          </div>
        </Marker>
      );
    }

    return (
      <Marker
        key={'marker' + cluster.id}
        longitude={longitude}
        latitude={latitude}
        offsetLeft={-10}
        offsetTop={-10}
      >
        <FiberManualRecordIcon
          style={{ color: '#38BAFF', cursor: 'pointer' }}
          fontSize="small"
          onClick={() => setParkingClicked(cluster)}
        />
      </Marker>
    );
  });

  useEffect(() => {
    const getStreetParkings = async () => {
      setParkings(await getParkings());
    };
    if (initializeMap) {
      getStreetParkings();
      setInitializeMap(false);
    }
  }, [initializeMap]);

  return (
    <div>
      <AsyncSelect
        styles={searchBarStyle}
        cacheOptions
        loadOptions={(e) => handleLocationInput(e)}
        onInputChange={(e) => handleLocationInput(e)}
        onChange={handleLocationSelect}
        isClearable={true}
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

        {parkingClicked && (
          <Popup
            anchor="top"
            longitude={parkingClicked.properties.parking.nPositionCentreLongitude}
            latitude={parkingClicked.properties.parking.nPositionCentreLatitude}
            onClose={setParkingClicked}
          >
            <ParkingInfo info={parkingClicked.properties.parking} />
          </Popup>
        )}
        <GeolocateControl
          style={geolocateControlStyle}
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation={true}
          auto
        />
      </ReactMapGL>
    </div>
  );
};

export default Map;
