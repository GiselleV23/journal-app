import { SaveOutlined } from "@mui/icons-material";
import { Grid, Typography, Button, TextField } from "@mui/material";
import { ImageGallery } from "../components";
import { useForm } from "../../hooks/useForm";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import { setActiveNote } from "../../store/journal/journalSlice";
import { startSaveNote } from "../../store/journal/thunks";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";

export const NoteView = () => {
  const dispatch = useDispatch();
  /*aqui tenemos lo que es el cascaron de cuando una nota esta activa es decir en modo edicion y ya no se encunetra
  en el sideBar sino en el cuerpo de mi app.
  
  aqui lo que necitamos hacer es tomar la nota activa para mostrarlo en este cascaron, entonces debemos manejar el
  formulario que tenemos en este cascaron y para ese manejo usaremos nuestro customHook useForm y como estado inicual
  de este formulario vamos a tomar la nota activa*/

  const {
    active: note,
    messageSaved,
    isSaving,
  } = useSelector(
    (state) => state.journal
  ); /*con la sintaxis active:note estamos indicando que 
  ahora el active sera note */

  const { body, tittle, date, onInputChange, formState } =
    useForm(note); /*el body y el tittle son los campos que yo necesito
  enlazar en mi nota activa es decir en este carcaron que tenemos aca y que cuenta con unos inputs para eso los vamos 
  a usar en mis TextField respectivos con name, value, y el onInputChage de mi hook useForm*/

  /*vamos a usar usemMemo para mostrar el date en mi nota activa, usamos el useMemo porque aunque la fecha no cambie
  mucho mi formulario si y yo solo quiero que este codigo se ejecute solo cuando cambie la fecha */
  const dateString = useMemo(() => {
    const newDate = new Date(date);
    return newDate.toUTCString();
  }, [date]);

  /*Ahor lo que tenemos que hacer es poder cambiar de nota activa , porqeu cuando ya hemos dado click en mi nota 
  y puesto su contenido en mi nota de edicion ya no podemos dar click en las otras esperando que cambie el continido
  a la nueva nota que clickie y esto se debe a que nuestro componente no se esta redibujando y lo unico que cambia
  es mi nota activa pero no cambia el initialForm de form de mi hook useForm, entonces debemos decirle a mi
  useForm que si mi objeto note cambia actualice las referencias de mi initialForm de mi custom Hook
  
  para solucionar esto vamos a implementar en mi useForm otro useEffect, ya con lo que hicimos en mi useForm soluciona
  mos este incoveniente*/

  /*Ahora vamos a hacer que cuando yo realice cambios en mi nota tambien estos cambios se reflejen en mi nota activa
  y para esto vamos a usar un useEffect */

  useEffect(() => {
    dispatch(setActiveNote(formState));
    /*al mandarle a mi setActiveNote mi formState el cual tiene todas las propiedades
    de la nota va a incluisve a tener las propiedades actualizadas de las mismas */
  }, [formState]); //cuando cualquier propiedad de mi formState cambie hare el dispatch de una nueva accion

  /*ahora sigue el tema de guardar mi nota en firebase que al ser asincrona lo haremos con un thunk y realizaremos
  el manejo del boton que se encuentra aqui de guardar*/

  useEffect(() => {
    //efecto para manejo de la nota guardada correctamente
    if (messageSaved.length > 0) {
      Swal.fire("Nota actualizada", messageSaved, "success");
    }
  }, [messageSaved]);

  const onSaveNote = () => {
    dispatch(startSaveNote());
  };

  return (
    <Grid
      className="animate__animated animate__fadeIn animate__fater" /*use de la libreria animated.style*/
      container
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ mb: 1 }}
    >
      <Grid item>
        <Typography fontSize={39} fontWeight="light">
          {dateString}
        </Typography>
      </Grid>

      <Grid item>
        <Button
          color="primary"
          sx={{ padding: 2 }}
          onClick={onSaveNote}
          disabled={isSaving}
        >
          <SaveOutlined sx={{ fontSize: 30, mr: 1 }} />
          Guardar
        </Button>
      </Grid>

      <Grid container>
        <TextField
          type="text"
          variant="filled"
          fullWidth
          placeholder="Ingrese un titulo"
          label="Titulo"
          sx={{ boder: "none", mb: 1 }}
          name="tittle"
          value={tittle}
          onChange={onInputChange}
        />

        <TextField
          type="text"
          variant="filled"
          fullWidth
          multiline
          placeholder="¿Qué sucedió hoy?"
          minRows={5}
          name="body"
          value={body}
          onChange={onInputChange}
        />
      </Grid>

      {/*aqui pondriamos una galaeria de imagenes*/}
      <ImageGallery />
    </Grid>
  );
};
