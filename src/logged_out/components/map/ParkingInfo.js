import Typography from '@material-ui/core/Typography';
import React from 'react';

const ParkingInfo = ({ info, regulations }) => {
  const formatter = new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  });

  return (
    <div>
      <Typography variant="h6" gutterBottom key={info.sNoPlace}>
        {`Parking ${info.sNoPlace}`}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Rate: {formatter.format(info.nTarifHoraire / 100)}/hour
      </Typography>
      {regulations.map((regulation, index) => (
        <Typography variant="body1" gutterBottom key={`${regulation._id}_${index}`}>
          {regulation.sDescription}
        </Typography>
      ))}
    </div>
  );
};

export default ParkingInfo;
