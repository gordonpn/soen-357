import React, { useEffect, useState, useRef, useMemo } from 'react';
import ReactMapGL, { Layer, Marker, Source, GeolocateControl } from 'react-map-gl';
import { createRoutes } from '../../../utils/api/mapbox.js';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import { getParkings } from '../../../utils/api/parking.js';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

const Map = () => {
  const hq = {
    longitude: -73.745181,
    latitude: 45.4644455,
  };
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 45.4644455,
    longitude: -73.745181,
    zoom: 8,
  });
  const geolocateControlStyle = {
    right: 100,
    top: 100,
  };

  const mapRef = useRef('map');

  const [destination, setDestination] = useState('');
  const [parkings, setParkings] = useState([]);
  const [initializeMap, setInitializeMap] = useState(true);

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
  useEffect(() => {
    const getStreetParkings = async () => {
      setParkings(await getParkings());
    };
    if (initializeMap) {
      getStreetParkings();
      setInitializeMap(false);
    }
  });

  return (
    <div>
      <ReactMapGL
        {...viewport}
        ref={mapRef}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
      >
        {parkings.length
          ? markers
          : // parkings.map((parking) => (
            //     <div key={parking._id}>
            //         {/* <Source key={'source' + parking._id} type="geojson" data={dest.route}>
            //             <Layer
            //                 id={dest._id}
            //                 key={dest._id}
            //                 {...dest.routeStyle}
            //             />
            //         </Source> */}
            //         <Marker
            //             key={'marker' + parking._id}
            //             longitude={parking.nLongitude}
            //             latitude={parking.nLatitude}
            //         // offsetLeft={-10}
            //         // offsetTop={-10}
            //         >
            //             <FiberManualRecordIcon

            //                 fontSize="small"
            //             />
            //         </Marker>
            //     </div>
            // )
            // )
            null}

        {/* <Marker longitude={hq.longitude} latitude={hq.latitude} offsetLeft={-10} offsetTop={-10}>
                    <FiberManualRecordIcon
                
                    fontSize="small"
                     />
                </Marker> */}
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
