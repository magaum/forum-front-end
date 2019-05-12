<template>
  <div>
    <forum-header/>
    <router-view></router-view>
    <forum-footer/>
  </div>
</template>

<script>
import Header from "./components/shared/Header.vue";
import Footer from "./components/shared/Footer.vue";
import { routes } from "./routes";

export default {
  components: {
    "forum-header": Header,
    "forum-footer": Footer
  },
  name: "app",
  data() {
    return { routes };
  }
};
</script>

<style>
body {
  font-family: Verdana, Tahoma, Arial, Helvetica, sans-serif;
}
#nprogress .bar {
  background: red;
}

#nprogress .spinner-icon {
  border-top-color: red;
  border-left-color: red;
}

</style>
