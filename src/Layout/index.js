import React, { useState, useEffect } from "react";
import Header from "./Header";
import NotFound from "./NotFound";
import Home from "./Home"
import StudyCards from "./StudyCards"
import CreateDeck from "./CreateDeck"
import DeckView from "./DeckView"
import AddCard from "./AddCard"
import EditDeck from "./EditDeck"
import EditCard from "./EditCard"
import { BrowserRouter as Router, Route, Switch, useParams, useHistory, Redirect } from "react-router-dom"
import ImportCard from "./ImportCard"
import SignIn from './SignIn'
import SignUp from './SignUp'

const PrivateRoute = ({ children }) => {
  const session = JSON.parse(localStorage.getItem('flashcard-app-session'))
  if (!session || !session.apiToken || !session.name) {
    return <Redirect to="/sign_in" />
  }

  return children
}

const GuestRoute = ({ children }) => {
  const session = JSON.parse(localStorage.getItem('flashcard-app-session'))
  if (session) {
    return <Redirect to="/" />
  }

  return children
}


function Layout() {
  const [decks, setDecks] = useState([])
  const [deck, setDeck] = useState([])
  const [cards, setCards] = useState([]); 


  return (
    <div>
      <Header />
      <div className ="container">
      <Switch>
        <Route exact path="/">
          <PrivateRoute>
            <Home decks={decks} setDecks={setDecks}/>
          </PrivateRoute>
        </Route>
        <Route exact path="/decks/new">
          <PrivateRoute>
            <CreateDeck />
          </PrivateRoute>
        </Route>
        <Route exact path="/decks/:deckId/study">
          <PrivateRoute>
            <StudyCards deck={deck} setDeck={setDeck} cards={cards} setCards={setCards}/>
          </PrivateRoute>
        </Route>
        <Route exact path="/decks/:deckId">
          <PrivateRoute>
            <DeckView deck={deck} setDeck={setDeck} />
          </PrivateRoute>
        </Route>
        <Route exact path="/decks/:deckId/edit">
          <PrivateRoute>
            <EditDeck deck={deck} setDeck={setDeck} />
          </PrivateRoute>
        </Route>
        <Route exact path="/decks/:deckId/cards/new">
          <PrivateRoute>
            <AddCard deck={deck} setDeck={setDeck} cards={cards} setCards={setCards}/>
          </PrivateRoute>
        </Route>
        <Route exact path="/decks/:deckId/cards/import">
          <PrivateRoute>
            <ImportCard />
          </PrivateRoute>
        </Route>
        <Route exact path="/decks/:deckId/cards/:cardsId/edit">
          <PrivateRoute>
            <EditCard deck={deck} setDeck={setDeck} cards={cards} setCards={setCards}/>
          </PrivateRoute>
        </Route>
        <Route exact path="/sign_in">
          <GuestRoute>
            <SignIn />
          </GuestRoute>
        </Route>
        <Route exact path="/sign_up">
          <GuestRoute>
            <SignUp />
          </GuestRoute>
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
      </div>
    </div>
  );
}

export default Layout;
