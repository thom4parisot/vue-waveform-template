<template>
  <div>
    <p class="player">
      <code>{{ audioFile }}</code>

      <audio ref="audioPlayer" controls>
        <source :src="audioFile" type="audio/mpeg">
      </audio>
    </p>

    <div class="peaks-container">
      <div class="waveform waveform--small" ref="overview"></div>
      <div class="waveform" ref="zoomview"></div>
    </div>

    <ul class="timed-events">
      <li v-for="cue in cues" :key="cue.id" class="cue" :style="'--bg-color: ' + cue.color">
        <header>
          <strong class="cue__title">{{ cue.labelText }}</strong>
        </header>

        <time :datetime="cue.time">{{ cue.time }}</time>
      </li>
    </ul>
  </div>
</template>

<script>
import Peaks from 'peaks.js';
import { mapGetters } from 'vuex';

const defaultOptions = {
  zoomWaveformColor: '#e2172d',
}

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
        ...defaultOptions,
        mediaElement: this.$refs.audioPlayer,
        dataUri: this.$props.dataFile,
        containers: {
          overview: this.$refs.overview,
          zoomview: this.$refs.zoomview
        }
      }, this.onWaveformLoaded)
    })
  },

  destroyed () {
    this._waveform.destroy()
  },

  methods: {
    onWaveformLoaded (error, peaks) {
      if (error) {
        throw new Error(error)
      }

      this.cues.forEach(cue => peaks.points.add(cue))
      peaks.on('points.dragmove', ({ id, time:newTime }) => {
        const time = parseFloat(newTime.toFixed(4))
        this.$store.commit('programme/cueUpdate', { id, time })
      })
    }
  },

  computed: {
    ...mapGetters('programme', ['cues'])
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

.waveform {
  flex: 1 0 auto;
}

.waveform--small {
  flex: 0 0 33%;
}

.timed-events {
  display: flex;
  list-style: none;
  justify-content: center;
  gap: 1em;
  margin: 1em 2em;
  padding: 0;
}

.cue {
  flex: 1 0 auto;
  border: 1px solid var(--bg-color);
}

.cue > header {
  background-color: var(--bg-color);
}
</style>
