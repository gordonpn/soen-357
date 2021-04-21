import { Grid, isWidthUp, Typography, withWidth } from '@material-ui/core';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import DirectionsCarRoundedIcon from '@material-ui/icons/DirectionsCarRounded';
import InfoRoundedIcon from '@material-ui/icons/InfoRounded';
import PropTypes from 'prop-types';
import React from 'react';
import calculateSpacing from './calculateSpacing';
import FeatureCard from './FeatureCard';

const iconSize = 30;

const features = [
  {
    color: '#381D2A',
    headline: 'Availability',
    text: 'View available and occupied street parking spaces',
    icon: <CalendarTodayIcon style={{ fontSize: iconSize }} />,
    mdDelay: '0',
    smDelay: '0',
  },
  {
    color: '#AABD8C',
    headline: 'Informative',
    text: 'View street parking spot information such as price and parking hours',
    icon: <InfoRoundedIcon style={{ fontSize: iconSize }} />,
    mdDelay: '200',
    smDelay: '200',
  },
  {
    color: '#F39B6D',
    headline: 'Navigation',
    text: 'Show parking directions using your favourite navigation app',
    icon: <DirectionsCarRoundedIcon style={{ fontSize: iconSize }} />,
    mdDelay: '400',
    smDelay: '0',
  },
];

function FeatureSection(props) {
  const { width } = props;
  return (
    <div style={{ backgroundColor: '#FFFFFF' }}>
      <div className="container-fluid lg-p-top">
        <Typography variant="h3" align="center" className="lg-mg-bottom">
          Features
        </Typography>
        <div className="container-fluid">
          <Grid container spacing={calculateSpacing(width)}>
            {features.map((element) => (
              <Grid
                item
                xs={6}
                md={4}
                data-aos="zoom-in-up"
                data-aos-delay={isWidthUp('md', width) ? element.mdDelay : element.smDelay}
                key={element.headline}
              >
                <FeatureCard
                  Icon={element.icon}
                  color={element.color}
                  headline={element.headline}
                  text={element.text}
                />
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
    </div>
  );
}

FeatureSection.propTypes = {
  width: PropTypes.string.isRequired,
};

export default withWidth()(FeatureSection);
