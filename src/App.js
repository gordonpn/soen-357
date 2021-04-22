import { CssBaseline, MuiThemeProvider } from '@material-ui/core';
import React, { Fragment, lazy, Suspense } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import GlobalStyles from './GlobalStyles';
import Pace from './shared/components/Pace';
import theme from './theme';

const LoggedOutComponent = lazy(() => import('./logged_out/components/Main'));

function App() {
  return (
    <BrowserRouter>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles />
        <Pace color={theme.palette.primary.light} />
        <Suspense fallback={<Fragment />}>
          <Switch>
            <Route>
              <LoggedOutComponent />
            </Route>
          </Switch>
        </Suspense>
      </MuiThemeProvider>
    </BrowserRouter>
  );
}

export default App;
