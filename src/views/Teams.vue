<template>
  <div class="teams">
    <v-container class="teamsContainer">
      <v-row>
        <v-col cols="12" md="4">
          <h2 class="viewTitle">{{ $t("0007") }}</h2>
        </v-col>
        <v-col cols="12" md="8">
          <v-text-field
            class="searchtextField" dense v-model="search" :label="$t('0013')" prepend-inner-icon="search" outlined :hint="$t('0046')"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row class="teamsRow">
        <v-col cols="12" md="12" lg="4">
          <TeamsBoard :teamArray="filteredTeams"/>
        </v-col>
        <v-col cols="12" md="12" lg="8">
          <UserBoard :userArray="filteredUsers" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import TeamsBoard from '@/components/TeamsBoard.vue'
import UserBoard from '@/components/UserBoard.vue'
import { ITeam, IUser } from '@/types'

export default Vue.extend({
  name: 'Teams',
  components: {
    TeamsBoard,
    UserBoard
  },
  data: () => ({
    search: '',
    searchTeamArray: [] as Array<ITeam>, // Liste des Equipes après la recherche
    searchUsersArray: [] as Array<IUser> // Liste des Utilisateurs après la recherche
  }),
  mounted () {
    var localStorageRecuperator = {
      teams: [] as ITeam[],
      users: [] as IUser[]
    }
    localStorageRecuperator.teams = JSON.parse(localStorage.getItem('GreatFirmApp_teams') as string) as Array<ITeam>
    localStorageRecuperator.users = JSON.parse(localStorage.getItem('GreatFirmApp_users') as string) as Array<IUser>

    // On vérifie à la création du composant si il existe déjà des données dans le localStorage, si oui on remplace le store par les valeurs récupéré
    if (localStorageRecuperator.teams !== [] && localStorageRecuperator.teams !== null) { this.$store.state.teams = localStorageRecuperator.teams }
    if (localStorageRecuperator.users !== [] && localStorageRecuperator.users !== null) { this.$store.state.users = localStorageRecuperator.users }

    this.searchTeamArray = this.$store.state.teams
    this.searchUsersArray = this.$store.state.users
    console.log('localStorageRecup', localStorageRecuperator)
  },
  computed: {
    /**
   * Retourne les Equipes filtrés avec la zone de recherche
   *
   * @returns Une liste d'équipes filtré
   *
   */
    filteredTeams () : Array<ITeam> {
      return this.searchTeamArray.filter((team:ITeam) => {
        return team.name.toLowerCase().match(this.search.toLowerCase())
      })
    },

    /**
   * Retourne les Utilisateurs filtrés avec la zone de recherche
   *
   * @returns Une liste d'utilisateurs filtré
   *
   */
    filteredUsers () : Array<IUser> {
      return this.searchUsersArray.filter((user:IUser) => {
        return (user.element.firstname.toLowerCase().match(this.search.toLowerCase()) ||
        user.element.lastname.toLowerCase().match(this.search.toLowerCase()) ||
        this.checkIfUserIsInSearchTeam(user) ||
        user.position.toLowerCase().match(this.search.toLowerCase())) && this.checkIfUserIsInActiveTeam(user)
      })
    }
  },
  methods: {
    /**
   * Retourne vrai si l'utilisateur est dans une équipe coché ( active )
   *
   * @returns Un boolean
   *
   */
    checkIfUserIsInActiveTeam (user:IUser) : boolean {
      const activesTeams: string[] = this.$store.state.teams.filter((team:ITeam) => team.active).map((team:ITeam) => team.id)
      if (activesTeams.length === 0) {
        return true
      }

      var isVisible = false
      user.teams.forEach(teamId => {
        if (activesTeams.includes(teamId)) {
          isVisible = true
        }
      })
      return isVisible
    },

    /**
   * Retourne vrai si l'utilisateur est dans une équipe dont le nom est dans la recherche
   *
   * @returns Un boolean
   *
   */
    checkIfUserIsInSearchTeam (user:IUser) : boolean {
      var toReturn = false

      if (user.teams.length === 0) {
        toReturn = false
      }

      user.teams.forEach(teamId => {
        var team = this.$store.state.teams.find((teamX:ITeam) => teamX.id === teamId)
        console.log(team)
        if (team && team.name.toLowerCase().match(this.search.toLowerCase())) {
          console.log('istrue')
          toReturn = true
        }
      })
      return toReturn
    }
  }
})
</script>

<style lang="scss" scoped>
.teams{
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  right: 0;
  padding: 10px 80px 0 90px;
  color: #2C405A;

  .teamsContainer{
    height: 100%;
    overflow: auto;

    ::v-deep .v-text-field__details {
        margin: 0 !important;
    }
    .viewTitle{
      font-size: 23px;
      letter-spacing: 0;
    }
    ::v-deep .v-label {
      color: #3F536E;
    }
    ::v-deep .v-text-field--outlined:not(.v-input--is-focused):not(.v-input--has-state) > .v-input__control > .v-input__slot fieldset {
      color: #C5DBEA;
    }

    .teamsRow{
      .col-md-4.col-12{
        height: 100%;
      }
    }
  }
}

// Pour réduire la du padding englobant l'ensemble en cas de plus petit écran
@media screen and (max-width: 960px) {
  .teams{
    padding: 10px 40px 0 40px;
  }
}
@media screen and (max-width: 800px) {
  .teams{
    padding: 0;
  }
}
</style>
