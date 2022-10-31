import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom"
import { readDeck, deleteCard } from "../utils/api/index"


function DeckView({deck, setDeck}) {
  const params = useParams()
  const { deckId } = params
  const history = useHistory()
  const [cards, setCards] = useState([])

  useEffect(() => {
    const abortController = new window.AbortController();
    const signal = abortController.signal;
    async function getDeck() {
      try {
        const response = await readDeck(deckId, signal)
        setDeck(response)
        setCards(response.cards)
      } catch (error) {
        if(error.name !== "AbortError") {
          throw error;
        }
      }
    }
    getDeck()
  
  }, [deckId])

  async function deleteCardHandler(cardId, index) {
    try {
      if(
        window.confirm(
          "Delete this deck?\n\nYou will not be able to recover it."
        )
      ) {
        await deleteCard(cardId);
        cards.splice(index, 1)
        setCards([ ...cards ])
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        throw error;
      }
    }
  }

  const Card = ({ card, index }) => {
    return (
      <div className="card flex-grow-1">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <h6 className="card-subtitle flex-grow-1">
              Front
              <span className="ml-2 text-muted">#{index + 1}</span>
            </h6>
            <button onClick={()=> deleteCardHandler(card.id, index)} className="btn">
              <span className="oi oi-trash text-danger" aria-hidden="true"></span>
            </button>
          </div>
          <p className="card-text text-muted">{card.front}</p>
          <hr/>
          <h6 className="card-subtitle my-2">Back</h6>
          <p className="card=text text-muted">{card.back}</p>
        </div>
        <div className="card-footer text-center">
          <Link to={`/decks/${deckId}/cards/${card.id}/edit`}>
              Edit
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <nav aria-label='breadcrumb'>
        <ol className='breadcrumb'>
          <li className='breadcrumb-item'>
            <Link to='/'>
              <i className='fas fa-home'></i> Home
            </Link>
          </li>
          <li className='breadcrumb-item active' aria-current='page'>
            {deck.name ? deck.name : 'Loading...'}
          </li>
        </ol>
      </nav>
      <div className="card my-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start align-items-md-center flex-column flex-md-row">
            <div>
              <h5>{deck.name}</h5>
              <p>{deck.description}</p>
            </div>

            <div>
              <Link to={`/decks/${deck.id}/edit`} className="mr-2">
                  <button className="btn btn-secondary" type="button">Edit</button>
              </Link>
              <Link to={`/decks/${deck.id}/study`} className="mr-2">
                  <button className="btn btn-primary" type="button">Study</button>
              </Link>
            </div>
          </div>
          
        </div>
      </div>
      <div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0">Cards</h3>

          <div>
            <div className="btn-group btn-group-sm">
              <Link to={`/decks/${deck.id}/cards/new`} className="btn btn-primary">
                  Add Cards
              </Link>
              <Link to={`/decks/${deck.id}/cards/import`} className="btn btn-primary">
                  Import Cards
              </Link>
            </div>
          </div>
        </div>
        <div className="row">
          {cards.map((card, index) => (
            <div className="col-12 col-md-4 d-flex align-items-stretch mb-3 mb-md-4" key={index}>
              <Card card={card} index={index} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DeckView