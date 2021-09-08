const express = require('express');
const cors = require('cors');

 const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

 const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui - concluido
  const { username } = request.headers;
  const user = users.find((user)=> user.username === username);
  if(!user){
    return response.status(404).json({error:"User not exists!"});
  }
  request.user = user;
  return next();


}

app.post('/users', (request, response) => {
  // Complete aqui - concluido
  const { name,username } = request.body;
  const userAlreadyExists = users.some((user)=>user.username === username);

  if(userAlreadyExists){
    return response.status(400).json({
      error:"User already exists!"
    });
  }
  users.push({
    id: uuidv4(), 
    name,
    username, 
    todos: []
  });
  return response.status(201).json(users);
});

app.get('/todos',checksExistsUserAccount, (request, response) => {
  // Complete aqui - concluido
  const { user } = request;
  return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui - concluido
  const { user } = request;
  const { title,deadline } = request.body;

  const todoOperation ={
    id: uuidv4(),
	  title,
	  done: false, 
	  deadline: new Date(deadline),
	  created_at: new Date()
  }
  user.todos.push(todoOperation);
  return response.status(201).json(todoOperation);

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui - Concluido
  const { user } = request;
  const { title, deadline} = request.body;
  const { id } = request.params;

  const userTodos = user.todos.find((todo)=>todo.id === id);
    
  if(!userTodos){
    return response.status(404).json({
      error:"Todo not found!"
    });
  }
  userTodos.title = title;
  userTodos.deadline = new Date(deadline);

  return response.status(201).json(userTodos);
  
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { id } = request.params;

  const todoDone = user.todos.find((done)=> done.id === id);

  if(!todoDone){
    return response.status(404).json({
      error:"Todo not exists!"
    });
  }
  todoDone.done = true;

  return response.status(201).json(todoDone);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request;
  const { id } = request.params;

  const deleteTodo = user.todos.find((todo)=> todo.id === id);
  
  if(!deleteTodo){
    return response.status(404).json({
      error: "todo not exists!"
    })
  }
  users.splice(deleteTodo,1);
  return response.status(204).send();
});

module.exports = app;