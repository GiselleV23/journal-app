import { useEffect, useMemo, useState } from 'react';

export const useForm = ( initialForm = {}, formValidations={} ) => {
  
    const [ formState, setFormState ] = useState( initialForm );

    /*debemos crear un nuevo esado para comprobar si los inputs son validos o no.
    esto lo hacemos mediante un hook de react porque si se dispara un error en el formulario necesitare redibujar
    el formulario es decir que se vuelva a generar para asi mostrar los msj de error y si no esta en u error
    que se borren las cosas . cuando hablamos de cambiar cosas en el html que requieran renderizarse tenemos que
    usar añgun tipo de hook que maneje el estado */
    const [formValidation, setFormValidation] = useState({
        //la idea de este estado es que yo pueda saber con mi formValidation si hay un error o no en mi campo o input
    });

    //mandamos a llamar mi funcion createValidators mediante un useEffect
    useEffect(() => {

        createValidators() //cada que mi formState(cambie mi email, password, dname) cambien llamamos mi createValidators
        
    }, [formState]); //dependencias cada que el formState cambie(cada que mi estado inicial cambie)


    /*vamos a implimentar otro useEffect donde si el objeto que recibe mi form cambia asi mismo actualice los campos
    mi initialForm, esto lo hicimos con el problema de que mi nota activa solo podia posicionarla en el mis inputs
    una sola vez y que si ya lo habia hecho y trataba de dar click en otra nota para ponerla en mi modo activo
    de edicion no podia y seguian los datos de la primera nota que active para edicion*/
    useEffect(() => {

        setFormState(initialForm);
        
    }, [initialForm]); 

    /*ahora hay que hacer la validacion de mi formulario completo no solo de cada campo por individual para que
    todo nuestro form este valido cada campo debe de estar en null.
    usaremos un useMemo porque quiero memorizar el valor y unicamente deberia de volverse a procesar si cambia mi
    formState sobre todo lo hacemos si cambia el estado de otro lugar no re procesar este ya que de igual forma
    mi formState estara cambiando constantemente pero es una buena practica usarw el useMemo*/
    const isFormValid = useMemo( () => {

         /*lo que tenemos que hacer aqui es de alguna manera retornar un true si el formulario es valido y un false
         entonces vamos a tomar nuestro estado actual el formValidation y barrer cada una de sus propiedades y ver
         si cada una de estas tiene el valor de null, si algun campo no esta en null vamos a salirnos del ciclo 
         y decir "el formulario no es valido " */
         for(const formValue of Object.keys(formValidation)){//barremos cada una de las llaves que tiene mi formvalid

            //ahora haremos una evaluacion:
            if( formValidation[ formValue] !== null) return false;/*estoy preguntando si mi formValidation en la 
            propiedad formValue(que puede ser el email, password o display name segun la iteracion en la que se 
            encuentre) es diferente !== de null entonces podremos un return false para romper el ciclo y salirce
            de la funcion */

         }
         return true;
    }, [formValidation]);

    const onInputChange = ({ target }) => {
        const { name, value } = target;
        setFormState({
            ...formState,
            [ name ]: value
        });
    };

    const onResetForm = () => {
        setFormState( initialForm );
    };

    const createValidators = () => {

        const formCheckedValues = {};

        //hay que barrer nuestro objeto de lidaciones es decir nuestro objeto 
        for(const formField of Object.keys(formValidations)){
            /*el object.keys me permite tomar las propiedades de un objeto y convertirlos en un arreglo para asi 
            poder iterarlos, el formField es el nombre que le daremos a la posicion que este iterando en el 
            momento. seria basicamente otra propiedad de mi objeto. */
           //console.log(formField); //el formField toma todas las propiedades de mi objeto formValitations

           const [fn, errorMessaje] = formValidations[formField]; /*destructuramos las propiedades de mi array  
           que se encuentran en mi objeto formValidations que son la posicion 0 la funcion y la posicision 1 que es 
           mi mensaje de error.
        
           [formFiel] es una propiedad computada : es una propiedad computada ya que esta se creara de manera dinamica
           segun donde se encuentre mi iteracion. ya que si pusieramos formValidations.formField no lo encontrariamos
           porque no exisitiria en mi objeto
           el formField tomara elvalor de la propiedad en la que se encuentre la iteracion es decir que su la itera
           cion esta en la posicion 0 que es mi email mi formField tomara los valores de mi email es decir su fn y
           y su errorMessaje*/

        //ejecucion de mi fn
           formCheckedValues[`${formField}Valid`] = fn(formState[formField]) ? null : errorMessaje;
           /* tomamos nuestro onbjeto que dejamos vacio(formChectVales)
           [${formField}valid] es una nueva propiedad computada que tendra anexado el valid y esta nueva 
           propiedad tendra como valor mis isFormValid,displayNameValid,emailValid,passwordValid que los recibe
           mi cutom Hook useForm.

           y esto sera igual a la ejecucion de mi fn que estoy mandando y el primer argumetno que vamos a mandar es el
           es el valor del formulario en nuestro formField, es decir el valor que tenga nuestro input correspondiente

           tomamos el formState pues ahi tenemos los valores de nuestro formulario y si esta condicion se cumple
           podemos almacenar un null mediante un ternario indicando que no hay un error y caso contrario el 
           errorMessajesi no se cumple y muestra un false mostaremos el errorMessaje
           
           */
        }

        //ahora debemos establecer nuestro cambio estado indicando que el formCheckValues sera el stato actualizado
        setFormValidation(formCheckedValues)
        /*console.log(formCheckedValues);/*veremos que mi formCheckValues sera un objeto con estas propiedades: 
         displayNameValid, emailValid, passwordValid estaran en null los que cumplan las condiciones del objeto
         formValidations creadas en mi RegisterPage si alguno de estos campos no cumple la condicion se mostrara en la
         consola dicho msj de error ejemplo y los que si la cumplen estaran en null:

         displayNameValid: null
         emailValid: null
         passwordValid: "El password debe de tener mas de letras."
       */
    };



    return {
        ...formState,
        formState,
        onInputChange,
        onResetForm,

        ...formValidation,//exparsimos este objeto para que mi registerPage tome todas las propiedades de este
        isFormValid//Retornamos mi funcion de validacion de todo el formulario aqui para ser tomado por registerPage

    }
}