import { Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Button,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { AuthLayout } from "../layout/AuthLayout";
import { useForm } from "../../hooks";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { startCreatingUserWithEmailPassword } from "../../store/auth/thunks";
import { useMemo } from "react";

const formData = {
  /*mis argumetos el lugar de recibirlos mi useForm directamento los creamos en una variable aparte 
  si yo dejo estos campos como un string vacio y borro los campos tambien en mi navegador web y recargo l a pag
  los campos seguiran vacios mostrando l error y no deberia de ser asi puesto que si recargo mi pagina o entro a
  ella por primera vez no me deberian de aprecer con los msj de eror mis campos*/
  email: "",
  password: "",
  displayName: "",
};

const formValidations = {
  /*este objeto se lo mandaremos a mi useForm para que me diga vomo determinar si mis campos 
estan bien entonces en mi hook useForm es donde tendremos mi funcion para validar*/

  /*aqui mandaremos una funcion para evaluarlo la funcion como primer argumento tendra el value(valor actual
    que escribe la persona) y opreguntamos si ese valor incluye la @ 
    El valor de cada propiedad es un arrgelo donde cada uno tiene en la primera posicion la funcion que lo va a
    evaluar y el segundo el msj de error a mostrar*/
  email: [(value) => value.includes("@"), "El email debe contener un @."], // este es el msj que querre mostrar en mi propiedad error
  password: [
    (value) => value.length >= 6,
    "El password debe de tener mas 5 de letras.",
  ],
  displayName: [(value) => value.length >= 1, "El nombre es obligatorio."],
  //si las condiciones no se cumplen se mostrara el msj , es decir la posicion 1 de mi arreglo
};

export const RegisterPage = () => {
  const dispatch = useDispatch();
  /*use del dispatch para poder despachar mi funcion startCreatingUserWithEmailPassword 
   que se encuentra e mi thunks*/

  const [formSubmitted, setFormSubmitted] =
    useState(false); /*aqui conmenzamo a solucionar el problema de cuado 
  se carga la pagina por primera vez y los campos por estar vacios aparecen con el msj de error */

  //Aqui trabajaremos la parte de mostrar al usuario el msj que nos da firebase sobre si su usuario ingresado ya existe
  /*con el useSelector tomamos el state y no interesa tomar del state el state.auth y del state.auth voy a 
  destructurar el status y el errorMessage*/
  const { status, errorMessage } = useSelector((state) => state.auth);
  /*ahora aqui desahabilitaremos el boton de register para que cuando se este registrando no se pueda hacer click en
  el si nos encontramos en el checking de nuestra autenticacion y hacemos el useMemmo porque no quiero que mi status
  se este recalculando cada que cambien los valores del forulario */
  const isCheckingAuthentication = useMemo(
    () => status === "checking",
    [status]
  );

  //AQUI VAMOS A REALIZAR LAS VALIDACIONES DE CADA CAMPO DE MI FORMULARIO DE REGISTRO DE USUARIOX
  //cuando el usuario no esta registrado/autenticado y debe crear su cuenta
  const {
    formState,
    displayName,
    email,
    password,
    onInputChange,
    /*mi useform debe validar cada uno de estos campos, pero mi use form no tiene forma de saber que campo esta 
    siendo trbajado pues estos cambian de manera dinamica, por lo que debemos mandarle a mi useForm mis validaciones
    de manera dinamica en otro objeto*/
    isFormValid,
    displayNameValid,
    emailValid,
    passwordValid,
  } = useForm(formData, formValidations); //le mandamos a mi form el segundo argumento que es mi objeto de validation
  //y tambien mandamos mi formValidations a mi customHook use form

  /* console.log(displayNameValid); 
  aqui cuando yo escriba en mi input displayName sera null pero si borro lo escrito 
  llegara mi msj de error diciendo que aquel campo es obligatorio*/

  //conexion a los campos respectivos de los inputs para que podamos hacer el submit del formulario
  const onSubmit = (event) => {
    event.preventDefault();
    setFormSubmitted(true); //cuando se toque el boton de submit tener el setForm en true

    if (!isFormValid) return; //si isForm no es valido que haga un return
    //console.log(formState);

    dispatch(startCreatingUserWithEmailPassword(formState)); //despachamos mi funcion que esta en mis thunks
  };

  return (
    <AuthLayout title="Crear cuenta">
      <h1>FormValid: {isFormValid ? "Válido" : "Incorrecto"}</h1>
      <form
        onSubmit={onSubmit}
        className="animate__animated animate__fadeIn animate__fater" /*use de la libreria animated.style*/
      >
        <Grid container>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <TextField
              label="Nombre completo"
              type="text"
              placeholder="Jhon week"
              fullWidth
              name="displayName"
              value={displayName}
              onChange={onInputChange}
              error={!!displayNameValid && formSubmitted} //doble negacion lo convierte en un valor buelano
              /*propiedad del material ui me permite usar el error y al ponerlo solo estamos mandando un true 
              es decir unhay error y si este campo esta vacio me lo mostrara en color rojo. */
              helperText={displayNameValid} // me permite mostrar un mesj debajo de mi  campo vacio
              /*pero todo esto debemos ponerlo condicional es decir que si esta vacio aparezca el msj antes hecho
              que si no cumple los requerimientos en cada campo espesifique que no es valido todo esto lo podrias 
              hacer usando el useMemo como lo hicimos con el isAuthenticating. pero lo mejor seria que esto tambien
              fuera manejado por mi useForm */
            />
          </Grid>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <TextField
              label="correo"
              type="email"
              placeholder="correo@google.com"
              fullWidth
              name="email"
              value={email}
              onChange={onInputChange}
              error={!!emailValid && formSubmitted} //si el display name es valido  el formSumited sea disparado*/
              helperText={emailValid}
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
              error={!!passwordValid && formSubmitted}
              helperText={passwordValid}
            />
          </Grid>

          <Grid container spacing={2} sx={{ mb: 2, mt: 1 }}>
            <Grid item xs={12} sm={6} display={!!errorMessage ? "" : "none"}>
              {/*condicion display none */}
              <Alert severity="error">{errorMessage}</Alert>
              {/*el alert hay que usarlo de manera condicional
              para que no se vea cuando se recargue la pag y esten los campos vacios  */}
            </Grid>

            <Grid item xs={12} sm={6}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isCheckingAuthentication} //estara deshabilitado si esta haciento la autenticacion
              >
                Crer cuenta
              </Button>
            </Grid>
          </Grid>

          <Grid container direction="row" justifyContent="end">
            <Typography sx={{ mr: 1 }}>¿Ya tienes cuenta?</Typography>
            <Link component={RouterLink} color="inherit" to="/auth/login">
              Ingresar
            </Link>
          </Grid>
        </Grid>
      </form>
    </AuthLayout>
  );
};
