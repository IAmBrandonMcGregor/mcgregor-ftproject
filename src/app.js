
// Import external dependencies.
import Ractive from 'ractive';
import template from './app.html';
import sass from './app.sass';
import filter from 'lodash.filter';
import sortBy from 'lodash.sortby';

// Caching references to global data.
const users = window.users;
const rawPosts = window.posts;
const images = window.images;

// Cache module-level variables.
const maximumCharacters = 140;

// Create our global Ractive application instance.
const app = Ractive({
    target: '#BrandonsFTProject',
    template,
    data: function () {
        return {
            itemsPerPage: 10,
            searchText: '',
            sortColumn: 'name',
            sortDesc: false,
            products: [
                {
                    name: 'Snapback Hat',
                    type: 'Physical',
                    price: 15.67,
                    inventory: 200,
                },
                {
                    name: 'Maxi Dress - Floral',
                    type: 'Physical',
                    price: 15.67,
                    inventory: 200,
                },
                {
                    name: 'High Waist Jeans',
                    type: 'Physical',
                    price: 15.67,
                    inventory: 200,
                },
                {
                    name: 'Grey Silk Blouse',
                    type: 'Physical',
                    price: 15.67,
                    inventory: 200,
                },
                {
                    name: 'Snapback Hat',
                    type: 'Physical',
                    price: 15.67,
                    inventory: 200,
                },
                {
                    name: 'Snapback Hat',
                    type: 'Physical',
                    price: 15.67,
                    inventory: 200,
                },
                {
                    name: 'Snapback Hat',
                    type: 'Physical',
                    price: 15.67,
                    inventory: 200,
                },
                {
                    name: 'Snapback Hat',
                    type: 'Physical',
                    price: 15.67,
                    inventory: 200,
                },
                {
                    name: 'Snapback Hat',
                    type: 'Physical',
                    price: 15.67,
                    inventory: 200,
                },
                {
                    name: 'Snapback Hat',
                    type: 'Physical',
                    price: 15.67,
                    inventory: 200,
                },
                {
                    name: 'Snapback Hat',
                    type: 'Physical',
                    price: 15.67,
                    inventory: 200,
                },
                {
                    name: 'Snapback Hat',
                    type: 'Physical',
                    price: 15.67,
                    inventory: 200,
                },
                {
                    name: 'Snapback Hat',
                    type: 'Physical',
                    price: 15.67,
                    inventory: 200,
                },
                {
                    name: 'Snapback Hat',
                    type: 'Physical',
                    price: 15.67,
                    inventory: 200,
                },
                {
                    name: 'Snapback Hat',
                    type: 'Physical',
                    price: 15.67,
                    inventory: 200,
                },
                {
                    name: 'Snapback Hat',
                    type: 'Physical',
                    price: 15.67,
                    inventory: 200,
                },
                {
                    name: 'Snapback Hat',
                    type: 'Physical',
                    price: 15.67,
                    inventory: 200,
                },
                {
                    name: 'Snapback Hat',
                    type: 'Physical',
                    price: 15.67,
                    inventory: 200,
                },
                {
                    name: 'Snapback Hat',
                    type: 'Physical',
                    price: 15.67,
                    inventory: 200,
                },
                {
                    name: 'Snapback Hat',
                    type: 'Physical',
                    price: 15.67,
                    inventory: 200,
                },
                {
                    name: 'Snapback Hat',
                    type: 'Physical',
                    price: 15.67,
                    inventory: 200,
                },
                {
                    name: 'Snapback Hat',
                    type: 'Physical',
                    price: 15.67,
                    inventory: 200,
                }
            ],
        }
    },
    computed: {
        visibleProducts: function () {
            const itemsPerPage = this.get('itemsPerPage');
            const searchText = this.get('searchText').toLowerCase();
            const sortColumn = this.get('sortColumn');
            const sortDesc = this.get('sortDesc');
            let products = this.get('products');

            // Reduce our products by search text if present.
            if (searchText) {
                let name, price;
                products = filter(products, product => {
                    name = product.name.toLowerCase();
                    price = product.price.toString();
                    return name.includes(searchText) || price.includes(searchText);
                });
            }

            // Sort by selected column.
            if (sortColumn) {
                products = sortBy(products, sortColumn);

                if (sortDesc)
                    products.reverse();
            }

            // TODO: Improve pagination handling here.

            // Grab only the current page of 
            return products.slice(0, itemsPerPage);
        },
    },

    // Custom component-level functions.
    noop: function (message = 'IDK what though.') {
        window.console.log(`You've clicked something! ${message}`);
    },
    sortBy: function (sortColumn = 'name') {
        const sortDesc = this.get('sortColumn') === sortColumn && this.get('sortDesc') === false;
        this.set({sortColumn, sortDesc});
    },
});

// Export the instance.
export default app;