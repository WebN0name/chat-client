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
            <v-icon @click="sendMessage(userQs, userId, friendId, chatId)">fas fa-arrow-circle-right</v-icon>
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
    sendMessage (userQs, userId, friendId, chatId) {
      this.messages.push(this.msg)
      const date = new Date()
      const data = {
        qs: userQs,
        chatId: chatId,
        message: {
          type: 'text',
          text: this.msg,
          sender: userId,
          date: date,
          visible: true
        }
      }
      this.socket.emit('sendMessage', data)
    },

    getMessages (userQs, chatId) {
      const data = {
        qs: userQs,
        chatId: chatId
      }

      this.socket.emit('getMessages', data)
    },

    userConnectToChat (userQs, userId, chatId) {
      const data = {
        qs: userQs,
        chatId: chatId,
        vk_user_id: userId
      }

      this.socket.emit('userConnectToChat', data)
    }
  },

  async mounted () {
    await this.Fetch_Qs()
    await this.Fetch_Id()
    await this.userConnectToChat(this.userQs, this.userId, this.chatId)
    await this.getMessages(this.userQs, this.chatId)
    this.socket.on('getMessages', (data) => {
      this.messages = data
    })
  }
}
</script>

<style scoped>

</style>
