<template>
  <div class="text-center">
    <h1 class="text-8xl	font-bold text-slate-500">
      403
    </h1>
    <h3 class="text-uppercase text-3xl text-slate-500">
      Acesso negado
    </h3>
    <p class="text-muted mb-5 text-lg mt-10 text-slate-500">
      Você não tem permissão para acessar esta página.
      <br>
      Contate o administrador do sistema.
    </p>
    <PrimeButton
      label="Inicio"
      icon="pi pi-arrow-left"
      @click="navigateTo('/sistema/')"
    />
  </div>
</template>

<script setup>
  definePageMeta({
    layout: 'auth',
    middleware: [],
  });
</script>