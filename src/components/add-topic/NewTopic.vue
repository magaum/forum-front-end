<template>
  <b-container>
    <b-container class="padding-10">
      <h1 style="padding:20px">{{ pageSubject }}</h1>
      <b-alert variant="danger" v-if="error.length" show>{{ error }}</b-alert>
      <b-alert variant="success" v-if="message.length" show>{{ message }}</b-alert>
      <!-- topic title -->
      <b-form-input
        v-model="topic.title"
        type="text"
        :state="topicTitleValidation"
        aria-describedby="titleValidation"
        placeholder="Título do tópico"
      />
      <b-form-invalid-feedback id="titleValidation">O título deve conter no mínimo 10 caracteres</b-form-invalid-feedback>
    </b-container>

    <!-- topic description  -->
    <b-container class="padding-10" fluid>
      <b-row class="justify-content-md-center">
        <b-col>
          <b-form-textarea
            v-model="topic.description"
            id="textarea-large"
            size="lg"
            placeholder="Descrição"
          />
        </b-col>
      </b-row>
    </b-container>

    <!-- subjects and stuffs -->
    <b-container>
      <b-input-group prepend="Assuntos relacionados" class="mt-3">
        <b-form-input @keyup.enter="appendSubject" v-model="subject" type="text"/>
        <b-input-group-append>
          <forum-button
            @actionBehavior="appendSubject"
            variant="primary"
            type="submit"
            label="Adicionar"
          ></forum-button>
        </b-input-group-append>
      </b-input-group>
      <ul id="subjects">
        <b-row>
          <li
            @mouseover="dangerColor(item)"
            @mouseleave="normalColor(item)"
            @click="removeItem(item)"
            style="padding:5px"
            v-for="(subject,item) in topic.subjects"
            :key="item"
          >
            <b-badge href="#">{{ subject }}</b-badge>
          </li>
        </b-row>
      </ul>
    </b-container>
    <!-- button for post the topic -->
    <b-row class="justify-content-md-center">
      <forum-button
        v-if="buttonLabel == 'Salvar tópico'"
        @actionBehavior="postTopic"
        variant="success"
        type="submit"
        :label="buttonLabel"
      ></forum-button>
      <forum-button
        v-if="buttonLabel == 'Salvar alterações'"
        @actionBehavior="updateTopic"
        variant="success"
        type="submit"
        :label="buttonLabel"
      ></forum-button>
    </b-row>
  </b-container>
</template>

<script>
import Button from "../shared/Button.vue";
import auth from "../../jwt-auth/";
export default {
  created: function() {
    this.$http
      .get(
        "users/username/" +
          localStorage.getItem("username")
      )
      .then(response => {
        this.topic.user = response.data;
      })
      .catch(error => {});
    this.changePageSubject();
  },
  components: {
    "forum-button": Button
  },
  watch: {
    $route: "changePageSubject"
  },
  computed: {
    topicTitleValidation() {
      if (!this.topic.title) return null;
      return this.topic.title.length > 9 ? true : false;
    }
  },
  methods: {
    changePageSubject() {
      if (this.$route.params.id) {
        this.topic = this.$route.params.topic;
        this.pageSubject = "Atualizar tópico";
        this.buttonLabel = "Salvar alterações";
      } else {
        this.pageSubject = "Criar tópico";
        this.buttonLabel = "Salvar tópico";
        this.topic = {
          title: "",
          description: "",
          user: {},
          subjects: []
        };
      }
    },
    appendSubject() {
      this.topic.subjects.push(this.subject);
      this.subject = "";
    },
    dangerColor(item) {
      document.getElementById("subjects").children[0].children[
        item
      ].children[0].style.backgroundColor = "firebrick";
    },
    normalColor(item) {
      document.getElementById("subjects").children[0].children[
        item
      ].children[0].style.backgroundColor = "#777777";
    },
    removeItem(item) {
      this.topic.subjects.splice(item, 1);
    },
    updateTopic() {
      let headerConfiguration = {
        headers: auth.getAuthHeader()
      };
      this.$http
        .put(
          "topics/" + this.$route.params.topic.objectId,
          this.topic,
          headerConfiguration
        )
        .then(response => {
          this.$router.push({
            name: "topic",
            params: { id: this.topic.objectId, title: this.topic.title }
          });
          this.topic = {
            title: "",
            description: "",
            user: {},
            subjects: []
          };
        })
        .catch(error => {
          if (error.response.status == 403)
            this.error = "Você não possui permissão para atualizar tópicos!";
          else
            this.error = "Algum erro ocorreu. Status: " + error.response.status;
        });
    },
    postTopic() {
      let headerConfiguration = {
        headers: auth.getAuthHeader()
      };
      this.$http
        .post("topics", this.topic, headerConfiguration)
        .then(response => {
          this.message = "Tópico criado com sucesso!";
          this.topic = {
            title: "",
            description: "",
            user: {},
            subjects: []
          };
          setTimeout(() => {
            this.$router.push("/topics");
          }, 1000);
        })
        .catch(error => {
          this.error =
            "Algum erro ocorreu na criação do tópico: status" +
            error.response.status;
        });
    }
  },
  data() {
    return {
      error: "",
      message: "",
      buttonLabel: "Salvar tópico",
      pageSubject: "Criar tópico",
      subject: "",
      topic: {
        title: "",
        description: "",
        user: {},
        subjects: []
      }
    };
  }
};
</script>

<style scoped>
ul {
  list-style-type: none;
  padding: 0px;
}

.padding-10 {
  padding-bottom: 10px;
}
</style>
