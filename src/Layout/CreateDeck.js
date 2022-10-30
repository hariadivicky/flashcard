import React, { useState } from "react"
import { Link, Switch } from "react-router-dom"
import Form from "./Form"
import { useHistory } from "react-router-dom"
import { createDeck } from "../utils/api/index"

function CreateDeck() {
    let history = useHistory();
    const initialFormState = {
        name: "",
        description: "",
        cards: null
    }
    const [formData, setFormData] = useState({...initialFormState});
    const handleChange = ({target}) => {
        setFormData({
            ...formData, [target.name]: target.value,
        })
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const multipartForm = new FormData()
        for (let field in formData) {
            multipartForm.set(field, formData[field])
        }

        const response = await createDeck(multipartForm)
        history.push(`/decks/${response.id}`)
    }

    function handleCancel(event) {
        event.preventDefault();
        history.push("/")
    }

    function handleFileChange({ target }) {
        setFormData({
            ...formData, [target.name]: target.files[0],
        })
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
                        Create Deck
                    </li>
                </ol>
            </nav>
            
            <h1 className='my-4 text-center'>Create Deck</h1>
            <Form
                onSubmit={handleSubmit}
                onFormStateChange={handleChange}
                onFormStateFileChange={handleFileChange}
                onCancel={handleCancel}
                formData={formData}
            />
        </div>
    )
}

export default CreateDeck