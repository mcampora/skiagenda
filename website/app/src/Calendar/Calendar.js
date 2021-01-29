import React from 'react';

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interaction from '@fullcalendar/interaction'

import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { Button, Typography } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { withStyles } from '@material-ui/core/styles';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles((theme) => ({
  calendar: {
    flexGrow: 1,
    padding: '24px',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '25ch',
    margin: 8,
  },
}));
const styles = (theme) => ({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography variant="h6">{children}</Typography>
        {onClose ? (
          <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );
});

function MyDialog(props) {
    const open = props.open;
    const title = props.title;
    const handleClose = () => {
        props.onClose(false);
    }
    return (
        <Dialog open={open}>
            <DialogTitle onClose={handleClose}>{title}</DialogTitle>
            {props.children}
        </Dialog>
    );
}

function HolidaysPopup(props) {
    return (
        <MyDialog title="Vacances" {...props}>
            <DialogContent>
                <img src="/zones.jpg" alt="zones" />
            </DialogContent>
        </MyDialog>
    );
}

function ReservationPopup(props) {
    const classes = useStyles();
    return (
        <MyDialog title="Reservation" {...props}>
            <DialogContent>
                <TextField
                    id="categorie"
                    label="Categorie"
                    select
                    defaultValue="famille"
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                >
                    {["famille","reservation","pret","autre"].map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    id="note"
                    label="Note"
                    multiline
                    defaultValue=""
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    id="revenus"
                    label="Revenus"
                    type="number"
                    defaultValue="0"
                    className={classes.textField}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">€</InputAdornment>,
                    }}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    id="period"
                    disabled
                    label="Periode"
                    defaultValue="du 5 au 10 Novembre 2020"
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    id="creator"
                    disabled
                    label="Createur"
                    defaultValue="mcampora_at_gmail.com"
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    id="id"
                    disabled
                    label="Id"
                    defaultValue="xxxyyyyeee4444mmm666"
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    id="creationDate"
                    disabled
                    label="Date de creation"
                    type="datetime-local"
                    defaultValue="2017-05-24T10:30"
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    id="lastUpdate"
                    disabled
                    label="Derniere mise a jours"
                    type="datetime-local"
                    defaultValue="2017-05-24T10:30"
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button color="primary">
                    Save
                </Button>
                <Button color="primary" autoFocus>
                    Delete
                </Button>
            </DialogActions>
        </MyDialog>
    );
}

export function Calendar(props) {
    const classes = useStyles();
    const [hollidays, setHollidays] = React.useState(false);    
    const [reservation, setReservation] = React.useState(false); 
    const componentDidMount = () => {
        //fetch('http://jsonplaceholder.typicode.com/users')
        //.then(res => res.json())
        //.then(data => this.setState({ contacts: data }))
        //.catch(console.log)
    }
    const getEvents = (d, successCallback, failureCallback) => {
    }
    const addEvent = (d) => {
    }
    const moveEvent = (d) => {
    }
    const selectEvent = (e) => {
    }
    return (
      <Box className={classes.calendar} maxWidth="100%" p={3} >
        <HolidaysPopup open={hollidays} onClose={setHollidays}/>
        <ReservationPopup open={reservation} onClose={setReservation}/>
        
        <FullCalendar
          plugins={[ dayGridPlugin, interaction ]}
          initialView="dayGridMonth"
          locale="fr"
          headerToolbar={{
            left: '',
            center: 'title',
            right: 'prev,next'
          }}
          //refetchResourcesOnNavigate={true}
          events={getEvents}
          selectable={true}
          select={addEvent}
          selectAllow={function(selectInfo) { 
            //console.log('selectAllow')
            //console.log(selectInfo)
            return true
          }}
          editable={true}
          eventResizableFromStart={true}
          eventDurationEditable={true}
          eventDrop={moveEvent}
          eventResize={moveEvent}
          eventClick={selectEvent}
        />
        
      </Box>
    );
}
