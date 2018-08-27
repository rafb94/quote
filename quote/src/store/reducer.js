import * as actionTypes from './actions/actionTypes';

const initialState =  {
    currentItem: null,
    currentClass: null,
    suppliers: null,
    email: null,
    password: null,
    isAuth: false,
    token: null,
    userId: null,
    error: null
}

const reducer = (state = initialState, action) => {

  

    switch(action.type) {
        case "UPDATE_ITEM":
            return{ 
                ...state,
                currentItem: action.valueItem
            }
        case "UPDATE_CLASS":
            if (action.valueClass !== null){ 
                switch (action.valueClass) {
                    case "ReactivosCalientes":
                        action.valueClass= "ReactivosCalientes";
                            break;
                    case "ReactivosFrios":
                        action.valueClass= "ReactivosFrios";
                        break;
                    default:
                        action.valueClass= action.valueClass;
                
                }   
            }
            return{ 
                ...state,
                currentClass: action.valueClass
            }
        case "RETRIEVE_SUPPLIERS":
            return{ 
                ...state,
                suppliers: action.suppliers
            }
        case "AUTH_START":
            return{
                ...state,
                email: action.email,
                password: action.password
            }
        case "AUTH_SUCCESS":
        console.log("success")
            return{
                ...state,
                token: action.token,
                userId: action.userId
            }
        case actionTypes.AUTH_FAIL:
            console.log("hi!")
            return{
                ...state,
                error: action.error
            }
        case "LOGOUT":
            return{
                ...state,
                token: null,
                userId: null,
            }
        default:
            return state
    }

}

export default reducer;