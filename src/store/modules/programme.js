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
    points: []
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
    points (state) {
      return state.points.sort((a, b) => a.time - b.time)
    }
  },

  mutations: {
    // Find and merge an existing cue with newly provided data
    updatePoint (state, payload) {
      const index = state.points.findIndex(({ id }) => id === payload.id)

      Object.entries(payload).forEach(([key, value]) => {
        Vue.set(state.points[index], key, value)
      })
    },

    removePoint (state, id) {
      const index = state.points.findIndex((point) => point.id === id)

      Vue.delete(state.points, index)
    },

    addPoint (state, point) {
      state.points = [...state.points, point]
    },

    addPoints (state, points) {
      state.points = [...state.points, ...points]
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
