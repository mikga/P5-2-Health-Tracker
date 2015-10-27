var app = app || {};

// Food List Collection
// --------------------

var FoodList = Backbone.Firebase.Collection.extend({

  model: app.Food,

  // Firebase URL
  url: "https://glowing-heat-9347.firebaseio.com",

  totalCalories: function() {
    // var tc;
    // var foodItems = this.models;

    // console.log(foodItems);
    // for (var i = 0, len = foodItems.length; i < len; i++){
    //   tc =+ foodItems[i].attributes.totalCalorie;
    // }
    // return tc;

    return _.reduce(this.models, function(t, f){return t + f.attributes.totalCalorie; }, 0);
  }

});

app.FoodList = new FoodList();