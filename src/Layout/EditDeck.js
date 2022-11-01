import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import { readDeck, updateDeck } from '../utils/api';
import Form from './Form';

// Component for edit deck component
function EditDeck() {
  const mountedRef = useRef(false);
  const initialState = {
    name: '',
    description: ''
  }

  const [editDeckFormData, setEditDeckFormData] = useState(initialState);

  const { deckId } = useParams();
  const history = useHistory();

  // effect for mounted ref changes
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // effect to grab deck information from server
  useEffect(() => {
    const abortController = new window.AbortController();
    async function loadDeck() {
      try {
        const loadedDeck = await readDeck(deckId, abortController.signal);
        if (mountedRef.current) {
          delete loadDeck.cards
          setEditDeckFormData(() => loadedDeck);
        }
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

  // Handlers
  const handleChange = ({ target }) => {
    setEditDeckFormData((currentState) => ({
      ...currentState,
      [target.name]: target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await updateDeck(editDeckFormData);
    history.push(`/decks/${response.id}`);
  };

  const handleCancel = (event) => {
    event.preventDefault()
    history.push(`/decks/${deckId}`)
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
              {editDeckFormData.name ? editDeckFormData.name : 'Loading...'}
            </Link>
          </li>
          <li className='breadcrumb-item active' aria-current='page'>
            Edit
          </li>
        </ol>
      </nav>
      <h1 className='my-4 text-center'>Edit Deck</h1>
      <Form
          onSubmit={handleSubmit}
          onFormStateChange={handleChange}
          onCancel={handleCancel}
          formData={editDeckFormData}
          editMode={true}
        />
    </div>
  );
}

export default EditDeck;