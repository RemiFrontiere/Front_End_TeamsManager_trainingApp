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
            <span class="headline">{{ $t("0027") }}</span>
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
                    md="6"
                  >
                    <v-text-field
                      autofocus dense v-model="firstname" :label="$t('0032')" required :rules="firstnameRules" prepend-inner-icon="mdi-account"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-text-field
                      autofocus dense v-model="lastname" :label="$t('0024')" required :rules="lastnameRules" prepend-inner-icon="mdi-account"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                  >
                    <v-text-field
                      dense v-model="position" :label="$t('0025')" required :rules="positionRules" prepend-inner-icon="mdi-briefcase"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                  >
                    <v-select
                      v-model="teams"
                      :items="teamsItems"
                      item-text="name"
                      item-value="id"
                      :menu-props="{ maxHeight: '400' }"
                      :label="$t('0026')"
                      multiple
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
              @click="deleteUser"
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
              @click="updateUser"
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
  name: 'UpdateUserDialog',
  props: ['dialog', 'currentUser'],
  data: () => ({
    firstname: '', // Prénom de l'utilisateur
    firstnameRules: [
      (v: any) => !!v || i18n.t('0031')
    ],
    lastname: '', // Nom de l'utilisateur
    lastnameRules: [
      (v: any) => !!v || i18n.t('0028')
    ],
    position: '', // Poste de l'utilisateur
    positionRules: [
      (v: any) => !!v || i18n.t('0029')
    ],
    teams: [] as string[], // Liste d'ID des équipes où l'utilisateur est affecté
    teamsItems: [] as ITeam[], // Equipe à laquelle il est possible d'être affectée
    valid: true
  }),
  watch: {
    dialog: {
      immediate: true,
      deep: true,
      handler () {
        if (this.currentUser && this.currentUser.element) {
          this.firstname = this.currentUser.element.firstname
          this.lastname = this.currentUser.element.lastname
          this.position = this.currentUser.position
          this.teams = this.currentUser.teams

          // On affiche seulement les Equipes qui ne sont pas des Equipes "Parentes"
          this.teamsItems = this.$store.state.teams.map((team:ITeam) => {
            var haveChild = false
            this.$store.state.teams.forEach((teamElem:ITeam) => {
              if (teamElem.parent) {
                if (teamElem.parent === team.id) {
                  haveChild = true
                }
              }
            })
            if (!haveChild) {
              return team
            }
          }).filter((team:ITeam) => team && team.id)
        }
      }
    }
  },
  methods: {
  /**
   * Supprime l'Utilisateur courrant ( currentUser )
   *
   */
    deleteUser () {
      // @ts-ignore
      this.$dialog.confirm(i18n.t('0052'), { okText: i18n.t('0053'), cancelText: i18n.t('0054'), customClass: 'dialogConfirm' })
        .then(() => {
          const index = this.$store.state.users.findIndex((x:IUser) => x.id === this.currentUser.id)
          if (index > -1) {
            this.$store.state.users.splice(index, 1)
            this.$store.dispatch('showMessage', {
              text: i18n.t('0043'),
              color: '#3f536e'
            })
          }
          this.closeDialog()
        })
    },

    /**
   * Met à jour l'Utilisateur courrant ( currentUser )
   *
   */
    updateUser () {
      if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
        // @ts-ignore
        this.$dialog.confirm(i18n.t('0050'), { okText: i18n.t('0053'), cancelText: i18n.t('0054'), customClass: 'dialogConfirm' })
          .then(() => {
            const user:IUser = this.$store.state.users.find((user:IUser) => user.id === this.currentUser.id)
            if (user) {
              user.element.firstname = this.firstname
              user.element.lastname = this.lastname
              user.position = this.position
              user.teams = this.teams
            }
            this.$store.dispatch('showMessage', { // On envoie la Popup 'Utilisateur modifié :  [NomPrenom]'
              text: i18n.t('0034') + this.firstname + ' ' + this.lastname,
              color: '#3f536e'
            })
            this.closeDialog()
          })
      }
    },

    /**
   * Ferme la Popup 'Mise à jour Utilisateur'
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
