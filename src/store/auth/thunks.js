
import { loginWithEmailAndPassword, logoutFirebase, registerUserWithEmailPassword, singInWithGoogle } from "../../firebase/providers";
import { checkingCredentials, login, logout } from "./authSlice";

export const checkingAuthentication = (email,Password) => { //dispara mi accion asincrona 
    return async(dispatch) => {
        
        dispatch(checkingCredentials());//checkingCredential es mi accion que pone mi estatus en checkin es decir si el usuario esta autenticado o no
    }
}


export const startGoogleSignIn = () => {
    return async(dispatch) => {

        dispatch(checkingCredentials());

        const result = await singInWithGoogle();
        /*console.log({result}) //con la parte de el try donde destructuramos mi user ya podemos tomar las 
        prpiedades de mi user que necesitamos y actualizar mi estado con dichas propiedades*/
    
        /*aqui vamos a manejar el error de cuando el usuario cancele la auth en mi popup
        despues de ya haber autenticado y volver a dar click en el boton de google
        el error que veremos sera mi ok: false */

        //haremos uso del logout que es una accion de mi authSlice
        if (!result.ok) return dispatch( logout(result.errorMessage)); /*si sucede un error lo veremos en mi estado en la
        parte del state en mi errorMesaje de mi logout*/


        /*ahora si todo sale bien y no hay error:
        haremos el dispatch de un objeto que pase  a mi action login seria lo mismo que tenemos en mi logut
        pero ya le paseremos a nuestras propiedades el valor que contiene el payload */
        dispatch(login(result))
        
    }
} 

/*aqui estamos creando nuestro usuario en mi firebase pero autenticado y el firebase me ayudara con el tema de los
errores en caso de que el usuario exista y esto lo mostraremos en mi propiedad antes creada errorMessage */
export const startCreatingUserWithEmailPassword = ({email, password, displayName}) => {
    return async(dispatch ) => {
        dispatch(checkingCredentials());//volvemos a hacer el cheking es decir que mi estado diga el cheking 

        //llamado de mi funcion que se encuentra en mis providers, tabien sera llamada e nuestro registerPage
        const {ok, uid, photoURL, errorMessage} = await registerUserWithEmailPassword({email, password, displayName});
        //console.log(resp)yo se que de mi respuesta desestructuro lo que necesito {ok, uid, photoURL}

        //ahora solo necesitare hacer una evaluacion 
        /*si mi ok fallo y algo sale mal voy  mandar a llamar mi logout que esta en mi authSlice el cual tiene
        mi payload.message lo que indica que mi errorMessage es una propiedad de un objeto por eso las llaves
        entonces aqui en caso de que mi usuario y exista firebase me mostrara el error diciendo que este ya existe
        y el status sera no-Authenticated*/
        if(!ok) return dispatch(logout({errorMessage}))


        /*si todo sale bien logeamos al usuario: recuerden que cuando hacemos el login: authenticated pero hasta aqui
        el msj de error que me regresa firebase solo se ve en mi objeto auth en la propiedad errorMessage de mi state
        de redux en el navegador , aqui no hemos hecho que dicho msj tambien se vea en mi registerPage para mi usuari
        y esto lo haremos en mi provier.js en la parte del catch y tambien lo trabajaremos en mi registerPage*/
        dispatch(login({uid, displayName, email, photoURL}));
    }

}

//verifiar que mi usuario ya con un cuenta se encuentre dicha cuenta tambien en mi firebase
/*entonces cuando estemos en mi login ingresamos mi cuenta ya almacenada en mi base de datos de firebase al dar click
en el boton login nuestro state de redux en el navegador mostrara nuestro usuario como authenticated con su display
name y uid y la photoURL y el errormessage en null puesto que no habra error ya que mi usuario si existe en la base 
en la base de datos
si por ejemplo escribimos mal la contraseña del usuario que ya esta en base de datos tendremoscomo respuesta del 
status no authenticates y el errorMessage(pin):"Firebase: Error (auth/wrong-password)." */
export const startLoginWithEmailAndPassword = ({email, password}) => {

    return async(dispatch) => {//depachamos la accion

        dispatch(checkingCredentials()); //volvemos a usar esta funcion para bloquear botones y poner el checkimg

        const result = await loginWithEmailAndPassword({email, password});
        console.log(result)

        //evaluacion de la respuesta:
        if (!result.ok) return dispatch( logout(result))

        dispatch(login(result));
    }

}; 

//trabajndo la accion para hacer el logot de firebase
export const startLogout = () => {/* este startLogout lo usamos en nuestro navbar con el useDispatch para luego 
usarlo en mi funcion onLogout que relacionamos con nuestro boton de salir*/
    return async(dispatch) => { //vamos a despechar la accion que creamos en mi provider

        await logoutFirebase(); //llamamos mi funcion de mi provider

        dispatch(logout());
    }
}