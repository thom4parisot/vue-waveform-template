import Vue from 'vue'

export default {
  namespaced: true,

  state: () => ({
    // An optional intro track
    introTrack: null,
    // An optional extro track
    extroTrack: null,
    //
    currentTime: 0.00,
    // Main track events
    cues: [
      {
        editable: true,
        time: 0.10,
        labelText: 'Start',
        id: 'start',
        color: 'hsl(171, 100%, 41%)'
      },
      {
        editable: true,
        time: 3.00,
        labelText: 'Fade in',
        id: 'fade-in',
        color: 'hsl(217, 71%, 53%)'
      },
      {
        editable: true,
        time: 0.00,
        labelText: 'Fade out',
        id: 'fade-out',
        color: 'hsl(48, 100%, 67%)'
      },
      {
        editable: true,
        time: 12.00,
        labelText: 'End',
        id: 'end',
        color: 'hsl(48, 100%, 67%)'
      }
    ]
  }),

  getters: {
    currentTime (state) {
      return state.currentTime
    },
    introTrack (state) {
      return state.introTrack
    },
    extroTrack (state) {
      return state.extroTrack
    },
    cues (state) {
      return state.cues.sort((a, b) => a.time - b.time)
    }
  },

  mutations: {
    // Find and merge an existing cue with newly provided data
    cueUpdate (state, payload) {
      const index = state.cues.findIndex(({ id }) => id === payload.id)

      Object.entries(payload).forEach(([key, value]) => {
        Vue.set(state.cues[index], key, value)
      })
    },

    cueAdd (state, payload) {
      state.cues = [...state.cues, payload]
    },

    // We can use `intro` or `extro` as a Type
    setTrack(state, { type, src }) {
      state[`${type}Track`] = src
    },

    setCurrentTime(state, time) {
      state.currentTime = time
    }
  }
}
