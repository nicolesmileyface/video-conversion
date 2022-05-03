<template>
  <div v-if="isSupported" class="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-6 md:gap-8 mt-12">
    <div class="grid gap-4 grid-rows-[auto,1fr]">
      <div class="flex items-center justify-between">
        <p class="font-medium">Input Type:</p>
        <div class="flex items-center gap-2">
          <button
            class="flex items-center gap-4 font-medium px-2 py-1 rounded w-max"
            :class="{
              'bg-rose-500/25': inputType === 'image',
              'bg-transparent': inputType !== 'image',
            }"
            @click="() => (inputType = 'image')"
          >
            Image
          </button>
          <button
            class="flex items-center gap-4 font-medium px-2 py-1 rounded w-max"
            :class="{
              'bg-rose-500/25': inputType === 'video',
              'bg-transparent': inputType !== 'video',
            }"
            @click="() => (inputType = 'video')"
          >
            Video
          </button>
        </div>
      </div>
      <section class="bg-rose-500/10 rounded md:shadow p-4 flex flex-col items-center justify-center" :class="{ 'h-60': !videoSrc }">
        <img v-if="videoSrc && inputType === 'image'" :src="videoSrc" class="mb-4 rounded-md max-h-96" />
        <video v-else-if="videoSrc" controls class="mb-4 rounded-md">
          <source :src="videoSrc" />
        </video>
        <input ref="fileInput" @change="updatePreview" type="file" class="hidden" />
        <button v-if="!isReady" disabled class="text-xl py-2 border-b-2 border-transparent">Loading ffmpeg...</button>
        <button v-else :disabled="!isReady || isConverting" @click="$refs.fileInput.click()" class="text-xl flex items-center gap-4 py-2 border-b-2 border-transparent hover:border-rose-200">
          <PaperClipIcon class="w-5 h-5" />
          <p v-if="video">{{ video.name }}</p>
          <p v-else>Select Input File</p>
        </button>
      </section>
    </div>
    <div class="w-full h-px md:w-1 md:h-full bg-rose-900 bg-opacity-[0.02]"></div>
    <div class="grid gap-4 grid-rows-[auto,1fr]">
      <div class="flex items-center justify-between">
        <p class="font-medium">Output Format:</p>
        <label for="image-format" class="focus-within:ring ring-rose-400 flex items-center gap-4 bg-rose-500/25 px-2 py-1 rounded w-max" v-if="inputType === 'image'">
          <select id="image-format" name="image-format" @change="clearFormat" v-model="selectedFormat" class="appearance-none bg-transparent font-medium focus:outline-none">
            <option value="" disabled selected>Select a format</option>
            <option :value="format" v-for="format of imageFormats" :key="format.format">{{ format.format }}</option>
          </select>
          <ChevronDownIcon class="w-3 h-3" />
        </label>
        <label for="video-format" class="focus-within:ring ring-rose-400 flex items-center gap-4 bg-rose-500/25 px-2 py-1 rounded w-max" v-else>
          <select id="video-format" name="video-format" @change="clearFormat" v-model="selectedFormat" class="appearance-none bg-transparent font-medium focus:outline-none">
            <option value="" disabled selected>Select a format</option>
            <option :value="format" v-for="format of videoFormats" :key="format.format">{{ format.format }}</option>
          </select>
          <ChevronDownIcon class="w-3 h-3" />
        </label>
      </div>
      <section class="bg-rose-500/10 rounded md:shadow p-4 flex flex-col items-center justify-center">
        <div class="flex items-center justify-center h-full">
          <div v-if="imageSrc" class="text-center flex flex-col justify-center items-center">
            <img :src="imageSrc" alt="output" class="mb-4 rounded-md max-h-96" />
            <button @click="downloadBlob" class="text-xl flex items-center gap-4 py-2 border-b-2 border-transparent hover:border-rose-200 w-max">
              {{ `Download ${selectedFormat ? selectedFormat.format : '__'}` }}
            </button>
          </div>
          <div v-else>
            <button class="text-xl flex items-center gap-4 py-2 border-b-2 border-transparent hover:border-rose-200" v-if="videoSrc && selectedFormat" :disabled="isConverting || !selectedFormat" @click="convertToFormat(video, selectedFormat)">
              {{ isConverting ? 'Converting File...' : `Convert To ${selectedFormat.format}` }}
            </button>
            <button class="text-xl opacity-60 cursor-not-allowed py-2 border-b-2 border-transparent" v-else disabled>Convert File</button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ChevronDownIcon, PaperClipIcon } from '@heroicons/vue/outline'
import { ref } from 'vue'
import useFFmpeg from '../composables/useFFmpeg'
const videoSrc = ref(null)
const video = ref(null)
const selectedFormat = ref('')
const inputType = ref('video')

const { isReady, convertToFormat, output: imageSrc, isConverting, isSupported, videoFormats, imageFormats } = useFFmpeg()
const updatePreview = (e) => {
  if (e.target.files.length) {
    videoSrc.value = URL.createObjectURL(e.target.files[0])
    video.value = e.target.files[0]
  }
}

const clearFormat = () => {
  imageSrc.value = null
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
</script>
