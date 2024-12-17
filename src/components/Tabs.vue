<template>
  <IonTabs>
    <IonRouterOutlet />
    <IonTabBar slot="bottom">
      <!-- Tab Buttons -->
      <IonTabButton tab="collection" href="/tabs/MyCollection">
        <IonIcon icon="albums-outline" />
        <IonLabel>Collection</IonLabel>
      </IonTabButton>

      <IonTabButton tab="wishlist" href="/tabs/wishlist">
        <IonIcon icon="heart-outline" />
        <IonLabel>Wishlist</IonLabel>
      </IonTabButton>

      <IonTabButton tab="sets" href="/tabs/sets">
        <IonIcon icon="layers-outline" />
        <IonLabel>Sets</IonLabel>
      </IonTabButton>

      <IonTabButton tab="profile" href="/tabs/profile">
        <IonIcon icon="person-outline" />
        <IonLabel>Profile</IonLabel>
      </IonTabButton>

      <IonTabButton tab="scan" href="/tabs/scan">
        <IonIcon icon="scan-outline" />
        <IonLabel>Scan</IonLabel>
      </IonTabButton>
    </IonTabBar>
  </IonTabs>
</template>

<script>
  import {
    IonTabs,
    IonRouterOutlet,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel,
  } from '@ionic/vue';

  export default {
    name: 'TabNavbars',
    components: {
      IonTabs,
      IonRouterOutlet,
      IonTabBar,
      IonTabButton,
      IonIcon,
      IonLabel,
    },
  };
</script>
