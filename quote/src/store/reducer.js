const initialState =  {
    currentItem: null,
    currentClass: null,
    suppliers: null
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
            console.log(action.valueClass)
            return{ 
                ...state,
                currentClass: action.valueClass
            }
        case "RETRIEVE_SUPPLIERS":
            return{ 
                ...state,
                suppliers: action.suppliers
            }
        default:
            return state
    }

}

export default reducer;