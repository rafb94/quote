import axios from 'axios';
import * as actionTypes from './actionTypes';


const authStart = (email, password) => {
    return{
        type: 'AUTH_START',
        email: email,
        password: password
    }
}

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        if(!token){
            dispatch(onLogout());
        } else{
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if(expirationDate > new Date()){
                const userId = localStorage.getItem('userId');
                dispatch(authSuccess(token, userId));
            }else {
                dispatch(onLogout());
                dispatch(checkAuthTimeout(expirationDate.getSeconds() - new Date().getSeconds()));
            }
           
        }
    }
}

const authSuccess = (token, userId) => {
    return{
        type: 'AUTH_SUCCESS',
        token: token,
        userId: userId
    }
}

const authFail = (error) =>{
    return{
        type: actionTypes.AUTH_FAIL,
        error: error
    }
}

const checkAuthTimeout = (expirationDate) =>{
    console.log(expirationDate * 1);
    return dispatch => {
        setTimeout(() => {
            dispatch(onLogout())
        }, expirationDate * 1000)
    }
}


export const onAuth = (email, password, login) => {
    return dispatch => {
        authFail()
        dispatch(authStart(email, password));
        let authData = {
            email: email,
            password: password,
            returnSecureToken: true
        }

        let url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyArFYBuC3PekSrCsy-geqmvKPVntG9mBIE'

        if(login){
            url = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyArFYBuC3PekSrCsy-geqmvKPVntG9mBIE"
        }
        

        axios.post(url, authData)
        .then(response => {
            const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);
            localStorage.setItem('token', response.data.idToken);
            localStorage.setItem('expirationDate', expirationDate);
            localStorage.setItem('userId', response.data.localId);
            dispatch(authSuccess(response.data.idToken, response.data.localId));
            dispatch(checkAuthTimeout(response.data.expiresIn))
            console.log(response)})
            .catch(err => authFail(err))
    }
}

export const onLogout = () => {
    console.log("hi!")
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
    return{
        type: "LOGOUT"
    }
}