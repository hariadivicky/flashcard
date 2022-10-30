import React, { useState } from "react"
import ReactCardFlip from 'react-card-flip'

function Card(props) {
  const {
    front,
    back,
    onNext,
    onPrev,
    position,
    total
  } = props

  const [isFlipped, setFlipped] = useState(false)

  return (
    <div>
      <ReactCardFlip isFlipped={isFlipped}>
        <div className="card flex-grow-1">
          <div className="card-header text-right">
            <p className="text-muted">Card {position}/{total}</p>
          </div>
          <div className="card-body d-flex align-items-center justify-content-center" style={{minHeight: '165px'}}>
            <h5 className="card-title text-center">{front}</h5>
          </div>
          <div className="card-footer text-center">
            <div className="d-flex justify-content-between align-items-center">
              <div className="flex-grow-1 text-center">
                <button className="btn btn-outline-secondary btn-block" disabled={position === 1} onClick={onPrev}>Prev</button>
              </div>
              <div className="flex-grow-1 text-center mx-2">
                <button className="btn btn-primary btn-block" onClick={() => setFlipped(!isFlipped)}>Flip</button>
              </div>
              <div className="flex-grow-1 text-center">
                <button className="btn btn-outline-secondary btn-block" disabled={position === total} onClick={onNext}>Next</button>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-light flex-grow-1">
          <div className="card-header text-right">
            <p className="text-muted">Card {position}/{total}</p>
          </div>
          <div className="card-body d-flex align-items-center justify-content-center flex-column" style={{minHeight: '165px'}}>
            <p className="card-subtitle">{back}</p>
          </div>
          <div className="card-footer text-center">
            <div className="d-flex justify-content-between align-items-center">
              <div className="flex-grow-1 text-center">
                &nbsp;
              </div>
              <div className="flex-grow-1 text-center mx-2">
                <button className="btn btn-primary btn-block" onClick={() => setFlipped(!isFlipped)}>Back</button>
              </div>
              <div className="flex-grow-1 text-center">
                &nbsp;
              </div>
            </div>
          </div>
        </div>
      </ReactCardFlip>
    </div>
  )
}

export default Card