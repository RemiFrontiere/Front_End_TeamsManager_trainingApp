<template>
  <v-app v-if="isInitialized" class="app">
    <v-toolbar fixed height="60" dark color="primary">
      <div class="v-toolbar-side-icon"><v-img src="@/assets/img/logo01.png"></v-img></div>

      <v-toolbar-title>
        <v-img class="logoTitle" src="@/assets/img/logo02.png"></v-img>
        <div class="textTitle">{{ $t("0001") }}</div></v-toolbar-title
      >
      <v-spacer></v-spacer>

      <!-- Visible seulement pour les écrans au dessus de 960px de largeur  -->
      <div class="rightContent hidden-sm-and-down">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon>mdi-bell</v-icon>
            </v-btn>
          </template>
          <span>{{ $t("0006") }}</span>
        </v-tooltip>
        <div class="userInfo">
          <v-menu offset-y open-on-hover>
            <template v-slot:activator="{ on, attrs }">
              <v-btn class="ma-2 buttonContainer"
                text
                v-bind="attrs"
                v-on="on">
                <div class="content">
                  <div class="textContainer">
                    <div class="topContainer">
                      <div class="name">Clarke B.</div>
                      <v-icon>mdi-menu-down</v-icon>
                    </div>
                  </div>
                  <div class="role">DRH</div>
                </div>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(item, index) in menuItems"
                :key="index"
              >
                <v-list-item-title>{{ $t(item.i18nText) }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-avatar>
            <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John" />
          </v-avatar>
        </div>
      </div>

      <!-- Bouton/Avatar visible seulement pour les petits écrans de largeur max de 960px -->
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn class="avatarButton hidden-md-and-up"
            text
            v-bind="attrs"
            v-on="on">
            <v-avatar>
              <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John" />
            </v-avatar>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item, index) in menuItems"
            :key="index"
          >
            <v-list-item-title>{{ $t(item.i18nText) }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

    </v-toolbar>
    <v-navigation-drawer
      color="secondary"
      dark
      mini-variant
      mini-variant-width="60"
      permanent
      class="appNavDrawer"
    >
      <v-tooltip right v-for="(item, i) in drawerItems" :key="i">
        <template v-slot:activator="{ on, attrs }">
          <v-list-item
            class="px-2 drawerListItem"
            :to="item.link"
            link
            v-bind="attrs"
            v-on="on"
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
          </v-list-item>
        </template>
        <span>{{ $t(item.i18nText) }}</span>
      </v-tooltip>

      <!-- Bouton notification visible seulement pour les petits écrans de largeur max de 960px -->
      <v-tooltip right>
        <template v-slot:activator="{ on, attrs }">
          <v-list-item
            class="px-2 hidden-md-and-up"
            v-bind="attrs"
            v-on="on"
          >
            <v-list-item-action>
              <v-icon>mdi-bell</v-icon>
            </v-list-item-action>
          </v-list-item>
        </template>
        <span>{{ $t("0006") }}</span>
      </v-tooltip>
      <v-list-item class="px-2 bottomPageIcon">
        <v-list-item-action>
          <v-icon>mdi-help-circle</v-icon>
        </v-list-item-action>
      </v-list-item>
    </v-navigation-drawer>
    <v-main class="mainApp">
      <router-view></router-view>

     <!-- Snackbar -->
      <v-snackbar v-model="showSnackbar" :color="colorSnackbar" bottom> {{ textSnackbar }} </v-snackbar>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'App',
  data: () => ({
    isInitialized: false,
    drawer: false,
    drawerItems: [
      {
        icon: 'mdi-account-box',
        i18nText: '0002',
        link: '/management'
      },
      {
        icon: 'mdi-forum',
        i18nText: '0003',
        link: '/messaging'
      },
      {
        icon: 'mdi-chart-box',
        i18nText: '0004',
        link: '/dashboard'
      }
    ],
    menuItems: [
      { i18nText: '0044' },
      { i18nText: '0045' }
    ],
    // SNACKBAR_ELEMENT
    showSnackbar: false,
    colorSnackbar: '',
    textSnackbar: ''
  }),
  components: {
  },
  created () {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'SHOW_MESSAGE') {
        this.textSnackbar = mutation.payload.text
        this.colorSnackbar = mutation.payload.color
        this.showSnackbar = true
      }
    })
  },
  mounted: function () {
    this.$i18n.locale = 'fr'
    this.isInitialized = true
  },
  methods: {
  }
})
</script>

<style lang="scss">
@import "@/assets/styles/main.scss";

.app{
  .v-navigation-drawer--mini-variant {
    width: 60px !important;
    height: calc(100vh - 60px) !important;
  }
  .v-toolbar__content {
    padding: 14px 18px;
  }
  .v-toolbar-side-icon {
    height: 35px;
    width: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 2px;
    margin-right: 35px;
  }
  .appNavDrawer .v-list-item {
    height: 70px;
    border-bottom: 1px solid #ffffff;
    border-left: 1px solid #2c405a;
  }
  .appNavDrawer .v-list-item {
    height: 70px;
    border-bottom: 1px solid #ffffff;
    border-left: 1px solid #2c405a;
  }
  .v-list-item.drawerListItem.v-list-item--active {
    border-left: 1px solid #81c926 !important;
  }
  .v-list-item.bottomPageIcon {
    position: absolute !important;
    bottom: 0;
    width: 100%;
    border-bottom: 0;
  }
  .v-toolbar__title {
    display: flex;
    justify-content: center;
    align-items: center;

    .logoTitle {
      height: 30px;
      width: 30px;
      margin-right: 4px;
    }
    .textTitle {
      width: 120px;
      text-transform: uppercase;
      font-family: "Polentical_Neon_Regular";
      white-space: normal !important;
      line-height: 0.9 !important;
      font-size: 16px !important;
    }
    // Pour réduire la taille de la police en fonction des tailles d'écran
    @media screen and (max-width: 960px) {
      .textTitle {
        font-size: 14px !important;
      }
    }
    @media screen and (max-width: 700px) {
      .textTitle {
        font-size: 12px !important;
      }
      button.avatarButton{
        height: 40px !important;
        width: 40px !important;
      }
    }
  }
  .rightContent{
    display: flex;
    justify-content: center;
    align-items: center;

    .userInfo {
      display: flex;
      justify-content: center;
      align-items: center;

      button.buttonContainer {
        margin: 0 15px 0 0 !important;
        text-transform: none;
        .content {
          .name {
            font-size: 14px;
          }
          .role {
            font-size: 12px;
            opacity: 0.7;
            font-family: "OpenSans-Light";
            text-align: left;
          }
          i {
            font-size: 25px !important;
            margin-left: 10px;
          }
        }
      }
      .textContainer {
        .topContainer {
          display: flex;
          align-items: center;
        }
      }
    }
  }

  button.avatarButton{
    margin: 0 !important;
    padding: 0 !important;
    height: 48px !important;
  }
  @media screen and (max-width: 700px) {
    button.avatarButton{
      height: 40px !important;
      width: 40px !important;
      min-width: 40px !important;

      .v-avatar{
        height: 40px !important;
        width: 40px !important;
      }
    }
  }

  main.v-main.mainApp {
    position: absolute;
    width: calc(100% - 60px);
    height: calc(100% - 60px);
    right: 0;
    bottom: 0;
  }

}
</style>
