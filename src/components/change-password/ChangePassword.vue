<template>
  <b-container class="text-center">
    <h1>Troca de senha</h1>
    <b-row align-h="center">
      <b-col cols="5">
        <b-alert v-if="error" show variant="danger">{{ error }}</b-alert>
        <b-alert v-if="message" show variant="success">{{ message }}</b-alert>
        <b-form-input
          @input="validate"
          type="password"
          :state="isValid"
          v-model="password"
          placeholder="Senha"
        ></b-form-input>
      </b-col>
    </b-row>
    <div style="padding:20px">
      <b-button @click="changePassword" variant="success">Alterar</b-button>
    </div>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      isValid: null,
      password: "",
      error: "",
      message: ""
    };
  },
  methods: {
    validate() {
      if (!this.password) {
        this.isValid = null;
        this.error = "";
        this.message = "";
      } else if (this.password.length < 6) this.isValid = false;
      else this.isValid = true;
    },
    changePassword() {
      if (!this.password) {
        this.message = "";
        this.error = "Preencha o formulário com sua nova senha";
      } else if (this.password.length < 6) {
        this.message = "";
        this.error = "Sua senha deve conter pelo menos 6 caracteres";
      } else if (this.password.length >= 6) {
        this.$http
          .post(
            "users/" +
              this.$route.params.token +
              "/change/password/" +
              this.password
          )
          .then(result => {
            if (result.status == 200) {
              this.error = "";
              this.message = "Senha atlerada com sucesso";
              this.$router.push("/");
            }
          })
          .catch(err => {
            if (err.response.status == 404) this.error = "Link inválido";
            else this.error = "Algum erro ocorreu. Status: " + err.status;
          });
      }
    }
  }
};
</script>

<style scoped>
h1 {
  padding: 20px;
}
</style>
