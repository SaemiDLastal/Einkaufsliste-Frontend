<template>
  <div class="grocery-list-app">
    <h1>Grocery Lists</h1>
    <div v-for="groceryList in groceryLists" :key="groceryList.id" class="grocery-list">
      <h2>{{ groceryList.title }}</h2>
      <ul>
        <li v-for="item in groceryList.itemList" :key="item.id" :class="{ 'item-checked': item.checked }">
          {{ item.name }}
          <button @click="updateItemStatus(groceryList, item)">
            {{ item.checked ? 'Uncheck' : 'Check' }}
          </button>
          <button @click="removeItem(groceryList, item)">Remove</button>
        </li>
      </ul>
      <div>
        <input type="text" v-model="newItemName" placeholder="Item name" />
        <input type="text" v-model="newItemCategory" placeholder="Item category" />
        <button @click="addItem(groceryList)">Add Item</button>
      </div>
      <button @click="deleteGroceryList(groceryList)">Delete Grocery List</button>
    </div>
    <div>
      <h2>Create New Grocery List</h2>
      <input type="text" v-model="newGroceryListTitle" placeholder="Grocery list title" />
      <button @click="createGroceryList">Create Grocery List</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      groceryLists: [],
      newGroceryListTitle: '',
      newItemName: '',
      newItemCategory: ''
    };
  },
  mounted() {
    this.fetchGroceryLists();
  },
  methods: {
    fetchGroceryLists() {
      fetch('/api/groceryList')
          .then(response => response.json())
          .then(data => {
            this.groceryLists= data;
          })
          .catch(error => {
            console.error('Error fetching grocery lists:', error);
          });
    },
    createGroceryList() {
      const newGroceryList = {
        title: this.newGroceryListTitle,
        itemList: []
      };

      fetch('/api/groceryList', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newGroceryList)
      })
          .then(response => response.json())
          .then(data => {
            this.groceryLists.push(data);
            this.newGroceryListTitle = '';
          })
          .catch(error => {
            console.error('Error creating grocery list:', error);
          });
    },
    addItem(groceryList) {
      const newItem = {
        name: this.newItemName,
        category: this.newItemCategory,
        checked: false
      };

      fetch(`/api/groceryList/${groceryList.id}/item`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newItem)
      })
          .then(response => response.json())
          .then(data => {
            groceryList.itemList.push(data);
            this.newItemName = '';
            this.newItemCategory = '';
          })
          .catch(error => {
            console.error('Error adding item:', error);
          });
    },
    removeItem(groceryList, item) {
      fetch(`/api/groceryList/${groceryList.id}/item`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
      })
          .then(() => {
            const index = groceryList.itemList.findIndex(i => i.id === item.id);
            groceryList.itemList.splice(index, 1);
          })
          .catch(error => {
            console.error('Error removing item:', error);
          });
    },
    updateItemStatus(groceryList, item) {
      fetch(`/api/groceryList/${groceryList.id}/item/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
      })
          .catch(error => {
            console.error('Error updating item status:', error);
          });
    },
    deleteGroceryList(groceryList) {
      fetch(`/api/groceryList/${groceryList.id}`, {
        method: 'DELETE'
      })
          .then(() => {
            const index = this.groceryLists.findIndex(list => list.id === groceryList.id);
            this.groceryLists.splice(index, 1);
          })
          .catch(error => {
            console.error('Error deleting grocery list:', error);
          });
    }
  }
};
</script>

<style scoped>
.grocery-list {
  margin-bottom: 20px;
}

.item-checked {
  text-decoration: line-through;
}
</style>
