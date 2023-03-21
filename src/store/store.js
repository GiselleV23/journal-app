import { configureStore } from '@reduxjs/toolkit'
import { authSlice } from './auth'
import { journalSlice } from './journal'

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer, //tenemos slice de autenticaciondonde trabajamos los form de login y register usto con firebase
    journal: journalSlice.reducer, //ahora tenemos aqui el nuevo reducer que ya es sobre nuestra app journal
    //ahora en el navegador en redux/state veremos tanto nuestro estado de auth y el estado de journal
  },
})  