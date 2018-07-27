import React, { Component } from 'react';
import Item from '../../components/items/item';
import Aux from '../../hoc/Auxiliar';

class newItem extends Component {


    render(){

        let item = null;

        if (this.props.itemList !== null) {
            console.log(this.props.itemList)
            item =  <Item list={this.props.itemClasses}/>
        }

        return(
        <Aux>
           {item}
        </Aux>
        )
    }
}

export default newItem;