<template>
  <div class="container">
    <h1>Grocery List</h1>
    <div class="row">
      <div class="col-md-4">
        <h2>Create Grocery List</h2>
        <form @submit.prevent="createGroceryList">
          <div class="form-group">
            <label for="title">Title:</label>
            <input type="text" class="form-control" v-model="newGroceryList.title" required>
          </div>
          <button type="submit" class="btn btn-primary">Create</button>
        </form>
      </div>
      <div class="col-md-8">
        <h2>Grocery Lists</h2>
        <table class="table">
          <thead>
          <tr>
            <th>Title</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="groceryList in groceryLists" :key="groceryList.id">
            <td>{{ groceryList.title }}</td>
            <td>
              <button @click="showGroceryList(groceryList.id)" class="btn btn-primary">Show</button>
              <button @click="deleteGroceryList(groceryList.id)" class="btn btn-danger">Delete</button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-if="selectedGroceryList">
      <h2>{{ selectedGroceryList.title }}</h2>
      <table class="table">
        <thead>
        <tr>
          <th>Item</th>
          <th>Category</th>
          <th>Quantity</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item) in selectedGroceryList.itemList" :key="item.id">
          <td>{{item.name }}</td>
          <td>{{item.category}}</td>
          <td>{{item.quantity}}</td>
          <td>
            <button @click="deleteItem(item.id)" class="btn btn-danger">Delete</button>
          </td>
        </tr>
        </tbody>
      </table>
      <h3>Add Item</h3>
      <form @submit.prevent="addItem">
        <div class="form-group">
          <label for="itemName">Name:</label>
          <input type="text" class="form-control" v-model="newItem.name" required>
        </div>
        <div class="form-group">
          <label for="itemName">Category:</label>
          <input type="text" class="form-control" v-model="newItem.category" required>
        </div>
        <div class="form-group">
          <label for="newItemQuantity">Quantity:</label>
          <input type="number" class="form-control" v-model="newItem.quantity" required>
        </div>
        <button type="submit" class="btn btn-primary">Add</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      groceryLists: [],
      selectedGroceryList: null,
      newGroceryList: {
        title: '',
        itemList: []
      },
      newItem: {
        name: '',
        category: '',
        quantity: ''
      },

    };
  },
  mounted() {
    this.fetchGroceryLists();
  },
  methods: {
    fetchGroceryLists() {
      fetch('http://localhost:8080/api/groceryList')
          .then(response => response.json())
          .then(data => {
            this.groceryLists = data;
          })
          .catch(error => {
            console.error('Error:', error);
          });
    },
    createGroceryList() {
      fetch('http://localhost:8080/api/groceryList', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.newGroceryList)
      })
          .then(response => response.json())
          .then(data => {
            this.newGroceryList.itemList.push(data);
            this.newGroceryList.title = '';
            this.newGroceryList.itemList = [];
            this.fetchGroceryLists();
          })
          .catch(error => {
            console.error('Error:', error);
          });

    },
    showGroceryList(id) {
      fetch(`http://localhost:8080/api/groceryList/${id}`)
          .then(response => response.json())
          .then(data => {
            this.selectedGroceryList = data;
            this.newItem.quantity = '';
            this.fetchGroceryLists();
          })
          .catch(error => {
            console.error('Error:', error);
          });
    },
    deleteGroceryList(id) {
      fetch(`http://localhost:8080/api/groceryList/${id}`, {
        method: 'DELETE'
      })
          .then(() => {
            this.groceryLists = this.groceryLists.filter(list => list.id !== id);
            this.selectedGroceryList = null;
          })
          .catch(error => {
            console.error('Error:', error);
          });
    },
    addItem() {
      fetch(`http://localhost:8080/api/groceryList/${this.selectedGroceryList.id}/item`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.newItem)
      })
          .then(response => response.json())
          .then(data => {
            console.log(data);
            this.selectedGroceryList.itemList.push(data);
            this.newItem.name = '';
            this.newItem.category = '';
            this.newItem.quantity = '';
          })
          .then(() => {
            this.fetchGroceryLists();
          })
          .catch(error => {
            console.error('Error:', error);
          });

    },
    updateItem(item) {
      fetch(`http://localhost:8080/api/item/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
      })
          .catch(error => {
            console.error('Error:', error);
          });
    },
    deleteItem(item,id) {
      fetch(`http://localhost:8080/api/item/${item.id}`, {
        method: 'DELETE'
      })
          .then(() => {
            this.newItem = this.newItem.filter(item => item.id !== id);
          })
          .catch(error => {
            console.error('Error:', error);
          });
    }
  }
};
</script>

<style scoped>
.container {
  margin-top: 40px;
}
</style>
