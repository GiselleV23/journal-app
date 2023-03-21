import { AddOutlined } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { startNewNote } from "../../store/journal";
import { JournalLayout } from "../layout/JournalLayout";
import { NoteView, NothingSelectedView } from "../views";

export const JournalPage = () => {
  const dispatch = useDispatch();
  const { isSaving, active } = useSelector(
    (state) => state.journal
  ); /*necesitmos toar el isSaving para hacer de manera codicional 
  la deshabilitada de mi boton + cuando dicha propiedad este en true*/

  const onClickNewNote = () => {
    //manejo del boton llamando y despachando la funcion que tenemos en nuestro thunks startNewNote

    dispatch(startNewNote());
  };

  return (
    <JournalLayout>
      {
        //si tenemos una nota activa mostrar el componente  <NoteView /> si no tenemos nota activa mostrar el
        //<NothingSelectedView />
        !!active ? <NoteView /> : <NothingSelectedView />
      }

      <IconButton
        disabled={isSaving}
        onClick={onClickNewNote}
        size="large"
        sx={{
          color: "white",
          backgroundColor: "error.main",
          ":hover": { backgroundColor: "error.main", opacity: 0.9 },
          position: "fixed",
          right: 50,
          bottom: 50,
        }}
      >
        <AddOutlined sx={{ fontSize: 15 }} />
      </IconButton>
    </JournalLayout>
  );
};
