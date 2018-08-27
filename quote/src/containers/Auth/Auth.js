import React, {Component} from 'react';
import classes from './Auth.css';
import Aux from '../../hoc/Auxiliar';
import Label from '../../UI/Label/Label';
import Input from '../../UI/Input/Input';
import {connect} from 'react-redux';
import * as actions from '../../store/actions/index';

class auth extends Component {

    state={
        email: null,
        password: null,
        login: true
    }

    setEmailHandler = (event) => {
        
        this.setState({email: event.target.value})
    }

    setPasswordHandler = (event) => {
        console.log(this.props.token)
        this.setState({password: event.target.value})
    }

    submitHandler = (event) => {
        event.preventDefault();
        this.props.onAuth(this.state.email, this.state.password, this.state.login)
    }

    loginSignupHandler = () => {
        let loginToggler = !this.state.login
        this.setState({login: loginToggler})
    }

    render () {

        
        return( 
        <Aux>
            <div className={this.props.leStyle}>
                <span style={{fontSize: "200%", fontWeight: "bold"}}> {this.state.login? "Log In" : "Registrarse" } </span>
                {this.state.login? <div style={{color: "green"}} onClick={this.loginSignupHandler}>Registrarse?</div> : <div style={{color: "green"}} onClick={this.loginSignupHandler}>Log in?</div>}
            </div>
            <div className={this.props.leStyle}>
                <form onSubmit={this.submitHandler}>
                    <Label> Email: </Label>
                    <Input leType="email" lePlaceholder="ejemplo@abc.com" changed={this.setEmailHandler}/>
                    <Label> Contraseña: </Label>
                    <Input leType="password" lePlaceholder="contraseña" changed={this.setPasswordHandler}/><br/>
                    <Input leType="submit" leValue={this.state.login?"Log in": "Registrarse" } />
                    {this.props.error? <div> {this.props.error} </div> : null}
                </form>
            </div>
        </Aux>
        )
    }
}

const mapStateToProps = state =>{
    return{
        token: state.token,
        error: state.error
    }
}

const mapDispatchToProps = dispatch => {
    return{
        onAuth: (email, password, login) => dispatch(actions.onAuth(email, password, login))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(auth);