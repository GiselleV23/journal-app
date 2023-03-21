import { TurnedInNot } from "@mui/icons-material";
import {
  Drawer,
  Box,
  Toolbar,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Grid,
  ListItemText,
  useRadioGroup,
} from "@mui/material";
import { useSelector } from "react-redux";
import { SideBarItem } from "./SideBarItem";

export const SideBar = ({ drawerWidth }) => {
  const { displayName } = useSelector((state) => state.auth);

  /*aqui vamos a tomar las notes para poder mostrarlas en mi app , recordemos que la notes las trabajamos con mi funcion
   loadNotes, con la action de mi slice setNotes y la despachamos con mi thunk startLoadingNotes*/
  const { notes } = useSelector((state) => state.journal);

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      <Drawer
        variant="permanent" //esta varient podria ser temporary si quisieramos mostrarla o ocultarla en condicional
        open={true}
        sx={{
          display: { xs: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            {displayName}
          </Typography>
        </Toolbar>
        <Divider />

        <List>
          {notes.map((note) => (
            <SideBarItem key={note.id} {...note} />
          ))}
        </List>
      </Drawer>
    </Box>
  );
};
