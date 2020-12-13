import React from 'react';
import Container from '@material-ui/core/Container';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import FingerprintIcon from '@material-ui/icons/Fingerprint';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import {
    BrowserRouter as Router,
    Switch as RSwitch,
    Route,
    Link as RouterLink,
} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
    title: {
      flexGrow: 1,
      padding: '24px',
    },
    logo: {
    }
  }));
  
function OldSignIn() {
    return (
      <div>
      <h1 class="section-title">Connexion</h1>
      <form id="signinForm" class="form-wrapper is-active form form-login">
          <fieldset>
              <div class="input-block">
                  <label for="emailInputSignin">Email</label>
                  <input type="email" id="emailInputSignin" placeholder="Email" required/>
              </div>
              <div class="input-block">
                  <label for="passwordInputSignin">Mot de passe</label>
                  <input type="password" id="passwordInputSignin" placeholder="Mot de passe" pattern=".*" required/>
              </div>
          </fieldset>
          <button type="submit" class="btn-login">Connexion</button>
      </form>
      <div id="theotheroption">
          <a id="register" href="register.html">S'enregistrer</a>
      </div>
      </div>
    );
}
  
function UserScreen(props) {
    const classes = useStyles();
    const title = props.title;
    const action = props.action;
    return (
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <Avatar className={classes.avatar}><FingerprintIcon /></Avatar>
          <Typography component="h1" variant="h5">{title}</Typography>
          <form className={classes.form} action={action} noValidate>
            {props.children}
          </form>
        </div>
      </Container>
    );
}
  
function SignIn(props) {
    const classes = useStyles();
    return (
      <UserScreen title="Sign in" action="/">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              //margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              //margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          Sign In
        </Button>
        <Grid container>
          <Grid item xs>
            <Link component={RouterLink} to="/user/forgotpassword" variant="body2">
              Forgot password?
            </Link>
          </Grid>
          <Grid item>
            <Link component={RouterLink} to="/user/signup" variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
          </Grid>
        </Grid>
      </UserScreen>
    );
}
  
function SignUp() {
    const classes = useStyles();
    return (
      <UserScreen title="Sign up" action="/user/signupverify">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              name="password2"
              label="Verify password"
              type="password"
              id="password2"
              autoComplete="current-password"
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          Sign Up
        </Button>
        <Grid container justify="flex-end">
          <Grid item>
            <Link component={RouterLink} to="/user/signin" variant="body2">
              Already have an account? Sign in
            </Link>
          </Grid>
        </Grid>
      </UserScreen>
    );
}
  
function ForgotPassword() {
    const classes = useStyles();
    return (
      <UserScreen title="Reset my password" action="/user/passwordverify">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              //margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          Change password
        </Button>
      </UserScreen>
    );
}
  
function Verify(props) {
  return (
    <UserScreen title="Check your mailbox">
      <Typography>{props.children}</Typography>
    </UserScreen>
  );
}

function SignupVerify(props) {
  return (<Verify>We sent you an email, click on the link we provided to finalize the signup!</Verify>);
}

function PasswordVerify(props) {
  return (<Verify>We sent you an email, click on the link we provided to enter a new password!</Verify>);
}

function SignupFinalize() {
  return (
    <UserScreen title="Change your password"></UserScreen>
  );
}

function PasswordFinalize() {
    return (
      <UserScreen title="Change your password"></UserScreen>
    );
}

export function User(props) {
    return (
      <React.Fragment>
      <Router>
        <RSwitch>
          <Route path="/user/signup">
            <SignUp {...props}/>
          </Route>
          <Route path="/user/signupverify">
            <SignupVerify {...props}/>
          </Route>
          <Route path="/user/passwordverify">
            <PasswordVerify {...props}/>
          </Route>
          <Route path="/user/forgotpassword">
            <ForgotPassword {...props}/>
          </Route>
          <Route path="/user/signin">
            <SignIn {...props}/>
          </Route>
        </RSwitch>
      </Router> 
      </React.Fragment>
    );
}
  