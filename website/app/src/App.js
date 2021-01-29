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
import { Authenticator, SignIn, ConfirmSignIn, VerifyContact, ForgotPassword, RequireNewPassword, SignUp, ConfirmSignUp } from 'aws-amplify-react';
import awsconfig from './aws-exports';
import amplifyTheme from './amplifyTheme'

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
  return (
    <React.Fragment>
      { loggedIn && (
          <IconButton onClick={ signOut } color="inherit" >
            <PowerSettingsNewIcon />
          </IconButton>
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

const authTheme = amplifyTheme;

function App() {
  // user state and event handlers
  const [loggedIn, setLoggedIn] = useState(false);
  const handleAuthStateChange = (state) => {
    console.log(state);
    if (state === 'signedIn') {
      /* Do something when the user has signed-in */
      setLoggedIn(true);
    }
    else {
      setLoggedIn(false);
    }
  };
  
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


  return (
    <ThemeProvider theme={ theme }>
      <CssBaseline />
      <Banner loggedIn={loggedIn} darkState={darkState} handleThemeChange={handleThemeChange} />
      {loggedIn === false ? (
        <div style={{ 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
          }}>
          <Authenticator hideDefault={ true } onStateChange={ handleAuthStateChange } theme={ authTheme } >
            <SignIn />
            <ConfirmSignIn/>
            <VerifyContact/>
            <SignUp />
            <ConfirmSignUp />
            <ForgotPassword/>
            <RequireNewPassword />
          </Authenticator>
        </div>
      ) : (
        <Body />
      )}
      </ThemeProvider>
  );
    /*{ loggedIn 
        ?
        <Body loggedIn={loggedIn} handleLogin={handleLogin} />
        :
        <AmplifyAuthenticator onStateChange={ handleAuthStateChange }>
          <AlwaysOn />
          <div style={{ 
            display: 'flex',
            justifyContent: 'center' }}>
            <AmplifySignIn />
          </div>
        </AmplifyAuthenticator>
      }
    */}

export default App;
