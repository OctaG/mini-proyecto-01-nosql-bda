import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import InputAdornment from '@mui/material/InputAdornment';

export default function ItemForm({data, update}) {
  console.log(data);
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Detalles del artículo
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            onChange={e => update("itemName", e.target.value)}
            required
            id="itemName"
            name="itemName"
            label="¿Cuál es el artículo a subastar?"
            fullWidth
            variant="standard"
            defaultValue={data.itemName}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            onChange={e => update("itemDescription", e.target.value)}
            required
            id="itemDescription"
            name="itemDescription"
            label="Descipción"
            multiline
            fullWidth
            variant="standard"
            defaultValue={data.itemDescription}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            onChange={e => update("itemInitialPrice", e.target.value)}
            required
            id="itemInitialPrice"
            name="itemInitialPrice"
            label="Precio inicial"
            fullWidth
            variant="standard"
            defaultValue={data.itemInitialPrice}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            onChange={e => update("itemEstimatedValue", e.target.value)}
            id="itemEstimatedValue"
            name="itemEstimatedValue"
            label="Valor estimado"
            fullWidth
            variant="standard"
            defaultValue={data.itemEstimatedValue}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
