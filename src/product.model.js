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
    initialize: function () {
        console.log('A ProductModel has been created!');
    },
});

const ProductCollection = Backbone.Collection.extend({
    model: ProductModel,
});

export { ProductModel, ProductCollection };