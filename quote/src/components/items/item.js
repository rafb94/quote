import React, { Component } from 'react';
import axios from 'axios';
import {connect} from 'react-redux'; 
import Select from '../../UI/Select/Select';
import Button from '../../UI/Button/Button';



class item extends Component {

    state={
        newItem: "",
        items: null,
        itemClasses: null,
        error: false,
        itemDetail: null,
        currentClass: null,
        currentItem: null,
        }
    
    componentDidMount = () => {
            this.retrieveCategoriesHandler()
       
    }

    retrieveCategoriesHandler = () => {
        axios.get('https://cotizador-92b14.firebaseio.com/Categorias.json' + this.props.queryParams).then(response => {
            console.log(response.data)
            let itemClasses = Object.keys(response.data)
            this.setState({itemClasses: itemClasses, 
              currentItemClass: "",
            }) 
        }).catch(error => {
            this.setState({error: true})
        }
        )
    }

    showItemsOfClassHandler = (myClass) => {

            let queryParams = '?auth=' + this.props.token + '&orderBy="category"&equalTo="' + myClass + '"'

            axios.get('https://cotizador-92b14.firebaseio.com/Productos.json' + queryParams).then(
                response=> {
                console.log(Object.keys(response.data))
                this.setState({items: Object.keys(response.data)})
            })
            .catch(error => console.log(error))
            
            /* axios.get('https://cotizador-92b14.firebaseio.com/Productos.json' + this.props.queryParams)
            .then(response => console.log(response.data)).catch(error => {
                console.log(error)
                this.setState({error: true})
            }
            )   */
    }
    
        
    classUpdateHandler = (event) => {
        console.log("hi!")
        this.setState({currentClass: event.target.value})
        this.props.onUpdateClass(event)
        this.showItemsOfClassHandler(event.target.value);
    }

    

    
    
    render(){

        
        let list = null;
        let itemDetail= null;            
        
       
        /* Return a list with item classes, option tags */
        if (this.state.itemClasses !== null){
            
            let listClasses = this.state.itemClasses.map(itemClass =><option key={itemClass}> {itemClass}</option>)

            console.log(listClasses)

            list=  (
            <Select clicked={this.props.clicked} changed={this.classUpdateHandler} default="default">
                <option key="default" value="default" disabled> Tipo de Producto</option>
                {listClasses}
            </Select> 
            )
        } else{
            list= <Button clicked={this.retrieveCategoriesHandler}> Actualizar categorías</Button> 
        } 

         /* Return a list with items of the current class, option tags */
         let items = null;

         if (this.state.currentClass !== null && this.state.items){
            console.log(this.state.items)
            itemDetail= this.state.items.map(num =>{  
                return (<option key={num}> {num}</option>) 
            })
           
        }

        
        
        return(
            <div className={this.props.leStyle}>

            {/* Select Tag for item classes */}

                <div >
                   {list}
                </div>
                <br/>

            {/* Select Tag for items: */}

                <div style={this.props.dispProductList ? {display: 'none'} : null}>
                   { <Select clicked={this.props.clicked} changed={this.props.onUpdateItem} default="default">
                        <option key="default" value="default" disabled>  Producto</option>
                        {itemDetail} 
                    </Select> }
                </div>
                <br/>

            </div>

           
           
        )
        
    }
}

const mapStateToProps = state =>{
    return{
        currentItem: state,
        currentClass: state,
        token: state.token,
        userId: state.userId,
        queryParams: state.queryParams
    }
}

const mapDispatchToProps = dispatch => {
    return{
        onUpdateItem: (event) => dispatch({type: "UPDATE_ITEM", valueItem: event.target.value}),
        onUpdateClass: (event) => dispatch({type: "UPDATE_CLASS", valueClass: event.target.value})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(item);