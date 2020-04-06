import Vue from 'vue'
import Vuex from 'vuex'
import connect from '@vkontakte/vkui-connect-promise'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    friends: [],
    userId: Number,
    userQs: ''
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
                for (let i = 0; i < Object.keys(friends).length - 1; i++) {
                  if (friends[i].first_name === 'DELETED') {
                    delete friends[i]
                  }
                }
                friends.sort(function (a, b) {
                  if (a.first_name > b.first_name) {
                    return 1
                  }
                  if (a.first_name < b.first_name) {
                    return -1
                  }
                  return 0
                })
                console.log(friends)
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
    }
  },
  modules: {
  }
})
