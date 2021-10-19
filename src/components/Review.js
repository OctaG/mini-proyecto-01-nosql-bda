import React, {useState, useEffect} from 'react';
import Typography from '@mui/material/Typography';

export default function Review({data}) {

  const [nameFieldError, setNameFieldError] = useState(false);
  const [descriptionFieldError, setDescriptionFieldError] = useState(false);
  const [initialPriceFieldError, setInitialPriceFieldError] = useState(false);
  const [estimatedValueFieldError, setEstimatedValueFieldError] = useState(false);

  useEffect(()=>{
    console.log(data);
    if(data.itemName == ''){
      setNameFieldError(true);
    }
    if(data.itemDescription == ''){
      setDescriptionFieldError(true);
    }
    if(data.itemInitialPrice == '' || data.itemInitialPrice < 0){
      setInitialPriceFieldError(true);
    }
    if(data.itemEstimatedValue == '' || data.itemEstimatedValue < 0){
      setEstimatedValueFieldError(true);
    }
  }, [data]);

  return(
    <React.Fragment>
      <Typography sx={{fontWeight: "700", marginBottom: 3}} variant="h6">
        Resumen de la subasta
      </Typography>

      <Typography sx={{fontWeight: 600, marginBottom: 0.5}} paragraph>
        Artículo en subasta
      </Typography>
      {nameFieldError ?
        <Typography sx={{fontWeight: 100, marginBottom: 2, color:"red"}} gutterBottom paragraph >
          {"No debe dejar el nombre del artículo vacio"}
        </Typography>
        :
        <Typography sx={{fontWeight: 100, marginBottom: 2}} gutterBottom paragraph >
          {data.itemName}
        </Typography>
      }

       <Typography sx={{fontWeight: 600, marginBottom: 0.5}} paragraph>
         Descripción
       </Typography>
       {descriptionFieldError ?
         <Typography sx={{fontWeight: 100, marginBottom: 2, color:"red"}} gutterBottom paragraph >
           {"No debe dejar la descripción del artículo vacio"}
         </Typography>
         :
         <Typography sx={{fontWeight: 100, marginBottom: 2}} gutterBottom paragraph >
           {data.itemDescription}
         </Typography>
       }

        <Typography sx={{fontWeight: 600, marginBottom: 0.5}} paragraph>
          Precio inicial
        </Typography>
        {initialPriceFieldError ?
          <Typography sx={{fontWeight: 100, marginBottom: 2, color:"red"}} gutterBottom paragraph >
            {"El precio inicial debe ser un número igual o mayor a 0"}
          </Typography>
          :
          <Typography sx={{fontWeight: 100, marginBottom: 2}} gutterBottom paragraph >
            ${data.itemInitialPrice}
          </Typography>
        }

        <Typography sx={{fontWeight: 600, marginBottom: 0.5}} paragraph>
          Valor estimado por el usuario
        </Typography>
        {estimatedValueFieldError ?
          <Typography sx={{fontWeight: 100, marginBottom: 2, color:"red"}} gutterBottom paragraph >
            {"El valor estimado debe ser un número igual o mayor a 0"}
          </Typography>
          :
          <Typography sx={{fontWeight: 100, marginBottom: 2}} gutterBottom paragraph >
            ${data.itemEstimatedValue}
          </Typography>
        }

        <Typography sx={{fontWeight: 600, marginBottom: 0.5}} paragraph>
          Fecha y hora de la subasta
        </Typography>
        <Typography sx={{fontWeight: 100, marginBottom: 2}} gutterBottom paragraph >
          {"" + data.eventDateAndTime}
        </Typography>

        <Typography sx={{fontWeight: 600, marginBottom: 0.5}} paragraph>
          Duración de la subasta
        </Typography>
        <Typography sx={{fontWeight: 100, marginBottom: 2}} gutterBottom paragraph >
          {data.eventDuration} minutos
        </Typography>
    </React.Fragment>
  );
}
