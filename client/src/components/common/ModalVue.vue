<template>
  <div id="modal-dialog" class="modal" @click.self="closeModal">
    <!-- Modal content -->
    <div class="modal-content">
      <div class="modal-header">
        <slot name="header" />
      </div>
      <div class="modal-body">
        <slot />
      </div>
      <div class="modal-actions">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(["close"]);

const closeModal = () => {
  emit("close");
};
</script>

<style scoped>
@reference "@/index.css";

/* The Close Button */
.close {
  color: #aaa;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

/* The Modal (background) */
.modal {
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
}

/* Modal Content/Box */
.modal-header {
  @apply text-2xl font-semibold p-4 border-b-1 dark:border-slate-700 flex items-center justify-between;
}

/* Modal Body */
.modal-body {
  @apply p-6;
}

/* Modal Footer */
.modal-actions {
  @apply p-4 flex justify-end items-center;
}

/* Modal Content */
.modal-content {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /* background-color: #fefefe; */
  margin: auto;
  padding: 0;
  min-width: 400px;
  width: 80%;
  max-width: 640px;
  animation-name: animatefade;
  animation-duration: 0.4s;
  @apply rounded-lg shadow-lg bg-slate-100 dark:bg-slate-900 border dark:border-slate-700;
}

/* Add Animation */
@keyframes animatefade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
