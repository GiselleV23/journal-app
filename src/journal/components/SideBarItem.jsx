import { TurnedIn, TurnedInNot } from "@mui/icons-material";
import {
  Grid,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { setActiveNote } from "../../store/journal/journalSlice";

export const SideBarItem = ({
  tittle = "",
  body,
  id,
  date,
  imageUrls = [],
}) => {
  /*vamos aqui a hacer la funcion de que cuando yo de click sobre una nota se vuelva una nota actica para eso no
  vamos a generar una nueva accion en mi slice sino que usaremos la accion ya hecha con anterioridad setActiveNote*/

  const dispatch = useDispatch();

  const onClickNote = () => {
    dispatch(
      setActiveNote({ tittle, body, id, date, imageUrls })
    ); /*al ser una accion sincrona la puedo llamar 
    directamente, pues ya tengo la nota y solo la debo activar. recodemos que la nota activa tiene las mismas propiedades
    que la nota entonces por eso le debemos mandar al setActive dichas propiedades*/
  }; /*ya con esto al dar click sobre una nota esta saldra del sideBar y se posicionara en el cuerpo de mi app
  para asi poder editarla etc*/

  /*aqui vamos a usar un useMemo para que memorice mi tittle y solo cuando este cambie aplique la condicion de que si
  el titulo es un string de mas de 17 caracteres corte el titulo hasta 17 posiciones y le concatene los ... de no
  ser mayor a 17 entonces que muestre el titulo completo. esta variable newTitle la usamos en mi ListItemText primary*/
  const newTitle = useMemo(() => {
    return tittle.length > 17 ? tittle.substring(0, 17) + "..." : tittle;
  }, [tittle]);

  return (
    <ListItem disablePadding>
      <ListItemButton onClick={onClickNote}>
        <ListItemIcon>
          <TurnedInNot />
        </ListItemIcon>
        <Grid container>
          <ListItemText primary={newTitle} />
          <ListItemText secondary={body} />
        </Grid>
      </ListItemButton>
    </ListItem>
  );
};
