<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>

import GroceryList from "../components/GroceryList.vue";

export default {
  name: 'GroceryListView',
  components: {
    GroceryList
  }
}

</script>


<style scoped>

</style>
