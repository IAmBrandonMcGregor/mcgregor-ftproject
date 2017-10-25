import Backbone from 'backbone';

const ProductModel = Backbone.Model.extend({
    urlRoot: '/apiary/some-url',
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
        if (typeof attributes.quantity !== 'number' || attributes.quantity % 1 === 0)
            errors.push('ProductModel.name must be an integer.');
        if (!typeof attributes.price !== 'number')
            errors.push('ProductModel.price must be a number.');

        if (errors.length)
            return errors;
    }
});

const ProductCollection = Backbone.Collection.extend({
    model: ProductModel,
});

export { ProductModel, ProductCollection };