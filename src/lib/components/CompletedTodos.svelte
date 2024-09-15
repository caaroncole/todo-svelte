<script>
  import { writable } from 'svelte/store';
  import { todos, deleteTasks } from '$lib/api/todoService';

  // Create a local store for selectedTodos
  const selectedTodos = writable([]);
  let selectAll = false;

  async function handleDelete() {
    const currentSelectedTodos = $selectedTodos;
    if (currentSelectedTodos.length > 0) {
      await deleteTasks(currentSelectedTodos);
      // Clear the store and reset selectAll checkbox
      selectedTodos.set([]);
      selectAll = false;
    }
  }

  function toggleSelectAll(event) {
    selectAll = event.target.checked;
    selectedTodos.set(selectAll
      ? $todos.filter(todo => todo.completed).map(todo => todo._id)
      : []
    );
  }
</script>

<div class="container">
  <div class="completed-todos">
    <h2>Completed Todo's</h2>
    <ul>
      <input type='checkbox' bind:checked={selectAll} on:change={toggleSelectAll} />
      {#each $todos as todo (todo._id)}
        {#if todo.completed}
          <div class="todo-item">
            <input type="checkbox" value={todo._id} bind:group={$selectedTodos} />
            <li>{todo.task}</li>
          </div>
        {/if}
      {/each}
    </ul>
  </div>
  <div class="actions">
    <button on:click={handleDelete} disabled={$selectedTodos.length === 0}>Delete Selected</button>
  </div>
</div>

{#each $selectedTodos as todo}
  <li>{todo}</li>
{/each}

<style>
  .todo-item {
    display: flex;
  }
  li {
    list-style: none;
  }
</style>
