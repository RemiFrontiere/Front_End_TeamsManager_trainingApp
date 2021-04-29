<template>
  <div class="teamsBoard">
    <v-container class="teamBoardContainer" v-if="teamArray && teamArray.length">
          <div class="teamBoardTableContainer">

            <!-- Bouton "Ajouter un utilisateur" toujours en positon absolute en haut à droite -->
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn class="addUserBtn" text v-bind="attrs" v-on="on" @click="dialogCreateTeam = true">
                  <v-icon
                    left
                    color="#0093EE"
                  >
                    mdi-plus
                  </v-icon>
                  {{ $t("0008") }}
                </v-btn>
              </template>
              <span>{{ $t("0009") }}</span>
            </v-tooltip>

            <v-data-table
              :headers="headers"
              :items="teamArrayForTable"
              :items-per-page="10"
              show-select
              hide-default-header
              :mobile-breakpoint="0"
              :footer-props="{
                'items-per-page-text': $t('0040')
              }"
              class="elevation-1 teamBoardTable"
            >
              <template v-slot:[`header`]="{ props  }">
                <thead class="v-data-table-header">
                  <tr>
                    <th role="columnheader" scope="col" class="text-start" :class="{ 'specialHeader': head.value === 'name'}" :width="head.width" v-for="head in props.headers" :key="head.i18nText + randomDivKey()"><span>{{ $t(head.i18nText) }}</span></th>
                  </tr>
                </thead>
              </template>
              <template v-slot:[`item.data-table-select`]="{ item  }">
                <v-simple-checkbox v-model="item.active" @click="onCheckboxClicked(item)"></v-simple-checkbox>
              </template>
              <template v-slot:[`item.actions`]="{ item }">
                <div :class="{'forTopParent': item.child && item.child.length > 0}">
                  <v-icon
                    class="mr-2"
                    @click="updateTeam(item.id)"
                  >
                    mdi-dots-vertical
                  </v-icon>
                </div>
              </template>
              <template v-slot:[`item.name`]="{ item }">
                <div class="itemContainer">

                  <!-- On affiche "x membres" seulement si ce n'est pas une équipe parente -->
                  {{ item.name }} <small v-if="getNumberOfUser(item) > 0 && item.child.length === 0">[&#8239;{{ getNumberOfUser(item) }} <span class="hidden-sm-and-down">{{ $t('0037') }}</span>&#8239;]</small>
                  <template v-if="item.child && item.child.length > 0">
                    <div class="childContainer">
                      <div class="childElement" v-for="(childA, i) in item.child" :key="i + randomDivKey()">
                        <div class="childElementRow">
                          <v-checkbox color="#0093EE"
                            v-model="childA.active" @click="onCheckboxClicked(childA)"
                          ></v-checkbox>
                          {{ childA.name }} <small v-if="getNumberOfUser(childA) > 0 && childA.child.length === 0">[&#8239;{{ getNumberOfUser(childA) }} <span class="hidden-sm-and-down">{{ $t('0037') }}</span>&#8239;]</small>
                          <v-icon
                            class="mr-2 updateIcon"
                            @click="updateTeam(childA.id)"
                          >
                            mdi-dots-vertical
                          </v-icon>
                        </div>
                        <div>
                          <template v-if="childA.child && childA.child.length > 0">
                            <div class="childElement secondChildElement" v-for="(childB, i) in childA.child" :key="i + randomDivKey()">
                              <div class="childElementRow">
                                <v-checkbox color="#0093EE"
                                  v-model="childB.active" @click="onCheckboxClicked(childB)"
                                ></v-checkbox>
                                {{ childB.name }} <small v-if="getNumberOfUser(childB) > 0">[&#8239;{{ getNumberOfUser(childB) }} <span class="hidden-sm-and-down">{{ $t('0037') }}</span>&#8239;]</small>
                                <v-icon
                                  class="mr-2 updateIcon"
                                  @click="updateTeam(childB.id)"
                                >
                                  mdi-dots-vertical
                                </v-icon>
                              </div>
                            </div>
                          </template>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </template>
            </v-data-table>
        </div>
    </v-container>
    <UpdateTeamDialog :dialog="dialogUpdateTeam" :currentTeam="dialogUpdateTeamData"  @close="dialogUpdateTeam = false" />
    <CreateTeamDialog :dialog="dialogCreateTeam" @close="dialogCreateTeam = false" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CreateTeamDialog from '@/components/Dialogs/CreateTeamDialog.vue'
import UpdateTeamDialog from '@/components/Dialogs/UpdateTeamDialog.vue'
import { IUser, ITeam } from '@/types/index'
import { Ripple } from 'vuetify/lib/directives'
import { globalFunction } from '@/globalFunction'

export default Vue.extend({
  name: 'TeamsBoard',
  props: ['teamArray'],
  directives: {
    Ripple
  },
  data: () => ({
    headers: [
      {
        i18nText: '0010',
        value: 'name',
        width: 'calc(100% - 40px)'
      },
      {
        i18nText: '',
        value: 'actions',
        width: '40px'
      }
    ],
    dialogCreateTeam: false,
    dialogUpdateTeam: false,
    dialogUpdateTeamData: {} as ITeam,
    teamArrayForTable: [] as any[] // Les Equipes formattés avec les sous-equipes
  }),
  components: {
    CreateTeamDialog,
    UpdateTeamDialog
  },
  watch: {
    teamArray: {
      immediate: true,
      deep: true,
      handler () {
        this.teamArrayForTable = this.teamArray.filter((team:ITeam) => team.parent === null)
          .map((team:ITeam) => {
            return {
              id: team.id,
              name: team.name,
              active: team.active,
              child: this.getChild(team.id)
            }
          })
      }
    },
    teamArrayForTable: {
      immediate: true,
      deep: true,
      handler () {
        // console.log(this.teamArrayForTable)
        this.$emit('someChanges')
      }
    }
  },
  methods: {
    /**
   * Retourne les sous-équipes d'une autre équipe
   *
   * @param teamId - l'Id d'un objet Equipe
   * @returns Une liste de sous-équipes
   *
   */
    getChild (teamId:string) : Array<any> {
      var child: any[] = []
      this.teamArray.forEach((team:ITeam) => {
        if (team.parent === teamId) {
          child.push({
            id: team.id,
            name: team.name,
            active: team.active,
            child: this.getChild(team.id)
          })
        }
      })
      return child
    },

    /**
   * Ouvre la Popup de Mise à jour d'une équipe
   *
   * @param teamId - Id d'un objet Utilisateur
   *
   */
    updateTeam (teamId:string) {
      this.dialogUpdateTeamData = this.$store.state.teams.find((team:ITeam) => team.id === teamId)
      this.dialogUpdateTeam = true
    },

    /**
   * Retourne le nombre d'utilisateur affectés à une équipe
   *
   * @param team - un objet Equipe
   * @returns Le nombre d'utilisateur dans une équipe
   *
   */
    getNumberOfUser (team:ITeam) : number {
      var count = 0
      this.$store.state.users.forEach((user:IUser) => {
        if (user && user.teams && user.teams.some(x => x === team.id)) {
          count++
        }
      })
      return count
    },

    /**
   * Retourne un id random pour une Div
   *
   */
    randomDivKey () : string {
      return globalFunction.makeId(10)
    },

    /**
   * Met à jour l'état de l'équipe dans le store ( pour la recherche d'utilisateurs par equipe cochée )
   *
   * @param team - un objet Equipe
   *
   */
    onCheckboxClicked (team:any) {
      if (team) {
        this.$store.state.teams.find((teamX:ITeam) => teamX.id === team.id).active = team.active
        // if (team.child) {
        //   team.child.forEach((child : any) => {
        //     this.$store.state.teams.find((teamY:ITeam) => teamY.id === child.id).active = team.active
        //   })
        // }
      }
    }
  }
})
</script>

<style lang="scss" scoped>
  .teamsBoard{
    height: 100%;

    .teamBoardContainer{
      height: 100%;

      .teamBoardTableContainer{
        max-height: calc(100% - 50px);
        font-family: "OpenSans-Light";
        text-transform: none;
        font-size: 12px;
        font-weight: bold;
        letter-spacing: 0;
        position: relative;
        color: #3F536E;
        position: relative;

        .teamBoardTable{
          ::v-deep thead.v-data-table-header{
            letter-spacing: 1.7px;
            text-transform: uppercase;

            span{
              color: #8DABC4;
              font-family: 'OpenSans-Light';
              font-size: 11px;
            }
          }

          ::v-deep .v-simple-checkbox {
            position: absolute;
            top: 17px;
          }
          .forTopParent{
            position: absolute;
            top: 17px;
          }
          .itemContainer{
            padding: 16px 0 16px 0;

            .childContainer{
              margin-bottom: 5px;
              .childElement{
                margin-top: 13px;

                .secondChildElement{
                  margin-left: 30px;
                }
                .childElementRow{
                  display: flex;
                  align-items: center;

                  small {
                    margin-left: 4px;
                  }
                  .updateIcon{
                    position: absolute;
                    right: 17px;
                    z-index: 5;
                  }
                  .v-input--checkbox{
                    margin-top: 0;
                    padding-top: 0;
                    height: 25px;
                  }
                }
              }
            }
          }

          ::v-deep i.v-icon.mdi.mdi-checkbox-marked {
            color: #0093EE;
          }
          ::v-deep i.v-icon.mdi.mdi-checkbox-blank-outline {
            color: #C5D9E8;
          }
          ::v-deep .v-data-table tbody tr.v-data-table__selected {
            background: transparent;
          }
        }

        button.v-btn.addUserBtn{
          color: #3F536E;
          font-family: "Heebo-Regular";
          text-transform: none;
          font-size: 13px;
          letter-spacing: 0;
          position: absolute;
          z-index: 5;
          right: 0;
          height: 48px;
        }

        ::v-deep .v-data-footer{
          border-top: none !important
        }
        .v-data-table {
          color: #3F536E;
        }
        .v-data-table.teamBoardTable.v-data-table--has-bottom {
          box-shadow: none !important;

          ::v-deep tbody{

            tr{
              height: 60px;

              td {
                border-bottom: thin solid #C5DBEA !important;
              }
              td:first-child {
                position: relative;
                border-left: 1px solid #C5DBEA;
              }
              td:last-child {
                position: relative;
                border-right: 1px solid #C5DBEA;
              }
            }
            tr:first-child
            {
              td {
                border-top: 1px solid #C5DBEA;
              }
              td:first-child {
                border-top-left-radius:  5px;
              }
              td:last-child {
                border-top-right-radius:  5px;
              }
            }
            tr:last-child
            {
              td:first-child {
                border-bottom-left-radius:  5px;
              }
              td:last-child {
                border-bottom-right-radius:  5px;
              }
            }
          }
          ::v-deep thead{

            .specialHeader{
              position: absolute;
              top: 0;
              left: 0;
              display: flex;
              align-items: center;
            }
            th {
              border-bottom: 0;
              box-shadow: none !important;
            }
          }
        }
      }
    }
  }
</style>
