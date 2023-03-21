import { Navigate, Route, Routes } from "react-router-dom";
import { AuthRoutes } from "../auth/routes/AuthRoutes";
import { useCheckAuth } from "../hooks";
import { JournalRoutes } from "../journal/routes/JournalRoutes";
import { CheckingAuth } from "../ui/components/checkingAuth";

export const AppRouter = () => {
  /*nosotros nos encontramos auntenticados en firebase pero nuestra app no es capaz de mantener el estado de 
        la informacion que paso por el login o el register porque esa info esta en la memoria local y si recargo el 
        navegador web toda esa informacion se pierde y entoncen debemos hacer algo para ver la secciondel usuario 
        y recargar nuevamente nuestro state de redux en ek nvegador web  
   MANTENER EL ESTADO DE AUTENTICACION AL RECARGAR LA PAGIGA:
   EL SIGUIETE PASO SERIA DISPARAR UN EFECTO UNO que automaticamennte revise si la persona esta autenticada o no.
   firebase nos ofrece una forma de estar pendiente de ls cambios que dicho usuario va a tener  y esto es una funcion
   que se llama onAuthStateChanged*/

  const status = useCheckAuth(); //use de mi hook de autenticacion de usuario despues de haber recargado la pag

  if (status === "checking") {
    return <CheckingAuth />;
  }

  /*vamos a mostrar las rutas de manera condicional y sea la ruta del login o del register ya que si ya estamos 
  autenticados no deberiamos de ver de nuevo la del login pues ya estariamos adentro de la app y est tambien es una 
  forma de protecion de rutas publicas y privadas de manera condicional entonces ya con esta condicion cuando ya
  estemos en nustro login autenticados nos llevara a nuestra pantalla del jurnal que ya es nuestra app como tal 
  cuando intentemos poner en el link la ruto auth/login no lo permitira y permanecera en mi journal page
  ya que el login y el register solo existiran si e usuario no esta autenticado*/
  return (
    <Routes>
      {status === "authenticated" ? (
        <Route path="/*" element={<JournalRoutes />} /> //si estoy autenticado muestro mi journalRoutes
      ) : (
        <Route path="/auth/*" element={<AuthRoutes />} /> //si no estoy estoy autenticado muestro mi authroutes
      )}

      {/*AQUI PONDREMOS LA RUTA POR DEFECTO */}
      <Route path="/*" element={<Navigate to="/auth/login" />} />

      {/* login y registro */}
      {/*<Route path="/auth/*" element={<AuthRoutes />} />*/}

      {/* el diario o propiamente nuestra app journalApp, es decir donde la perdona autenticada vendra a trabajar */}
      {/*<Route path="/*" element={<JournalRoutes />} />*/}
    </Routes>
  );
};
