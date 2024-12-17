<template>
  <IonApp :class="{ dark: isDarkMode }">
    <IonRouterOutlet />
  </IonApp>
</template>

<script>
  import { defineComponent, computed } from 'vue';
  import { IonApp, IonRouterOutlet } from '@ionic/vue';
  import { useUserStore } from '@/store';

  export default defineComponent({
    name: 'App',
    components: {
      IonApp,
      IonRouterOutlet,
    },
    setup() {
      const userStore = useUserStore();
      const isDarkMode = computed(() => userStore.isDarkMode);

      return {
        isDarkMode,
      };
    },
  });
</script>
