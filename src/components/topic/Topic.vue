<template>
  <b-container v-if="topic != null">
    <!-- topic structure -->
    <h1>{{ topic.title }}</h1>

    <b-alert variant="danger" dismissible v-if="error.length" show>{{ error }}</b-alert>

    <hr>
    <p class="description">{{ topic.description }}</p>
    <b-container>
      <b-row align-h="end">
        <b-col v-if="topic.user" cols="2">
          <b-badge
            class="username"
            :to="{ name: 'users', params: { id:topic.user.objectId ,user: topic.user.username }}"
          >{{ topic.user.username }}</b-badge>
        </b-col>
        <b-col cols="1">
          <p v-b-popover.hover="'Curtidas neste tópico'">
            <font-awesome-icon
              id="topicLikes"
              style="cursor: pointer"
              @click="updateLikeInTopic(topic.objectId)"
              icon="thumbs-up"
            />
            {{ topic.likes != null ? topic.likes.length : 0 }}
          </p>
        </b-col>
      </b-row>
    </b-container>
    <!-- subjects structure -->
    <b-container v-if="topic.subjects != null">
      <b-row>
        <b-col>
          <ul>
            <b-col>
              <p style="padding:0; margin:0">Assuntos relacionados</p>
            </b-col>
            <b-row>
              <li style="padding:5px" v-for="(subject,item) in topic.subjects" :key="item">
                <b-badge variant="primary">{{ subject }}</b-badge>
              </li>
            </b-row>
          </ul>
        </b-col>
        <b-col v-if="isTopicCreator" cols="3">
          <b-button
            :to="{ name: 'updateTopic', params: { id: topic.objectId, topic }}"
            variant="outline-info"
          >Editar</b-button>
          <b-button v-b-modal.deleteTopic variant="outline-danger">Excluir</b-button>
          <b-modal
            @ok="removeTopic"
            ok-variant="danger"
            cancel-variant="outline-dark"
            id="deleteTopic"
            title="Tem certeza?"
          >
            <div class="d-block text-center">
              <h3>Este tópico será excluido!</h3>
            </div>
          </b-modal>
        </b-col>
      </b-row>
    </b-container>
    <!-- post comment form -->
    <b-container v-if="isAuthenticated">
      <hr>
      <h2>Adicionar comentário</h2>
      <b-alert v-if="message.length" dismissible show variant="success">{{ message }}</b-alert>
      <b-alert v-if="addErrorMessage.length" dismissible show variant="danger">{{ addErrorMessage }}</b-alert>
      <b-row class="justify-content-md-center">
        <b-col sm="8">
          <b-form-textarea id="new-comment" v-model="comment.description" rows="5" max-rows="8"/>
        </b-col>
      </b-row>
      <b-row class="justify-content-md-center">
        <b-col sm="8">
          <b-button @click="postComment" block variant="success">Comentar</b-button>
        </b-col>
      </b-row>
    </b-container>
    <!-- comments strucuture -->
    <b-container v-if="topic.comments != null" style="padding:50px">
      <b-button
        v-if="topic.comments.length"
        v-b-toggle.comments
        variant="primary"
      >Exibir comentários</b-button>
      <b-collapse id="comments" class="mt-2">
        <ul>
          <li v-for="(comment,item) in topic.comments" :key="item">
            <hr>
            <b-alert
              v-if="commentError.length && currentComment == item"
              show
              variant="danger"
            >{{ commentError }}</b-alert>
            <b-alert
              v-if="commentMessage.length && currentComment == item"
              show
              dismissible
              variant="success"
            >{{ commentMessage }}</b-alert>
            <p class="description">{{ comment.description }}</p>
            <div class="footer-info">
              <b-container>
                <b-row align-h="end">
                  <b-col v-if="comment.user" cols="2">
                    <b-badge
                      class="username"
                      :to="{ name: 'users', params: { id: comment.user.objectId ,user:comment.user.username }}"
                    >{{ comment.user.username }}</b-badge>
                  </b-col>
                  <b-col cols="1">
                    <p v-b-popover.hover="'Curtidas neste comentario'">
                      <font-awesome-icon
                        :id="comment.objectId"
                        style="cursor:pointer"
                        @click="updateLikeInComment(topic.objectId, comment)"
                        icon="thumbs-up"
                      />
                      {{ comment.likes !=null ? comment.likes.length :0 }}
                    </p>
                  </b-col>
                </b-row>
                <b-row>
                  <!-- COMMENTS UPDATE DELETE HERE -->
                  <b-col v-if="currentUser == comment.user.username" cols="3">
                    <b-button
                      @click="setComment(comment, item)"
                      v-b-modal.updateComment
                      variant="outline-info"
                    >Editar</b-button>
                    <b-button
                      @click="setComment(comment, item)"
                      v-b-modal.deleteComment
                      variant="outline-danger"
                    >Excluir</b-button>
                  </b-col>
                </b-row>
              </b-container>
            </div>
          </li>
        </ul>
      </b-collapse>
    </b-container>
    <!-- update comment modal -->
    <b-modal @ok="handleOk" id="updateComment" ref="modal" title="Editar comentário">
      <form @submit.stop.prevent="updateComment">
        <b-form-textarea type="text" v-model="commentSelected.description"/>
      </form>
    </b-modal>
    <!-- delete comment modal -->
    <b-modal
      @ok="removeComment"
      ok-variant="danger"
      cancel-variant="outline-dark"
      id="deleteComment"
      title="Tem certeza?"
    >
      <div class="d-block text-center">
        <h3>Este comentário será excluido!</h3>
      </div>
    </b-modal>
  </b-container>
  <b-container v-else>
    <h1>
      Topico não encontrado
      <font-awesome-icon icon="sad-cry"/>
    </h1>
  </b-container>
</template>

<script>
import auth from "../../jwt-auth/";
import Button from "../shared/Button.vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faThumbsUp,
  faCommentAlt,
  faComment,
  faSadCry
} from "@fortawesome/free-solid-svg-icons";

// add icons to the page
library.add(faThumbsUp, faCommentAlt, faSadCry);

export default {
  created: function() {
    this.isAuthenticated = auth.user.isAuthenticated;
    // validate current user for delete and update button
    this.currentUser = localStorage.getItem("username");
    this.$http
      .get("topics/" + this.$route.params.id)
      .then(result => {
        this.topic = result.data;
        this.isTopicCreator = this.topic.user.username == this.currentUser;
        this.listenTopicLike();
        this.listenCommentLike();
      })
      .catch(error => {
        this.topic = null;
        this.error = "Algum erro ocorreu. Status: " + error.response.status;
      });
  },
  components: {
    "forum-button": Button
  },
  methods: {
    listenCommentLike() {
      this.$nextTick(() => {
        if (this.topic.comments != null) {
          this.topic.comments.forEach(comment => {
            if (comment.likes != null) {
              comment.likes.filter(like => {
                let element = document.getElementById(comment.objectId);
                if (like == this.currentUser) {
                  element.style = "color:#17a2b8;cursor: pointer";
                } else {
                  element.style = "color:black;cursor: pointer";
                }
              });
            }
          });
        }
      });
    },
    listenTopicLike() {
      if (this.isAuthenticated && this.topic.likes) {
        let changeStyle = false;
        this.topic.likes.forEach(like => {
          if (like == this.currentUser) changeStyle = true;
        });
        if (changeStyle) {
          document.getElementById("topicLikes").style =
            "color:#17a2b8;cursor: pointer";
        } else {
          document.getElementById("topicLikes").style =
            "color:black;cursor: pointer";
        }
      }
    },
    addLikeInTopic(headerConfiguration, id) {
      // add like in topic
      this.$http
        .post(
          "topics/" + id + "/likes/" + this.currentUser,
          null,
          headerConfiguration
        )
        .then(response => {
          // reload topic from database
          this.$http
            .get("topics/" + id)
            .then(response => {
              this.topic = response.data;
              this.listenTopicLike();
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(error => {
          console.log(error);
          console.log(error.response);
        });
    },
    addLikeInComment(headerConfiguration, idTopic, comment) {
      // add like in comment
      this.$http
        .post(
          "topics/" +
            idTopic +
            "/comments/" +
            comment.objectId +
            "/likes/" +
            this.currentUser,
          null,
          headerConfiguration
        )
        .then(response => {
          // reload comment from database
          this.$http
            .get("topics/" + idTopic)
            .then(response => {
              this.topic = response.data;
              document.getElementById(comment.objectId).style =
                "cursor:pointer; color:#17a2b8";
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(error => {
          console.log(error);
          console.log(error.response);
        });
    },
    removeLikeInTopic(headerConfiguration, id) {
      // remove like in topic
      this.$http
        .delete(
          "topics/" + id + "/likes/" + this.currentUser,
          headerConfiguration
        )
        .then(response => {
          // reload topic from database
          this.$http
            .get("topics/" + id)
            .then(response => {
              this.topic = response.data;
              this.listenTopicLike();
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(error => {
          if (error.response.status == 403) {
            this.error =
              "Você não possui autorização para remover likes de tópicos";
          } else {
            this.error = "Algum erro ocorreu. Status: " + error.response.status;
          }
        });
    },
    removeLikeInComment(headerConfiguration, idTopic, comment) {
      // remove like in comment
      this.$http
        .delete(
          "topics/" +
            idTopic +
            "/comments/" +
            comment.objectId +
            "/likes/" +
            this.currentUser,
          headerConfiguration
        )
        .then(response => {
          // reload topic from database
          this.$http
            .get("topics/" + idTopic)
            .then(response => {
              this.topic = response.data;
              document.getElementById(comment.objectId).style =
                "cursor:pointer; color:black";
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(error => {
          if (error.response.status == 403) {
            this.commentError =
              "Você não possui autorização para remover likes de comentarios";
          } else {
            this.commentError = "Algum erro ocorreu. Status: " + error.response.status;
          }
        });
    },
    updateLikeInComment(idTopic, comment) {
      if (this.isAuthenticated) {
        // reader configuration
        let headerConfiguration = {
          headers: auth.getAuthHeader()
        };
        let add = true;
        if (comment.likes) {
          comment.likes.forEach(like => {
            if (like == this.currentUser) add = false;
          });
        }
        if (add) {
          this.addLikeInComment(headerConfiguration, idTopic, comment);
        } else {
          this.removeLikeInComment(headerConfiguration, idTopic, comment);
        }
      } else {
        this.commentError =
          "Só é possível adicionar likes quando está autenticado";
      }
    },
    updateLikeInTopic(idTopic) {
      if (this.isAuthenticated) {
        // reader configuration
        let headerConfiguration = {
          headers: auth.getAuthHeader()
        };
        let remove = false;
        if (this.topic.likes) {
          this.topic.likes.forEach(like => {
            if (like == this.currentUser) remove = true;
          });
        }
        if (remove) {
          this.removeLikeInTopic(headerConfiguration, idTopic);
        } else {
          this.addLikeInTopic(headerConfiguration, idTopic);
        }
      } else {
        this.error = "Só é possível adicionar likes quando está autenticado";
      }
    },
    handleOk(evt) {
      if (!this.commentSelected.description) {
        evt.preventDefault();
        alert("O comentário precisa ser preenchido");
      } else {
        this.updateCommment();
      }
    },
    updateCommment() {
      let headerConfiguration = {
        headers: auth.getAuthHeader()
      };

      // get user from server and set comment on response
      this.$http
        .get(
          "users/username/" +
            localStorage.getItem("username")
        )
        .then(result => {
          this.comment.user = result.data;

          // after get user data the comment is send
          this.$http
            .put(
              "topics/" +
                this.$route.params.id +
                "/comments/" +
                this.commentSelected.objectId,
              this.commentSelected,
              headerConfiguration
            )
            .then(result => {
              this.commentMessage = "Comentário atualizado";
            })
            .catch(error => {
              if (error.response.status == 403)
                this.commentError =
                  "Você não possui permissão para atualizar comentários";
              else
                this.error =
                  "Algum erro ocorreu. Status: " + error.response.status;
            });
        })
        .catch(errpr => {
          this.user = null;
          alert("Algum erro ocorreu. Status" + error.response.status);
        });
    },
    removeComment() {
      let headerConfiguration = {
        headers: auth.getAuthHeader()
      };

      this.$http
        .delete(
          "topics/" +
            this.$route.params.id +
            "/comments/" +
            this.commentSelected.objectId,
          headerConfiguration
        )
        .then(result => {
          this.topic.comments.splice(this.currentComment, 1);
        })
        .catch(error => {
          if (error.response.status == 403)
            this.commentError =
              "Você não possui autorização para remover comentários";
          else
            this.commentError =
              "Algum erro ocorreu. Status" + error.response.status;
        });
    },
    setComment(comment, item) {
      this.commentSelected = comment;
      this.currentComment = item;
    },
    removeTopic() {
      let headerConfiguration = {
        headers: auth.getAuthHeader()
      };

      this.$http
        .delete(
          "topics/" + this.topic.objectId,
          headerConfiguration
        )
        .then(result => {
          let user = localStorage.getItem("username");
          alert("Tópico excluído com sucesso!");
          this.$router.push("/" + user + "/topics");
        })
        .catch(err => {
          if (err.response.status == 403)
            this.error = "Você não tem autorização para excluir tópicos";
          else
            this.error =
              "O tópico não foi excluído. Status" + err.response.status;
        });
    },
    postComment() {
      if (!this.comment.description) {
        this.addErrorMessage = "Preencha o campo comentário";
      } else {
        let headerConfiguration = {
          headers: auth.getAuthHeader()
        };

        // get user from server and set the response to comment
        this.$http
          .get(
            "users/username/" +
              localStorage.getItem("username")
          )
          .then(result => {
            this.comment.user = result.data;

            // after get user data the comment is send
            this.$http
              .post(
                "topics/" +
                  this.$route.params.id +
                  "/comments",
                this.comment,
                headerConfiguration
              )
              .then(result => {
                this.comment.description = "";
                if (!this.topic.comments) {
                  this.$http
                    .get(
                      "topics/" + this.$route.params.id
                    )
                    .then(response => {
                      this.topic = response.data;
                    })
                    .catch(error => {
                      this.error =
                        "Algum erro ocorreu enquanto o comentário era adicionado. Status: " +
                        error.response.status;
                    });
                } else {
                  this.topic.comments.push(result.data);
                }
                this.message = "Comentário adicionado com sucesso";
              })
              .catch(err => {
                if (err.response.status == 403)
                  this.addErrorMessage =
                    "Você não possui autorização para adicionar comentários!";
                else
                  alert(
                    "O comentario não foi adicionado. Status: " +
                      err.response.status
                  );
              });
          })
          .catch(err => {
            this.user = null;
          });
      }
    }
  },
  data() {
    return {
      message: "",
      addErrorMessage: "",
      error: "",
      commentError: "",
      commentMessage: "",
      currentComment: 0,
      commentSelected: "",
      currentUser: undefined,
      isCommentCreator: false,
      isTopicCreator: false,
      isAuthenticated: false,
      topic: {
        comments: [],
        likes: []
      },
      comment: {
        description: "",
        user: {}
      }
    };
  }
};
</script>

<style scoped>
ul {
  list-style-type: none;
}

h1 {
  text-align: center;
  padding: 20px;
  text-decoration: none;
}

h2 {
  padding: 20px;
  font-size: 25px;
}

.description {
  text-align: justify;
  padding: 20px;
}

.username {
  color: aliceblue;
}

a {
  text-decoration: none;
}
</style>