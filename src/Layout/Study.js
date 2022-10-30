import React, { useRef } from "react"
import Slider from 'react-slick'
import Card from "./Card"
import { Link } from 'react-router-dom'

function Study({cards, deck}) {
  const settings = {
    infinite: false,
    speed: 500,
    draggable: false
  }

  const sliderRef = useRef()

  const nextCard = () => {
      sliderRef.current.slickNext()
  }

  const prevCard = () => {
      sliderRef.current.slickPrev()
  }

  if (cards < 3) {
    return (
      <div className="text-center">
        <h3>Not Enough Cards.</h3>
        <p>You need at least 3 cards to study. There are {cards.length} in this deck.</p>
        <Link to={`/decks/${deck.id}/cards/new`}>
          Add Card
        </Link>
        <span className="mx-3">or</span> 
        <Link to={`/decks/${deck.id}/cards/import`}>
          Import Card
        </Link>
      </div>
    )
  }

  return (
      <div className="row">
        <div className="col-12 col-md-5 mx-auto">
          <Slider {...settings} ref={sliderRef}>
            {cards.map((card, index) => (
              <div key={index} className="px-2">
                <Card
                  front={card.front}
                  back={card.back}
                  onPrev={prevCard}
                  onNext={nextCard}
                  position={index + 1}
                  total={cards.length}
                />
              </div>
            ))}
          </Slider>
        </div>
      </div>
  )
}

export default Study