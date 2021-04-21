import PropTypes from 'prop-types';
import React, { Fragment, useEffect } from 'react';
import FeatureSection from './FeatureSection';
import HeadSection from './HeadSection';

function Home(props) {
  const { selectHome } = props;
  useEffect(() => {
    selectHome();
  }, [selectHome]);
  return (
    <Fragment>
      <HeadSection />
      <FeatureSection />
    </Fragment>
  );
}

Home.propTypes = {
  selectHome: PropTypes.func.isRequired,
};

export default Home;
