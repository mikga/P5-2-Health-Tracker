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
  },

  validate: function(attrs, options) {
    var err = [];

    if (!attrs.name) {
      err.push({attr: 'name', message: 'Food name is not valid.'});
    }

    if (!attrs.quantity || isNaN(attrs.quantity)) {
      err.push({attr: 'quantity', message: 'Quantity is not valid.'});
    }

    if (!attrs.caloriePerUnit || isNaN(attrs.caloriePerUnit)) {
      err.push({attr: 'caloriePerUnit', message: 'Calorie is not valid.'});
    }

    if (err.length > 0) {
      return err;
    }

  }

});
