<template>
  <div>
    <ol class="tracks">
      <li>
        <p><strong>Intro Track</strong></p>

        <select :value="introTrack" @change="setTrack({ type: 'intro', src: $event.target.value })">
          <option value="" />
          <option v-for="(track, i) in transitionTracks" :key="i">
            {{ track }}
          </option>
        </select>

        <audio ref="introTrack" v-if="introTrack">
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
          <option value="" />
          <option v-for="(track, i) in transitionTracks" :key="i">
            {{ track }}
          </option>
        </select>

        <audio ref="extroTrack" v-if="extroTrack">
          <source :src="extroTrack" type="audio/mpeg">
        </audio>
      </li>
    </ol>


    <div class="peaks-container">
      <div class="waveform waveform--small" ref="overview"></div>
      <div class="waveform" ref="zoomview"></div>
    </div>

    <ul class="timed-events">
      <li v-for="point in points" :key="point.id" class="point" :style="'--bg-color: ' + point.color">
        <header>
          <strong class="point__title clickable" @click="setPointAtCurrentTime(point.id)">{{ point.labelText }}</strong>

          <span v-if="point.removable" @click.stop="removePoint(point.id)" aria-label="Delete">🗑</span>
        </header>

        <time :datetime="point.time">{{ point.time }}</time>
      </li>
    </ul>
  </div>
</template>

<script>
import { init } from 'peaks.js';
import { PointMarker } from '../peaks/markers.js'
import { mapGetters, mapMutations } from 'vuex';

const defaultOptions = {
  highlightOffset: 0,
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
      _peaks: null,
    }
  },

  // Temporal data (points and segments) are store in a store (Vuex for instance)
  // We will subscribe to its changes to keep Peaks in sync with our reactive data
  computed: {
    ...mapGetters('programme', ['points', 'introTrack', 'extroTrack'])
  },

  mounted () {
    this.$nextTick(() => init({
      ...defaultOptions,
      mediaElement: this.$refs.mainTrack,
      dataUri: {
        arraybuffer: this.$props.dataFile
      },
      containers: {
        overview: this.$refs.overview,
        zoomview: this.$refs.zoomview
      },
      createPointMarker: (options) => new PointMarker({
        ...options,
        fontSize: 14,
        fontStyle: 'bold'
      }),
    }, this.onWaveformLoaded))
  },

  destroyed () {
    this._peaks.destroy()
  },

  methods: {
    play (ref) {
      this.$refs[ref].play()
    },

    setPointAtCurrentTime (id) {
      const time = this._peaks.player.getCurrentTime()
      const point = this._peaks.points.getPoint(id)

      point.update({ time, editable: true })
      this.$store.commit('programme/updatePoint', { id, time })
    },

    onWaveformLoaded (error, peaks) {
      if (error) {
        throw new Error(error)
      }

      // We store the Peaks instance when the DOM is ready
      this._peaks = peaks

      // We add store-based events into peak on load
      this.points.forEach(point => peaks.points.add({
        ...point,
        editable: true,
        draggable: true,
        lineWidth: 3
      }))

      // We listen to Peaks points change within the Vue.js app
      peaks.on('points.dragmove', ({ id, time:newTime }) => {
        const time = parseFloat(newTime.toFixed(3))
        this.$store.commit('programme/updatePoint', { id, time })
      })

      // We keep track of the current time
      peaks.on('player.timeupdate', (time) => {
        this.$store.commit('programme/setCurrentTime', time)
      })

      // When a new point is added, we sync it back to Peaks
      this.$store.subscribe(({ type, payload }) => {
        if (['programme/addPoint', 'programme/addPoints'].includes(type)) {
          peaks.points.add(payload)
        }
      })

      // When a new point is remove, we sync it back to Peaks
      this.$store.subscribe(({ type, payload: pointId }) => {
        if (type === 'programme/removePoint') {
          peaks.points.removeById(pointId)
        }
      })

      // We remove the X-Axis in the Overview
      peaks.views.getView('overview')._axisLayer.remove()
    },

    selectPoint (id) {
      const { time } = this._peaks.points.getPoint(id)
      this._peaks.player.seek(time)
    },

    ...mapMutations('programme', ['setTrack', 'removePoint'])
  }
}
</script>

<style scoped>
.tracks {
  display: flex;
  justify-content: space-between;
  list-style: none;
  margin-left: 0;
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
  margin: .5em 0;
}

.waveform--small {
  flex: 0 0 25%;
}

.clickable {
  cursor: pointer;
}

.timed-events {
  display: flex;
  list-style: none;
  justify-content: center;
  gap: 1em;
  margin: 1em 0;
  padding: 0;
}

.point {
  flex: 1 0 auto;
  border: 1px solid var(--bg-color);
}

.point > header {
  background-color: var(--bg-color);
  display: flex;
  justify-content: space-between;
}

.point > header .point__title {
  flex-grow: 1;
}

.point > header,
.point time {
    padding: .5em .25em;
}

.point time {
  font-family: monospace;
}
</style>
