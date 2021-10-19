import React, {useEffect, useState} from "react";

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function Faqs() {
  return (
    <Box sx={{ marginTop: 5}}>
      <Box>
        <Box>
          <Typography sx={{fontWeight: "bold"}} align='center' gutterBottom variant="h1" >
            FAQs
          </Typography>
          <Typography sx={{fontWeight: "600"}} align='left' variant="h6" >
            1. ¿Qué es esta aplicación?
          </Typography>
          <Typography sx={{fontWeight: "lighter", marginBottom:5}} align='left' gutterBottom variant="h6" >
            Es un demo de una aplicación de subastas en tiempo real.
          </Typography>
          <Typography sx={{fontWeight: "600"}} align='left' variant="h6" >
            2. ¿Cómo funciona?
          </Typography>
          <Typography sx={{fontWeight: "lighter", marginBottom:5}} align='left' gutterBottom variant="h6" >
            Los usuarios pueden crear un evento de subasta para subastar un artículo.
            Los eventos de subasta empiezan en la fecha y hora que determina el usuario y tienen
            una duración de 5, 10, 15 o 20 minutos. Mientras la subasta está abierta, otros
            usuarios pueden acceder y ofertar por el artículo.
          </Typography>
          <Typography sx={{fontWeight: "600"}} align='left' variant="h6" >
            3. ¿Se necesita una cuenta?
          </Typography>
          <Typography sx={{fontWeight: "lighter", marginBottom:5}} align='left' gutterBottom variant="h6" >
            Sí, es necesario tener una cuenta tanto para crear eventos de subasta como para ofertar en las
            subastas de otros.
          </Typography>
          <Typography sx={{fontWeight: "600"}} align='left' variant="h6" >
            4. ¿Únicamente se puede ofertar mientras la subasta está abierta?
          </Typography>
          <Typography sx={{fontWeight: "lighter", marginBottom:5}} align='left' gutterBottom variant="h6" >
            Sí, ya que las subastas son en tiempo real, las ofertas unicamente ocurren mientras el evento está abierto.
          </Typography>
          <Typography sx={{fontWeight: "600"}} align='left' variant="h6" >
            5. ¿El usuario que creó la subasta puede ofertar?
          </Typography>
          <Typography sx={{fontWeight: "lighter", marginBottom:5}} align='left' gutterBottom variant="h6" >
            No, pero si puede entrar al evento y ver las ofertas de otros usuarios.
          </Typography>
          <Typography sx={{fontWeight: "600"}} align='left' variant="h6" >
            6. ¿Qué ocurre cuando la subasta termina?
          </Typography>
          <Typography sx={{fontWeight: "lighter", marginBottom:5}} align='left' gutterBottom variant="h6" >
            Cuando un evento de subasta termina, el usuario con la oferta más alta se convierte en el nuevo
            dueño del artículo. El usuario puede ver sus artículos en el menú  Mi perfil --> mis artículos.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Faqs;
