const SERVER = `http://localhost:4000`;

function Spacecraft(props) {
    const { item } = props;

    const deleteSpacecraft = async () => {
        const response = await fetch(`${SERVER}/spacecraft/${item.idSpace}`, {
            method: 'DELETE'
        });
        return response.json();
    }

    return (
        <div>
            <div>{item.idSpace}</div>
            <div>{item.numeSpace}</div>
            <div>{item.viteza}</div>
            <div>{item.masa}</div>
            
            <button onClick={() => {
                deleteSpacecraft();
            }}>Delete spacecraft</button>
            <br></br>
        </div>
    )
}

export default Spacecraft;