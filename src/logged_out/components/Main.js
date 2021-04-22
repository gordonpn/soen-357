import { withStyles } from '@material-ui/core';
import AOS from 'aos/dist/aos';
import 'aos/dist/aos.css';
import PropTypes from 'prop-types';
import React, { memo, useCallback, useState } from 'react';
import smoothScrollTop from '../../shared/functions/smoothScrollTop';
import CookieConsent from './cookies/CookieConsent';
import CookieRulesDialog from './cookies/CookieRulesDialog';
import Footer from './footer/Footer';
import NavBar from './navigation/NavBar';
import Routing from './Routing';

AOS.init({ once: true });

const styles = (theme) => ({
  wrapper: {
    backgroundColor: theme.palette.common.white,
    overflowX: 'hidden',
  },
});

function Main(props) {
  const { classes } = props;
  const [selectedTab, setSelectedTab] = useState(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isCookieRulesDialogOpen, setIsCookieRulesDialogOpen] = useState(false);

  const selectHome = useCallback(() => {
    smoothScrollTop();
    document.title = 'Live Parking Finder Prototype';
    setSelectedTab('Home');
  }, [setSelectedTab]);

  const handleMobileDrawerOpen = useCallback(() => {
    setIsMobileDrawerOpen(true);
  }, [setIsMobileDrawerOpen]);

  const handleMobileDrawerClose = useCallback(() => {
    setIsMobileDrawerOpen(false);
  }, [setIsMobileDrawerOpen]);

  const handleCookieRulesDialogOpen = useCallback(() => {
    setIsCookieRulesDialogOpen(true);
  }, [setIsCookieRulesDialogOpen]);

  const handleCookieRulesDialogClose = useCallback(() => {
    setIsCookieRulesDialogOpen(false);
  }, [setIsCookieRulesDialogOpen]);

  return (
    <div className={classes.wrapper}>
      {!isCookieRulesDialogOpen && (
        <CookieConsent handleCookieRulesDialogOpen={handleCookieRulesDialogOpen} />
      )}
      <CookieRulesDialog open={isCookieRulesDialogOpen} onClose={handleCookieRulesDialogClose} />
      <NavBar
        selectedTab={selectedTab}
        mobileDrawerOpen={isMobileDrawerOpen}
        handleMobileDrawerOpen={handleMobileDrawerOpen}
        handleMobileDrawerClose={handleMobileDrawerClose}
      />
      <Routing selectHome={selectHome} />
      <Footer />
    </div>
  );
}

Main.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(memo(Main));
