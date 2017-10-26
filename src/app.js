
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
            itemsPerPage: 10,
            pageIdx: 0,
            searchText: '',
            sortColumn: 'name',
            sortDesc: false,
            editingAll: false,
            products: new ProductCollection(),
            editing: {},
            newProducts: new ProductCollection(),
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
                products = products.filter(product => {
                    name = product.get('name').toLowerCase();
                    price = product.get('price').toString();
                    return name.includes(searchText) || price.includes(searchText);
                });
            }
            else
                products = products.models;

            // Sort by selected column.
            if (sortColumn) {
                products = _.sortBy(products, product => product.attributes[sortColumn]);

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
            const newProducts = this.get('newProducts');
            let startIdx = (pageIdx * itemsPerPage) - newProducts.length;
            if (startIdx < 0)
                startIdx = 0;

            // Unfortunately, the Backbone Adaptor does not work with computed properties. :'(
            return new ProductCollection(products.slice(startIdx, startIdx + itemsPerPage - newProducts.length)).toJSON();
        },
    },

    oninit: function () {

        // Request product information.
        this.get('products').fetch();

        // Setup a listener on the editing-all checkbox.
        this.observe('editingAll', function (editingAll) {
            const editing = this.get('editing');
            const products = this.get('products');

            if (editingAll) { // Set all products to being edited.
                products.forEach(product => {
                    if (!editing[product.id])
                        editing[product.id] = product.clone();
                });
            }
            else { // Save all of the edited products.
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
});

window.app = app;

// Export the instance.
export default app;