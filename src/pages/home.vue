<template>
  <div class="antialiased text-rose-200 px-6">
    <div class="max-w-6xl mx-auto py-[12vh]">
      <div class="text-center">
        <h1 class="text-4xl font-semibold">FFMpeg Utils</h1>
      </div>
      <div v-if="!isSupported" class="text-xl text-center mt-5">Sorry, your browser must implement SharedArrayBuffer (try Chrome)</div>
      <video-conversion v-else />
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import VideoConversion from '../components/video-conversion.vue'

import useFFmpeg from '../composables/useFFmpeg'

export default {
  name: 'App',
  components: { VideoConversion },
  setup() {
    const videoSrc = ref(null)
    const video = ref(null)
    const selectedFormat = ref('')

    const { isReady, convertToFormat, output: imageSrc, isConverting, isSupported, videoFormats, imageFormats } = useFFmpeg()

    const updatePreview = (e) => {
      if (e.target.files.length) {
        videoSrc.value = URL.createObjectURL(e.target.files[0])
        video.value = e.target.files[0]
      }
    }

    const downloadBlob = () => {
      if (!selectedFormat.value?.format) {
        return
      }
      const saveImg = document.createElement('a')
      saveImg.href = imageSrc.value
      saveImg.download = [Date.now(), selectedFormat.value.format].join('.')
      saveImg.click()
    }

    return {
      videoSrc,
      updatePreview,
      imageSrc,
      isConverting,
      isReady,
      convertToFormat,
      downloadBlob,
      video,
      isSupported,
      videoFormats,
      imageFormats,
      selectedFormat,
    }
  },
}
</script>
