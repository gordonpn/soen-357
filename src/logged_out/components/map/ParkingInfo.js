import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import { getParkingPeriods } from '../../../utils/api/parking';

const ParkingInfo = ({ info }) => {
  const [periods, setPeriods] = useState(null);

  useEffect(() => {
    const fetchParkingPeriods = async () => {
      setPeriods(await getParkingPeriods(info.sNoPlace));
    };

    fetchParkingPeriods();
  }, [info.sNoPlace]);

  const formatter = new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  });

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        {`Parking ${info.sNoPlace}`}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Rate: {formatter.format(info.nTarifHoraire / 100)}/hour
      </Typography>
      <Typography variant="body1" gutterBottom>
        Parking regulations:
      </Typography>
      {periods &&
        periods.map((period) => (
          <Typography variant="body1" gutterBottom key={period._id}>
            {period.sDescription}
          </Typography>
        ))}
    </div>
  );
};

export default ParkingInfo;
