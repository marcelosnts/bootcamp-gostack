import React, {useState, useEffect} from 'react';
import api from './services/api';

import './App.css';
// import backgroundImage from './assets/background.jpeg';

import Header from './components/Header';

function App (){
    // const [projects, setProjects] = useState(['Desenvolvimento de app', 'Front-end web']);
    const [projects, setProjects] = useState([]);

    // /*
    //     useState retorna um array com duas posições, sendo:
    //     [seu valor, função para alterar o valor]
    //     [getValue, setValue]
    // */
    
    async function handleAddProject(){
        //projects.push(`Novo projeto ${Date.now()}`);
        //...projects = Javascript Spread Operator, percorre o array anterior e copia/adiciona todos seus valores
        // setProjects([...projects, `Novo projeto ${Date.now()}`]);
        const response = await api.post('projects', {
            title : `Novo ${Date.now()}`,
            owner : "Marcelo"
        });
        
        const project = response.data; 
        setProjects([...projects, project]);
    }

    useEffect(() => {
        api.get('projects').then(response => {
            setProjects(response.data);
        });
    }, []);
    // O array de dependencias do useEffect informa quando esta função deve ser disparada, caso ocorra uma alteração na dependencia 
    // a função realiza os comandos informados
    return(
        <>
            <Header title="Projects"/>

            {/* <img width={300} src={backgroundImage}></img> */}

            <ul>
                {projects.map(project => <li key={project.id}>{project.title}</li>)}
            </ul>

            <button type="button" onClick={handleAddProject}>Adicionar projeto</button>
        </>
    );
}

export default App;