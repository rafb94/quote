import React, { Component } from 'react';
import classes from './items.css';
import Aux from '../../hoc/Aux';
import axios from 'axios';

let currentClass1 = null;

class item extends Component {

    state={
        items: null,
        cost: null,
        itemClasses: null,
        itemsRF: null,
        itemsRC: null,
        itemsDir: null,
        itemsDisp:null,
        itemsB:null,
        itemsAux: null,
        error: false,
        itemDetail: null,
        currentClass: null,
        currentItem: null,
    }
    
    componentDidMount = () => {
        axios.get('https://cotizador-92b14.firebaseio.com/itemPrices.json').then(response => {
            let itemClasses = Object.keys(response.data)

            this.setState({itemClasses: itemClasses, 
              cost: response.data, 
              items: {
                itemsRF: response.data["Reactivos Frios"],
                itemsRC: response.data["Reactivos Calientes"],
                itemsDir: response.data["Directos"],
                itemsDisp: response.data["Dispersos"],
                itemsB: response.data["Basicos"],
                itemsAux: response.data["Auxiliares"]
              },
              currentItemClass: "",
            }) 
        }).catch(error => {
            this.setState({error: true})
        }
        )
    }

    classUpdateHandler = (event) => {
   
           
        
        let currentClass2 = event.target.value;     
            
        if (this.state.items !== null){ 
    
            
            
            switch (currentClass2) {
                case "Reactivos Calientes":
                    currentClass1= "itemsRC";
                    break;
                case "Reactivos Frios":
                    currentClass1= "itemsRF";
                    break;
                default:
                    currentClass1= "putaaaaa";
               
            }
            
            this.setState({currentClass: currentClass1})
            
            
        }
    }

    itemUpdateHandler = (event) => {

        axios.put('https://cotizador-92b14.firebaseio.com/currentItem.json', {
            currentItem: event.target.value
        })
        
    }
    
    
    render(){

        
        let list = null;
        let itemDetail= null;

       
            
            if (this.state.currentClass !== null){
                
                itemDetail= Object.keys(this.state.items[currentClass1]).map(num =>{  
                    return (<option key={num}> {num}</option>) 
                })
                console.log(itemDetail)
            }
            
        
       
        
        if (this.state.itemClasses !== null){
            list= this.state.itemClasses.map(num =>{  
                return (<option key={num}> {num}</option>) 
            })
        } 

        
        
        return(
            <Aux>
                <div className={this.props.leStyle}>
                    <select  className={classes.select} onChange={this.classUpdateHandler}>{list}</select> 
                </div>

                <div className={this.props.leStyle}>
                    <select  className={classes.select} onChange={this.itemUpdateHandler}>{itemDetail} </select> 
                </div>)
            </Aux> 
           
        )
        
    }
}


export default item;