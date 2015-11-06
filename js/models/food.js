var app = app || {};

/**
 * Food model
 */
app.Food = Backbone.Model.extend({

  defaults: {
    name: '',
    quantity: 0,
    caloriePerUnit: 0,
    itemCalorie: 0,
    servingSizeUnit: ''
  }

});
