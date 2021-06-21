<template>
  <div>
    <ol class="tracks">
      <li>
        <p><strong>Intro Track</strong></p>

        <select :value="introTrack" @change="setTrack({ type: 'intro', src: $event.target.value })">
          <option v-for="(track, i) in transitionTracks" :key="i">
            {{ track }}
          </option>
        </select>

        <audio v-if="introTrack" controls>
          <source :src="introTrack" type="audio/mpeg">
        </audio>
      </li>
      <li>
        <p><strong>Main Track</strong></p>
        <code>{{ mainTrack }}</code>

        <audio ref="mainTrack" controls>
          <source :src="mainTrack" type="audio/mpeg">
        </audio>
      </li>
      <li>
        <p><strong>Extro Track</strong></p>

        <select :value="extroTrack" @change="setTrack({ type: 'extro', src: $event.target.value })">
          <option v-for="(track, i) in transitionTracks" :key="i">
            {{ track }}
          </option>
        </select>

        <audio ref="extroTrack">
          <source :src="extroTrack" type="audio/mpeg">
        </audio>
      </li>
    </ol>


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
import { mapGetters, mapMutations } from 'vuex';

const defaultOptions = {
  zoomWaveformColor: '#e2172d',
}

export default {
  props: {
    mainTrack: {
      type: String,
      required: true
    },
    dataFile: {
      type: String,
      required: true
    },
    transitionTracks: Array
  },

  data () {
    return {
      // I make the decision to not track the Peaks instance as a reactive property
      // Vue recommend to store only "plain value", and Peaks isn't
      // Cf. https://vuejs.org/v2/api/#data
      // _peaks: null,
    }
  },

  // Temporal data (points and segments) are store in a store (Vuex for instance)
  // We will subscribe to its changes to keep Peaks in sync with our reactive data
  computed: {
    ...mapGetters('programme', ['cues', 'introTrack', 'extroTrack'])
  },

  mounted () {
    this.$nextTick(() => {
      // We store the Peaks instance when the DOM is ready
      this._peaks = Peaks.init({
        ...defaultOptions,
        mediaElement: this.$refs.mainTrack,
        dataUri: {
          arraybuffer: this.$props.dataFile
        },
        containers: {
          overview: this.$refs.overview,
          zoomview: this.$refs.zoomview
        }
      }, this.onWaveformLoaded)
    })
  },

  destroyed () {
    this._peaks.destroy()
  },

  methods: {
    onWaveformLoaded (error, peaks) {
      if (error) {
        throw new Error(error)
      }

      // We add store-based events into peak on load
      this.cues.forEach(cue => peaks.points.add(cue))

      // We listen to Peaks points within the Vue.js app
      peaks.on('points.dragmove', ({ id, time:newTime }) => {
        const time = parseFloat(newTime.toFixed(4))
        this.$store.commit('programme/cueUpdate', { id, time })
      })

      // We keep track of the current time
      peaks.on('player.timeupdate', (time) => {
        this.$store.commit('programme/setCurrentTime', time)
      })

      // When a new point is added, we sync it back to Peaks
      this.$store.subscribe(({ type, payload }, state) => {
        if (type === 'programme/cueAdd') {
          peaks.points.add(payload)
        }
      })
    },

    ...mapMutations('programme', ['setTrack'])
  }
}
</script>

<style scoped>
.tracks {
  list-style: none;
  margin-left: 1.5em;
  padding: 0;
}
.tracks > li {
  margin-bottom: 1em;
}
.tracks p {
  margin: 0 0 .5em;
}
.tracks audio  {
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
