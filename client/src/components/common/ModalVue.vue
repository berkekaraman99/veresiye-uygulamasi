<template>
  <div id="modal-dialog" class="modal">
    <!-- Modal content -->
    <div class="modal-content">
      <div class="modal-header">
        <slot name="header"></slot>
      </div>
      <div class="modal-body">
        <slot></slot>
      </div>
      <div class="modal-footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";

let modal: HTMLElement | null;

onMounted(() => {
  modal = document.getElementById("modal-dialog");
});
</script>

<style scoped lang="scss">
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
