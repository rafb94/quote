import React, { Component } from 'react';
import Item from '../../components/items/item';
import Aux from '../../hoc/Auxiliar';
import classes from './NewItems.css';

class newItem extends Component {


    render(){

        let item = null;

        if (this.props.itemList !== null) {
            console.log(this.props.itemList)
            item =  <Item leStyle={classes.Element} list={this.props.itemClasses} dispProductList="Nope"/>
        }

        return(
        <Aux>
           {item}
        </Aux>
        )
    }
}

export default newItem;