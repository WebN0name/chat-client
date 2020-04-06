<template>
  <v-app>
    <router-link :to="'/'"></router-link>
    <router-view></router-view>
  </v-app>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import io from 'socket.io-client'
export default {
  name: 'App',

  data: () => ({
    socket: {}
  }),

  created () {
    this.$vuetify.theme.dark = true
    this.socket = io('https://secret-chat-ts.herokuapp.com/')
  },

  computed: {
    ...mapState(['userQs', 'userId'])
  },

  methods: {
    ...mapActions(['Fetch_Friends', 'Fetch_Id', 'Fetch_Qs']),

    newUser (userQs, userId) {
      const data = {
        qs: this.userQs,
        vk_user_id: this.userId
      }

      this.socket.emit('newUser', data)
      this.socket.on('newUser', (data) => {
        console.log(data)
      })
    }
  },

  async mounted () {
    await this.Fetch_Qs()
    await this.Fetch_Id()
    await this.newUser(this.userQs, this.UserId)
    await this.Fetch_Friends()
  }
}
</script>
