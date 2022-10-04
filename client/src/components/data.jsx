import axios from 'axios';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import NetworkGraph from './networkGraph';
    

function Graph({id, owner}) {
    console.log('xxx',id)
    const [data,setData] = useState([])

    useEffect(()=> {
        axios.get('https://women-connect-app.herokuapp.com/graph/' + id + '/' + owner)
        .then((response) => {
            console.log(id,owner)
            console.log(response)
            setData(response.data)
        })
    }, [id])

    return (
        <div className="App">
            <header>
            <NetworkGraph data={data} id={id} owner={owner} />
            </header>
        </div>
        );
}

export default Graph;