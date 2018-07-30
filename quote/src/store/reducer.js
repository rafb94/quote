const initialState =  {
    currentItem: null,
    currentClass: null
}

const reducer = (state = initialState, action) => {

    switch(action.type) {
        case "UPDATE_ITEM":
            return{ 
                ...state,
                currentItem: action.value
            }
        case "UPDATE_CLASS":
            return{ 
                ...state,
                currentClass: action.value
            }
        default:
            return state
    }

}

export default reducer;