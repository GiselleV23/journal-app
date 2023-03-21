
import { signInWithEmailAndPassword,createUserWithEmailAndPassword,
    GoogleAuthProvider, signInWithPopup, updateProfile } from "firebase/auth";
import { FirebaseAuth } from "./config";

const googleProvider = new GoogleAuthProvider();

export const singInWithGoogle = async() => {

     try{

        const result = await signInWithPopup(FirebaseAuth, googleProvider);
        //const credentials = GoogleAuthProvider.credentialFromResult(result);
        //console.log({credentials})

        //const user = result.user; // destructuro el user del result
        //console.log(user);//para poder hacer el console del user y ver que propiedades tiene y cuales necesito

        const {displayName, email, photoURL, uid} = result.user;//aqui ya estoy sacando del user las propiedades que necesito

        return{
         ok: true, //indicamos aqui que todo salio bien en mi funcion singInWithGoogle
         displayName, email, photoURL, uid //y aqui viene la info de mi usuario
        }


     }catch (error) {

        //ESTOS SON LOS TIPOS ERRORES QUE PODEMOS TOMAR DE LA DOCUEMNTACION OFICIAL DE FIREBASE Y QUE NOS MNUESTRAN EN SU EJEMPLO
        const errorCode = error.code;
        const errorMessage = error.message;
        //const email = error.customData.email; ESTE ES EL ERROR DEL EMAIL QUE ESTABA INTENTANDO ASOCIARSE.NO LO USE
        //const credential = GoogleAuthProvider.credentialFromError(error);ESTA SI TENEMOS UN ERROR DE LA CREDENCIALES

        //si sucede un error seria lo sig:

        return{
         ok:false,

        }

     }
}

//vamos a comenzar desde aqui a trabajr el tema de agregar un usuario a mi firebase o base de datos
export const registerUserWithEmailPassword = async ({email, password, displayName}) => { //esperamos un obje con estas props
   //esta como es una tarea asincrona puede fallar razon por la cual haremos un try y un catch

    try{

        //necesitamos en el try llegar a firebase y para esto necesitamos una funcion que se llama
        const resp = await createUserWithEmailAndPassword(FirebaseAuth, email, password); 
        /*esta funcion pide 3 arguentos que son (auth,email, password) 
        entonces le mandamos el primer argumento que seria en este caso mi FirebaseAuth que es el que tiene toda
        la informacion de l autenticacion basado en la version 9 de firebase 
        
        Esta funcion vamos a tener que llamarla asi como llamamos la parte de la autenticacion de google es decir
        la llamaremo en la parte de los thunks donde crearemos un nuevo*/

        const {uid, photoURL} = resp.user; //si todo sale bien en mi promesa tomamos lo que necesitamos de mi user
        console.log(resp)

        //aqui vamos a actualizar el displayName Y auth mi usuario en firebase:
        /*ahora con lo que hicimos anteriormente creamos nuestro usuario tomamos sus datos y los pudimos ver en 
        consola a exepcion del displayname que aparecia en null incluso en nuestra web oficial de fireBase en nuestro 
        proyecto en la parte users pudimos ver dicho usuario con su correo uid, fecha de acceso y creacion pero este 
        usuario esta mal creado ya que le hace falta la configuracion del user name y por eso debemos borrarlo de 
        nuestro firebase 
        al actualizar el displayName lo que buscamos es que cuando hagamos el login nosotros sepamos el nombre de
        esa persona actualizar la informacion del perfil del usuario es bastante sencillo 
        
        PARA ACTUALIZAR MI USUARIO EN FIREBASE ESXITE UNA FUNCION LLAMADA updateProfile esta funcion me pide como
        argumetno un usuario el cual es el usuario logeado acualmente y para eso tenemos algo que nos brinda 
        firebase que es el FirebaseAuth.currentUser y es este objeto el que nos proporcieda nuestro usuario
        actuamente logeado. el  FirebaseAuth.currentUser se activa en el intante que llamamos a la funcion
        createUserWithEmailAndPassword que nos brinda tmabien firebase para crear mi usuario es decir logea de una
        vez mi usuario al estabñecer mi currentUser
        */
  
      
        await updateProfile(FirebaseAuth.currentUser, {displayName}) /*con el displayName actualizamos el usuario lo 
        cual tambien es una tarea asincrona una ves se hace la promesa lo actualiza en firebase y esto ya es lo 
        ultimo que haria falta en la parte del provedor*/

        return{
         ok: true,
         uid, photoURL, email, displayName
        };

    }catch (error){
      //console.log(error.message)
      return{ok: false, errorMessage: error.message}
      
    };
}


/*aqui vamos a comenzar a trabajar con el login cuando el usuario ya esta creado, despachando una accion asincrona
que mire en mi firebase si dicho usurio existe en su base de datos de user, esta funcion sera muy parecida a la de
registerUserWithEmailPassword y tambien necesitaremos de una funcion que nos brinda firebase para lograr lo de 
ver si el usuario existe en la base de datos. 

haremos mi funcion que realiza la peticion a mi firebase para luego usarla en mis thunk que es el que despacha:*/

export const loginWithEmailAndPassword = async({email, password}) => {

   try{

      //uso de la funcion que me brinda firebase la cual me pide el auth, email , password.
      //si todo sale bien nosotro tendriamos el user
      const resp = await signInWithEmailAndPassword(FirebaseAuth, email, password)
      const {uid, photoURL, displayName} = (resp.user)

      //creamos la respuesta con un return:
      return{
         ok: true,
         uid, photoURL, displayName
      }

   }catch (error){

      return {ok: false, errorMessage: error.message}

   }
};

export const logoutFirebase = async () => {
   return await FirebaseAuth.signOut();//esto cierra firebase, google, microsoft ...cierra todo 
}