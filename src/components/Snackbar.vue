<template>
    <v-snackbar v-model="show" :color="color" :top="'top'">
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn dark text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Snackbar',

  data: () => ({
    show: false,
    color: '',
    text: ''
  }),
  mounted: function () {
    this.$store.subscribe((mutation, state) => {
      console.log(mutation)
    })
  },
  created () {
    this.$store.subscribe((mutation, state) => {
      console.log(mutation)
      if (mutation.type === 'SHOW_MESSAGE') {
        this.text = state.snackbar.text
        this.color = state.snackbar.color
        this.show = true
      }
    })
  }
})
</script>
