import React, { useEffect, useState, useRef } from 'react';
import ReactMapGL, { Marker, GeolocateControl } from 'react-map-gl';
import { getSearchResults } from '../../../utils/api/mapbox.js';
import { getParkings } from '../../../utils/api/parking.js';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import AsyncSelect from 'react-select/async';
import { useDebouncedCallback } from 'use-debounce';

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

  const mapRef = useRef('map');

  const [parkings, setParkings] = useState([]);
  const [initializeMap, setInitializeMap] = useState(true);
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 45.5088,
    longitude: -73.554,
    zoom: 11,
  });
  const markers = React.useMemo(
    () =>
      parkings.map((parking) => (
        <Marker
          key={'marker' + parking._id}
          longitude={parking.nPositionCentreLongitude}
          latitude={parking.nPositionCentreLatitude}
          offsetLeft={-10}
          offsetTop={-10}
        >
          <FiberManualRecordIcon style={{ color: '#38BAFF' }} fontSize="small" />
        </Marker>
      )),
    [parkings]
  );

  const handleLocationInput = useDebouncedCallback((e) => {
    const searchLocation = e;
    if (searchLocation) {
      return getSearchResults(searchLocation);
    }
  }, 100);

  const handleLocationSelect = (e) => {
    if (e) {
      setViewport((prev) => {
        return { ...prev, zoom: 15, latitude: e.coor[1], longitude: e.coor[0] };
      });
    }
  };

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
        {parkings.length ? markers : null}

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
