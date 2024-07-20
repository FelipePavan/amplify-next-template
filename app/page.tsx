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

  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }

  useEffect(() => {
    listTodos();
  }, []);

  function createTodo() {
    const person = window.prompt("SEU NOME FERA");
    const content = window.prompt("DESCREVA SEU ROLE");
    if (person && content) {
      client.models.Todo.create({
        content: `<strong>${person.toUpperCase()}</strong> respondeu: ${content}`,
      });
    }
  }

    
  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }

  return (
    <main>
      <h1>Esquenta virtual pro churras</h1>
      <h1>Descreva o seu role estilo churras perfeito</h1>
      <button onClick={createTodo}>Responder</button>
      <ul>
        {todos.map((todo) => (
          <li 
          onClick={() => deleteTodo(todo.id)}
          key={todo.id}>
          <span dangerouslySetInnerHTML={{ __html: todo.content }} />
          </li>
        ))}
      </ul>
      <div>
        Manda alguma coisa ai, deu trabalho fazer essa porra
        <br />
        <a href="https://www.youtube.com/watch?v=zDZaTCum2A0" target="_blank">
        Link secreto não clique
        </a>
      </div>
    </main>
  );
}
