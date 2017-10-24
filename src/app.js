
// Import external dependencies.
import Ractive from 'ractive';
import template from './app.html';
import sass from './app.sass';
import filter from 'lodash.filter';

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
            let products = this.get('products');

            if (searchText) {
                let name, price;
                products = filter(products, product => {
                    name = product.name.toLowerCase();
                    price = product.price.toString();
                    return name.includes(searchText) || price.includes(searchText);
                });
            }

            return products.slice(0, itemsPerPage);
        },
    },

    // Custom component-level functions.
    noop: function (message = 'IDK what though.') {
        window.console.log(`You've clicked something! ${message}`);
    },
});

// Export the instance.
export default app;