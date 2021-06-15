import Vue from 'vue'

export default {
  namespaced: true,

  state: () => ({
    cues: [
      {
        editable: true,
        time: 0.10,
        labelText: 'Début',
        id: 'start',
        color: 'hsl(171, 100%, 41%)'
      },
      {
        editable: true,
        time: 3.00,
        labelText: 'Fondu entrant',
        id: 'fade-in',
        color: 'hsl(217, 71%, 53%)'
      },
      {
        editable: true,
        time: 0.00,
        labelText: 'Fondu sortant',
        id: 'fade-out',
        color: 'hsl(48, 100%, 67%)'
      },
      {
        editable: true,
        time: 6.00,
        labelText: 'Mix',
        id: 'mix',
        color: 'hsl(0, 0%, 48%) 	'
      },
      {
        editable: true,
        time: 12.00,
        labelText: 'Fin',
        id: 'end',
        color: 'hsl(48, 100%, 67%)'
      }
    ]
  }),

  getters: {
    cues (state) {
      return state.cues
    }
  },

  mutations: {
    // Find and merge an existing cue with newly provided data
    cueUpdate (state, payload) {
      const index = state.cues.findIndex(({ id }) => id === payload.id)

      Object.entries(payload).forEach(([key, value]) => {
        Vue.set(state.cues[index], key, value)
      })
    }
  }
}
