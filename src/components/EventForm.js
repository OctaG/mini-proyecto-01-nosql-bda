import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import MenuItem from  '@mui/material/MenuItem';

export default function EventForm({data, update}) {
  const [value, setValue] = React.useState(new Date());
  const [duration, setDuration] = React.useState(5);
  const durations = [
  {
    value: 5,
    label: '5 minutos',
  },
  {
    value: 10,
    label: '10 minutos',
  },
  {
    value: 15,
    label: '15 minutos',
  },
  {
    value: 20,
    label: '20 minutos',
  },
];

const handleChange = (event) => {
   update("eventDuration", event.target.value);
 };

  return(
    <React.Fragment>
      <Typography sx={{fontWeight: "700", marginBottom: 3}} variant="h6">
        Detalles de la subasta
      </Typography>
      <Grid sx={{marginBottom: 3}} >
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            renderInput={(props) => <TextField {...props} />}
            value={data.eventDateAndTime}
            variant="standard"
            onChange={(newValue) => {
              update("eventDateAndTime", newValue)
            }}
          />
        </LocalizationProvider>
     </Grid>
     <Grid>
       <TextField
          id="eventDuration"
          select
          label="Duración"
          value={data.eventDuration}
          onChange={handleChange}
          helperText="Seleccione la duración de la subasta"
          variant="standard"
        >
          {durations.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
       </TextField>
     </Grid>
    </React.Fragment>
  );
}
