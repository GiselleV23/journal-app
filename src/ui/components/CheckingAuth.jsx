/*este componente lo que hara sera como mostrar una pantalla de carga con el componente CircularProgress que me da
mui que me muestra un logo de cargando.
este componente  CheckingAuth es el que vamos a querer mostrar cunado la aplicacion se recarga es decir cuando no 
sabemos si esta o no autenticado el usuario entonces en mi componente AuthSlice a mi status de mi initial state ya
lo ponemos regresar a checking y no en notAuthenticates ya que cuando la app se recarga por primera ver esto debe
estar en checkin pues no sabemos si esta o no autenticada antes de afirmarlo */

import { CircularProgress, Grid } from "@mui/material";

export const CheckingAuth = () => {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: "100vh", backgroundColor: "primary.main", padding: 4 }}
    >
      <Grid container direction="row" justifyContent="center">
        <CircularProgress color="warning" />
      </Grid>
    </Grid>

    /*nosotros nos encontramos auntenticados en firebase pero nuestra app no es capaz de mantener el estado de 
        la informacion que paso por el login o el register porque esa info esta en la memoria local y si recargo el 
        navegador web toda esa informacion se pierde y entoncen debemos hacer algo para ver la secciondel usuario 
        y recargar nuevamente nuestro state de redux en ek nvegador web  */
  );
};
