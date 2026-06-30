import { useState, useEffect } from "react";
import { supabase } from "./utils/supabase";

function ToDoList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  function handleInputChange(event) {
    setNewTask(event.target.value);
  }

  async function getTasks() {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.log(error);
    } else {
      setTasks(data);
    }
  }

  async function addTask() {
    if (newTask.trim() === "") return;

    const { error } = await supabase
      .from("tasks")
      .insert([{ task: newTask }]);

    if (error) {
      console.log(error);
    } else {
      setNewTask("");
      getTasks();
    }
  }

  async function deleteTask(id) {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id);

    if (error) {
      console.log(error);
    } else {
      getTasks();
    }
  }

  function moveTaskUp(index) {
    if (index > 0) {
      const updatedTasks = [...tasks];
      [updatedTasks[index], updatedTasks[index - 1]] =
        [updatedTasks[index - 1], updatedTasks[index]];
      setTasks(updatedTasks);
    }
  }

  function moveTaskDown(index) {
    if (index < tasks.length - 1) {
      const updatedTasks = [...tasks];
      [updatedTasks[index], updatedTasks[index + 1]] =
        [updatedTasks[index + 1], updatedTasks[index]];
      setTasks(updatedTasks);
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      addTask();
    }
  }

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <div className="to-do-list">
      <h1>To-Do-List</h1>
      <div className="enterTask">
        <input
          type="text"
          placeholder="Enter a task"
          value={newTask}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button className="add-button" onClick={addTask}>
          Add
        </button>
      </div>
      <ol>
        {tasks.map((task, index) => (
          <li key={task.id}>
            <span className="text">{task.task}</span>
            <button
              className="delete-button"
              onClick={() => deleteTask(task.id)}
            >
              Delete
            </button>
            <button
              className="moveUp-button"
              onClick={() => moveTaskUp(index)}
            >
              up
            </button>
            <button
              className="moveDown-button"
              onClick={() => moveTaskDown(index)}
            >
              down
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default ToDoList;