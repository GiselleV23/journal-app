import { async } from "@firebase/util";
import { collection, getDocs } from "firebase/firestore/lite";
import { FirebaseDB } from "../firebase/config";

//esta funcion asyn la llamamos en nuestro thunk startLoadingNotes
export const loadNotes = async(uid = "") => {//funcion para traer las notas de mis usurios que estan guardadas en firebase
    if(!uid) throw new Error('Uid del usuario no existe'); 

    /*como traer todos los documentos de mi base de datos en firebase , es decir todas la notas que tiene el usuario? 
    firebase nos ofrece dicha ayuda usando el collection que nos ayuda a tomar la referencia a la coleccion que
    necesitamos recordemos que cloud firebase trabaja collection - docuemntos -collection - documentos etc.
    
    al poner los parentesis en collection nos va a pedir la instancia de mi base de datos que ya viene configurada
    la cual seria, luego nos pide el path o los segmentos para llegar a la collection que me interesa.
    
    NOTA: si ponemos collection debe apuntar a collection si ponemos document debera apuntar a un document sino
    tendremos un error
    
    la coleccion que nosotros vamos a tomar es la notes*/

    const collectionRef = collection(FirebaseDB, `${uid}/journal/notes`);//ya aqui apuntamos a la collecion

    //ahora hay que traer los documentos que seria de la sig manera:
    const docs = await getDocs(collectionRef);/*con el getDocs que no da firebase los tomamos y me pide la referencia
    a la colleccion de la que tomaremos dichos documentos*/

    /*console.log(docs); al hacer este console log de mis docs veremos nuestros docuementos donde lo unico facil de 
    de ver es el uid que se ve al abrir alguno de los docuementos si abrimos donde dice prototype veremos una funcion
    llamada data que esta dentro de cada uno de esos documentos 
    nosotos con el docs optenemos la referencia a lso documentos de firebase pero si yo quiero la data que se 
    encuentra dentro debo de llamar la funcion que se llama data y esta dentro de cada uno de ellos y eso 
    es lo que haremos a continuacion.*/

    const notes = [];
    docs.forEach(doc => {
        /*console.log(doc.data()); /*de esta manera ya veriamos en consola la data de dichos documentos que son :
        {date: 1678196036345, body: '', tittle: ''} que fueron el objeto con las propiedades de campo , tipo y valor 
        que le dimos cuando creamos nuestra coleccion de notas */

        //como en dicho objeto no tenemos el id debemos agragarlo es por eso que hacemos los sig
        notes.push({id: doc.id, ...doc.data()}); /*usamos el push y mandamos el id que esta en mi doc.id, luego esparcimos
        con el operador express lo que contiene mi data que esta dentro de mi doc */
    });

    /*console.log(notes)  ahora en consola podremos ver nuestro de arreglo de objetos con las propiedades que tiene y 
    tambien la que agregamos ahora que es el uid se vera algo asi:
    body: ""
    date: 1678196036345
    id: "91IJg9rZd2h1QnE7R2iU"
    tittle: "" */

    //y luego retorno mi notas:
    return notes;

    /*ahora con mis notas ya optenidas debemos hacer en nuestro slice la funcionalidad de setNotes y despachar
    el setNotes en mis thonks para establecer las notas y en mi store en redux en el state ver mis notas cargadas
    que recordemos que hasta ahroa la propiedad de notes en mi initialState tiene el valor de un arreglo vacio*/
};

