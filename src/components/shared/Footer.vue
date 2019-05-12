<template>
  <footer fixed="bottom">
    <b-container>
      <b-row>
        <b-col>
          <h5>Sobre o projeto</h5>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <p>
            Este site é um estudo de caso para o projeto Esfinge Gamification,
            para saber mais sobre o projeto clique
            <a
              href="http://esfinge.sourceforge.net/Gamification.html"
              target="_blank"
            >aqui</a>. A ideia principal deste projeto é comprovar
            que a lógica de autorização criada no framework está funcional,
            e não permite requisições dependendo da quantidade
            de pontos que o usuário possui.
          </p>
        </b-col>
      </b-row>
    </b-container>
  </footer>
</template>

<script>
export default {};
</script>

<style scoped>
* {
  font-size: 12px;
  text-align: center;
  color: grey;
}

p {
  word-break: break-all;
}
li {
  list-style: none;
  display: inline-block;
}

footer {
  padding-top: 80px;
}

a {
  color: inherit;
}
</style>
