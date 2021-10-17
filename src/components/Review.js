import * as React from 'react';
import Typography from '@mui/material/Typography';

export default function Review({data}) {
  return (
    <React.Fragment>
      <Typography variant="h4" gutterBottom>
        Resumen de la subasta
      </Typography>

      <Typography variant="h6" gutterBottom>
        {"Artículo a subastar: " + data.itemName}
      </Typography>

      <Typography variant="h6" gutterBottom>
        {"Descripción: " + data.itemDescription}
      </Typography>

      <Typography variant="h6" gutterBottom>
        {"Precio inicial: " + data.itemInitialPrice}
      </Typography>

      <Typography variant="h6" gutterBottom>
        {"Valor estimado: " + data.itemEstimatedValue}
      </Typography>

      <Typography variant="h6" gutterBottom>
        {"Fecha y hora de la subasta: " + data.eventDateAndTime}
      </Typography>

      <Typography variant="h6" gutterBottom>
        {"Duración de la subasta: " + data.eventDuration + " minutos"}
      </Typography>

      <Typography variant="h6" gutterBottom>
        {"Intervalos de la oferta: $" + data.eventBidInterval}
      </Typography>

    </React.Fragment>
  );
}
