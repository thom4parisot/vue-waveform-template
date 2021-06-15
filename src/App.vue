<template>
  <div>
    <h1>Annotate Audio Waveforms</h1>
    <p>with Vue.js + Peaks.js</p>

    <main>
      <waveform dataFile="test.json" audioFile="test.mp3" />
    </main>
  </div>
</template>

<style>
body {
  font-family: sans-serif;
  font-size: 22px;
  line-height: 1.3;
}

h1 + p {
  margin-top: -1em;
  margin-bottom: 2em;
}
</style>

<script>
import Waveform from './components/Waveform.vue'

export default {
  components: {
    Waveform
  }
}

</script>
