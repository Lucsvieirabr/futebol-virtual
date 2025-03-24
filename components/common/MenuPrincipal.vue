<template>
  <div
    v-show="mostrarMenuPrincipal"
    class="flex-none min-h-screen w-72 px-1 bg-primary"
  >
    <div class="text-center">
      <img
        src="@/assets/images/logoWhite.webp"
        alt="Logotipo"
        class="my-8 h-10 mx-auto"
      >
    </div>
    <PrimePanelMenu
      :model="itemsMenuPrincipal"
      class="mt-4"
    >
      <template #item="{ item }">
        <router-link
          v-if="item.route"
          v-slot="{ href, navigate }"
          :to="item.route"
          custom
        >
          <a
            v-ripple
            class="relative flex align-items-center cursor-pointer text-color leading-none p-3"
            :href="href"
            @click="navigate"
          >
            <span :class="item.icon" />
            <span class="ml-2 text-color">{{ item.label }}</span>
          </a>
        </router-link>
        <a
          v-else
          v-ripple
          class="relative flex align-items-center cursor-pointer leading-none p-3"
          :href="item.url"
          :target="item.target"
        >
          <span
            :class="item.icon"
            class="leading-normal"
          />
          <span class="ml-2">{{ item.label }}</span>
          <span
            v-if="item.items"
            class="pi pi-angle-down text-primary ml-auto"
          />
        </a>
      </template>
    </PrimePanelMenu>
  </div>
</template>

<script setup>
  import { useMenuItems } from '~/data/menuItems';

  const { itemsMenuPrincipal } = useMenuItems();

  const mostrarMenuPrincipal = ref(false);
  const screenWidth = ref();

  const toggleMenuPrincipal = () => {
    mostrarMenuPrincipal.value = !mostrarMenuPrincipal.value;
  };

  const updateScreenWidth = () => {
    screenWidth.value = window.innerWidth;
  };

  watchEffect(() => {
    if (screenWidth.value > 640) {
      mostrarMenuPrincipal.value = true;
    } else {
      mostrarMenuPrincipal.value = false;
    }
  });

  onMounted(() => {
    window.addEventListener('resize', updateScreenWidth);
    updateScreenWidth(); // Atualiza a largura da tela quando o componente for montado
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', updateScreenWidth);
  });

  defineExpose({
    toggleMenuPrincipal,
  });
</script>