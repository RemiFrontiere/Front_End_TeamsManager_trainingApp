<template>
  <div class="userBoard">
    <v-container class="userBoardContainer" v-if="userArray && userArray.length">
        <div class="userBoardTableContainer">

            <!-- Bouton "Ajouter un utilisateur" toujours en positon absolute en haut à droite -->
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn class="addUserBtn" text v-bind="attrs" v-on="on" @click="dialogCreateUser = true">
                  <v-icon
                    left
                    color="#0093EE"
                  >
                    mdi-plus
                  </v-icon>
                  {{ $t("0008") }}
                </v-btn>
              </template>
              <span>{{ $t("0030") }}</span>
            </v-tooltip>

            <!-- Pour les écrans standard -->
            <v-data-table
              :headers="headersNormalScreen"
              :items="userArray"
              :items-per-page="10"
              hide-default-header
              :footer-props="{
                'items-per-page-text': $t('0022')
              }"
              class="elevation-1 userBoardTable hidden-sm-and-down"
            >
              <template v-slot:[`header`]="{ props  }">
                <thead class="v-data-table-header">
                  <tr>
                    <th role="columnheader" scope="col" class="text-start" :width="head.width" v-for="head in props.headers" :key="head.i18nText + randomDivKey()"><span>{{ $t(head.i18nText) }}</span></th>
                  </tr>
                </thead>
              </template>
              <template v-slot:[`item.element`]="{ item }">
                <div class="avatarNameContainer">
                  <img :src="item.element.avatar" :alt="item.lastname" height="25">
                  {{ item.element.firstname }} {{ item.element.lastname }}
                </div>
              </template>
              <template v-slot:[`item.teams`]="{ item }">
                <div class="teamsContainer">
                  <template v-if="item.teams && item.teams.length > 0">
                    <v-chip v-for="teamId in item.teams" :key="teamId + randomDivKey()">{{ getTeamName(teamId) }}</v-chip>
                  </template>
                </div>
              </template>
              <template v-slot:[`item.actions`]="{ item }">
                <div class="">
                  <v-icon
                    class="mr-2"
                    @click="updateUser(item)"
                  >
                    mdi-dots-vertical
                  </v-icon>
                </div>
              </template>
            </v-data-table>

            <!-- Pour les smartphones et petits écrans -->
            <v-data-table
              :headers="headersSmallScreen"
              :items="userArray"
              :items-per-page="10"
              hide-default-header
              :mobile-breakpoint="0"
              :footer-props="{
                'items-per-page-text': $t('0022')
              }"
              class="elevation-1 userBoardTable hidden-md-and-up"
            >
              <template v-slot:[`header`]="{ props  }">
                <thead class="v-data-table-header">
                  <tr>
                    <th role="columnheader" scope="col" class="text-start" :width="head.width" v-for="head in props.headers" :key="head.i18nText"><span>{{ $t(head.i18nText) }}</span></th>
                  </tr>
                </thead>
              </template>
              <template v-slot:[`item.element`]="{ item }">
                <div class="avatarNameContainer">
                  <img :src="item.element.avatar" :alt="item.lastname" height="25">
                  {{ item.element.firstname }} {{ item.element.lastname }}
                </div>
              </template>
              <template v-slot:[`item.actions`]="{ item }">
                <div class="">
                  <v-icon
                    class="mr-2"
                    @click="updateUser(item)"
                  >
                    mdi-dots-vertical
                  </v-icon>
                </div>
              </template>
            </v-data-table>
        </div>
    </v-container>
    <UpdateUserDialog :dialog="dialogUpdateUser" :currentUser="dialogUpdateUserData"  @close="dialogUpdateUser = false" />
    <CreateUserDialog :dialog="dialogCreateUser" @close="dialogCreateUser = false" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CreateUserDialog from '@/components/Dialogs/CreateUserDialog.vue'
import UpdateUserDialog from '@/components/Dialogs/UpdateUserDialog.vue'
import { IUser, ITeam } from '@/types/index'
import { globalFunction } from '@/globalFunction'

export default Vue.extend({
  name: 'UserBoard',
  props: ['userArray'],
  data: () => ({
    // Header à afficher pour écrans standard
    headersNormalScreen: [
      {
        i18nText: '0020',
        value: 'element',
        width: '20%'
      },
      {
        i18nText: '0021',
        value: 'position',
        width: '35%'
      },
      {
        i18nText: '0005',
        value: 'teams',
        width: 'calc(45% - 40px)'
      },
      {
        i18nText: '',
        value: 'actions',
        width: '40px'
      }
    ],
    // Header à afficher pour petits écrans
    headersSmallScreen: [
      {
        i18nText: '0020',
        value: 'element',
        width: 'calc(100% - 40px)'
      },
      {
        i18nText: '',
        value: 'actions',
        width: '40px'
      }
    ],
    dialogCreateUser: false,
    dialogUpdateUser: false,
    dialogUpdateUserData: {} as IUser
  }),
  components: {
    CreateUserDialog,
    UpdateUserDialog
  },
  methods: {

    /**
   * Ouvre la Popup de Mise à jour d'un utilisateur
   *
   * @param user - objet Utilisateur
   *
   */
    updateUser (user:IUser) {
      this.dialogUpdateUserData = user
      this.dialogUpdateUser = true
    },

    /**
   * Retourne le nom de l'équipe passé en paramètre
   *
   * @param teamId - Id d'une Equipe
   *
   */
    getTeamName (teamId:string):string {
      if ((teamId === '') || !(this.$store.state.teams.find((team:ITeam) => team.id === teamId))) { return '' }
      return this.$store.state.teams.find((team:ITeam) => team.id === teamId).name
    },

    /**
   * Retourne un id random pour une Div
   *
   */
    randomDivKey () : string {
      return globalFunction.makeId(10)
    }
  }
})
</script>

<style lang="scss" scoped>
  .userBoard{
    height: 100%;

    .userBoardContainer{
      height: 100%;

      .userBoardTableContainer{
        max-height: calc(100% - 50px);
        font-family: "OpenSans-Light";
        font-size: 12px;
        text-transform: none;
        font-weight: bold;
        letter-spacing: 0;
        position: relative;
        color: #3F536E;

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
        .userBoardTable{
          ::v-deep thead.v-data-table-header{
            letter-spacing: 1.7px;
            text-transform: uppercase;

            span{
              color: #8DABC4;
              font-family: 'OpenSans-Light';
              font-size: 11px;
            }
          }
          .avatarNameContainer{
            display: flex;
            align-items: center;
            height: 100%;
            img{
              border-radius: 5px;
              margin-right: 15px;
            }
          }
          .teamsContainer{
            .v-chip{
              color: #3F536E;
              margin-right: 6px;
              font-size: 10px;
              font-family: "Heebo-Regular";
              font-weight: bold;
              background-color: transparent;
              border: 1px solid #3F536E;
              height: 22px;
            }
          }
        }
        ::v-deep .v-data-footer{
          border-top: none !important
        }
        .v-data-table {
          color: #3F536E;
        }
        .v-data-table.userBoardTable.v-data-table--has-bottom {
          box-shadow: none !important;

          ::v-deep tbody{
            font-family: "Heebo-Regular";
            font-size: 13px;
            tr{
              height: 60px;
              td {
                border-bottom: thin solid #C5DBEA !important;
              }
              td:first-child {
                border-left: 1px solid #C5DBEA;
              }
              td:last-child {
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
