import React from 'react'

function Form(props) {
    const {
        onSubmit,
        onFormStateChange,
        onFormStateFileChange,
        onCancel,
        formData,
        editMode
    } = props

    return (
        <form onSubmit={onSubmit}>
            <div className= "form-group">
                <label className="form-label" htmlFor="name">Name</label>
                <input
                    type="text"
                    className="form-control"
                    id="name"
                    placeholder="Deck Name"
                    required
                    name="name"
                    onChange={onFormStateChange}
                    value={formData.name}
                />
            </div>
            <div className="form-group">
                <label className="form-label" htmlFor="description">Description</label>
                <textarea
                    type="text"
                    className="form-control input-lg"
                    id="description"
                    placeholder="Brief description of the deck"
                    required
                    name="description"
                    onChange={onFormStateChange}
                    value={formData.description}
                />
            </div>

            {!editMode && (
                <div className="form-group">
                    <label className="form-label" htmlFor="description">Cards data (optional)</label>
                    <input
                        type="file"
                        className="form-control input-lg"
                        id="cards"
                        name="cards"
                        onChange={onFormStateFileChange}
                    />
                </div>
            )}

            <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    )
}

export default Form;