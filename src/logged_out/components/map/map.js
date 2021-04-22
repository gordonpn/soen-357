import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import React, { useEffect, useRef, useState } from 'react';
import ReactMapGL, { GeolocateControl, Marker, Popup } from 'react-map-gl';
import AsyncSelect from 'react-select/async';
import { useDebouncedCallback } from 'use-debounce';
import { getSearchResults } from '../../../utils/api/mapbox.js';
import { getParkings } from '../../../utils/api/parking.js';
import ParkingInfo from './ParkingInfo.js';

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
          <FiberManualRecordIcon
            style={{ color: '#38BAFF', cursor: 'pointer' }}
            fontSize="small"
            onClick={() => setParkingClicked(parking)}
          />
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
      setLocation({ latitude: e.coor[1], longitude: e.coor[0] });
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
