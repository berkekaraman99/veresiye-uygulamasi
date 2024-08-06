<template>
  <div class="grid grid-cols-12">
    <div class="col-span-12 sm:col-start-2 sm:col-span-10 lg:col-start-4 lg:col-span-6 xl:col-start-4 xl:col-span-6">
      <div class="bg-white py-6 border rounded-lg shadow-lg">
        <h1 class="text-center mb-12 font-bold text-2xl">Giriş Yap</h1>
        <FormKit
          type="form"
          id="receivable-form"
          @submit="
            () => {
              console.log('Hi');
            }
          "
          :actions="false"
          :config="{
            classes: {
              outer: 'mx-auto',
              wrapper: 'mx-auto',
              messages: 'text-center',
            },
          }"
        >
          <FormKit type="text" name="user_name" label="Kullanıcı Adı" placeholder="Kullanıcı Adı" validation="required" />
          <FormKit type="password" name="password" label="Şifre" placeholder="Şifre" validation="required|length:8" />

          <FormKit type="submit" label="Oluştur" :wrapper-class="{ 'flex justify-center': true }" />
        </FormKit>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
