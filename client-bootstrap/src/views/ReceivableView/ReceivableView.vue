<template>
  <div class="row">
    <div class="col-12 col-md-10 offset-md-1 col-lg-6 offset-lg-3">
      <h1 class="text-center my-4">Alacak Oluşturma</h1>
      <div class="card card-body py-5 my-5">
        <FormKit
          type="form"
          id="receivable-creating"
          @submit="
            () => {
              console.log('Hi');
            }
          "
          :actions="false"
          :config="{
            classes: {
              outer: 'mx-auto',
              wrapper: 'mx-auto w-100',
              messages: 'text-center',
            },
          }"
        >
          <FormKit type="text" name="customer_name" label="Müşteri" placeholder="Müşteri adı" validation="required" />
          <FormKit type="number" name="price" label="Alacak" placeholder="Fiyat" validation="required" min="0" />
          <FormKit type="textarea" name="description" label="Açıklama" />

          <FormKit type="submit" label="Oluştur" wrapper-class="d-flex align-items-center justify-content-center" />
        </FormKit>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
