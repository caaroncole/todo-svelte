<script>
  import TodoList from "../lib/components/TodoList.svelte";
  import TodoForm from "../lib/components/TodoForm.svelte";
  import CompletedTodos from "../lib/components/CompletedTodos.svelte";
  import UserMessages from "../lib/components/UserMessages.svelte";

</script>
<main>
  <div class="new-todo">
    <TodoForm />
  </div>
  <div class="todos">
    <TodoList />
    <CompletedTodos />
  </div>
  <div class="user-messages">
    <UserMessages />
  </div>
</main>

<style>
  .todos {
    display: flex;
    gap: 20px;
  }
</style>