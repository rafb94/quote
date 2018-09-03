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
    error: null,
    showSideDrawer: false,
    queryParams: null
}

const reducer = (state = initialState, action) => {

  

    switch(action.type) {
        case "UPDATE_ITEM":
            return{ 
                ...state,
                currentItem: action.valueItem
            }
        case "UPDATE_CLASS":
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
                userId: action.userId,
                queryParams: '?auth=' + action.token + '&orderBy="userId"&equalTo="' + action.userId + '"'
            }
        case actionTypes.AUTH_FAIL:
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
        case "TOGGLE_SIDEDRAWER":
            return{
                ...state,
                showSideDrawer: !state.showSideDrawer,
            }
        default:
            return state
    }

}

export default reducer;