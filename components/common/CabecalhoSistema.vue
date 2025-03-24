<template>
  <div class="w-full bg-white border-b border-slate-200 py-1 px-4 flex justify-between">
    <PrimeButton
      icon="pi pi-bars"
      severity="secondary"
      text
      outlined
      aria-label="Menu"
      class="py-2.5 w-11"
      @click="$emit('toggleMenuPrincipal')"
    />
    <div>
      <PrimeButton
        aria-haspopup="true"
        aria-controls="submenu_perfil"
        icon="pi pi-user"
        severity="secondary"
        text
        outlined
        aria-label="Perfil"
        class="py-2.5 w-11"
        @click="toggleSubmenuPerfil"
      />
      <PrimeMenu
        id="submenu_perfil"
        ref="submenuPerfil"
        :model="itemsSubmenuPerfil"
        :popup="true"
      >
        <template #item="{ item, props }">
          <router-link
            v-if="item.route"
            v-slot="{ href, navigate }"
            :to="item.route"
            custom
          >
            <a
              v-ripple
              :href="href"
              v-bind="props.action"
              @click="navigate"
            >
              <span :class="item.icon" />
              <span class="ml-2">{{ item.label }}</span>
            </a>
          </router-link>
          <a
            v-else
            v-ripple
            :href="item.url"
            :target="item.target"
            v-bind="props.action"
          >
            <span :class="item.icon" />
            <span class="ml-2">{{ item.label }}</span>
          </a>
        </template>
      </PrimeMenu>
    </div>
  </div>
</template>

<script setup>
  /*
  import { useMenuItems } from '~/data/menuItems';

  const submenuPerfil = ref();

  const { itemsSubmenuPerfil } = useMenuItems();

  const toggleSubmenuPerfil = (event) => {
    submenuPerfil.value.toggle(event);
  };
  */
</script>