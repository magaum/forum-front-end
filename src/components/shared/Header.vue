<template>
  <div>
    <b-navbar toggleable="lg" class="forum-navbar">
      <b-navbar-toggle target="responsive-transiction"/>

      <b-collapse is-nav id="responsive-transiction">
        <b-navbar-nav>
          <b-nav-item>
            <router-link class="forum-navbar-item" to="/topics">Topicos</router-link>
          </b-nav-item>
          <b-nav-item>
            <router-link class="forum-navbar-item" to="/rules">Regras do forum</router-link>
          </b-nav-item>
          <b-nav-item>
            <router-link v-if="!isAuthenticated" class="forum-navbar-item" to="/">Login</router-link>
          </b-nav-item>
          <b-nav-item>
            <router-link
              v-if="isAuthenticated"
              class="forum-navbar-item"
              to="/add/topic"
            >Criar tópico</router-link>
          </b-nav-item>
          <b-nav-item>
            <router-link
              @click.native="toUserTopics"
              v-if="isAuthenticated"
              class="forum-navbar-item"
              to="#"
            >Meus tópicos</router-link>
          </b-nav-item>
          <b-nav-item>
            <router-link
              v-if="isAuthenticated"
              @click.native="logout"
              class="forum-navbar-item"
              to="#"
            >Logout</router-link>
          </b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="my-1 ml-auto">
          <b-nav-form v-on:submit.prevent>
            <b-form-input
              @focus="changeScreen"
              v-on:input.native="filter = $event.target.value"
              v-on:keyup.enter="search"
              style="width:500px"
              max="300"
              id="pesquisar"
              size="sm"
              class="my-1 mr-sm-2"
              type="text"
              placeholder="Pesquisar por nome ou assunto de topicos"
            />
          </b-nav-form>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import auth from "../../jwt-auth/";
export default {
  created() {
    this.$eventHub.$on("enableLogout", isAuthenticated =>
      this.checkAuthentication(isAuthenticated)
    );
  },
  beforeDestroy() {
    this.$eventHub.$off("enableLogout");
  },
  data() {
    return {
      isAuthenticated: false,
      filter: ""
    };
  },
  methods: {
    checkAuthentication(isAuthenticated) {
      this.isAuthenticated = isAuthenticated;
    },
    search() {
      this.$eventHub.$emit("filterTopics", this.filter);
    },
    changeScreen() {
      this.$router.push("/topics");
    },
    toUserTopics() {
      this.$router.push("/" + localStorage.getItem("username") + "/topics");
    },
    logout() {
      auth.logout(this);
    }
  }
};
</script>

<style scoped>
.forum-navbar {
  /* #9191E9 */
  background-color: #17a2b8;
}
.forum-navbar .forum-navbar-item {
  padding: 0.5em;
  color: white;
  font-weight: bold;
  text-decoration: none;
}
</style>
