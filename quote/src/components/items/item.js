import React, { Component } from 'react';
import axios from 'axios';
import {connect} from 'react-redux'; 
import Select from '../../UI/Select/Select';



class item extends Component {

    state={
        newItem: "",
        items: null,
        cost: null,
        itemClasses: null,
        error: false,
        itemDetail: null,
        currentClass: null,
        currentItem: null,
        }
    
    componentDidMount = () => {
        axios.get('https://cotizador-92b14.firebaseio.com/itemPrices.json').then(response => {
            console.log(response.data)
            let itemClasses = Object.keys(response.data)
            this.setState({itemClasses: itemClasses, 
              cost: response.data,
              items: response.data, 
              currentItemClass: "",
            }) 
        }).catch(error => {
            this.setState({error: true})
        }
        )
    }

    showItemsOfClassHandler = () => {
        if (this.state.currentClass){
            axios.get('https://cotizador-92b14.firebaseio.com/itemPrices.json').then(response => {
                let currentClass = this.state.currentClass.slice();
                console.log(response.data[currentClass])
                
            }).catch(error => {
                this.setState({error: true})
            }
            )  
        }
    }
        
    classUpdateHandler = (event) => {
     
        this.setState({currentClass: event.target.value})
        this.props.onUpdateClass(event)
        this.showItemsOfClassHandler();
    }

    

    
    
    render(){

        
        let list = null;
        let itemDetail= null;            
        
       
        /* Return a list with item classes, option tags */
        if (this.state.itemClasses !== null){
            list= this.state.itemClasses.map(itemClass =>{  
                return (
                <option key={itemClass}> {itemClass}</option>
            ) 
            })
        } 

         /* Return a list with items of the current class, option tags */  
         if (this.state.currentClass !== null){

            let currentClass = this.state.currentClass.slice();
            let items = null;

            items = Object.keys(this.state.items[currentClass])
        

            console.log(items)
            
            itemDetail= items.map(num =>{  
                return (<option key={num}> {num}</option>) 
            })
           
        }

        
        
        return(
            <div className={this.props.leStyle}>

            {/* Select Tag for item classes */}

                <div >
                    <Select clicked={this.props.clicked} changed={this.classUpdateHandler} default="default">
                        <option key="default" value="default" disabled> Tipo de Producto</option>
                        {list}
                    </Select> 
                </div>
                <br/>

            {/* Select Tag for items: */}

                <div style={this.props.dispProductList ? {display: 'none'} : null}>
                    <Select clicked={this.props.clicked} changed={this.props.onUpdateItem} default="default">
                        <option key="default" value="default" disabled>  Producto</option>
                        {itemDetail} 
                    </Select> 
                </div>
                <br/>

            </div>

           
           
        )
        
    }
}

const mapStateToProps = state =>{
    return{
        currentItem: state,
        currentClass: state
    }
}

const mapDispatchToProps = dispatch => {
    return{
        onUpdateItem: (event) => dispatch({type: "UPDATE_ITEM", valueItem: event.target.value}),
        onUpdateClass: (event) => dispatch({type: "UPDATE_CLASS", valueClass: event.target.value})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(item);