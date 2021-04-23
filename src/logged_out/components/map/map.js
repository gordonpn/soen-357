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

  const bounds = mapRef.current ? mapRef.current.getMap().getBounds().toArray().flat() : null;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setInitializeMap(true);
    }, 60000);
    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const points = React.useMemo(
    () =>
      parkings.map((parking) => {
        return {
          type: 'Feature',
          properties: {
            cluster: false,
            parkingId: parking._id,
            parking: parking,
            taken: Math.random() < 0.4,
          },
          geometry: {
            type: 'Point',
            coordinates: [
              parseFloat(parking.nPositionCentreLongitude),
              parseFloat(parking.nPositionCentreLatitude),
            ],
          },
        };
      }),
    [parkings]
  );

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom: viewport.zoom,
    options: {
      radius: 75,
      maxZoom: 50,
      minPoints: 5,
      map: (props) => {
        return {
          ...props,
          parkingCount: 1,
          noParkingCount: 1,
        };
      },
      reduce: (acc, props) => {
        if (!props.taken) {
          acc.parkingCount += props.parkingCount;
        } else {
          acc.noParkingCount += props.noParkingCount;
        }
        return acc;
      },
    },
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
    const { cluster: isCluster, parkingCount } = cluster.properties;
    const pointCount = parkingCount;
    if (isCluster && pointCount > 0) {
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
          style={{ color: cluster.properties.taken ? '#f44336' : '#38BAFF', cursor: 'pointer' }}
          fontSize="small"
          onClick={() => setParkingClicked(cluster.properties.parking)}
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
            longitude={parkingClicked.nPositionCentreLongitude}
            latitude={parkingClicked.nPositionCentreLatitude}
            onClose={setParkingClicked}
          >
            <ParkingInfo info={parkingClicked} />
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
