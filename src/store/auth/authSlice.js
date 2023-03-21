import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({

    name: 'auth',
    initialState: {
        //status: 'not-authenticated', 'checking',  , 'authenticated'
        status: "checking", /*ya lo ponemos en checkimg cuando hacemos el componente checkingAuth entonces lo que 
        vamos a hacer es que si estamos en checking nos vamos a ir a nuestro appRouter y antes de mostrar las rutas 
        vamos a hacer una condicion o evaluacion */
        uid: null,
        email: null,
        displayName: null,
        photoURL: null,
        errorMessage: null,
    },
    reducers: {
        login: (state, {payload}) => {

            state.status = 'authenticated';
            state.uid = payload.uid;
            state.email = payload.email;
            state.displayName = payload.displayName;
            state.photoURL = payload.photoURL;
            state.errorMessage = null; //aqui ya no tenemor el errorMessage pues hizo todo bien y esta en el login

        },

        logout: (state, {payload}) => {//aqui el payload entraria a discucion si es necesario puesto que si hago un logout es para cerrar seccion

            state.status = 'not-authenticated';
            state.uid = null;
            state.email = null;
            state.displayName = null;
            state.photoURL = null;
            state.errorMessage = payload?.errorMessage; //si viene el payload que tome el errorMesage sino que tome el objeto vacio

        },

        checkingCredentials: (state) => { /*verifica si esta autenticado o no y pone el cheking em el instante en el
        que el usuario da click en el boton de google para autenticarse*/
            state.status = 'checking'
        },
    }
});

export const { login, logout, checkingCredentials } = authSlice.actions;