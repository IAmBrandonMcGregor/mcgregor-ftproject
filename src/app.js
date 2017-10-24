
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
                  "id": 1,
                  "name": "Snapback Hat",
                  "type": "Physical",
                  "price": 20.99,
                  "inventory": 12,
                  "thumbnail": "http://frontend-trial-project.weebly.com/uploads/1/0/5/4/105462933/diamond-supply-co-brilliant-snapback-hat-224298.png"
                },
                {
                  "id": 2,
                  "name": "Maxi Dress - Floral",
                  "type": "Physical",
                  "price": 40,
                  "inventory": 24,
                  "thumbnail": "http://frontend-trial-project.weebly.com/uploads/1/0/5/4/105462933/27890e0eddd8e800fc2c8fc1c434744d.png"
                },
                {
                  "id": 3,
                  "name": "Maxi Dress - Vibrant",
                  "type": "Physical",
                  "price": 40,
                  "inventory": 17,
                  "thumbnail": "http://frontend-trial-project.weebly.com/uploads/1/0/5/4/105462933/27890e0eddd8e800fc2c8fc1c434744d.png"
                },
                {
                  "id": 4,
                  "name": "High Waist Jeans",
                  "type": "Physical",
                  "price": 45.99,
                  "inventory": 9,
                  "thumbnail": "http://frontend-trial-project.weebly.com/uploads/1/0/5/4/105462933/super-high-waisted-jeans-google-search-iozlcm0zk5j.png"
                },
                {
                  "id": 5,
                  "name": "Grey Silk Blouse",
                  "type": "Physical",
                  "price": 35,
                  "inventory": 33,
                  "thumbnail": "http://frontend-trial-project.weebly.com/uploads/1/0/5/4/105462933/6646dc1ab684f84f67a60dab5ebcb7d7.png"
                },
                {
                  "id": 6,
                  "name": "White Silk Blouse",
                  "type": "Physical",
                  "price": 35,
                  "inventory": 48,
                  "thumbnail": "http://frontend-trial-project.weebly.com/uploads/1/0/5/4/105462933/url.png"
                },
                {
                  "id": 7,
                  "name": "Ribbed V-Neck Sweater",
                  "type": "Physical",
                  "price": 52.5,
                  "inventory": 8,
                  "thumbnail": "http://frontend-trial-project.weebly.com/uploads/1/0/5/4/105462933/11718685.png"
                },
                {
                  "id": 8,
                  "name": "Ribbed Crew Neck Sweater",
                  "type": "Physical",
                  "price": 52.5,
                  "inventory": 9,
                  "thumbnail": "http://frontend-trial-project.weebly.com/uploads/1/0/5/4/105462933/goods-185120-sub3.png"
                },
                {
                  "id": 9,
                  "name": "Boat Neck Tee",
                  "type": "Physical",
                  "price": 25.8,
                  "inventory": 53,
                  "thumbnail": "http://frontend-trial-project.weebly.com/uploads/1/0/5/4/105462933/imageservice.png"
                },
                {
                  "id": 10,
                  "name": "Striped Crew Neck Tee",
                  "type": "Physical",
                  "price": 27.15,
                  "inventory": 41,
                  "thumbnail": "http://frontend-trial-project.weebly.com/uploads/1/0/5/4/105462933/img-thing.png"
                },
                {
                  "id": 11,
                  "name": "Floral Striped Button Down Shirt",
                  "type": "Physical",
                  "price": 50.99,
                  "inventory": 16,
                  "thumbnail": "http://frontend-trial-project.weebly.com/uploads/1/0/5/4/105462933/img-thing.png"
                },
                {
                  "id": 12,
                  "name": "Denim Jacket",
                  "type": "Physical",
                  "price": 80.8,
                  "inventory": 4,
                  "thumbnail": "http://frontend-trial-project.weebly.com/uploads/1/0/5/4/105462933/11708126.png"
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
        const oldSortColumn = this.get('sortColumn');
        let sortDesc = (oldSortColumn === sortColumn)
            ? !this.get('sortDesc')
            : false;
        this.set({sortColumn, sortDesc});
    },
});

// Export the instance.
export default app;