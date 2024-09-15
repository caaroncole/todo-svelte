import { writable } from 'svelte/store';

// Create a writable store to manage todos
const todos = writable([]);
const userMessages = writable([]);

// Function to fetch todos from the server and update the store
export async function fetchTodos() {
  try {
    const response = await fetch('http://localhost:3000/todos');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    todos.set(data);
    userMessages.set("Tasks retrieved.")
    // localStorage.setItem('todos', JSON.stringify(data)); // Cache in localStorage
    return data;
  } catch (error) {
    console.error('Error fetching todos:', error);
    userMessages.set(error)
    return { error: 'Failed to fetch todos' };
  }
}

// Function to create a new todo and update the store
export async function createTodo(todo) {
  try {
    const response = await fetch('http://localhost:3000/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: todo })
    });

    if (!response.ok) {
      if (response.status === 409) {
        throw new Error("Todo Already Exists")
      }
      const result = await response.json();
      throw new Error(result.error || 'Network response was not ok');

    }

    const newTodo = await response.json();
    userMessages.set(`${newTodo.task} successfully saved`)
    todos.update(currentTodos => {
      const updatedTodos = [...currentTodos, newTodo];
      // localStorage.setItem('todos', JSON.stringify(updatedTodos)); // Cache in localStorage
      return updatedTodos;
    });
    return { data: newTodo };
  } catch (error) {
    userMessages.set(error)
    console.error(`Error creating todo: ${error.message}`);
    return { error: 'Failed to create todo' };
  }
}

// Function to update completed status of todos and update the store
async function updateCompleted(ids, updates) {
  try {
    const response = await fetch('http://localhost:3000/todos', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids, updates })
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || 'Response not ok');
    }

    const updatedTodos = await response.json();
    todos.update(currentTodos => {
      const updatedList = currentTodos.map(todo =>
        ids.includes(todo._id) ? { ...todo, ...updates } : todo
      );
      // localStorage.setItem('todos', JSON.stringify(updatedList)); // Cache in localStorage
      return updatedList;
    });
    return { data: updatedTodos };
  } catch (error) {
    console.error('Error updating todos:', error);
    return { error: 'Failed to update todos' };
  }
}
export async function deleteTasks(ids) {
  try {
    const response = await fetch('http://localhost:3000/todos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids })
    });

    if (response.status === 204) {
      // Handle no content response
      userMessages.set('Selected tasks were successfully deleted.');
      todos.update(currentTodos => currentTodos.filter(todo => !ids.includes(todo._id)));
    } else if (!response.ok) {
      // Handle error response
      const result = await response.json();
      throw new Error(result.error || 'Could not delete todos');
    } else {
      // Handle other response cases
      const result = await response.json();
      const { deletedCount } = result;
      if (deletedCount > 0) {
        todos.update(currentTodos => {
          const updatedTodos = currentTodos.filter(todo => !ids.includes(todo._id));
          userMessages.set(`${deletedCount} tasks were deleted`);
          return updatedTodos;
        });
      } else {
        userMessages.set('No tasks deleted, check IDs');
      }
    }
  } catch (error) {
    console.error('Error deleting tasks:', error);
    userMessages.set(error.message);
  }
}



// Function to mark todos as completed and update the store
export async function markAsCompleted(ids) {
  return updateCompleted(ids, { completed: true });
}

// Export the store for use in components
export { todos, userMessages };
