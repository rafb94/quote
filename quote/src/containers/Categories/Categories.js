import React, {Component} from 'react';
import Aux from '../../hoc/Auxiliar';
import Input from '../../UI/Input/Input';
import Button from '../../UI/Button/Button';
import fire from '../../fire';
import {connect} from 'react-redux';
import Warning from '../../UI/Warning/Warning';
import ButtonSuccess from '../../UI/ButtonSuccess/ButtonSuccess';
import * as actions from '../../store/actions/index';
import Spinner from '../../UI/Spinner/Spinner';

class categories extends Component {

    state = {
        categories : null,
        showConfirm: false,
        newCategory: null,
        showWarning: null,
        showSuccessDelete: false,
        showSuccessAdd: false,
        showUpdateButton: true
    }

    componentDidMount() {

       this.retrieveCategories();
       
    }

    retrieveCategories = () => {
       function retrieveCategories(response) {
            return(Object.keys(response))
       }

       fire.database().ref('/itemPrices').once('value')
       .then(snapshot => this.setState({categories: retrieveCategories(snapshot.val())}))

    }

    addCategoryHandler = (event) => {
        event.preventDefault();
        fire.database().ref('itemPrices/').child(this.state.newCategory).child("userId").set(this.props.userId);
        
        let newCategory = this.state.newCategory.slice();
        this.state.categories.push(newCategory);
        console.log(this.state.categories)

        this.setState({showSuccessAdd: true})
        setTimeout(()=> {this.setState({showSuccessAdd: false})}, 1500)
    }

    deleteCategoryHandler = (cat) =>{

        fire.database().ref('itemPrices/').child(cat)
        .set(null); 

        this.setState({showSuccessDelete: true})
        setTimeout(()=> {this.setState({showSuccessDelete: false})}, 2000)
        
        let catIndex = this.state.categories.indexOf(cat)
        this.state.categories.splice(catIndex, 1)
        console.log(
            this.state.categories 
        )
        
    }

    showWarningDeleteHandler = (cat) => {
        this.setState({showWarning: cat})
    }

    showConfirmHandler = (event) => {
        event.preventDefault();
        this.setState({showConfirm: true})
    }

    setCategoryHandler = (event) => {
        this.setState({newCategory: event.target.value})
    }

    toggleUpdateHandler = () => {
        this.retrieveCategories();
        console.log(this.state.showUpdateButton)
        let showUpdateButton = !this.state.showUpdateButton;
        this.setState({showUpdateButton: showUpdateButton})
    }

    render() {
        /* Retrieve current item categories */
        /* let categories = (
            <Warning leDisp="yes"> 
            Por favor regístrate o ingresa tus datos en "Log In".
        </Warning>); */
       
       let categories = this.props.token ? <Spinner />: <Warning leDisp="yes"> Ingresar credenciales, por favor.</Warning>;
        if(this.state.categories && this.props.token){
            categories = this.state.categories.map(cat => <li onClick={() => 
            this.showWarningDeleteHandler(cat)} key={cat} style={{display: "block"}}> {cat} 
            {this.state.showWarning == cat? 
            <Button 
            clicked={() => this.deleteCategoryHandler(cat)}> Borrar permanentemente la categoría? Cuidado: Todos los items 
            de la categoría serán borrados.
                </Button> : null }</li>);
        }
        
        


        /* Show warning if user is not logged in */
        let category = (
        <Warning leDisp="yes"> 
        Por favor regístrate o ingresa tus datos en "Log In".
    </Warning>)

        if(this.props.token){
            category = ( 
                <Aux>
                    <h2>Añadir categoría: </h2>
                    <form onSubmit={this.addCategoryHandler}>
                        <Input leType="text" changed={this.setCategoryHandler}/>
                        <Button clicked={this.showConfirmHandler}> Añadir categoría </Button>
                        {this.state.showConfirm? <Input leType="submit" leValue=" Segur@?" /> : null}
                    </form>
                    <ButtonSuccess leClass={this.state.showSuccessAdd} > Categoría añadida! </ButtonSuccess>
                    <ButtonSuccess leClass={this.state.showSuccessDelete} > Categoría borrada! </ButtonSuccess>
                </Aux>
            )
        }
        
           
        

        return (
            
            <Aux>
                <div className={this.props.leStyle}> <h1>Categorías actuales: </h1>
                        {categories} 
                </div>

                <div className={this.props.leStyle}> 
                    {category}
                </div> 
                
            </Aux>
        )
        
    }
}

const mapStateToProps = state => {
    return{
        userId: state.userId,
        token: state.token
    }
}

const mapDispatchToProps = dispatch => {
    return{
        onTryAutoSignUp: () => dispatch(actions.authCheckState())
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(categories);