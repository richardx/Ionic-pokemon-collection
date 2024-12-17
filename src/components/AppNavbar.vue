<template>
  <IonHeader translucent>
    <IonToolbar>
      <!-- Logo og Titel -->
      <div class="flex items-center">
        <img src="@/assets/pokeball.png" alt="Logo" class="h-8 w-8 mr-2" />
        <IonTitle>Pokémon Collection</IonTitle>
      </div>
      <!-- Knapper -->
      <IonButtons slot="end">
        <IonButton @click="toggleDarkMode">
          <IonIcon :icon="darkModeIcon" slot="icon-only" />
        </IonButton>
        <IonButton @click="logout">
          <IonLabel>Logout</IonLabel>
        </IonButton>
      </IonButtons>
    </IonToolbar>
  </IonHeader>
</template>

<script>
  import {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonLabel,
  } from '@ionic/vue';
  import { defineComponent, computed } from 'vue';
  import { useUserStore } from '@/store';
  import { signOut } from 'firebase/auth';
  import { auth } from '@/firebase';
  import { useRouter } from 'vue-router';

  export default defineComponent({
    name: 'AppNavbar',
    components: {
      IonHeader,
      IonToolbar,
      IonTitle,
      IonButtons,
      IonButton,
      IonIcon,
      IonLabel,
    },
    setup() {
      const userStore = useUserStore();
      const router = useRouter();

      const toggleDarkMode = () => {
        userStore.toggleDarkMode();
      };

      const logout = async () => {
        try {
          await signOut(auth);
          userStore.setUser(null);
          router.push('/loginUser');
        } catch (error) {
          console.error('Logout error:', error);
        }
      };

      const darkModeIcon = computed(() => {
        return userStore.isDarkMode ? 'sunny-outline' : 'moon-outline';
      });

      return {
        toggleDarkMode,
        darkModeIcon,
        logout,
      };
    },
  });
</script>
