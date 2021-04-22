import Typography from '@material-ui/core/Typography';
import React, { memo } from 'react';

const ParkingInfo = ({ info }) => {
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
    </div>
  );
};

export default memo(ParkingInfo);
