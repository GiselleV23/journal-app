import { createSlice } from '@reduxjs/toolkit';
export const journalSlice = createSlice({ //este journalSlice lo debemos poner en nuestro store.js
   name: 'journal',
   initialState: {
      isSaving: false, //neceisto como stado inicial una bandera buelana para saber si estoy salvando o no 
      messageSaved: "", //estado donde el msj ya esta guardado
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
    deleteNoteById } = journalSlice.actions; //debo exportar mis acciones para usarlas en otras partes de mi app