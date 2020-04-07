<template>
    <v-app>
        <v-app-bar app>
            <v-icon @click="goBack()">fas fa-arrow-left</v-icon>
                <v-avatar>
                    <v-img :src="friendInfo.photo_200"></v-img>
                </v-avatar>
                <v-toolbar-title v-html="friendInfo.first_name + ' ' + friendInfo.last_name"></v-toolbar-title>
        </v-app-bar>
        <v-content>
            <v-container fluid>
                <ul>
                    <li v-for="message in messages" :key="message" >
                        <p>{{ message }}</p>
                    </li>
                </ul>
            <router-view></router-view>
            </v-container>
        </v-content>
        <v-footer app fixed="fixed">
            <v-text-field
            label="Сообщение"
            :outlined = true
            :dense = true
            v-model="msg"
            ></v-text-field>
            <v-icon @click="sendMessage()">fas fa-arrow-circle-right</v-icon>
        </v-footer>
    </v-app>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import io from 'socket.io-client'
export default {
  data: () => ({
    socket: {},
    fixed: true,
    messages: [],
    msg: ''
  }),

  created () {
    this.socket = io('https://secret-chat-ts.herokuapp.com/')
  },

  computed: {
    ...mapState(['friendId', 'userQs', 'userId', 'friendInfo', 'chatId'])
  },

  methods: {
    ...mapActions(['Fetch_Qs', 'Fetch_Id', 'Fetch_Person_By_Id']),
    goBack () {
      this.$router.push('/')
    },

    createChat (userQs, userId, friendId) {
      const data = {
        qs: userQs,
        vk_user_id1: userId,
        vk_user_id2: friendId
      }
      this.socket.emit('createChat', data)
      this.socket.on('newChat', (data) => {
        this.$store.dispatch('Fetch_Person_By_Id', data.result.users[1].userId)
        this.$store.state.chatId = data.result._id
      })
    },

    sendMessage (userQs, userId, friendId) {
      this.messages.push(this.msg)
      this.msg = ''

      const data = {

      }
      this.socket.emit('sendMessage', data)
    }
  },

  async mounted () {
    await this.Fetch_Qs()
    await this.Fetch_Id()
    await this.createChat(this.userQs, this.userId, this.friendId)
  }
}
</script>

<style scoped>

</style>
