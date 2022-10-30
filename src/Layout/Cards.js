import React, {useState, useEffect} from "react";
import { Link, useHistory } from "react-router-dom";
import { deleteDeck, listDecks } from "../utils/api/index";


function Cards({decks, setDecks}) {
  const [numOfDecks, setNumOfDecks] = useState(0);
  const abortController = new window.AbortController();
  const signal = abortController.signal;
  const history = useHistory();

  useEffect(() => {
      loadDecks();
  
      return() => {
        abortController.abort();
      };
    }, [numOfDecks]);

  async function loadDecks() {
    try {
      const response = await listDecks(signal);
      setDecks(response);
    } catch (error) {
      if (error.name !== "AbortError") {
        throw error;
      }
    }
  }

  async function deleteThisDeck(id) {
    try {
      if(
        window.confirm(
          "Delete this deck?\n\nYou will not be able to recover it."
        )
      ) {
        await deleteDeck(id, signal);
        updateDeckCount(-1);
        history.push("/")
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        throw error;
      }
    }
  }

  function updateDeckCount(number) {
    setNumOfDecks(() => numOfDecks + number)
  }
  
  const Deck = ({ deck }) => (
    <div className="card flex-grow-1">
      <div className="card-body">
        <h5 className="card-title d-flex justify-content-between align-items-center">
          <div>{deck.name}</div>
          <div>
            <button onClick={()=> deleteThisDeck(deck.id)} className="btn">
              <span className="oi oi-trash text-danger" aria-hidden="true"></span>
            </button>
          </div>
        </h5>
        <p className="card-subtitle text-muted">{deck.description}</p>
        <p className="card-text">{deck.cards.length} Cards</p>
      </div>
      <div className="card-footer">
        <div className="d-flex flex-row align-items-center">
          <div className="flex-grow-1 text-center">
            <Link to={`/decks/${deck.id}/study`}>
              Study
            </Link>
          </div>
          <div className="flex-grow-1 text-center">
            <Link to={`/decks/${deck.id}`}>
              View
            </Link>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="row">
      {decks.map((deck, index) => (
        <div className="col-12 col-md-4 d-flex align-items-stretch mb-2 mb-md-4" key={index}>
          <Deck deck={deck} />
        </div>
      ))}
    </div>
  )
}

export default Cards;