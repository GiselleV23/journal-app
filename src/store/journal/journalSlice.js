import { createSlice } from '@reduxjs/toolkit';
export const journalSlice = createSlice({ //este journalSlice lo debemos poner en nuestro store.js
   name: 'journal',
   initialState: {
      isSaving: false, //neceisto como stado inicial una bandera buelana para saber si estoy salvando o no 
      messageSaved: "", /*estado donde el msj ya esta guardado, es decir cuando demos guardar la nota y esta se guarde
      vamos a poner el msj aqui y cuando estamos haciendo una nueva nota este msj lo limpiamos*/
      notes: [], //nuestras notas ya guardadas estaran en un objeto que sera un arreglo 
      active: null, //estado que se vera si la nota esta activa y contendra las propiedas de cada nota
   },

   reducers: {
     
      savingNewNote: (state) => { /*cuando llamemos esta funcion debemos cambiar nuestra propiedad isSaving a true y que si
      mi isSaving esta en true el boton de + este deshabilitado y esta condicion la manejamos en mi journalPage
      directamente en mi boton +*/

         state.isSaving = true; //cuando llamemos esta accion estara en true siempre y la disparamos en nuestro thunk
      },

      //ahora vamos a definir que acciones vamos a necesitar para nuestro diario haciendo un CRUD
      addNewEmptyNote: (state , action) => {/*cuando toquemos el boton de + debo trabajar con firebase para comenzarla
       a actualizar. ahora ya teniendo la nota lista en la parte de mis thunks, cuando yo mande a disparar mi  
       addNewEmptyNote mi action.payload debe ser la nota que yo voy a incertar como estamos en redux toolkit
       no es necesario destructurar para tomar las notas anteriores sino que puedo hacer codigo mutante y eso se 
       encargara de crer un nuevo estado estado*/

       state.notes.push(action.payload); //estamos agregando una nueva nota a mi propiedad de notas que es un []
       state.isSaving = false; //lo ponemos
      },
   
      setActiveNote: (state, action) => { //accion donde al dar click en una nota la establece como actva
            state.active = action.payload/*estamos diciendo que la propiedad active es igual a la action.payload
            es decir a mi note diciendo que mi setActiveNote su action es la nota que quiero establecer en pantalla 
            es decir mi newNote y la mando a llamar y hago el dispatch en mi thunks */

            state.messageSaved =""; //estoy cambiando la nota activa por eso limpiamos el msj
      },

      setNotes: (state, action) => { //action para cargar las notas, cuando ya las tenemos leidas desde algun lugar
           state.notes = action.payload; /*asignamos el valor para la creacion de mis notas que era antes un objeto
           vacio y ahora es el payload que tiene como valos el notes que  su ves tiene el valor del resultado de mi 
           peticion hecha con la funcion loadNotes*/
      },

      setSaving: (state) => { //crear la nota ya cargada
         /*este setSavin lo vamos a mandar a llamar y a despachar e los thunks en la accion startSaveNote que es donde 
         guardamos la nota en firebase */
         state.isSaving = true;
         //falta TODO msj de error

         state.messageSaved =""; /*limpiamos el valor del msj mientras la nota esta cargada pero no guardada*/
        
      },

      upDateNote: (state, action) => { /*actualizar una nota para que se vea el cambio en mi en mi side bar al hacer
      dicho cambio en mi nota activa, entonces lo que vamos a hacer es barrer nuestro arreglo de notas , buscar el id
      de la nota en la que se realizo el cambio y hacer su actualizacion*/

         state.isSaving = false; //pasamos el isSaving a false porque ya termino de cargar dicha nota a la BD

         state.notes = state.notes.map(note => {

            if(note.id === action.payload.id){//vamos a suponer que el payload es igual a nota actulaizada
               return action.payload;
            }

            return note;

         });

         //todo msj de actualizacion
         state.messageSaved = `${action.payload.tittle}, actualizada correctamente` /*con un efecto vamos a poder
         estar pendientes de este msj y cuando este cambie el messageSaved cambien a mi texto actualizada correc-
         tamente podemos disparar el sweetAlert2 */
      },

      /*Ahora lo que vamos a hacer es trabajar con nuestras images de nuestra app para las cuales usaremos
      cloudinary el cual la cual con su bibliotea de medios emplea apis restful y sdk para automatizar imagenes
      y tambien usaremos postman para hacer la peticion a cloudinary nusyras magenes necesitan un backend que 
      tenga un url ose un api que este esperando esas imagenes y aqui es donde usaremos clodinary
      
      vsmos a necesitar hacer un selector de imagenes que nos permita tomar la imagen que queramos y mandarla a cloudinary
      entonces vamos a tomar las imagenes, seleccionarlas, cargarlas, mandarlas a llamar, crear el frontdata y subirlo
      etc
      
      buscamos con esto que nuestra app le permita a nuestro usuario seleccionar imagines propias de su galeria en el 
      pc y agregarlas a la nota con la que se relaciona dicha imagen, esto lo haremos en mi componente NoteView*/


      /*ahora vamos a subir nuestras imagenes a cloudinary , como para esto voy a necesitar hacer una peticion http
      es decir algo asincrono debo de hacer un thunk el cual se llamara startUploadingFiles */

      setPhotosToActiveNote: (state, action) => {

         state.active.imageUrls = [...state.active.imageUrls, ...action.payload]; /*aqui lo que estamos haciendo es
         crear una nueva propiedad a mi active que es el imageUrls y esta sera igual un arreglo que con el operador
         expres le indico que tome todas las imagenes anteriores y le concateno el action.payload que vendria siendo
         las imagenes nuevas asi tendriamos un arreglo con las imagenes viejas y con las nuevas  llamamos neustro
         setPhotosToActiveNote en el thunk */

         state.isSaving = false;

      },

      deleteNoteById: (state, action) => { //eliminar de nuestro listado las notas 

      }

   }
});
// Action creators are generated for each case reducer function
export const { 
    savingNewNote,
    addNewEmptyNote,
    setActiveNote,
    setNotes,
    setSaving,
    upDateNote,
    setPhotosToActiveNote,
    deleteNoteById } = journalSlice.actions; //debo exportar mis acciones para usarlas en otras partes de mi app
