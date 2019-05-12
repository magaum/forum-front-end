<template>
  <b-button :block="block" @click="action" :variant="variant" :type="type">
    <b-spinner hidden small/>
    {{ label }}
  </b-button>
</template>

<script>
export default {
  props: {
    label: {
      required: true,
      type: String
    },
    type: {
      required: true,
      type: String
    },
    variant: {
      type: String
    },
    block: {
      type: String
    }
  },
  methods: {
    action() {
      // let spinner = document.getElementById("button-spinner");
      // spinner.hidden = !spinner.hidden;
      this.$emit("actionBehavior");
    }
  }
};
</script>

<style scoped>
</style>
