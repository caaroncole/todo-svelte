<script>
  import { onMount } from 'svelte';
  import { todos, fetchTodos, markAsCompleted } from '$lib//api/todoService';

  
  let error = '';
  let checkedTodos = [];

  onMount(async () => {
    await fetchTodos();
  });

  async function handleCompleted() {
    if (checkedTodos.length > 0) {
      markAsCompleted(checkedTodos);
      checkedTodos = [];
    }

  }
 
</script>

<div class="container">
  <div class="todos">
    <h2>Todo's</h2>
    <ul>
      {#each $todos as todo (todo._id)}
        {#if todo.completed === false}
        <div class="todo-item">
          <input type="checkbox" value={todo._id} bind:group={checkedTodos}/>
          <li >{todo.task} </li>
        </div>
        {/if}
      {/each}
    </ul>
  </div>
  <div class="actions">
    <button on:click={handleCompleted} disabled={!checkedTodos.length > 0}>Mark Completed</button>
  </div>
</div>

<style>
  .container {
    flex: 0 0 10em;
  }
  .todo-item {
    display: flex;
  }
  li {
    list-style: none;
  }
 /*  .completed {
    text-decoration: line-through;
  } */
</style>