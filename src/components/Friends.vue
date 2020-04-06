<template>
    <v-app>
        <v-toolbar-title class="d-inline text-center contacts" style="width: 100%">
            <h4>Контакты</h4>
        </v-toolbar-title>
        <v-text-field class="search"
        label="Поиск"
        :clearable= true
        :outlined="true"
        >
        </v-text-field>
            <v-list :avatar = true>
         <v-list-item-group>
          <v-subheader style="display: none"></v-subheader>
          <v-list-item
          v-for="friend in friends"
          :key="friend.id"
          @click="toChat(friend.first_name, friend.last_name, friend.photo_200)"
          >
             <v-list-item-avatar v-if="avatar">
              <v-img :src="friend.photo_200"></v-img>
            </v-list-item-avatar>
            <v-list-item-title v-html="friend.first_name + ' ' + friend.last_name"></v-list-item-title>
          </v-list-item>
          </v-list-item-group>
        </v-list>
    </v-app>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data: () => ({
    avatar: true
  }),

  computed: {
    ...mapState(['friends', 'userQs'])
  },

  methods: {
    test () {
      console.log(this.friends)
      console.log(this.userQs)
    }
  },

  mounted () {
    this.test()
  }
}
</script>

<style scoped>
    .contacts{
        margin-top: 10px;
    }

    .search{
        margin-top: 15px !important;
        margin-left: 10px !important;
        margin-right: 10px !important;
    }
</style>
