import Backbone from 'backbone';

const ProductModel = Backbone.Model.extend({
    urlRoot: 'https://private-anon-c447f6f7d4-weeblyfrontendtrialapi.apiary-mock.com/products',
    defaults: function () {
        return {
            name: '',
            type: '',
            price: 0.0,
            inventory: 0,
            thumbnail: '//placehold.it/30x30',
        };
    },
    validate: function (attributes) {
        const errors = [];
        if (!attributes.name || !attributes.name.trim())
            errors.push('ProductModel.name is missing.');
        if (typeof attributes.inventory !== 'number' || attributes.inventory % 1 !== 0)
            errors.push('ProductModel.name must be an integer.');
        if (typeof attributes.price !== 'number')
            errors.push('ProductModel.price must be a number.');

        if (errors.length)
            return errors;
    }
});

const ProductCollection = Backbone.Collection.extend({
    model: ProductModel,
    url: 'https://private-anon-c447f6f7d4-weeblyfrontendtrialapi.apiary-mock.com/products',
});

export { ProductModel, ProductCollection };