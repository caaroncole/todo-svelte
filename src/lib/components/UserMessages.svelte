<script>
  import { userMessages } from '$lib/api/todoService'; // Import the userMessages store

  let showMessage = true;

  $:{ if ($userMessages) {
    showMessage = true;
    setTimeout(() => { showMessage = false }, 5000);
  }};
</script>

{#if $userMessages}
  {#if showMessage}
    <div class="message">
      {$userMessages}
    </div>
  {/if}
{/if}

<style>
  .message {
    color: blue;
    margin-bottom: 1em;
  }
</style>
