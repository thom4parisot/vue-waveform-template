<template>
  <div>
    <p class="player">
      <code>{{ audioFile }}</code>

      <audio ref="audioPlayer" controls>
        <source :src="audioFile" type="audio/mpeg">
      </audio>
    </p>



    <div class="peaks-container">
      <div class="waveform" ref="zoomview"></div>
      <div class="waveform" ref="overview"></div>
    </div>
  </div>
</template>

<script>
import Peaks from 'peaks.js';

export default {
  props: {
    audioFile: {
      type: String,
      required: true
    },
    dataFile: {
      type: String,
      required: true
    }
  },

  mounted () {
    this.$nextTick(() => {
      this._waveform = Peaks.init({
        mediaElement: this.$refs.audioPlayer,
        dataUri: this.$props.dataFile,
        containers: {
          overview: this.$refs.overview,
          zoomview: this.$refs.zoomview
        }
      }, this.onWaveformLoaded)
    })
  },

  methods: {
    onWaveformLoaded (error, peaks) {
      error ? console.error(error) : console.log(peaks)
    }
  }
}
</script>

<style scoped>
.player audio  {
  margin-left: 1em;
  vertical-align: middle;
}

.peaks-container {
  display: flex;
  flex-flow: column;
  justify-content: space-between;
  height: 200px;
  margin: 3em 0;
}

.waveform:nth-child(1) {
  flex: 1 0 66%;
}
.waveform:nth-child(2) {
  flex: 1 0 33%;
}
</style>
