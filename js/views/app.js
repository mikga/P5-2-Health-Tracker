var app = app || {};

// The Application
// ---------------

app.AppView = Backbone.View.extend({
  el: '.ctapp',

  totalCaloriesTemplate: _.template($('#total-calories').html()),

  events: {
    // 'keypress .new-food-name': 'createOnEnter',
    'keyup .new-food-name': 'searchFood',
    'keypress .new-food-amount': 'createOnEnter',
    'keypress .new-food-calorie': 'createOnEnter'
  },

  initialize: function() {
    this.$main = this.$('main');
    this.$footer = this.$('footer');
    this.$foodname = this.$('.new-food-name');
    this.$foodamount = this.$('.new-food-amount');
    this.$foodcalorie = this.$('.new-food-calorie');


    this.listenTo(app.FoodList, 'add', this.addOne);
    this.listenTo(app.FoodList, 'reset', this.addAll);
    this.listenTo(app.FoodList, 'all', this.render);

  },

  render: function() {
    var totalCalories = app.FoodList.totalCalories();

    if (app.FoodList.length) {
      this.$main.show();
      this.$footer.show();

      this.$footer.html(this.totalCaloriesTemplate({
        totalCalories: totalCalories
      }));
    } else {
      this.$main.hide();
      this.$footer.hide();
    }
  },

  addOne: function(food) {
    var view = new app.FoodView({model: food});
    $('.food-list').append(view.render().el);
  },

  addAll: function() {
    this.$('food-list').html('');
    app.FoodList.each(this.addOne, this);
  },

  newAttributes: function() {

    var name = this.$foodname.val().trim();
    var amount = parseInt(this.$foodamount.val().trim());
    var caloriePerUnit = parseInt(this.$foodcalorie.val().trim());

    return {
      name: name,
      amount: amount,
      caloriePerUnit: caloriePerUnit,
      totalCalorie: (function(a, c){
        return a * c;
      })(amount, caloriePerUnit)
    };
  },

  createOnEnter: function(e) {
    if (e.which !== ENTER_KEY || !(this.$foodname.val().trim() && this.$foodamount.val().trim()) ) {
      return;
    }
    app.FoodList.create(this.newAttributes());
    this.$foodname.val('');
    this.$foodamount.val('');
    this.$foodcalorie.val('');
  },

  searchFood: function() {
    var name = this.$foodname.val().trim();
    var url = 'https://api.nutritionix.com/v1_1/search/' + name + '?fields=item_name%2Citem_id%2Cbrand_name%2Cnf_calories%2Cnf_serving_size_unit%2Cnf_serving_size_qty%2Cnf_serving_weight_grams&appId=ab67ebd5&appKey=ff8d79e60c8d9447ddf0457786be4f77';
    $('.search-results').html('');

    console.log('Search term: ' + name);

    if (name) {

      $.ajax({
        url: url
      }).done(function(msg) {
        var itemName,
            itemId,
            brandName,
            nfCalories,
            nfServingSizeUnit,
            nfServingSizeQty,
            nfServingWeightGrams;

        var items = msg.hits;

        for (var i = 0, len = items.length; i < len; i++){
          itemName = items[i].fields.item_name;
          itemId = items[i].fields.item_id;
          brandName = items[i].fields.brand_name;
          nfCalories = items[i].fields.nf_calories;
          nfServingSizeUnit = items[i].fields.nf_serving_size_unit;
          nfServingSizeQty = items[i].fields.nf_serving_size_qty;
          nfServingWeightGrams = items[i].fields.nf_serving_weight_grams;

          $('.search-results').append('<li class="search-result-item"><span class="item-name">' + itemName + '</span> / <span class="brand-name">' + brandName + '</span></li>');
          // console.log('Item name: ' + itemName + ', brandName: ' + brandName + ', nf_calories: ' + nfCalories + ', nf_serving_size_unit: ' + nfServingSizeUnit + ', nf_serving_size_qty: ' + nfServingSizeQty + ', nf_serving_weight_grams: ' + nfServingWeightGrams);
        }

      }).fail(function(jqXHR, textStatus) {
        console.log( "Request failed: " + textStatus );
      });

    }
  }

});