const express = require('express');
const cors = require('cors');
const actions = require('./data/helpers/actionModel');
const projects = require('./data/helpers/projectModel');
const port = 5000;
const server = express();
//const router = express.Router();

server.use(express.json());
server.use(cors({ origin: 'http://localhost:3000'}));

const sendUserError = (status, message, res) => {
  res.status(status).json({ error: message });
  return;
}

// ! ====================== Projects
server.get('/api/projects', (req, res) => {
  projects
    .get()
    .then(projects => {
      if (projects.length === 0) {
        sendUserError(404, "projects could not be found", res);
      } 
      res.status(200).json({ projects });
    })
    .catch(err => {
      sendUserError(500, "There was an error in getting projects", res)
      return;
    });
})

server.post('/api/projects', (req, res) => {
  //console.log(req.body);
  const { name, description, completed } = req.body;
  if ( !name || !description ) return sendUserError(400, "name and description are required", res);
  projects
    .insert({ name, description, completed })
    .then((result) => res.status(200).json({ result }))
    .catch(() => sendUserError(500, "Project could not be added", res));
})

server.get('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  projects
    .get(id)
    .then(project => {
      //console.log(project)
      if (!project) return sendUserError(404, "project could not be found", res);
      res.status(200).json({ project })
    })
    .catch(() => sendUserError(500, "The project can not be retrieved"));
})

server.delete('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  projects
    .remove(id)
    .then(() => res.json({success: "project was deleted"}))
    .catch(() => sendUserError(500, "There was an error while deleting the project", res));
})










server.listen(port, () => console.log('API running on port 5000'))