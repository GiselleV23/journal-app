/*cuando toquemos el boton de + yo tengo que hacer el dispatch de una accion y esta accion es asincrona ya que tengo 
que salir de mi app llegar a firebase y luego regresar a mi app por eso lo hago en mis thunks que es donde despacho
tareas asincronas*/

import { collection, deleteDoc, doc, setDoc } from "firebase/firestore/lite";
import { FirebaseDB } from "../../firebase/config";
import { fileUpload, loadNotes } from "../../helpers";
import { addNewEmptyNote, deleteNoteById, savingNewNote, setActiveNote, setNotes, setPhotosToActiveNote, setSaving, upDateNote } from "./journalSlice";

export const startNewNote = () => { /*esta accion la despachamos cuando demos click en el boton + por lo cual esta 
funcion startNewNote la llamaremos o despacharemos  en el componente que tiene el boton + que es el journalPage*/
    return async(dispatch, getState) => {/*este segundo argumento que retorna mi funcion es una funcion la cual
    atrapara mi estado , es decir mostrara la info de mi actual usuario que es displatyName, photoURL etc pero 
    de este solo necesitamos el uid. esta funcion getState parece ser algo que me brinda redux en estas funciones
    asincronas de thunks*/
        
        dispatch(savingNewNote());/*despachando la accion de mi journalSlace que hace deshabilitar el boton de +
        si nuestra propiedad de stato isSaving esta en true , entonces lo que veremos es que cuando le demos click
        por un momento se deshabilitara en lo que obtenemos la utenticacion */

        //para grabar los datos en firebase de cada usuario debo tomar el uid de este para poder crear la newNote

        //console.log(getState())
        const {uid} = getState().auth; /*llamo mi funcion y que lo busque dentro del nodo de autenticacion ta tenemos 
        el uid y no necesitamos mandarlo dentro de nuestra newNote*/
        
        //console.log("startNewNote")//lo ponemos para provar en consola que el msj startNewNote se vea al click en +
        //la nueva nota que debo insertar:
        const newNote ={
            tittle: "",
            body: "",
            date: new Date().getTime(),
            //el uid que iria aqui me lo dara firebase
        }


        /*Ahora lo que debemos hacer es ver como podemos apuntar a nuestro nodo de notas de firebase por lo cual 
        necesitamos usar firebase y debemos crear la referencia donde queremos insertar la nota que es nuestra
        coleccion*/
        const newDoc = doc(collection(FirebaseDB, `${uid}/journal/notes`))/*asi ya tendriamos la referencia exacta
        a nuestra coleccion en cloudFirebase donde crearemos la base de datos de cada usuario . es aqui justo 
        donde tenemos esta referencia donde insertaremos la nueva nota. al poner en nuestra referencia en uid del 
        usuario la nora ya se guardaria especificamente como una nota de ese usuario */

        //isertar nota al usurio con dicho uid en el estado actual, es decir el usuario que esta autenticado actualemente
        const setDocResp = await setDoc(newDoc, newNote)  /*esta funcion setDoc de firebase me pide dos cosas 1 es la refrencia al documento donde lo
        quiero insertar y luego me pide el objeto que quiero grabar que es mi newNote. en pocas palabras el newDoc
        es la referencia al lugar de firebase fonde iran mis datos y el setDoc lleva elobjeto que se debe de alma
        cenar en newDoc*/

        console.log( {newDoc, setDocResp })
        
        /*ahora lo que debemos hacer es isertar nuestra nota en mi reducer es decir que se vea en mi state en redux
        en el navegador web y para eso solo necesitamos poner el id de mi usuario en el objeto newNote */

        newNote.id = newDoc.id /*estamos creando la propiedad id en mi newNote y vamos a disparar la accion en mi
        journalSlice  la de addNewEmptyNote*/
        

       dispatch(addNewEmptyNote(newNote)); //despachamos la accion de slice la cual requiere el payload
       /*ahora cada vez que demos click en mi boton de agregar nota + tendremo una nueva nota con el id que nos
       brindo firebase en nuestro estado de redux, entonces si vamos al navegador redux/state veremos que despues
       de dar dicho click la porpiedad id contendra el id de firebase
       
       pero la nota hasta aqui no esta activida y ese sera nuestr siguiente paso hacer que se active con mi action
       de mi slice que se llama setActiveNote entonces vamos a hacer esto en mi setActiveNote*/
       dispatch(setActiveNote(newNote));
       /*entonces en este punto cuando demos click en agregar nota tambien se vera en el state de redux en el navegador
       en la propiedad active la misma nota que se ve en mi propiedad notes
       
       y asi de facil ya incertamos nuestra nota activa para hacer que mi boton*/
    }
}

/*en este momento si cargamos el navegador web vamos a perder todoas las notas que ha hecho el usuario pero siguen
existiendo en firebase , el objetivo es que cuando el usuario inicie seccion obbtengamos las notas que el ha
realizado con anterioridad y eso es lo que haremos a continuacion al ser una tarea asincrona la haremos tambien 
en los thunks. algunas personas en lugar de disparar thonks lo que hacen es crear las funciones que van al backnd
traen la info y luego cuando ya se tiene la data procesada es lo que envia a la parte de redux y de esta manera
se ahorran la parte de los thonks */

export const startLoadingNotes = () => { /*el start es porque vamos a comenzar a cargar dichas notas ahora en donde
llamaremos esta funcion?. si recordamos nosotros creamos un hook que se llama useCheckAuth el cual cuando tenemos
un usuario el primero en darse cuenta es en mi useEffect de dicho customHook, ahi vemos si tenemos un suario  y cual 
es recordemos que este customHook lo usamos en nuestro router principal que es el appRouter y es justo aqui en este
cutom Hook donde podemos hacer el dispatch de mi startLoadingNotes para la peticion de traer dichas notas.*/
    return async(dispatch, getState) => {

        const {uid} = getState().auth;
        if(!uid) throw new Error('Uid del usuario no existe'); /*esto nunca deberia de pasar puesto que mi usuario
        siempre va existir si ya tomamos dicho uid pero nos sirve en caso de que por ejemlo mi dispatch de  
        startLoadingNotes se pusiera antes de tomar dicho usuario en mi useEffect de mi hook useCheckAuth, el 
        dispatch de esta funcion debe ser puesta despues de que ya tomamos nuestro usuario*/


        /*COMO EL CODIGO PARA TRAER LAS NOTAS DEL USUARIO DE FIREBASE ES ALGO QU LLEVARA MAS TRABAJO LO VAMOS A CREAR 
        COMO UNA FUNCION HELPER que tendra el nombre de loadNotes, ES DECIR UN HERLPER POR FUERA DE MIS MODULOS ya que 
        si ponemos dicho condigo dentro del thunk va a crecer mucho y lo ideal es tratar de mantenerlo limpio y facil 
        de leer. esta funcion creada en mi carpeta helpers sera llamada aqui*/
        //console.log({uid})

        const notes = await loadNotes(uid); /*esta variable notes le asignamos el valor de la peticion que hicimos
        en mi funcio loadNotes recordemos que en dicha funcion retornamos las notes */

        dispatch(setNotes(notes));/*nuestra accion del setNotes de mi slice tiene como valor de payload mi notas
        es decir el resultado de mi peticion loadNotes
        
        ahora si voy a mi navegador web en redux en mi state ya tendriamos las notas debidamente cargadas*/
    }
};

export const startSaveNote = () => { //funcion asincrona para guardar la nota que hizo mi usuario en cloud firebase
    return async(dispatch, getState) => {

        dispatch(setSaving());

       //necesitamos tomar el uid del user:
       const {uid} = getState().auth;

       //nececitamos la nota activa:
       const {active:note} = getState().journal; /*recordemos que la nota activa tiene mi id . pero como firebase
       ya lo tiene no queremos que se vuelva a crear por lo que tenemos que remover el id de esta nota activa entonces
       para eso haremos lo sig */

       const noteToFireStore = {...note};
       delete noteToFireStore.id; //eliminamos la propiedad id de nuestro objeto note

       //console.log(noteToFireStore); pata ver mi nota cuando doy guardar en consola

       const docRef = doc(FirebaseDB, `${uid}/journal/notes/${note.id}`) /*aqui hacemos referencia al documento
       donde tenemos que guardar la nota cuando ya confirmamos en consola que guarda correctamente*/

       await setDoc(docRef, noteToFireStore, {merge: true}) /*aqui ya vamos a guardar la nota en firebase para eso nos 
       pide la referencia y por eso le mandamos a la funcion setDoc la variable que creamos antes docRef , luego 
       enviamos la data que quremos enviar a firestore que es noteToFireStore, esta funcion setDoc tambien recibe 
       un tercer argumento llamado setOptions y ente dichas opciones esta el merge y este merge es simplemente una 
       union que si hay campos que estoy mandando en noteToFireStore y que no existen en firebase merge le pide a los 
       campos que estan alla que se mantengan al ponerlo en true
       */

       /*cuando hacemos todo lo del startSaveNote y el setSaving quiere decir que la nota ya se actualizo y su toco 
       guardarpues ya se ve dica actualizacion en la base de datos de firebase pero mi entrada en el sideBar se 
       mantiene igual , es decir la seccion de mi nota activa actualiza y guarda en firebase pero mi sideBar no 
       se actualiza con dicho cambio hecho en la nota activa, esto es porque en ningun momento le hemos dicho a nuestro
       jounalSlice que se actualizo una nota podriamos solucionarlo volviendo a cargar todas las notas pero no seria 
       practico ya que dicho cambio solo se realizo en una sola nota, es decir vamos a actualizar mi referencia local
        usando nuestra action upDateNote de mi slice  */

        dispatch(upDateNote(note)); /*nota actulizada con el id es decir la nota que esta en mi upDate no ls que esta en 
        mi noteFirestore ya que esa nota no tiene id si mandaramos esa nota y no la que hicimos en nuestro upDateNote 
        tendriamos que agregar el id*/

        /*en este punto ya logramos que lo que haciamos en la nota activa se actuaizara en la notas de mi sideBar */

        /*ahora lo que vamos a hacer es mostrar un msj que cuando yo de click en mi botnon de guardar aparezca el 
        msj diciendo que se grabo satidfactotiamente , tambien debemos deshabilitar el boton cuando estemos guardando 
        la nota */

    }
};

export const startUploadingFiles = (files=[]) => { //recibe como argumento archivos
    return async(dispatch) => {
        /*cuando comienzo a cargar debo hacer el dispatch de setSaving con la intecion de que me bloqueo botones 
        mientras carga y pondra la app en un estado de carga*/
        dispatch(setSaving());

        //console.log(files); verificar si estamos recibiendo dichos files

        //await fileUpload(files[0]);

        //Subir las imagenes en secuencia a cloudinary .
        const fileUploadPromises = [];
        for(const file of files){//aqui lo que haremos sera creaar un arreglo de todas la promesas a dispara

            fileUploadPromises.push(fileUpload(file));//insertamos con el push el arhivo que estoy iterando

        }

        //ahora para disparar dicho arreglo de promesas hago lo sig:
        const photosUrls = await Promise.all(fileUploadPromises); /*este all espera un arreglo de callbacks o en este 
        caso de promesas*/

        //console.log(photosUrls);

        /*ahora debemos establecer nuestro arreglo de imagenes guardadas en mi variable photoUrls en la nota activa
        ya que la nota activa es la que se va a guardar en nuestro firebase */

        //dispatch de mi action de mi slice setPhotosToActiveNote
        dispatch(setPhotosToActiveNote(photosUrls));

    }

};

export const startDeletingNote = () => { //lo llamamos en mi NoteView
    return async(dispatch, getState) => {

        // 1: tomamos del state lo que necesitamos para borrar la nota
        const {uid} = getState().auth;
        const {active: note} = getState().journal;

        //console.log(uid, note);//ver si estamos tomando correctamento lo que necesitamos para poder delete la nota


        /*2: ahora ya teniendo lo que necesitamos para borrar la nota necesitamos hacer la referencia al documento
        de firebase para eliminar la nota con dicho id para eso debremos contruir el url que nos da firebase en nuestro
        cloud firestore donde tenemos nuestras notas */

        const docRef = doc(FirebaseDB, `${uid}/journal/notes/${note.id}`) /*usamos el doc que es una funcion de firebase
        que me pide como primer argumeto la instancia a la base de datos la cual me la proporciona el mismo firebase con 
        el FirebaseDB y luego como segundo argumento el path como un string o los segmentos como un arreglo de strings
        el profe prefiere hacerlo con backticks y concatenar el uis del usuario que da firebase y la nota con el id */

        /* 3: ahora para eliminar dicha nota de firebase haremos lo sig usuando una funcion de firebase que se llama 
        deleteDoc y me pide como argumento la referencia del documento a eliminar que vendria siendo lo que guardamos 
        en la variable docRef */
        await deleteDoc(docRef); //esta respesta no regresa nada simplemente si se hace bien se borra y si no pues no 

        /* 4: una ves se borra la nota en firebase tenemos que limpiar mi store s decir eliminar mi nota de manera local
         y para eso despachamos nuestra nuestro deleteNoteById que esta en nuestrlo slice / journal*/
         dispatch(deleteNoteById(note.id)); /*aqui si recibe parametro ya que necesita borrar la nota activa y borrar 
         tambien el arreglo de notas que se encuentra en mi sideBar.tambien al eliminar la nota debemos eliminar las 
         imagenes de dicha nota en cloudinary, pero la eliminacion de las imagenes no las haremos aqui , las ahremos 
         con el backen directamente desde cloudinary*/

        
    }
}