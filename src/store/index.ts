import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    teams: [
      {
        id: 'tRdEVOvvwO',
        name: 'Administration',
        active: true,
        parent: null
      },
      {
        id: 'tRdEVOvvwe',
        name: 'Comptabilité',
        active: false,
        parent: null
      },
      {
        id: 'tRdEVOvvwD',
        name: 'Développement',
        active: true,
        parent: null
      },
      {
        id: 'tRddVOvvwO',
        name: 'Finance',
        active: false,
        parent: null
      },
      {
        id: 'tRaEVOvvwO',
        name: 'IT',
        active: true,
        parent: null
      },
      {
        id: 'tRdEeOvvwO',
        name: 'Logistique',
        active: false,
        parent: null
      },
      {
        id: 'tRdEpOvvwO',
        name: 'Europe',
        active: false,
        parent: 'tRdEeOvvwO'
      },
      {
        id: 'tzdEVOvvwO',
        name: 'Asie',
        active: false,
        parent: 'tRdEeOvvwO'
      },
      {
        id: 'tRdEVxvvwO',
        name: 'Team Honk Kong',
        active: false,
        parent: 'tzdEVOvvwO'
      },
      {
        id: 'tRdEXOvvwO',
        name: 'Team Tokyo',
        active: false,
        parent: 'tzdEVOvvwO'
      }
    ],
    users: [
      {
        id: 'tRdEAOvvwO',
        element: {
          avatar: 'https://i.pravatar.cc/100?img=1',
          // name: 'Albert Munch',
          firstname: 'Albert',
          lastname: 'Munch'
        },
        position: 'Responsable des finances et stratégie',
        teams: ['tRdEVOvvwO', 'tRdEpOvvwO']
      },
      {
        id: 'tAdEAOvvwO',
        element: {
          avatar: 'https://i.pravatar.cc/100?img=2',
          firstname: 'Allie',
          lastname: 'Armstrong'
        },
        position: 'Head of marketing and sales',
        teams: ['tRdEVOvvwO']
      },
      {
        id: 'tRdEADvvwO',
        element: {
          avatar: 'https://i.pravatar.cc/100?img=3',
          firstname: 'Frederic',
          lastname: 'Krueger'
        },
        position: 'Team leader',
        teams: ['tRdEVOvvwO', 'tRdEVOvvwD']
      },
      {
        id: 'tAdEAdvvwO',
        element: {
          avatar: 'https://i.pravatar.cc/100?img=4',
          firstname: 'Henry',
          lastname: 'Dunant'
        },
        position: 'Lead engineer',
        teams: ['tRdEVOvvwD']
      },
      {
        id: 'tAeEAdvvwO',
        element: {
          avatar: 'https://i.pravatar.cc/100?img=5',
          firstname: 'Jon',
          lastname: 'Jones'
        },
        position: 'Chef de projet IT',
        teams: ['tRaEVOvvwO']
      },
      {
        id: 'tAeEAdvewO',
        element: {
          avatar: 'https://i.pravatar.cc/100?img=11',
          firstname: 'Kévin',
          lastname: 'McFlo'
        },
        position: 'Comptable',
        teams: ['tRdEVOvvwe']
      },
      {
        id: 'tAeEAevewO',
        element: {
          avatar: 'https://i.pravatar.cc/100?img=8',
          firstname: 'Florian',
          lastname: 'De Coubertin'
        },
        position: 'Gestionnaire Porte-Feuille',
        teams: ['tRddVOvvwO', 'tRdEXOvvwO']
      }
    ]
  },
  actions: {
    showMessage ({ commit }, payload) {
      commit('SHOW_MESSAGE', payload)
    }
  },
  mutations: {
    SHOW_MESSAGE (state:any, payload) {
      state.text = payload.text
      state.color = payload.color
    }
  },
  getters: {
    /**
   * On sauvegarde les modifications dans le localStorage dès qu'on détecte une modification sur teams
   *
   */
    teamsChange: state => {
      localStorage.setItem('GreatFirmApp_teams', JSON.stringify(state.teams))
    },
    /**
   * On sauvegarde les modifications dans le localStorage dès qu'on détecte une modification sur users
   *
   */
    usersChange: state => {
      localStorage.setItem('GreatFirmApp_users', JSON.stringify(state.users))
    }
  },
  modules: {
  }
})
