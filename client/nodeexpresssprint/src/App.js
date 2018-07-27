import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor() {
    super();
    this.state = {
      projects: [],
      name: '',
      description: '',
    }
  }

  componentWillMount() {
    this.getData();
  }

  getData = () => {
    axios
      .get('http://localhost:5000/api/projects')
      .then((response) => {
        //console.log('response', response.data.projects);
        this.setState({projects: response.data.projects})
      })
      .catch(err => console.log(err));
  }

  handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/api/projects/${id}`)
      .then((response) => {  
        this.getData()
      })
      .catch(err => console.log(err));
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit = () => {
    axios
      .post(`http://localhost:5000/api/projects`, {
        name: this.state.name,
        description: this.state.description
      })
      .then(response => {
        console.log('submited data', response.data.projects)
        this.getData()
      })
      .catch(err => console.log(err));
  }

  render() {
    console.log('state', this.state.projects)
    return (
      <div className="App">
        <h1>Node Express Sprint</h1>
        <input 
          name="name" 
          type="text" 
          placeholder="name" 
          onChange={(e) => this.handleChange(e)} /><br />
        <textarea 
          name="description"  
          placeholder="description" 
          onChange={(e) => this.handleChange(e)} /><br />
        <button onClick={() => this.handleSubmit()}>Submit</button>

        {this.state.projects.map(project => {
          return ( 
            <div key={project.id}>
              <div>
                Name: {project.name}
              </div>
              <div>
                Description: {project.description}
              </div>
              <div>
                completed: {project.completed}
              </div>
              <button onClick={() => this.handleDelete(project.id)}>Delete</button>
            </div>
          )
        })}
      </div>
    );
  }
}

export default App;

