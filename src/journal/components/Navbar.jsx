import { LogoutOutlined, MenuOutlined } from "@mui/icons-material";
import { Grid, AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { startLogout } from "../../store/auth/thunks";

export const Navbar = ({ drawerWidth = 240 }) => {
  const dispatch = useDispatch();
  //AQUI VAMOS A TRABAJAR EL LOGOUT CON NUESTRO BOTONde salir que es el LogoutOutlined
  /*nosotros basicamente tendremos que hacer el logout de firebase y esto no es una funcion totalmente sincrona 
  porque de cierta forma necesitaremos llegar a fiebase , adicionalmente yo luego tambien tendre que limpiar otras
  partes de mi store como por ej en este caso solo tenemos en nuestro store la propiedad auth pero mas adelante 
  tendremos journal , puede que tengamos ui es decir otras opciones que vamos a tener que limpiar y vamos a tener
  que haccer los dispatch de cada una de esas acciones  , entondes en la parte de firebase en los privers.js vamos
  a llamar la funcion de singOut que no brinda firebase */

  const onLogout = () => {
    //aqui voy a necesitar hacer el dispatch de una accion la cual la accion la crearemos
    //en los thunks si no fuera asincrona podriamos hacerla directo en un reducer
    //console.log("logout");
    dispatch(startLogout());
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          sx={{ mr: 2, display: { sm: "none" } }}
        >
          <MenuOutlined />
        </IconButton>

        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" noWrap component="div">
            JournalApp
          </Typography>

          <IconButton color="error" onClick={onLogout}>
            <LogoutOutlined />
          </IconButton>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};
