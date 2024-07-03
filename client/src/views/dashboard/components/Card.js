import "../styles/Card.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import { Draggable } from "react-beautiful-dnd";

import CardEditor from "./CardEditor";
import axios from "axios";

class Card extends Component {
  state = {
    hover: false,
    editing: false
  };

  startHover = () => this.setState({ hover: true });
  endHover = () => this.setState({ hover: false });

  startEditing = () =>
    this.setState({
      hover: false,
      editing: true,
      text: this.props.card.text
    });

  endEditing = () => this.setState({ hover: false, editing: false });

  editCard = async text => {
    const { card, dispatch } = this.props;

    const editdata = { cardId: card._id, cardText: text}

    this.endEditing();
    try {
      const response = await axios.put('http://localhost:5000/api/board/updatelist', editdata, {
        headers: {
          'Content-Type': 'application/json'
        }
      }
      );
      console.log("response", response);
      
    } catch (error) {
      console.log(error);
    }    
    
            dispatch({
              type: "CHANGE_CARD_TEXT",
              payload: { cardId: card._id, cardText: text }
            });

  
  };

  deleteCard = async () => {
    const { listId, card, dispatch } = this.props;
   const data = {
      cardId: card._id, listId 
    }

    try {
      const response = await axios.delete(`http://localhost:5000/api/board/deletelist/:id`, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      }
      );
      console.log("response", response);
      if (window.confirm("Are you sure to delete this card?")) {
        dispatch({
          type: "DELETE_CARD",
          payload: {cardId: card._id, listId }
        });
      }
    } catch (error) {
      console.log(error);
    }    
  };

  render() {
    const { card, index } = this.props;
    const { hover, editing } = this.state;

    if (!editing) {
      return (
        <Draggable draggableId={card._id} index={index}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className="Card"
              onMouseEnter={this.startHover}
              onMouseLeave={this.endHover}
            >
              {hover && (
                <div className="Card-Icons">
                  <div className="Card-Icon" onClick={this.startEditing}>
                    <ion-icon name="create" />
                  </div>
                </div>
              )}

              {card.text}
            </div>
          )}
        </Draggable>
      );
    } else {
      return (
        <CardEditor
          text={card.text}
          onSave={this.editCard}
          onDelete={this.deleteCard}
          onCancel={this.endEditing}
        />
      );
    }
  }
}

const mapStateToProps = (state, ownProps) => ({
  card: state.cardsById[ownProps.cardId]
});

export default connect(mapStateToProps)(Card);
