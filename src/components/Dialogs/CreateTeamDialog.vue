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
            <span class="headline">{{ $t("0014") }}</span>
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
                      prepend-inner-icon="mdi-account-multiple"
                    ></v-select>
                  </v-col>
                </v-row>
              </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions>
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
              @click="addTeam"
            >
              {{ $t("0017") }}
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
import { globalFunction } from '@/globalFunction'

export default Vue.extend({
  name: 'CreateTeamDialog',
  props: ['dialog'],
  data: () => ({
    name: '', // Nom de l'equipe
    nameRules: [
      (v: any) => !!v || i18n.t('0028')
    ],
    selectedUsers: [] as string[], // Liste d'ID des utilisateurs selectionnés
    usersItems: [] as any[],
    parent: null,
    possibleParentTeams: [] as ITeam[], // Equipes pouvant être une équipe parente
    valid: true
  }),
  watch: {
    dialog: {
      immediate: true,
      deep: true,
      handler () {
        this.name = ''
        this.parent = null
        this.selectedUsers = []

        this.usersItems = this.$store.state.users.map((user:IUser) => {
          return {
            id: user.id,
            name: user.element.firstname + ' ' + user.element.lastname
          }
        })

        this.possibleParentTeams = this.$store.state.teams
      }
    }
  },
  methods: {

    /**
   * Ajout d'une nouvelle équipe
   *
   */
    addTeam () {
      if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
        // @ts-ignore
        this.$dialog.confirm(i18n.t('0047'), { okText: i18n.t('0053'), cancelText: i18n.t('0054'), customClass: 'dialogConfirm' })
          .then(() => {
            const currentTeamId = globalFunction.makeId(10)
            this.$store.state.teams.push(
              {
                id: currentTeamId,
                name: this.name,
                active: false,
                parent: this.parent
              })

            this.selectedUsers.forEach((userId:string) => {
            // Si on les a ajouté de cette équipe on leur push l'id de l'équipe
              if (this.$store.state.users.find((user:IUser) => user.id === userId)) {
                this.$store.state.users.find((user:IUser) => user.id === userId).teams.push(currentTeamId)
              }
            })

            this.$store.dispatch('showMessage', { // On envoie la Popup 'Equipe créé :  [NomEquipe]'
              text: i18n.t('0036') + this.name,
              color: '#3f536e'
            })
            this.closeDialog()
          })
      }
    },

    /**
   * Ferme la Popup 'Création Equipe'
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
