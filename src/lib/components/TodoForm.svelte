<script>
  import { createTodo } from '$lib/api/todoService';
  import { createEventDispatcher } from 'svelte';
  let todo = '';

  async function handleSubmit() {
    const { data, error } = await createTodo(todo);
    if (error) {
      console.error(error);
      // Handle the error, e.g., show a notification or message
    } else {
      console.log('Todo created:', data);
      // Handle success, e.g., clear the form or redirect
      todo = ''  // Reset form
      };
    }
  
</script>

<form on:submit|preventDefault={handleSubmit}>
  <input bind:value={todo} placeholder="Task Name" required>
  <button type="submit">Add Todo</button>
</form>