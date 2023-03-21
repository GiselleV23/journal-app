import { useMemo } from "react";

import { Link as RouterLink } from "react-router-dom";
import { Google } from "@mui/icons-material";
import {
  Alert,
  Button,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { AuthLayout } from "../layout/AuthLayout";
import { useForm } from "../../hooks/index";
import { useDispatch, useSelector } from "react-redux";
import {
  //checkingAuthentication,
  startGoogleSignIn,
  startLoginWithEmailAndPassword,
} from "../../store/auth/thunks";

const formData = {
  email: "",
  password: "",
};

export const LoginPage = () => {
  /*aqui vamos hacer una validacion en mis botones tanto en el de login como en el de google para que cuando 
  nos estemos auntenticando en mi popup no podamos hacer click sobre ellos*/
  const { status, errorMessage } = useSelector((state) => state.auth);

  const dispatch = useDispatch(); //tomamos el dispatch del hook para despachar la accion del reducer con el sumbmit

  const { email, password, onInputChange } =
    useForm(
      formData
    ); /*despues de haber logrado autenticar mi usuario en firebase es decir que su correo y contraseña
  ya se encunetre en la base de datos y el manejo del error cuando el usuario ya existe entonces ya podemos
  quitar nuestro usuario y password por defecto de nuestro objeto 
};  */

  //continuacion de la validacion:
  const isAuthenticating = useMemo(
    () => status === "checking",
    [status]
  ); /*si estatus es completamente igual a 
  checking eso regresara un valor buleano y la dependencia sera el status, asi lo memorizo . si mi status cambia
  devolvera el nuevo valor si el status nunca cambia no se volvera a dibujar esto 
  */

  const onSubmit = (event) => {
    event.preventDefault();
    /*console.log({ email, password });*/
    /*dispatch(checkingAuthentication()); //cuando hagamos el onsubit(click en el boton login) se dispare el 
    chekimgAutentication para que mi status cambie de not-autenticationa cheking despachamos la accionde mi thunks
    cheking autentication asincrona la cual a s vez dispara mi accion de reducer checkingCredential*/

    /*ya aqui no necsitamos despachar la accion de checkingAuthentication() sino que vamos a despachar mi accion
    que se encuentra en los thunks startLoginWithEmailAndPassword*/
    dispatch(startLoginWithEmailAndPassword({ email, password }));
  };

  const onGoogleSingIn = () => {
    console.log("onGoogleSingIn");
    dispatch(startGoogleSignIn());
  };

  return (
    <AuthLayout title="Login">
      <form
        onSubmit={onSubmit}
        className="animate__animated animate__fadeIn animate__fater" /*use de la libreria animated.style*/
      >
        <Grid container>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <TextField
              label="correo"
              type="email"
              placeholder="correo@google.com"
              fullWidth
              name="email"
              value={email}
              onChange={onInputChange}
            />
          </Grid>

          <Grid item xs={12} sx={{ mt: 2 }}>
            <TextField
              label="contraseña"
              type="password"
              placeholder="Contraseña"
              fullWidth
              name="password"
              value={password}
              onChange={onInputChange}
            />
          </Grid>

          <Grid container display={!!errorMessage ? "" : "none"} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Alert severity="error">{errorMessage}</Alert>
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mb: 2, mt: 1 }}>
            {/*estara el boton desabilitado si cumple la condicion de mi funcion */}
            <Grid item xs={12} sm={6}>
              <Button
                disabled={isAuthenticating}
                type="submit"
                variant="contained"
                fullWidth
              >
                Login
              </Button>
            </Grid>

            <Grid item xs={12} sm={6}>
              {/*estara el boton desabilitado si cumple la condicion de mi funcion */}
              <Button
                disabled={isAuthenticating}
                variant="contained"
                fullWidth
                onClick={onGoogleSingIn}
              >
                <Google />
                <Typography sx={{ ml: 1 }}>Google</Typography>
              </Button>
            </Grid>
          </Grid>

          <Grid container direction="row" justifyContent="end">
            <Link component={RouterLink} color="inherit" to="/auth/register">
              Crear una cuenta
            </Link>
          </Grid>
        </Grid>
      </form>
    </AuthLayout>
  );
};
