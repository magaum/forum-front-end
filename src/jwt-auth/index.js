export default {

    user: {
        isAuthenticated: false
    },
    login(context, credentials, redirect) {
        context.$http.post("login", credentials)
            .then((response) => {
                let jwt = response.headers.authorization.split(" ")[1];
                if (jwt) {
                    localStorage.setItem('token', jwt);
                    localStorage.setItem("username", credentials.username);
                    this.user.isAuthenticated = true;
                    context.$eventHub.$emit('enableLogout', true);
                    if (redirect) {
                        context.$router.push(redirect);
                    }
                } else {
                    // this.$eventHub.$emit('authenticationFailed');     
                }
            }).catch((error) => {
                if (error.response.status === 403)
                    error = "Acesso não autorizado, usuário ou senha incorretos"
                context.error = error;

            })
    },

    signup(context, credentials) {
        context.$http.post("users/signup", credentials)
            .then((response) => {
                this.user.isAuthenticated = false
                let user = { username: credentials.username, password: credentials.password }
                this.login(context, user, "topics");

            }).catch((error) => {
                let status = error.response.status;
                if (status == 409)
                    error = "Este usuário já está cadastrado"
                else if (status == 400)
                    error = "Preencha o forumlário corretamente"
                context.error = error
            })
    },

    logout(context) {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        this.user.isAuthenticated = false;
        context.$eventHub.$emit('enableLogout', false);
        context.$router.push("/");
    },

    getAuthHeader() {
        return {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    }
}