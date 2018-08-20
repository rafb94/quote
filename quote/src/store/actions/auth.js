import axios from 'axios';


export const authStart = (email, password) => {
    return{
        type: 'AUTH_START',
        email: email,
        password: password
    }
}

export const authSuccess = (token, userId) => {
    return{
        type: 'AUTH_SUCCESS',
        token: token,
        userId: userId
    }
}

export const authFail = (error) =>{
    return{
        type: 'AUTH_FAIL',
        error: error
    }
}


export const onAuth = (email, password) => {
    return dispatch => {
        dispatch(authStart(email, password));
        let authData = {
            email: email,
            password: password,
            returnSecureToken: true
        }
        let url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyArFYBuC3PekSrCsy-geqmvKPVntG9mBIE'

        axios.post(url, authData)
        .then(response => {
            const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);
            localStorage.setItem('token', response.data.idToken);
            localStorage.setItem('expirationDate', expirationDate);
            localStorage.setItem('userId', response.data.localId);
            dispatch(authSuccess(response.data.idToken, response.data.localId));
            console.log(response)})
            .catch(err => authFail(err))
    }
}

export const onLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
    return{
        type: "LOGOUT"
    }
}