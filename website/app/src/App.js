//import logo from './logo.svg';
import React from 'react';
import './App.css';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import {
  BrowserRouter as Router,
  Switch as RSwitch,
  Route,
  Link as RouterLink,
  Redirect
} from "react-router-dom";
import blue from '@material-ui/core/colors/blue';
import pink from '@material-ui/core/colors/pink';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import DarkIcon from '@material-ui/icons/Brightness3';
import LightIcon from '@material-ui/icons/Brightness5';

import { User } from './User/User.js';

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
    padding: '24px',
  },
  logo: {
  }
}));

function Logo() {
  const classes = useStyles();
  return (
    <img src="/logo.png" classes={classes.logo} width="150" alt="logo"></img>
  );
}

function UserMenu(props) {
  const loggedIn = props.loggedIn;
  const handleLogout = props.handleLogout;
  return (
    <React.Fragment>
      {loggedIn && (
        <div>
          <IconButton
            onClick={handleLogout}
            color="inherit"
          >
            <PowerSettingsNewIcon />
          </IconButton>
        </div>
      )}  
    </React.Fragment>
  );
}

function ThemeSwitch(props) {
  const darkState = props.darkState;
  const handleThemeChange = props.handleThemeChange;
  return (
    <React.Fragment>
      <IconButton onClick={handleThemeChange} color="inherit">
        {darkState 
          ? <LightIcon /> 
          : <DarkIcon /> 
        }
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

function Calendar() {
  return (
    <div>
      <Typography>Calendar</Typography>
    </div>
  );
}

function Body(props) {
  const loggedIn = props.loggedIn;
  return (
    <div>
    <Router>
      <RSwitch>
        <Route path="/user">
          <User {...props}/>
        </Route>
        <Route path="/">
          {loggedIn?<Calendar/>:<Redirect to="/user/signin"/>}
        </Route>
      </RSwitch>
    </Router> 
    </div>
  );
}

function App() {
  // user state and event handlers
  const [loggedIn, setLoggedIn] = React.useState(true);
  const [userId, setUserId] = React.useState('mcampora@gmail.com');
  const handleLogin = () => {
    setLoggedIn(true);
  };
  const handleLogout = () => {
    setLoggedIn(false);
  };

  // selected theme and event handler
  const [darkState, setDarkState] = React.useState(true);
  const paletteType = darkState ? "dark" : "light";  
  const theme = createMuiTheme({
    palette: {
      type: paletteType,
      primary: {
        main: blue[600],
      },
      secondary: {
        main: pink[500],
      }
    }
  });
  const handleThemeChange = () => {
    setDarkState(!darkState);
  };

  return (
    <ThemeProvider theme={theme}>
      <React.Fragment>
        <CssBaseline />
        <Banner userId={userId} loggedIn={loggedIn} handleLogout={handleLogout} darkState={darkState} handleThemeChange={handleThemeChange} />
        <Body loggedIn={loggedIn} handleLogin={handleLogin} />
      </React.Fragment>
    </ThemeProvider>
  );
}

export default App;
