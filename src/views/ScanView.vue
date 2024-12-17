<template>
  <IonPage>
    <IonHeader>
      <AppNavbar />
    </IonHeader>
    <IonContent :fullscreen="true" style="--background: transparent">
      <div
        class="flex flex-col items-center justify-start min-h-screen bg-transparent p-4"
      >
        <h1 class="text-2xl font-bold mb-4 text-red-800 dark:text-red-800">
          Scan Pokemon Card
        </h1>

        <!-- Kamera Preview Container -->
        <div
          class="relative w-full max-w-md h-64 bg-gray-200 rounded-lg overflow-hidden"
        >
          <!-- Kamera Preview -->
          <div id="cameraPreview" class="camera-preview w-full h-full"></div>
          <!-- Stop Kamera Knappen -->
        </div>

        <!-- Start Kamera Knappen -->
        <button @click="startCamera" class="btn-primary mt-4">
          Start Camera
        </button>
        <button @click="stopCamera" class="btn-primary mt-4">
          Stop Camera
        </button>

        <!-- Fejl- og Resultatmeddelelser -->
        <p v-if="error" class="text-red-500 mt-4">{{ error }}</p>
        <p v-if="result" class="text-green-500 mt-4">Result: {{ result }}</p>
      </div>
    </IonContent>
  </IonPage>
</template>

<script>
  import { IonPage, IonHeader, IonContent } from '@ionic/vue';
  import AppNavbar from '@/components/AppNavbar.vue';
  import { CameraPreview } from '@capacitor-community/camera-preview';
  import { Capacitor } from '@capacitor/core';

  export default {
    name: 'ScanView',
    components: {
      IonPage,
      IonHeader,
      IonContent,
      AppNavbar,
    },
    data() {
      return {
        error: '',
        result: '',
      };
    },
    async mounted() {
      if (Capacitor.getPlatform() !== 'web') {
        await this.requestPermissions();
      } else {
        this.error = 'Camera preview er ikke tilgængelig i browseren.';
      }
    },
    methods: {
      async requestPermissions() {
        try {
          const status = await CameraPreview.checkPermissions();
          if (status.camera !== 'granted') {
            const permission = await CameraPreview.requestPermissions();
            if (permission.camera !== 'granted') {
              this.error = 'Kameratilladelse er påkrævet.';
            }
          }
        } catch (err) {
          this.error = 'Fejl ved anmodning om tilladelser.';
          console.error(err);
        }
      },
      async startCamera() {
        if (Capacitor.getPlatform() !== 'web') {
          try {
            await CameraPreview.start({
              position: 'rear',
              parent: 'cameraPreview', // Brug ID'en på div'en
              className: 'camera-preview',
              disableAudio: true,
              toBack: false, // Placerer kameraet over webview
              width: window.innerWidth,
              height: document.getElementById('cameraPreview').clientHeight,
            });
          } catch (err) {
            this.error = 'Kan ikke starte kameraet.';
            console.error(err);
          }
        } else {
          this.error = 'Start Camera fungerer kun på mobile enheder.';
        }
      },
      async stopCamera() {
        if (Capacitor.getPlatform() !== 'web') {
          try {
            await CameraPreview.stop();
          } catch (err) {
            this.error = 'Kan ikke stoppe kameraet.';
            console.error(err);
          }
        } else {
          this.error = 'Stop Camera fungerer kun på mobile enheder.';
        }
      },
    },
    ionViewWillLeave() {
      this.stopCamera();
    },
  };
</script>

<style scoped>
  .camera-preview {
    width: 100%;
    height: 100%;
    z-index: 1;
    border-radius: 0.5rem;
    object-fit: cover;
  }

  .btn-primary {
    @apply bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400;
  }

  button {
    z-index: 20;
  }
</style>
