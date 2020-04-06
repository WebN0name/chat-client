<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
    >
        <Friends />
    </v-navigation-drawer>
    <v-app-bar
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Pentagram</v-toolbar-title>
    </v-app-bar>
  </v-app>
</template>

<script>
import io from 'socket.io-client'
import { mapState } from 'vuex'
import Friends from '../components/Friends'

export default {
  name: 'Home',

  data: () => ({
    drawer: null
  }),

  components: {
    Friends
  },

  computed: {
    ...mapState(['userId', 'userQs'])
  }
}
</script>

<style scoped>
</style>
