import React, { useState } from 'react';

import './App.css';

import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import blue from '@material-ui/core/colors/blue';
import pink from '@material-ui/core/colors/pink';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import DarkIcon from '@material-ui/icons/Brightness3';
import LightIcon from '@material-ui/icons/Brightness5';

import Amplify, { Auth } from 'aws-amplify';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import { AmplifyAuthenticator } from "@aws-amplify/ui-react";
import awsconfig from './aws-exports';

import { Calendar } from './Calendar/Calendar.js';

Amplify.configure(awsconfig);

var theme = null;
const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
    textAlign: 'center',
    padding: '24px',
    paddingTop: '24px'
  },
  logo: {
    width: '150px',
  }
}));

function Logo() {
  const classes = useStyles();
  return ( <img src="/logo.png" className={classes.logo} alt="logo"></img> );
}

async function signOut() {
  try {
      await Auth.signOut();
  } catch (error) {
      console.log('error signing out: ', error);
  }
}

function UserMenu(props) {
  const { loggedIn } = props;  
  //console.log('loggedIn: ' + loggedIn);
  return (
    <React.Fragment>
      {/*<AmplifySignOut />*/}
      { loggedIn ? (
        <IconButton onClick={ signOut } color="inherit" >
          <PowerSettingsNewIcon />
        </IconButton>
      ) : (
        <div />
      )}
    </React.Fragment>
  );
}

function ThemeSwitch(props) {
  const { darkState, handleThemeChange } = props;
  return (
    <React.Fragment>
      <IconButton onClick={handleThemeChange} color="inherit" >
        { darkState ? <LightIcon /> : <DarkIcon /> }
      </IconButton>
    </React.Fragment>
  );
}

function Banner(props) {
  const classes = useStyles();
  return (
    <React.Fragment>
      <AppBar position="sticky">
        <Toolbar>
          <Logo />
          <Typography variant="h6" className={classes.title}>Agenda neige</Typography>
          <ThemeSwitch {...props} />
          <UserMenu {...props}/>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}

function Body(props) {
  //const { loggedIn } = props;
  return ( <Calendar/> );
}

function App() {
  // amplify state
  const [authState, setAuthState] = React.useState();
  const [user, setUser] = React.useState();
  React.useEffect(() => {
      onAuthUIStateChange((nextAuthState, authData) => {
        //console.log(nextAuthState);
        //console.log(authData);
        setAuthState(nextAuthState);
        setUser(authData)
      });
  }, []);
  
  // selected theme and event handler
  const [darkState, setDarkState] = useState(true);
  const paletteType = darkState ? "dark" : "light";  
  theme = createMuiTheme({
    spacing: 8,
    palette: {
      type: paletteType,
      primary: {
        main: blue[600],
      },
      secondary: {
        main: pink[500],
      }
    },
  });
  const handleThemeChange = () => {
    setDarkState(!darkState);
  };
  
  const loggedIn = (authState === AuthState.SignedIn);

  return (
    <ThemeProvider theme={ theme }>
      <CssBaseline />
      <Banner loggedIn={ loggedIn } user={ user } darkState={ darkState } handleThemeChange={ handleThemeChange } />
      { loggedIn ? (
            <Body />
        ) : (
          <AmplifyAuthenticator />
        )
      }
    </ThemeProvider>
  );
};

export default App;
