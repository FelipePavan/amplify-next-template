"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [secondTodos, setSecondTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos(data.items.filter(item => item.listType === 'firstList')),
    });
  }

  function listSecondTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setSecondTodos(data.items.filter(item => item.listType === 'secondList')),
    });
  }

  useEffect(() => {
    listTodos();
    listSecondTodos();
  }, []);

  function createTodo() {
    const person = window.prompt("DIGITE SEU NOEME");
    const content = window.prompt("RESPOSTA PARA A PERGUNTA");
    if (person && content) {
      client.models.Todo.create({
        content: `<strong>${person.toUpperCase()}</strong> respondeu: ${content}`,
        listType: 'firstList'
      });
    }
  }

  function createSecondTodo() {
    const person = window.prompt("DIGITE SEU NOEME");
    const content = window.prompt("CONTE ALGO");
    if (person && content) {
      client.models.Todo.create({
        content: `<strong>${person.toUpperCase()}</strong> mandou: ${content}`,
        listType: 'secondList'
      });
    }
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id });
  }

  function deleteSecondTodo(id: string) {
    client.models.Todo.delete({ id });
  }

  return (
    <div className="container">
      <main>
        <div className="todo-container">
          <h1>Esquenta virtual pro churras</h1>
          <h1>Responda: Como seria o role estilo churras ideal pra voce</h1>
          <button onClick={createTodo}>Responder</button>
          <ul>
            {todos.map((todo) => (
              <li
                onClick={() => deleteTodo(todo.id)}
                key={todo.id}
              >
                <span dangerouslySetInnerHTML={{ __html: todo.content || '' }} />
              </li>
            ))}
          </ul>
        </div>
        <div className="todo-container">
          <h1>Mural Aleatorio</h1>
          <h1>Escreva aqui qualquer coisa que voce queira que os outros saibam</h1>
          <button onClick={createSecondTodo}>Responder</button>
          <ul>
            {secondTodos.map((todo) => (
              <li
                onClick={() => deleteSecondTodo(todo.id)}
                key={todo.id}
              >
                <span dangerouslySetInnerHTML={{ __html: todo.content || '' }} />
              </li>
            ))}
          </ul>
        </div>
      </main>
      <footer>
        Manda alguma coisa ai, deu trabalho fazer essa porra
        <br />
        <a href="https://www.youtube.com/watch?v=zDZaTCum2A0" target="_blank">
          Link secreto não clique
        </a>
      </footer>
    </div>
  );
}
