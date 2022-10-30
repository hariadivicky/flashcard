import React, { useState, useEffect } from 'react'
import { useHistory, useParams, Link } from 'react-router-dom'
import { importCardsToDeck, readDeck } from '../utils/api'

function ImportCard() {
    const history = useHistory()
    const params = useParams()
    const { deckId } = params

    const initialState = {
        name: '',
        description: ''
    }

    const [deck, setDeck] = useState(initialState)
    const [cardFile, setCardFile] = useState(null)

    // effect to grab deck information from server
    useEffect(() => {
        const abortController = new window.AbortController();
        async function loadDeck() {
            try {
                const loadedDeck = await readDeck(deckId, abortController.signal);
                setDeck(loadedDeck)
            } catch (error) {
                if (error.name !== 'AbortError') {
                    throw error;
                }
            }
        }

        loadDeck();
        return () => {
            abortController.abort();
        };
    }, [deckId]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData()
        formData.set('cards', cardFile)

        const abortController = new window.AbortController()
        const response = await importCardsToDeck(deck, formData, abortController.signal);
        history.push(`/decks/${response.id}`);
    };
    
    const handleCancel = (event) => {
        event.preventDefault()
        history.push(`/decks/${deckId}`)
    }

    const onFormStateFileChange = ({ target }) => {
        setCardFile(target.files[0])
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
                    <li className='breadcrumb-item'>
                        <Link to={`/decks/${deckId}`}>
                        {deck.name ? deck.name : 'Loading...'}
                        </Link>
                    </li>
                    <li className='breadcrumb-item active' aria-current='page'>
                        Import Cards
                    </li>
                </ol>
            </nav>
            <h1 className='my-4 text-center'>Import Cards</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label" htmlFor="description">Cards data</label>
                    <input
                        type="file"
                        className="form-control input-lg"
                        id="cards"
                        name="cards"
                        onChange={onFormStateFileChange}
                    />
                </div>

                <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
                <button type="submit" className="btn btn-primary">Import</button>
            </form>
        </div>
    )
}

export default ImportCard