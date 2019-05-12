<template>
  <div>
    <b-container class="login-padding position-relative">
      <b-card :title="formLabel" border-variant="secondary" align="left">
        <b-alert v-if="error" show variant="danger">{{ error }}</b-alert>
        <b-alert v-if="message" show variant="success">{{ message }}</b-alert>
        <b-form id="formHome">
          <!-- foreach in form properties -->
          <b-form-group v-for="prop in formProps" :key="prop.id" :id="prop.id" :label-for="prop.id">
            <b-form-input
              @input="validate(prop)"
              :state="prop.isValid"
              :id="prop.id"
              :type="prop.type"
              required
              :placeholder="prop.placeholder"
              v-model="prop.formData"
            />
          </b-form-group>
        </b-form>
        <forum-button @actionBehavior="action" variant="info" type="submit" :label="formLabel"></forum-button>
        <forum-button @actionBehavior="clear" variant="danger" type="reset" label="Limpar"></forum-button>
        <!-- action to chage form type, signup and login are the available types -->
        <footer style="color:darkblue">
          <label @click="changeType">{{ formFooter }}</label>
          <b-button
            variant="light"
            style="color:darkblue; backgroud-color:white"
            v-if="formAction == 'login' && error"
            v-b-modal.changePassword
          >Esqueci minha senha</b-button>
          <b-modal
            id="changePassword"
            ref="modal"
            title="Insira seu usuário e um email será enviado para troca da senha"
            @ok="validateForm"
          >
            <form @submit.stop.prevent="sendEmail">
              <b-form-textarea type="text" v-model="username"/>
            </form>
          </b-modal>
        </footer>
      </b-card>
    </b-container>
  </div>
</template>

<script>
import Button from "../shared/Button.vue";
import auth from "../../jwt-auth/";
export default {
  created: function() {
    // user cannot back to this page when is authenticated
    if (auth.user.isAuthenticated) {
      this.$router.push("topics");
    }
  },
  components: {
    "forum-button": Button
  },
  data() {
    return {
      message: "",
      username: "",
      error: "",
      formAction: "login",
      formLabel: "Login",
      formFooter: "Ainda não tem cadastro? Inscreva-se",
      formProps: [
        {
          id: "username",
          type: "text",
          placeholder: "Login",
          formData: "",
          isValid: null
        },
        {
          id: "password",
          type: "password",
          placeholder: "Senha",
          formData: "",
          isValid: null
        }
      ]
    };
  },

  methods: {
    validateForm(evt) {
      if (this.username) {
        this.sendEmail();
      } else {
        evt.preventDefault();
        alert("Preencha o campo com seu nome de usuário");
      }
    },
    sendEmail() {
      this.$http
        .post("users/reset/password/" + this.username)
        .then(result => {
          if (result.status == 200) {
            this.error = "";
            this.message = "Verifique seu email para alterar sua senha!";
          }
        })
        .catch(err => {
          this.message = "";
          this.error = "Algum problema ocorreu, tente novamente mais tarde";
        });
    },
    // change default form type they are login and signup
    changeType() {
      this.error = "";
      this.message = "";
      const email = {
        id: "email",
        type: "email",
        placeholder: "Email",
        formData: "",
        isValid: null
      };
      if (this.formProps.length == 3) {
        this.formAction = "login";
        this.formLabel = "Login";
        this.formFooter = "Ainda não tem cadastro? Inscreva-se";
        this.formProps.pop(email);
        this.formProps.forEach(prop => {
          prop.isValid = null;
          prop.formData = "";
        });
      } else {
        this.formAction = "signup";
        this.formLabel = "Cadastrar";
        this.formFooter = "Já é cadastrado? Entrar";
        this.formProps.push(email);
        this.formProps.forEach(prop => {
          prop.isValid = null;
          prop.formData = "";
        });
      }
    },
    validate(form) {
      if (form.id == "username") {
        form.isValid = form.formData.length > 2 && form.formData.length < 35;
      }
      if (form.id == "password") {
        form.isValid = form.formData.length > 5 && form.formData.length < 100;
      }
      if (form.id == "email") {
        let regex = RegExp(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
        form.isValid = regex.test(form.formData);
      }
    },
    /**
     * Iterate for form items and set current value to empty string
     */
    clear() {
      this.formProps.forEach(prop => {
        prop.formData = "";
        prop.isValid = null;
      });
    },
    // send request to api for login or create a user
    action() {
      let username = this.formProps[0].formData;
      let password = this.formProps[1].formData;
      // request for login user
      if (this.formAction == "login") {
        if (this.formProps[0].isValid && this.formProps[1].isValid) {
          let user = { username, password };
          auth.login(this, user, "topics");
        } else {
          this.error = "O formulário não foi preenchido corretamente";
        }
      }
      //request for create user
      else if (this.formAction == "signup") {
        if (
          this.formProps[0].isValid &&
          this.formProps[1].isValid &&
          this.formProps[2].isValid
        ) {
          let email = this.formProps[2].formData;
          let user = { username, password, email };
          auth.signup(this, user, "login");
        } else {
          this.error = "O formulário não foi preenchido corretamente";
        }
      }
    }
  }
};
</script>

<style scoped>
.login-padding {
  max-width: 50em;
  padding: 10em;
}

footer {
  padding-top: 10px;
}

label {
  cursor: pointer;
  margin: 0px;
}
</style>
