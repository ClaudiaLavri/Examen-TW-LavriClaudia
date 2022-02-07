import { useEffect, useState } from "react";
import Spacecraft from "../componente/Spacecraft.js";
import SpacecraftForm from "./SpacecraftForm.js";

const SERVER = `http://localhost:4000`;

function SpacecraftList() {
    const [spacecrafts, setSpacecraft] = useState([]);

    const getSpacecraft = async () => {
        const response = await fetch(`${SERVER}/spacecraft`, {
            method: 'get',
            headers: {
                Accept: 'application/json'
            },
        });
        const data = await response.json();
        setSpacecraft(data);
    }

    const addSpacecraft = async (spacecraft) => {
        await fetch(`${SERVER}/spacecraft`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(spacecraft)
        })
        getSpacecraft();
    }

    const updateSpacecraft = async (spacecraft) => {
        await fetch(`${SERVER}/spacecraft/${spacecraft.idSpace}`, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(spacecraft)
        })
        getSpacecraft();
    }

    useEffect(() => {
        getSpacecraft()
    }, []);

    return (
        <div>
            <SpacecraftForm onAdd={addSpacecraft} onUpdate={updateSpacecraft} />
            <br></br>
            <br></br>
            {
                spacecrafts.map(item => <Spacecraft key={item.idSpace} item={item} />)
            }
        </div>
    )
}

export default SpacecraftList;
