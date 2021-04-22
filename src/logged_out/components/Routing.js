import PropTypes from 'prop-types';
import React, { memo } from 'react';
import { Switch } from 'react-router-dom';
import PropsRoute from '../../shared/components/PropsRoute';
import Home from './home/Home';
import Map from './map/map';

function Routing(props) {
  const { selectHome } = props;
  return (
    <Switch>
      <PropsRoute exact path="/blog" component={Map} />
      <PropsRoute path="/" component={Home} selectHome={selectHome} />
    </Switch>
  );
}

Routing.propTypes = {
  selectHome: PropTypes.func.isRequired,
};

export default memo(Routing);
