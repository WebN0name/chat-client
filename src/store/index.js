import Vue from 'vue'
import Vuex from 'vuex'
import connect from '@vkontakte/vkui-connect-promise'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    friends: [],
    userId: Number,
    userQs: '',
    dialogs: [],
    friendInfo: [],
    friendId: Number,
    chatId: ''

  },
  mutations: {
    Set_Friends (state, friends) {
      state.friends = friends
    },

    Set_Id (state, tmp) {
      state.userId = Number(tmp)
    },

    Set_Qs (state, tmp) {
      state.userQs = String(tmp)
    },

    Set_Dialogs (state, data) {
      state.dialogs = data
    },

    Set_friendInfo (state, data) {
      state.friendInfo = data
    }
  },
  actions: {
    async Fetch_Friends () {
      try {
        await connect.send('VKWebAppGetAuthToken', { app_id: 7339757, scope: 'friends' })
          .then(async r => {
            var token = r.data.access_token
            await connect
              .send('VKWebAppCallAPIMethod', {
                method: 'friends.get',
                params: {
                  v: '5.103',
                  fields: 'photo_200',
                  access_token: token
                }
              }).then(r => {
                var friends = r.data.response.items
                friends.sort((a, b) => {
                  if (a.first_name > b.first_name) {
                    return 1
                  }
                  if (a.first_name < b.first_name) {
                    return -1
                  }
                  return 0
                })
                friends = friends.filter(value => value.first_name !== 'DELETED')
                this.commit('Set_Friends', friends)
              })
          })
      } catch (error) {
        console.log(error)
      }
    },

    Fetch_Id () {
      var tmp = new URLSearchParams(window.location.search).get('vk_user_id')
      this.commit('Set_Id', tmp)
    },

    Fetch_Qs () {
      var tmp = new URLSearchParams(window.location.search)
      this.commit('Set_Qs', tmp)
    },

    async Fetch_Chats ({ commit }, data) {
      var chatList = data.result.chatList
      var dialogs = []
      for (let i = 0; i < Object.keys(chatList).length; i++) {
        dialogs.push(chatList[i].companion)
      }
      dialogs.reverse()
      dialogs = String(dialogs)
      try {
        await connect.send('VKWebAppGetAuthToken', { app_id: 7339757, scope: 'friends' })
          .then(async r => {
            var token = r.data.access_token
            await connect
              .send('VKWebAppCallAPIMethod', {
                method: 'users.get',
                params: {
                  v: '5.103',
                  user_ids: dialogs,
                  fields: 'photo_200',
                  access_token: token
                }
              }).then(r => {
                var companions = r.data.response
                commit('Set_Dialogs', companions)
              })
          })
      } catch (error) {
        console.log(error)
      }
    },

    async Fetch_Person_By_Id ({ commit }, data) {
      try {
        await connect.send('VKWebAppGetAuthToken', { app_id: 7339757, scope: 'friends' })
          .then(async r => {
            var token = r.data.access_token
            await connect
              .send('VKWebAppCallAPIMethod', {
                method: 'users.get',
                params: {
                  v: '5.103',
                  user_ids: data,
                  fields: 'photo_200',
                  access_token: token
                }
              }).then(r => {
                var person = r.data.response[0]
                commit('Set_friendInfo', person)
              })
          })
      } catch (error) {
        console.log(error)
      }
    }
  },

  getters: {
    filtFriends (state) {
      return state.friends
    }
  },

  modules: {
  }
})
