var app = app || {};

// Food model
// ----------

app.Food = Backbone.Model.extend({

  defaults: {
    name: '',
    amount: 0,
    caloriePerUnit: 0,
    totalCalorie: 0
  }

});
