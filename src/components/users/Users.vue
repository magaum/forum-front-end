<template>
  <b-container v-if="user != null" class="container-user">
    <b-row>
      <b-col>
        <b-card bg-variant="light" header="Perfil do usuário" class>
          <b-card-text>{{ user.username }}</b-card-text>
          <b-card-text>{{ user.email }}</b-card-text>
        </b-card>
      </b-col>
      <b-col>
        <b-button
          @click="getAchievements"
          class="achievement-toggle"
          block
          v-b-toggle.collapse1
          variant="primary"
        >Ver conquistas do usuário</b-button>
        <b-collapse id="collapse1" class="mt-2">
          <b-card v-for="achievement in achievements" :key="achievement.name">
            <p class="card-text">
              <label
                v-if="achievement.name == 'points'"
              >{{ achievement.name + ": " + achievement.quantity }}</label>
              <label v-else>
                {{ achievement.name }}
                <font-awesome-icon icon="trophy"/>
              </label>
            </p>
          </b-card>
        </b-collapse>
      </b-col>
    </b-row>
  </b-container>
  <b-container v-else class="container-user">
    <h1>Usuário não encontrado
      <font-awesome-icon icon="sad-cry"/>
    </h1>
  </b-container>
</template>

<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSadCry, faTrophy } from "@fortawesome/free-solid-svg-icons";

// add icons to the page
library.add(faSadCry, faTrophy);

export default {
  created: function() {
    this.$http
      .get("users/" + this.$route.params.id)
      .then(result => {
        this.user = result.data;
      })
      .catch(err => {
        this.user = null;
        console.log(err);
      });
  },
  methods: {
    getAchievements() {
      this.$http
        .get("gamification/" + this.user.username)
        .then(result => {
          this.achievements = result.data;
        })
        .catch(err => {
          this.user = null;
          console.log(err);
        });
    }
  },
  data() {
    return {
      user: {},
      achievements: [
        {
          name: ""
        }
      ]
    };
  }
};
</script>

<style scoped>
* {
  max-width: 20rem;
}

.container-user {
  padding-top: 30px;
}
</style>
