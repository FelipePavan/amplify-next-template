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
  const [username, setUsername] = useState<string | null>(null);

  function downloadFiles() {
    const urls = [
      'https://thumbs.dreamstime.com/z/happy-cartoon-penis-tongue-happy-cartoon-penis-tongue-vector-107168800.jpg',
      'https://thumbs.dreamstime.com/z/happy-cartoon-penis-tongue-happy-cartoon-penis-tongue-vector-107168800.jpg',
      'https://thumbs.dreamstime.com/z/happy-cartoon-penis-tongue-happy-cartoon-penis-tongue-vector-107168800.jpg',
      'https://thumbs.dreamstime.com/z/happy-cartoon-penis-tongue-happy-cartoon-penis-tongue-vector-107168800.jpg',
      'https://thumbs.dreamstime.com/z/happy-cartoon-penis-tongue-happy-cartoon-penis-tongue-vector-107168800.jpg'
    ];
    urls.forEach(url => {
      const link = document.createElement('a');
      link.href = url;
      const filename = url.split('/').pop() || 'downloaded_file';
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

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
    const storedName = localStorage.getItem("username");
    if (storedName) {
      setUsername(storedName);
    } else {
      const name = window.prompt("DIGITE SEU NOME FERA");
      if (name) {
        const upperCaseName = name.toUpperCase();
        localStorage.setItem("username", upperCaseName);
        setUsername(upperCaseName);
      }
    }
  }, []);

  function createTodo() {
    if (username) {
      const content = window.prompt("RESPOSTA PARA A PERGUNTA");
      if (content) {
        client.models.Todo.create({
          content: `<strong>${username}</strong>: ${content}`,
          listType: 'firstList'
        });
      }
    } else {
      alert("Username is not set. Please refresh the page and provide your name.");
    }
  }

  function createSecondTodo() {
    if (username) {
      const content = window.prompt("CONTE ALGO");
      if (content) {
        client.models.Todo.create({
          content: `<strong>${username}</strong>: ${content}`,
          listType: 'secondList'
        });
      }
    } else {
      alert("Username is not set. Please refresh the page and provide your name.");
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
          <h1>Responda: Como seria o role estilo churras ideal pra você?</h1>
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
          <h1>Mural Aleatório</h1>
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
      <div className="corner-button">
        <button className="download-button" onClick={downloadFiles}>Não clique</button>
      </div>
        Manda alguma coisa ai, deu trabalho fazer essa porra
        <br />
        <a href="https://www.youtube.com/watch?v=zDZaTCum2A0" target="_blank">
          Link secreto não clique
        </a>
      </footer>
    </div>
  );
}
