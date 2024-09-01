<template>
  <div id="myModal" class="modal">
    <!-- Modal content -->
    <div class="modal-content">
      <div class="modal-header">
        <h2>Modal Header</h2>
        <span id="close-btn" class="close" @click="closeModal">&times;</span>
      </div>
      <div class="modal-body">
        <p>Some text in the Modal Body</p>
        <p>Some other text...</p>
      </div>
      <div class="modal-footer">
        <button class="bg-gray-500 hover:bg-gray-600 text-white p-3 mx-4 rounded-lg" @click="closeModal()">Vazgeç</button>
        <button class="bg-green-600 hover:bg-green-700 p-3 text-white rounded-lg">Onayla</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";

let modal: HTMLElement | null;

const closeModal = () => {
  if (modal) {
    modal.style.display = "none";
  }
};

onMounted(() => {
  modal = document.getElementById("myModal");
});
</script>

<style scoped lang="scss">
/* The Modal (background) */
.modal {
  display: block; /* Hidden by default */
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
  @apply text-2xl font-semibold p-4 border-b-2 flex items-center justify-between;
}

/* Modal Body */
.modal-body {
  @apply p-6;
}

/* Modal Footer */
.modal-footer {
  @apply p-4 flex justify-end items-center;
}

/* Modal Content */
.modal-content {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fefefe;
  margin: auto;
  padding: 0;
  border: 1px solid #888;
  min-width: 400px;
  width: 80%;
  max-width: 640px;
  //   box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  //   border-radius: 1rem;
  animation-name: animatefade;
  animation-duration: 0.4s;
  @apply rounded-lg shadow-lg;
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
</style>
