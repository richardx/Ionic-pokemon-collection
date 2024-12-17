<template>
  <IonPage>
    <IonHeader>
      <!-- Inkluder AppNavbar her -->
      <AppNavbar />
    </IonHeader>
    <IonContent>
      <div class="container mx-auto p-4">
        <!-- Header with Flexbox -->
        <div class="flex items-center justify-between mb-4">
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white">
            My Collection
          </h1>
          <!-- Add Card Button -->
          <button
            @click="navigateToAddCard"
            class="bg-blue-500 dark:bg-blue-700 text-white rounded px-4 py-2"
          >
            Add Card
          </button>
        </div>

        <!-- Search and Sort Container -->
        <div
          class="flex flex-col md:flex-row items-center justify-between mb-4 space-y-4 md:space-y-0"
        >
          <!-- Search Input -->
          <input
            v-model="searchQuery"
            @input="debouncedSearch"
            type="text"
            placeholder="Search for cards in collection..."
            class="w-full md:flex-grow p-2 border rounded bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
          />

          <!-- Sort Controls -->
          <SortControls @sort-changed="handleSortChange" class="ml-2" />
        </div>

        <!-- Total Price -->
        <div class="mb-4 text-left text-gray-800 dark:text-gray-200">
          <strong>Total Collection Price:</strong> ${{ totalPrice }}
        </div>

        <!-- Card List -->
        <div v-if="isLoading" class="flex justify-center">
          <span class="text-gray-500">Loading...</span>
        </div>
        <CollectionCardList
          v-else
          :cards="filteredSortedCards"
          @remove-card="handleRemoveCard"
          @view-detail="handleViewDetail"
          @update-quantity="handleUpdateQuantity"
        />
      </div>
    </IonContent>
  </IonPage>
</template>

<script setup>
  import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    updateDoc,
  } from 'firebase/firestore';
  import debounce from 'lodash/debounce';
  import { computed, onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import CollectionCardList from '../components/CollectionCardList.vue';
  import SortControls from '../components/SortControls.vue';
  import useSortable from '../composables/useSortable';
  import { db } from '../firebase';
  import pokemonService from '../services/pokemonService';
  import { useUserStore } from '../store';
  import { IonPage, IonContent, IonHeader } from '@ionic/vue';
  import AppNavbar from '../components/AppNavbar.vue';

  // Reactive variables
  const searchQuery = ref('');
  const collectionCards = ref([]);
  const isLoading = ref(false);
  const router = useRouter();

  const userStore = useUserStore();
  const user = computed(() => userStore.user);

  // Use useSortable
  const { sortedResults: sortedCollectionCards, handleSortChange } =
    useSortable(collectionCards);

  // Filtered and sorted cards based on search
  const filteredSortedCards = computed(() => {
    if (!searchQuery.value) return sortedCollectionCards.value;
    return sortedCollectionCards.value.filter((card) =>
      card.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });

  // Fetch market price
  const fetchMarketPrice = async (apiId) => {
    try {
      const apiResponse = await pokemonService.getCard(apiId);
      const apiDetails = apiResponse.data.data;
      if (apiDetails.tcgplayer?.prices?.holofoil?.market !== undefined) {
        return apiDetails.tcgplayer.prices.holofoil.market;
      } else if (apiDetails.tcgplayer?.prices?.normal?.market !== undefined) {
        return apiDetails.tcgplayer.prices.normal.market;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching market price:', error);
      return null;
    }
  };

  // Fetch collection
  const fetchCollection = async () => {
    isLoading.value = true;
    try {
      const snapshot = await getDocs(
        collection(db, 'users', user.value.uid, 'collection')
      );
      const cards = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const updatedCards = await Promise.all(
        cards.map(async (card) => {
          const marketPrice =
            card.marketPrice || (await fetchMarketPrice(card.apiId)) || 0;
          return {
            ...card,
            marketPrice,
            rarity: card.rarity || 'Unknown',
            setNumber: card.setNumber || 'N/A',
            type: card.type || 'Unknown',
          };
        })
      );
      collectionCards.value = updatedCards;
    } catch (error) {
      console.error('Error fetching collection:', error);
      collectionCards.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  // Remove card from collection
  const removeCardFromCollection = async (cardId) => {
    if (!user.value) return;
    try {
      await deleteDoc(doc(db, 'users', user.value.uid, 'collection', cardId));
      collectionCards.value = collectionCards.value.filter(
        (card) => card.id !== cardId
      );
    } catch (error) {
      console.error('Error removing card from collection:', error);
    }
  };

  const handleRemoveCard = (cardId) => removeCardFromCollection(cardId);

  const handleViewDetail = ({ card, source }) => {
    router.push(`/tabs/cardDetail/${card.id}/${source}`);
  };

  const handleUpdateQuantity = async ({ cardId, newQuantity }) => {
    if (!user.value || newQuantity < 1) return;
    try {
      await updateDoc(doc(db, 'users', user.value.uid, 'collection', cardId), {
        quantity: newQuantity,
      });
      const card = collectionCards.value.find((c) => c.id === cardId);
      if (card) {
        card.quantity = newQuantity;
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  // Calculate total price
  const totalPrice = computed(() => {
    return collectionCards.value
      .reduce(
        (total, card) =>
          total +
          (parseFloat(card.marketPrice) || 0) * (parseInt(card.quantity) || 0),
        0
      )
      .toFixed(2);
  });

  // Debounce search
  const debouncedSearch = debounce(() => {
    // Search logic is handled via computed property
  }, 300);

  const navigateToAddCard = () => {
    router.push('/tabs/addCard');
  };

  onMounted(() => {
    if (user.value) {
      fetchCollection();
    }
  });
</script>
