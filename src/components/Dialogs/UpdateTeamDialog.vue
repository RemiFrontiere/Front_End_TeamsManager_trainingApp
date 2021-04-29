<template>
  <div class="createTeamDialog">
    <v-row justify="center">
      <v-dialog
        :value="dialog"
        persistent
        max-width="600px"
      >
        <v-card>
          <v-card-title>
            <span class="headline">{{ $t("0019") }}</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-form
                ref="form"
                v-model="valid"
                lazy-validation
              >
                <v-row>
                  <v-col
                    cols="12"
                  >
                    <v-text-field
                      autofocus dense v-model="name" :label="$t('0015')" required :rules="nameRules" prepend-inner-icon="mdi-label"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-select
                      v-model="parent"
                      :items="possibleParentTeams"
                      item-text="name"
                      item-value="id"
                      :menu-props="{ maxHeight: '400' }"
                      :label="$t('0038')"
                      prepend-inner-icon="mdi-account-multiple"
                    ></v-select>
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-select
                      v-model="selectedUsers"
                      :items="usersItems"
                      item-text="name"
                      item-value="id"
                      :menu-props="{ maxHeight: '400' }"
                      :label="$t('0039')"
                      multiple
                      :disabled="isParentTeam()"
                      prepend-inner-icon="mdi-account-multiple"
                    ></v-select>
                  </v-col>
                </v-row>
              </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="error"
              text
              @click="deleteTeam"
            >
              {{ $t("0041") }}
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="#3F536E"
              text
              @click="closeDialog"
            >
              {{ $t("0016") }}
            </v-btn>
            <v-btn
              color="#3F536E"
              text
              :disabled="!valid"
              @click="updateTeam"
            >
              {{ $t("0018") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script lang="ts">
import i18n from '@/i18n'
import Vue from 'vue'
import { ITeam, IUser } from '@/types/index'

export default Vue.extend({
  name: 'UpdateTeamDialog',
  props: ['dialog', 'currentTeam'],
  data: () => ({
    name: '',
    nameRules: [
      (v: any) => !!v || i18n.t('0028')
    ],
    selectedUsers: [] as string[], // Liste d'ID des utilisateurs selectionnés
    usersItems: [] as any[],
    possibleParentTeams: [] as ITeam[], // Equipes pouvant être une équipe parente
    parent: null,
    valid: true
  }),
  watch: {
    dialog: {
      immediate: true,
      deep: true,
      handler () {
        if (this.currentTeam) {
          this.name = this.currentTeam.name
          this.parent = this.currentTeam.parent

          this.selectedUsers = this.$store.state.users.filter((user:IUser) => user.teams.some(x => x === this.currentTeam.id)).map((user:IUser) => user.id)

          this.usersItems = this.$store.state.users.map((user:IUser) => {
            return {
              id: user.id,
              name: user.element.firstname + ' ' + user.element.lastname
            }
          })
          this.possibleParentTeams = this.$store.state.teams.filter((team:ITeam) => team.id !== this.currentTeam.id) // Team parent --> Tout sauf currentTeam lui même
        }
      }
    }
  },
  methods: {
  /**
   * Supprime la Team courrante ( currentTeam )
   *
   */
    deleteTeam () {
      // @ts-ignore
      this.$dialog.confirm(i18n.t('0051'), { okText: i18n.t('0053'), cancelText: i18n.t('0054'), customClass: 'dialogConfirm' })
        .then(() => {
          const index = this.$store.state.teams.findIndex((x:ITeam) => x.id === this.currentTeam.id)

          // On retire l'id de cette team des utilisateurs ( si l'id est present dans user.teams)
          this.$store.state.users.forEach((user:IUser) => {
            const indexOnUserTeams = user.teams.indexOf(this.currentTeam.id)
            if (indexOnUserTeams !== -1) {
              user.teams.splice(indexOnUserTeams, 1)
            }
          })

          if (index > -1) {
            this.$store.state.teams.splice(index, 1)
            this.$store.dispatch('showMessage', { // On envoie la Popup 'Equipe modifié :  [NomEquipe]'
              text: i18n.t('0042'),
              color: '#3f536e'
            })
          }
          this.closeDialog()
        })
    },

    /**
   * Retourne True si currentUser est une Equipe parente
   *
   * @returns Un Boolean - True si currentUser à des équipes enfants
   *
   */
    isParentTeam () : boolean {
      var haveChild = false
      this.$store.state.teams.forEach((team:any) => {
        if (team.parent) {
          if (team.parent === this.currentTeam.id) {
            haveChild = true
          }
        }
      })
      if (haveChild) {
        return true
      }
      return false
    },

    /**
   * Met à jour la Team courrante ( currentTeam )
   *
   */
    updateTeam () {
      if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
        // @ts-ignore
        this.$dialog.confirm(i18n.t('0049'), { okText: i18n.t('0053'), cancelText: i18n.t('0054'), customClass: 'dialogConfirm' })
          .then(() => {
            const team:ITeam = this.$store.state.teams.find((team:ITeam) => team.id === this.currentTeam.id)
            team.name = this.name
            team.parent = this.parent
            console.log('UPDATE', team)

            this.$store.state.users.forEach((user:IUser) => {
            // Pour les utilisateurs qui déjà affectée à cette équipe
              if (user.teams.some(x => x === this.currentTeam.id)) {
              // Si on les a supprimé de cette équipe on leur retire l'id de l'équipe
                if (!this.selectedUsers.some(x => x === user.id)) {
                  const index = user.teams.indexOf(this.currentTeam.id)
                  if (index > -1) {
                    user.teams.splice(index, 1)
                  }
                }
              } else {
              // Si on les a ajouté de cette équipe on leur push l'id de l'équipe
                if (this.selectedUsers.some(x => x === user.id)) {
                  user.teams.push(this.currentTeam.id)
                }
              }
            })

            console.log(this.$store.state.teams)
            this.$store.dispatch('showMessage', {
              text: i18n.t('0035') + this.name,
              color: '#3f536e'
            })
            this.closeDialog()
          })
      }
    },

    /**
   * Ferme la Popup 'Mise à jour Equipe'
   *
   */
    closeDialog () {
      this.$emit('close')
    }
  }
})
</script>

<style lang="scss" scoped>
  .v-card__title{
    font-family: "OpenSans-Light";
    color: #3F536E;
    font-size: 23px;
    letter-spacing: 0;
  }
  button{
    color: #3F536E;
    font-family: "OpenSans-Regular";
  }
</style>
