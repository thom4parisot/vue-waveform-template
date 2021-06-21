<template>
  <div>
    <h1>Annotate Audio Waveforms</h1>
    <p>with Vue.js + Peaks.js</p>

    <main>
      <waveform dataFile="test.dat" mainTrack="test.mp3" :transitionTracks="['transitions/Jingle - labo Vestaradio.mp3', 'transitions/jingle vestaradio.mp3']" />

      <fieldset>
        <legend>Add New Cue</legend>

        <form @submit.prevent="createNewCue">
          <label>
            Name
            <input type="text" required v-model="cueName" />
          </label>

          <button>Add at current time</button>
        </form>
      </fieldset>
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
import { mapGetters } from 'vuex';

// Generated from https://colorbrewer2.org/#type=diverging&scheme=RdYlBu&n=6
const COLOR_PALETTE = ['#d73027','#fc8d59','#fee090','#e0f3f8','#91bfdb','#4575b4']

const slugify = (label) => String(label).toLocaleLowerCase().replace(/\s+/g, '-')

const randomColor = () => {
  return COLOR_PALETTE[ Math.floor(Math.random() * COLOR_PALETTE.length) ]
}

export default {
  components: {
    Waveform
  },

  data () {
    return {
      cueName: ''
    }
  },

  computed: {
    ...mapGetters('programme', ['currentTime']),
  },

  methods: {
    createNewCue () {
      this.$store.commit('programme/cueAdd', {
        labelText: this.cueName,
        id: slugify(this.cueName),
        color: randomColor(),
        time: this.currentTime,
        editable: true
      })

      this.cueName = ''
    },
  }
}

</script>
