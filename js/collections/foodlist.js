var app = app || {};

/**
 * Food List Collection
 */
var FoodList = Backbone.Firebase.Collection.extend({

  model: app.Food,

  // Firebase URL
  // Using firebase to store the food list doesn't make sense for this application
  // particularly when multiple people concurrently access this app, unless the list is
  // stored separately for each session, but this is used just to show that I can use Firebase APIs.
  url: "https://glowing-heat-9347.firebaseio.com",

  /** Return total calories of the food in the collection */
  totalCalories: function() {
    return _.reduce(this.models, function(t, f){return t + f.attributes.itemCalorie; }, 0);
  }

});

// Add collection to app
app.FoodList = new FoodList();