<template>
  <div class="management">
    <v-navigation-drawer v-model="drawer" absolute>
      <div class="drawerContainer">
        <v-btn v-if="drawer" icon fab small color="primary" class="opencloseBtn" @click.stop="drawer = !drawer">
          <v-icon>mdi-menu-left</v-icon>
        </v-btn>
        <v-btn v-else icon fab small color="primary" class="opencloseBtn" @click.stop="drawer = !drawer">
          <v-icon>mdi-menu-right</v-icon>
        </v-btn>
        <div v-if="drawer">
          <v-list>
            <v-subheader class="drawerSubHeader">{{ $t("0002") }}</v-subheader>
            <v-tooltip right v-for="(item, i) in drawerItems" :key="i">
              <template v-slot:activator="{ on, attrs }">
                <v-list-item
                  class="px-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-list-item-content>
                      <v-btn depressed class="managementDrawerBtn" active-class="managementDrawerBtnActiveClass" link :to="item.link">
                      {{ $t(item.i18nText) }}
                      <v-icon
                        right
                      >
                        mdi-chevron-right
                      </v-icon>
                    </v-btn>
                  </v-list-item-content>
                </v-list-item>
              </template>
              <span>{{ $t(item.i18nText) }}</span>
            </v-tooltip>
          </v-list>
        </div>
      </div>
    </v-navigation-drawer>
    <v-main class="mainManagement" :class="{ drawerClosed: !drawer }">
      <router-view></router-view>
    </v-main>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class Management extends Vue {
  data () {
    return {
      drawer: true,
      drawerItems: [
        {
          i18nText: '0005',
          link: '/management/teams'
        }
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
.management {
  width: 100%;
  height: 100%;

  aside.v-navigation-drawer.v-navigation-drawer--absolute.v-navigation-drawer--open{
    width: 210px !important;
  }
  aside.v-navigation-drawer.v-navigation-drawer--absolute.v-navigation-drawer--close {
    transform: translateX(0) !important;
    visibility: visible;
    width: 40px !important;
  }

  button.v-btn.opencloseBtn{
    position: absolute;
    top: 20px;
    right: 0;
  }
  .v-subheader.drawerSubHeader{
    letter-spacing: 1.7px;
    margin-top: 10px;
    text-transform: uppercase;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #8DABC4;
  }
  .v-list-item__content{
    display: flex;
    justify-content: center;
    align-items: center;
  }

  // Couleur de fond des boutons "Actif" de la liste dans le drawer
  .managementDrawerBtnActiveClass {
    color: transparent;
  }
  .managementDrawerBtn{
    width: 100%;
    background-color: #ECF5FD;
    font-family: 'OpenSans-Regular' !important;
    text-transform: none;
    font-size: 15px;
    text-align: left;
    justify-content: center;
    align-items: center;
    display: flex;
    height: 42px;
    width: 160px;

    ::v-deep span.v-btn__content{
      display: block;
      color: #3F536E;
    }

    .v-icon{
      position: absolute;
      right: 0;
      color: #A8C6DF;
    }
  }
  .mainManagement{
    position: absolute;
    width: calc(100% - 210px);
    height: 100%;
    top: 0;
    right: 0;
  }

  /*
   Permet de "faire passer" le drawer par dessus le mainContent. Utilisé sur les petits écrans
   pour évitez que tout le contenus se rétracte lors de chaque ouverture du drawer
  */
  @media screen and (max-width: 1250px) {
    .mainManagement{
      min-width: calc(100vw - 60px - 40px);
    }
  }
  .mainManagement.drawerClosed{
    width: calc(100% - 40px);
  }
}
</style>
