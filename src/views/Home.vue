<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
    >
    <v-toolbar-title class="d-inline text-center contacts" style="width: 100%">
        <h4>Контакты</h4>
      </v-toolbar-title>

      <div class="search">
        <v-text-field
        label="Поиск"
        :outlined = true
        :dense = true
        v-model="searchContacts"
        ></v-text-field>
      </div>
      <v-list :avatar = true>
          <v-list-item
          v-for="friend in filterContacts"
          :key="friend.id"
          @click="toChat(friend.id)"
          >
             <v-list-item-avatar v-if="avatar">
              <v-img :src="friend.photo_200"></v-img>
            </v-list-item-avatar>
            <v-list-item-title v-html="friend.first_name + ' ' + friend.last_name"></v-list-item-title>
          </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Pentagram</v-toolbar-title>
    </v-app-bar>
    <v-content>

    <!-- Provides the application the proper gutter -->
    <v-container fluid>
        <v-list :avatar = true>
          <v-list-item
          v-for="dialog in this.dialogs"
          :key="dialog.id"
          @click="toDialog(dialog.id)"
          >
             <v-list-item-avatar v-if="avatar">
              <v-img :src="dialog.photo_200"></v-img>
            </v-list-item-avatar>
            <v-list-item-title v-html="dialog.first_name + ' ' + dialog.last_name"></v-list-item-title>
          </v-list-item>
      </v-list>
      <router-view></router-view>
    </v-container>
  </v-content>

  </v-app>
</template>

<script>
import io from 'socket.io-client'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Home',

  data: () => ({
    drawer: null,
    avatar: true,
    socket: {},
    searchContacts: ''
  }),

  created () {
    this.socket = io('https://secret-chat-ts.herokuapp.com/')
  },

  computed: {
    ...mapState(['userId', 'userQs', 'friends', 'dialogs']),
    filterContacts () {
      return this.friends.filter(friend => {
        if (friend.first_name.indexOf(this.searchContacts) !== -1) {
          return true
        }

        if (friend.last_name.indexOf(this.searchContacts) !== -1) {
          return true
        }

        if ((friend.first_name.toLowerCase()).indexOf(this.searchContacts) !== -1) {
          return true
        }

        if ((friend.last_name.toLowerCase()).indexOf(this.searchContacts) !== -1) {
          return true
        }
      })
    }
  },

  methods: {
    ...mapActions(['Fetch_Id', 'Fetch_Qs', 'Fetch_Friends', 'Fetch_Chats', 'Fetch_Person_By_Id']),

    newUser (userQs, userId) {
      const data = {
        qs: userQs,
        vk_user_id: userId
      }
      this.socket.emit('newUser', data)
      this.socket.on('newUser', (data) => {
      })
    },

    getChats (userQs, userId) {
      const data = {
        qs: userQs,
        vk_user_id: userId
      }
      this.socket.emit('getChats', data)
    },

    toChat (friendId) {
      this.$store.state.friendId = friendId
      this.$router.push('Chat')
    },

    toDialog (friendId) {
      this.$store.state.friendId = friendId
      this.$router.push('Dialog')
    }
  },

  async mounted () {
    await this.Fetch_Friends()
    await this.Fetch_Qs()
    await this.Fetch_Id()
    await this.newUser(this.userQs, this.userId)
    await this.getChats(this.userQs, this.userId)
    this.socket.on('getChats', (data) => {
      this.$store.dispatch('Fetch_Chats', data)
    })
  },

  beforeCreate () {
  }
}
</script>

<style scoped>
  .search{
    margin-top: 15px;
    margin-left: 10px;
    margin-right: 10px;
  }
  .contacts{
    margin-top: 10px;
  }
</style>
