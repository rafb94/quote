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
        
        this.setState({password: event.target.value})
    }

    submitHandler = (event) => {
        event.preventDefault();
        this.props.onAuth(this.state.email, this.state.password)
    }

    loginSignupHandler = () => {
        let loginToggler = !this.state.login
        this.setState({login: loginToggler})
    }

    render () {

        return(
        <Aux>
            <div className={this.props.leStyle}>
                <span style={{fontSize: "200%", fontWeight: "bold"}}> Log In </span>
            </div>
            <div className={this.props.leStyle}>
                <form onSubmit={this.submitHandler}>
                    <Label> Email: </Label>
                    <Input leType="email" lePlaceholder="ejemplo@abc.com" changed={this.setEmailHandler}/>
                    <Label> Contraseña: </Label>
                    <Input leType="text" lePlaceholder="contraseña" changed={this.setPasswordHandler}/><br/>
                    <Input leType="submit" leValue={this.state.login?"Entrar": "Registrar" } />
                    {this.state.login? <div onClick={this.loginSignupHandler}>Registrarse</div> : <div onClick={this.loginSignupHandler}>Log in</div>}
                </form>
            </div>
        </Aux>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return{
        onAuth: (email, password) => dispatch(actions.onAuth(email, password))
    }
}


export default connect(null, mapDispatchToProps)(auth);