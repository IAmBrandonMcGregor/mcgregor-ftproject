
// Import external dependencies.
import Ractive from 'ractive';
import BackboneAdaptor from 'ractive-adaptors-backbone';
import Exoskeleton from 'exoskeleton';
import _ from 'lodash';
import template from './app.html';
import sass from './app.sass';
import productRow from './product-row.html';
import productRowEdit from './product-row-edit.html';
import { ProductCollection, ProductModel } from './product.model';

// Configure our BB Adaptor
BackboneAdaptor.Backbone = Exoskeleton;

// Create our global Ractive application instance.
const app = Ractive({
    target: '#BrandonsFTProject',
    template,
    adapt: [BackboneAdaptor],
    partials: {
        productRow,
        productRowEdit,
    },
    data: function () {
        return {

            // UI controls - These are all modified directly by the user. Our computed properties respond.
            itemsPerPage: 10,
            pageIdx: 0,
            searchText: '',
            sortColumn: 'name',
            sortDesc: false,
            editingAll: false,

            // products - This stores ALL products from the server. The UI does not bind directly to
            //            this property. Instead it triggers computed-properties.
            products: new ProductCollection(),

            // editing - This is a map of draft Product Models by id. When a user edits a product,
            //           they're actually creating a cloned Product Model instance.
            editing: {},

            // new products - This is a collection of new models without IDs. This will render
            //                editing rows at the bottom and impacts table-page generation.
            newProducts: new ProductCollection(),
        }
    },
    computed: {

        // These properties are generated whenever any of the 'this.get(...)' properties change.
        // Ractive Computed Properties - https://ractive.js.org/api/#computed

        // sorted and filtered products - a vanilla array of Product Model instances. It's been 
        //                                sorted and filtered based on sort column, sort direction, and search text.
        sortedAndFilteredProducts: function () {

            // Cache references to our watched properties.
            const searchText = this.get('searchText').toLowerCase();
            const sortColumn = this.get('sortColumn');
            const sortDesc = this.get('sortDesc');
            let products = this.get('products');

            // Reduce our products by search text if present.
            if (searchText) {
                let name, price;
                products = products.filter(product => {
                    name = product.get('name').toLowerCase();
                    price = product.get('price').toString();
                    return name.includes(searchText) || price.includes(searchText);
                });
            }
            else
                products = products.models;

            // Sort by selected column.
            // TODO: Sort based on the BackboneCollection.comparator and .sort() calls.
            if (sortColumn) {
                products = _.sortBy(products, product => product.attributes[sortColumn]);

                if (sortDesc)
                    products.reverse(); // <- This is why we're utilizing a vanillajs array.
            }

            return products;
        },

        // pages - This populates the page selector dropdown. It's just an array of integers. It 
        //         regenerates based on how many sorted-and-filtered and new products we have. Items per page too.
        pages: function () {

            // Cache references to our watched properties.
            const sortedAndFilteredProductsLength = this.get('sortedAndFilteredProducts.length');
            const newProductsLength = this.get('newProducts.length');
            let itemsPerPage = parseInt(this.get('itemsPerPage'));

            // Factor in the number of new products we have to keep on screen.
            itemsPerPage = itemsPerPage - newProductsLength;
            if (itemsPerPage < 0)
                itemsPerPage = 0;

            // Determine how many pages we'll need and create an array of that length.
            const numberOfPages = Math.ceil(sortedAndFilteredProductsLength / itemsPerPage);
            let pages = [];
            for (let i=0; i<numberOfPages; i++) {
                pages[i] = i+1;
            }
            return pages;
        },

        // visible products - This is a vanilla array of Product Models. Only those that are present
        //                    in the UI based on sorting, filtering, and paging.
        visibleProducts: function () {

            // Cache references to our watched properties.
            const pageIdx = this.get('pageIdx');
            const products = this.get('sortedAndFilteredProducts');
            const newProductsLength = this.get('newProducts.length');
            let itemsPerPage = this.get('itemsPerPage');
            
            // Factor in the number of new products we have to keep on screen.
            itemsPerPage = itemsPerPage - newProductsLength;
            if (itemsPerPage < 0)
                itemsPerPage = 0;

            // Compute the start and end indexes.
            const startIdx = pageIdx * itemsPerPage;
            const endIdx = startIdx + itemsPerPage;

            // Unfortunately, the Backbone Adaptor does not work with computed properties. :'(
            // We still want to use the Collection.toJSON method though because our 'products' are Backbone Models.
            return new ProductCollection( products.slice(startIdx, endIdx) ).toJSON();
        },
    },

    oninit: function () {

        // Request product information.
        this.get('products').fetch();

        // Setup a listener on the editing-all checkbox.
        this.observe('editingAll', function (editingAll) {
            const editing = this.get('editing');
            const products = this.get('products');

            // Set all products to being edited.
            if (editingAll) { 
                products.forEach(product => {
                    if (!editing[product.id])
                        editing[product.id] = product.clone();
                });
            }

            // Save all of the edited products.
            else { 
                _.forEach(editing, editedProduct => {
                    if (editedProduct === null)
                        return;
                    else if (!_.isEmpty(editedProduct.changed))
                        this.saveEditedProduct(editedProduct);
                    else
                        delete editing[editedProduct.id];
                });
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
        this.set(`editing.${product.id}`, new ProductModel(_.clone(product)));
    },
    saveEditedProduct: function (product, checkbox) {

        // Grab our Backbone Model if we've received a keypath.
        if (typeof product === 'string') {
            product = this.get(product);
        }

        // If the model is valid, save it...
        if (product.isValid()) {
            
            // Ignore if nothing has changed.
            if (_.isEmpty(product.changed)) {
                console.log('Yo dog!, nothing has changed!');
                return this.set(`editing.${product.id}`, null);
            }

            // Make the HTTP request to save.
            product.save()
            .then(() => {
                window.console.info(`We've successfully saved the product changes`);
            })

            // TODO: this call is failing due to backbone using OPTIONS as the method for CORS.
            .catch(err => {
                window.console.info(`There was an issue : ${err}`, err);
                //this.set(`editing.${product.id}`, product);
            })
            .then(() => {
                this.get('products').remove(product.id);
                this.get('newProducts').remove(product.id);
                this.get('products').add(product);
            });
        }

        // ...otherwise, don't allow it to be saved.
        else {
            console.log('This model is not valid!');
            if (checkbox) {
                window.requestAnimationFrame(function () {
                    checkbox.checked = true;
                });
            }
            return false;
        }

        this.set(`editing.${product.id}`, null);
        return true;
    },
    addNewProduct: function () {
        
        // Cache some references to view-data.
        const newProducts = this.get('newProducts');
        const itemsPerPage = this.get('itemsPerPage');

        // Only allow new products to be added if they fit in the table.
        if (newProducts.length < itemsPerPage-1)
            newProducts.add({});
    },
});

window.app = app;

// Export the instance.
export default app;