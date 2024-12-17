import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import { IonicVue } from '@ionic/vue';
// Importér Ionic CSS
import '@ionic/vue/css/core.css';
import '@ionic/vue/css/ionic.bundle.css';

// Importér Ionicons og registrer dem
import { addIcons } from 'ionicons';
import {
  ionAlbumsOutline,
  ionHeartOutline,
  ionLayersOutline,
  ionPersonOutline,
  ionScanOutline,
  menuOutline,
  moonOutline,
  sunnyOutline,
} from 'ionicons/icons';

addIcons({
  'albums-outline': ionAlbumsOutline,
  'heart-outline': ionHeartOutline,
  'layers-outline': ionLayersOutline,
  'person-outline': ionPersonOutline,
  'scan-outline': ionScanOutline,
  'moon-outline': moonOutline,
  'sunny-outline': sunnyOutline,
  'menu-outline': menuOutline,
});

// Importér Pinia og Firebase Auth
import { useUserStore } from '@/store';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { createPinia } from 'pinia';

// Importér dine globale CSS
import './assets/main.css';

const pinia = createPinia();
const app = createApp(App);

app.use(IonicVue);
app.use(pinia);
app.use(router);

// Auth state observer
const auth = getAuth();
const userStore = useUserStore();

onAuthStateChanged(auth, (currentUser) => {
  userStore.setUser(currentUser);
  userStore.isAuthReady = true;
});

// Mount appen, når routeren er klar
router.isReady().then(() => {
  app.mount('#app');
});
