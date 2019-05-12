<template>
  <div class="text-center">
    <b-modal
      id="modal-center"
      header-bg-variant="danger"
      header-text-variant="light"
      variant="primary"
      centered
      v-model="showModal"
    >
      <p>Nenhum topico foi encontrado</p>
      <div slot="modal-footer" class="w-100">
        <b-button size="sm" class="float-right" variant="primary" @click="showModal=false">Fechar</b-button>
      </div>
    </b-modal>

    <ul>
      <!-- iterate for topics filter data -->
      <li v-for="topic in paginatedData" :key="topic.objectId">
        <b-list-group>
          <b-list-group-item>
            <b-container fluid>
              <b-row>
                <b-col cols="9">
                  <router-link
                    class="topic"
                    :to="{ name: 'topic', params: { id: topic.objectId, title:topic.title }}"
                  >{{ topic.title }}</router-link>
                </b-col>
                <b-col cols="1">
                  <b-badge
                    :to="{ name: 'users', params: { id: topic.user.objectId, user: topic.user.username }}"
                  >{{ topic.user.username }}</b-badge>
                </b-col>
                <b-col cols="1">
                  <p v-b-popover.hover="'Curtidas neste tópico'">
                    <font-awesome-icon icon="thumbs-up"/>
                    {{ topic.likes != null ? topic.likes.length : 0 }}
                  </p>
                </b-col>
                <b-col cols="1">
                  <p v-b-popover.hover="'Comentários neste tópico'">
                    <font-awesome-icon icon="comment-alt"/>
                    {{ topic.comments != null ? topic.comments.length : 0 }}
                  </p>
                </b-col>
              </b-row>
            </b-container>
          </b-list-group-item>
        </b-list-group>
      </li>
    </ul>
    <div v-if="topics.length > 9">
      <forum-button
        :disabled="pageNumber == 0"
        @actionBehavior="prevPage"
        variant="outline-primary"
        type="submit"
        label="anterior"
      ></forum-button>
      <forum-button
        :disabled="pageNumber >= (pageCount -1)"
        @actionBehavior="nextPage"
        variant="outline-primary"
        type="submit"
        label="proximo"
      ></forum-button>
    </div>
  </div>
</template>

<script>
import Button from "../shared/Button.vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faThumbsUp,
  faCommentAlt,
  faComment
} from "@fortawesome/free-solid-svg-icons";
library.add(faThumbsUp, faCommentAlt);

export default {
  created() {
    this.$eventHub.$on("filterTopics", filter => this.searchTopics(filter));
    this.getTopics();
  },
  beforeDestroy() {
    this.$eventHub.$off("filterTopics");
  },
  components: {
    "forum-button": Button
  },
  computed: {
    pageCount() {
      let l = this.topics.length,
        s = 10;
      if (this.filteredTopics.length) l = this.filteredTopics.length;
      return Math.ceil(l / s);
    },
    paginatedData() {
      const start = this.pageNumber * 10,
        end = start + 10;
      if (this.filteredTopics.length)
        return this.filteredTopics.slice(start, end);
      return this.topics.slice(start, end);
    }
  },
  methods: {
    getTopics() {
      setTimeout(() => {
        if (this.$route.params.id) {
          this.$http
            .get("topics/users/" + this.$route.params.id)
            .then(result => {
              this.topics = result.data;
            })
            .catch(err => {
              this.topic = null;
              console.log(err);
            });
        } else {
          this.$http
            .get("topics")
            .then(result => {
              this.topics = result.data;
            })
            .catch(err => {
              this.topic = null;
              console.log(err);
            });
        }
      }, 500);
    },
    searchTopics(filter) {
      let regex = RegExp(filter);
      this.filteredTopics = this.topics.filter(topic => {
        if (regex.test(topic.title)) return true;
      });
      this.topics.forEach(topic =>
        topic.subjects.forEach(subject => {
          if (filter == subject) this.filteredTopics.push(topic);
        })
      );
      if (!this.filteredTopics.length) {
        this.showModal = !this.showModal;
      }
    },
    nextPage() {
      this.pageNumber++;
    },
    prevPage() {
      this.pageNumber--;
    }
  },
  watch: {
    $route: "getTopics"
  },
  data() {
    return {
      showModal: false,
      pageNumber: 0,
      filteredTopics: [],
      topics: []
    };
  }
};
</script>

<style scoped>
ul {
  list-style-type: none;
  margin: 0;
  padding: 0px 0px 40px 0px;
}

.username {
  color: aliceblue;
}

.topic {
  color: inherit;
  text-decoration: none;
}

h1 {
  padding: 40px;
}
</style>
