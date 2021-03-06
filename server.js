const express = require('express');
const cors = require('cors');
const actions = require('./data/helpers/actionModel');
const projects = require('./data/helpers/projectModel');
const port = 5000;
const server = express();
//const router = express.Router();

server.use(express.json());
server.use(cors({ origin: 'http://localhost:3000' }));

const sendUserError = (status, message, res) => {
  res.status(status).json({ error: message });
  return;
}

// ============= Custom middleware ====================== //

const checkDescriptionSize = (req, res, next) => {
  const { description } = req.body;
  if (description.length > 128) {
    sendUserError(400, "Description limit is 128 characters", res);
  } else {
    next();
  }
}

const checkNameSize = (req, res, next) => {
  const { name } = req.body;
  if (name.length > 128) {
    sendUserError(400, "Name limit is 128 characters", res);
  } else {
    next();
  }
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

server.post('/api/projects', checkNameSize, checkDescriptionSize, (req, res) => {
  //console.log(req.body);
  const { name, description, completed } = req.body;
  if ( !name || !description ) return sendUserError(400, "name and description are required", res);
  projects
    .insert({ name, description, completed })
    .then((result) => res.status(201).json({ result }))
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

server.put('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, completed } = req.body;
  projects
    .get(id)
    .then(project => {
      if (!project) {
        return sendUserError(404, "The specified Project could not be found", res);
      } else {
        if (!name || !description ) {
          return sendUserError(400, "Name and Description are required", res);
        }
        projects
          .update(id, { name, description, completed })
          .then(updated => res.status(200).json(updated))
          .catch(err => sendUserError(500, "There was an error in updating project", res));  
      }
    });
})

// ! ========================= Actions

server.get('/api/actions', (req, res) => {
  actions
    .get()
    .then(actions => {
      if (actions.length === 0) return sendUserError(404, "actions could not be found", res);
      return res.status(200).json({ actions });
    })
    .catch(err => sendUserError(500, "There was an error in getting actions", res));
})

server.post('/api/actions', checkDescriptionSize, (req, res) => {
  const { project_id, description, notes, completed } = req.body;
  if ( !description || !project_id ) return sendUserError(400, "Project id and description are required", res);
  actions
    .insert({ project_id, description, notes, completed })
    .then((newAction) => res.status(201).json({ newAction }))
    .catch(() => sendUserError(500, "Action could not be added", res));
})

server.get('/api/actions/:id', (req, res) => {
  const { id } = req.params;
  actions
    .get(id)
    .then(action => {
      console.log(action)
      if (action === 0) return sendUserError(404, "action could not be found", res);
      return res.status(200).json({ action })
    })
    .catch(() => sendUserError(500, "The action can not be retrieved"));
})

server.delete('/api/actions/:id', (req, res) => {
  const { id } = req.params;
  actions
    .remove(id)
    .then(() => res.json({success: `action with id: ${id} was deleted`}))
    .catch(() => sendUserError(500, "There was an error while deleting the action", res));
})

server.put('/api/actions/:id', (req, res) => {
  const { id } = req.params;
  const { project_id, description, notes, completed } = req.body;
  actions
    .get(id)
    .then(action => {
      if (!action) {
        return sendUserError(404, "The specified Project could not be found", res);
      } else {
        if (!project_id || !description || !notes) {
          return sendUserError(400, "Project id, description, and notes are required", res);
        }
        actions
          .update(id, { project_id, description, notes, completed })
          .then(updated => res.status(200).json(updated))
          .catch(err => sendUserError(500, "There was an error in updating action", res));  
      }
    });
})













server.listen(port, () => console.log('API running on port 5000'))