
// Import external dependencies.
import Ractive from 'ractive';
import BackboneAdaptor from 'ractive-adaptors-backbone';
import Exoskeleton from 'exoskeleton';
import template from './app.html';
import sass from './app.sass';
import filter from 'lodash.filter';
import sortBy from 'lodash.sortby';
import clone from 'lodash.clone';
import isEmpty from 'lodash.isempty';
import productRow from './product-row.html';
import { ProductCollection } from './product.model';

// Configure our BB Adaptor
BackboneAdaptor.Backbone = Exoskeleton;

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
    adapt: [BackboneAdaptor],
    partials: {
        productRow,
    },
    data: function () {
        return {
            itemsPerPage: 10,
            pageIdx: 0,
            searchText: '',
            sortColumn: 'name',
            sortDesc: false,
            editingAll: false,
            products: new ProductCollection([
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
            ]),
            editing: {},
        }
    },
    computed: {
        sortedAndFilteredProducts: function () {

            // Sort and filter our products based on UI selections.
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

            return products;
        },
        pages: function () {

            // Populate an array of integers. This is used to populate the page selection dropdown.
            const sortedAndFilteredProducts = this.get('sortedAndFilteredProducts');
            const itemsPerPage = parseInt(this.get('itemsPerPage'));
            const numberOfPages = Math.ceil(sortedAndFilteredProducts.length / itemsPerPage);
            let pages = [];
            for (let i=0; i<numberOfPages; i++) {
                pages[i] = i+1;
            }
            return pages;
        },
        visibleProducts: function () {

            // Based on the selected page, page length, and filter... grab the currently displayed products.
            const pageIdx = this.get('pageIdx');
            const itemsPerPage = this.get('itemsPerPage');
            const products = this.get('sortedAndFilteredProducts');
            const startIdx = pageIdx * itemsPerPage;
            return products.slice(startIdx, startIdx + itemsPerPage);
        },
    },

    oninit: function () {
        this.observe('editingAll', function (editingAll) {
            const editing = {};
            if (editingAll) {
                this.get('products').forEach(product => editing[product.id] = clone(product));
            }
            else if (!editingAll && !isEmpty(this.get('editing'))) {
                console.log('TODO: Save Editing Changes!');
            }
            this.set({editing});
        });
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

    editProduct: function (product) {
        this.set(`editing.${product.id}`, clone(product));
    },
    saveEditedProduct: function (product) {
        window.console.info('Yeah, go ahead and save those changes.');
        this.set(`editing.${product.id}`, null);
    },
});

window.app = app;

// Export the instance.
export default app;