import { shallowMount } from '@vue/test-utils';
import GroceryListView from '@/views/GroceryListView';

describe('GroceryListView', () => {
  it('fetches grocery lists on mount', (done) => {
    // Mock fetch and its response
    const mockResponse = { data: [{ id: 1, title: 'Grocery List 1' }] };
    global.fetch = jest.fn().mockResolvedValue({
      json: () => Promise.resolve(mockResponse),
    });

    // Shallow mount the component
    const wrapper = shallowMount(GroceryListView);

    // Wait for Vue's next tick to allow data population
    wrapper.vm.$nextTick().then(() => {
      // Assert that fetch was called with the correct URL
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/api/groceryList');

      // Assert that the groceryLists data property is populated correctly
      expect(wrapper.vm.groceryLists).toEqual([{ id: 1, title: 'Grocery List 1' }]);

      done();
    });
  });

  it('creates a new grocery list', async () => {
    // Mock fetch and its response
    const mockFetchPromise = Promise.resolve({
      json: () => Promise.resolve({ id: 1, title: 'Grocery List 1' }),
    });
    global.fetch = jest.fn().mockImplementation(() => mockFetchPromise);

    // Shallow mount the component
    const wrapper = shallowMount(GroceryListView);

    // Set the newGroceryList data property
    wrapper.setData({
      newGroceryList: {
        title: 'Grocery List 1',
        itemList: [],
      },
    });

    // Trigger the form submission
    wrapper.find('form').trigger('submit.prevent');

    // Wait for the fetch promise to resolve
    await wrapper.vm.$nextTick();

    // Assert that fetch was called with the correct URL and payload
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/api/groceryList', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Grocery List 1',
        itemList: [],
      }),
    });

    // Wait for Vue's next tick to allow reactivity updates
    await wrapper.vm.$nextTick();

    // Assert that a new grocery list is added to the groceryLists data property
    expect(wrapper.vm.groceryLists.length).toBe(1);

    // Assert that the newGroceryList data property is reset
    expect(wrapper.vm.newGroceryList).toEqual({
      title: '',
      itemList: [],
    });

    // Ensure that fetchGroceryLists is called after creating the grocery list
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/api/groceryList');
  });

  it('deletes a grocery list', () => {
    // Mock fetch and its response
    const mockFetchPromise = Promise.resolve();
    global.fetch = jest.fn().mockImplementation(() => mockFetchPromise);

    // Shallow mount the component
    const wrapper = shallowMount(GroceryListView, {
      data() {
        return {
          groceryLists: [{ id: 1, title: 'Grocery List 1' }],
          selectedGroceryList: { id: 1, title: 'Grocery List 1' },
        };
      },
    });

    // Trigger the deleteGroceryList method
    wrapper.vm.deleteGroceryList(1);

    // Assert that fetch was called with the correct URL and method
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:8080/api/groceryList/1', {
      method: 'DELETE',
    });

    // Wait for the fetch promise to resolve
    return mockFetchPromise.then(() => {
      // Assert that the grocery list is removed from the groceryLists data property
      expect(wrapper.vm.groceryLists).toEqual([]);
      // Assert that the selectedGroceryList data property is reset
      expect(wrapper.vm.selectedGroceryList).toBeNull();
    });
  });
});
