const initialState =  {
    currentItem: null,
    currentClass: null,
    suppliers: null,
    email: null,
    password: null,
    isAuth: false,
    token: null,
    userId: null
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
            return{
                ...state,
                token: action.token,
                userId: action.userId
            }
        case "LOGOUT":
            console.log("hi!");
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