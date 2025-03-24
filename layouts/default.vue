<template>
  <div>
    <CommonSplashScreen v-show="showSplashScreen" />
    <div
      v-show="!showSplashScreen"
      class="flex backgroundWallpaper"
    >
      <div class="flex-grow min-h-screen">
        <CommonCabecalhoSistema
          @toggle-menu-principal="menuPrincipal?.toggleMenuPrincipal"
        />
        <div class="w-screen p-6 sm:w-full">
          <slot />
        </div>
      </div>
      <PrimeToast />
      <PrimeConfirmDialog />
    </div>
  </div>
</template>

<script setup>
  import { Summary, Severity } from "../composables/common/toastCustom";

  const showSplashScreen = ref(true);
  const authRequest = useAuthRequest();

  onBeforeMount(() => {
    authRequest.validarSessao().then(() => {
      showSplashScreen.value = false;
    });
  });
</script>
