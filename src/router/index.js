import { createRouter, createWebHistory } from '@ionic/vue-router';
import TabNavbars from '@/components/Tabs.vue';
import AddCard from '@/views/AddCard.vue';
import CardDetail from '@/views/CardDetail.vue';
import Login from '@/views/LoginUser.vue';
import MyCollection from '@/views/MyCollection.vue';
import Profile from '@/views/ProfileUser.vue';
import Register from '@/views/RegisterUser.vue';
import ScanView from '@/views/ScanView.vue';
import SetDetail from '@/views/SetDetail.vue';
import SetsUser from '@/views/SetsUser.vue';
import WishlistUser from '@/views/WishlistUser.vue';
import { useUserStore } from '@/store';
import { watch } from 'vue';

const routes = [
  {
    path: '/',
    redirect: '/tabs/MyCollection',
  },
  {
    path: '/tabs/',
    component: TabNavbars,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/tabs/MyCollection',
      },
      {
        path: 'MyCollection',
        name: 'MyCollection',
        component: MyCollection,
      },
      {
        path: 'wishlist',
        name: 'WishlistUser',
        component: WishlistUser,
      },
      {
        path: 'sets',
        name: 'SetsUser',
        component: SetsUser,
      },
      {
        path: 'profile',
        name: 'ProfileUser',
        component: Profile,
      },
      {
        path: 'scan',
        name: 'ScanView',
        component: ScanView,
      },
      {
        path: 'addCard',
        name: 'AddCard',
        component: AddCard,
      },
      {
        path: 'cardDetail/:id/:source',
        name: 'CardDetail',
        component: CardDetail,
        props: true,
      },
      {
        path: 'sets/:setId',
        name: 'SetDetail',
        component: SetDetail,
        props: true,
      },
    ],
  },
  // Non-authenticated routes
  {
    path: '/loginUser',
    name: 'LoginUser',
    component: Login,
  },
  {
    path: '/registerUser',
    name: 'RegisterUser',
    component: Register,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Global navigation guard
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  // If auth is not ready, wait until it is
  if (!userStore.isAuthReady) {
    const unwatch = watch(
      () => userStore.isAuthReady,
      (isAuthReady) => {
        if (isAuthReady) {
          unwatch(); // Stop watching
          const isAuthenticated = userStore.user !== null;

          if (requiresAuth && !isAuthenticated) {
            next({ name: 'LoginUser' });
          } else {
            next();
          }
        }
      }
    );
  } else {
    const isAuthenticated = userStore.user !== null;

    if (requiresAuth && !isAuthenticated) {
      next({ name: 'LoginUser' });
    } else {
      next();
    }
  }
});

export default router;
