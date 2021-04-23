import { Button, createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { memo } from 'react';

function ColoredButton(props) {
  const { color, children, theme } = props;
  const buttonTheme = createMuiTheme({
    ...theme,
    palette: {
      primary: {
        main: color,
      },
    },
  });
  const buttonProps = (({ color, theme, children, ...o }) => o)(props);
  return (
    <MuiThemeProvider theme={buttonTheme}>
      <Button {...buttonProps} color="primary">
        {children}
      </Button>
    </MuiThemeProvider>
  );
}

ColoredButton.propTypes = {
  color: PropTypes.string.isRequired,
};

export default memo(ColoredButton);
