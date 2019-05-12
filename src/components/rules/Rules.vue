<template>
  <b-container>
    <b-list-group>
      <b-list-group-item v-for="(rule, index) in rules" :key="index">{{ rule.rule }}</b-list-group-item>
    </b-list-group>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      rules: [
        {
          rule: "A cada tópico adicionado você ganha 10 pontos"
        },
        {
          rule: "É possível atualizar um tópico após ganhar 50 pontos "
        },
        {
          rule: "É possível remover um tópico após ganhar 100 pontos "
        },
        {
          rule:
            "Você ganha um troféu quando recebe o primeiro like em algum comentário ou tópico"
        },
        {
          rule:
            "É possível remover likes após receber o troféu em seu comentário ou tópico"
        },
        {
          rule:
            " É possível adicionar comentários quando você ganhar 150 pontos "
        },
        {
          rule:
            "É possível atualizar comentários quando você ganhar 350 pontos "
        },
        {
          rule: "É possível remover comentários quando você ganhar 450 pontos "
        }
      ]
    };
  }
};
</script>

<style scoped>
</style>
