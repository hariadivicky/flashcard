import React, { useEffect } from "react";
import { Link, useParams, } from "react-router-dom";
import { readDeck } from "../utils/api/index";
import Study from "./Study";

function StudyCards({ deck, setDeck, cards, setCards}) {
  const {deckId} = useParams();

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

  return (
    <div>
      <nav aria-label='breadcrumb'>
        <ol className='breadcrumb'>
          <li className='breadcrumb-item'>
            <Link to='/'>
              <i className='fas fa-home'></i> Home
            </Link>
          </li>
          <li className='breadcrumb-item'>
            <Link to={`/decks/${deckId}`}>
              {deck.name ? deck.name : 'Loading...'}
            </Link>
          </li>
          <li className='breadcrumb-item active' aria-current='page'>
            Study
          </li>
        </ol>
      </nav>
      <div className="my-4 text-center">
        <h1>Study: {deck.name ? deck.name : 'Loading...'}</h1>
        <p>{deck.description}</p>
      </div>
      <div>
        <Study cards={cards} deck={deck}/>
      </div>
    </div>
  )
}

export default StudyCards;