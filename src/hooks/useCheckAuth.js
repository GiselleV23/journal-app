import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FirebaseAuth } from "../firebase/config";
import { login, logout } from "../store/auth/authSlice";
import { startLoadingNotes } from "../store/journal";

export const useCheckAuth = () => {
     //para est use efect haremos un custom hook para no llenar mi appRouter con tanto codigo 
  //evaluacion de si app esta en checking en mi estatus de mi authslice mostrar mi componente de carga checkingauth
  const { status } = useSelector((state) => state.auth); //tomamos el estatus
  const dispatch = useDispatch();

  
  useEffect(() => {
    onAuthStateChanged(FirebaseAuth, async (user) => {
      /*esta funcion me pide mi auth que es mi firebaseauth esta 
    funcion regresa en si misma algo que se conoce como obserbable y los obserbables no son mas que una funcion que 
    esta emitiendo valores . cuando el estado de mi app cambie mi funcion se va a volver a disparar, normalmente 
    cuando tenemos una funcion obserbabol voy a querer limpiarla pero en este caso no porque siempre qiero estar 
    pendiente de dicho cambio e mi status. ligo esta funcion recibe el callback que es la fumcion que yo quiero 
    ejecutar cuando esta reciba el sig valor es decir el nuevo user*/
      if (!user) return dispatch(logout()); //llamamos mi logout que esta en mi authSlice

      //ahora si  tengo un usuario voy a llamar el dispatch pero del login
      const { uid, displayName, photoURL, email } = user;
      dispatch(login({ uid, displayName, photoURL, email }));
      //ahora para lograr autenticar dicho usuario despues de recargar la pagina hay que hacer el dispatch del mismo
      /*ahora ya el usuario que haya ingresado va a permanecer autenticado sin importar si se recargo o no la pagina
      el que haya ingresado en el login esta siempre en estado de autenticado */

      /*Aqui despachamos accion de mis thunks del journal que traera las notas de mi usuario para que asi el usuario
      al ingresar con su cuenta mantenga sus notas hechas con anteridad es decir que sus cambios se guarden*/
      dispatch(startLoadingNotes());//debe despecharse depues depues del dispatch del login que es cuando toma el user
    });
  }, []);

  return status;
  
}