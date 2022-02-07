import { useState } from 'react'

function SpacecraftForm(props) {
    const { onAdd } = props;
    const { onUpdate } = props;
    const [idSpace, setId] = useState('');
    const [numeSpace, setTitle] = useState('');
    const [viteza, setAbstract] = useState('');
    const [masa, setMasa] = useState('');
    const [createdAt] = useState('');
    const [updatedAt] = useState('');

    const addArticle = () => {
        onAdd({
            idSpace, numeSpace, viteza, masa, createdAt, updatedAt
        })
    }

    const updateArticle = () => {
        onUpdate({
            idSpace, numeSpace, viteza, masa, createdAt, updatedAt
        })
    }

    return (
        <div>
            <br></br>
            <br></br>
            <div>
                <input type='text' placeholder='idSpace' onChange={(event) => setId(event.target.value)}></input>
            </div>
            <div>
                <input type='text' placeholder='numeSpace' onChange={(event) => setTitle(event.target.value)}></input>
            </div>
            <div>
                <input type='text' placeholder='viteza' onChange={(event) => setAbstract(event.target.value)}></input>
            </div>
            <div>
                <input type='text' placeholder='masa' onChange={(event) => setMasa(event.target.value)}></input>
            </div>
            <br></br>
            <button onClick={addArticle}>Add</button>
            <button onClick={updateArticle}>Update</button>
        </div>
    )
}

export default SpacecraftForm