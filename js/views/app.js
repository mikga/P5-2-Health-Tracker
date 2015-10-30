var app = app || {};

// The Application
// ---------------

app.AppView = Backbone.View.extend({
  el: '.ctapp',

  totalCaloriesTemplate: _.template($('#total-calories').html()),

  events: {
    // 'keypress .new-food-name': 'createOnEnter',
    // 'keyup .new-food-name': 'searchFood',
    'keyup .new-food-quantity': 'updateTotal',
    'keyup .new-food-calorie': 'updateTotal',
    'click .add-food': 'createOne'

  },

  initialize: function() {
    this.$main = this.$('main');
    this.$footer = this.$('footer');
    this.$foodname = this.$('.new-food-name');
    this.$foodquantity = this.$('.new-food-quantity');
    this.$foodcalorie = this.$('.new-food-calorie');
    this.$servingSizeUnit = this.$('.serving-size-unit');
    this.$itemCalorie = this.$('.item-calorie');


    this.listenTo(app.FoodList, 'add', this.addOne);
    this.listenTo(app.FoodList, 'reset', this.addAll);
    this.listenTo(app.FoodList, 'all', this.render);
  },

  render: function() {
    var totalCalories = app.FoodList.totalCalories();
    var foodname = this.$foodname;
    var foodcalorie = this.$foodcalorie;
    var foodquantity = this.$foodquantity;
    var servingSizeUnit = this.$servingSizeUnit;
    var itemCalorie = this.$itemCalorie;

    // Add autocomplete to the search field
    $('#autocomplete').autocomplete({
      source: function(request, response) {
        var name = request.term;
        var url = 'https://api.nutritionix.com/v1_1/search/' + name + '?fields=item_name%2Citem_id%2Cbrand_name%2Cnf_calories%2Cnf_serving_size_unit%2Cnf_serving_size_qty%2Cnf_serving_weight_grams&appId=ab67ebd5&appKey=ff8d79e60c8d9447ddf0457786be4f77';

        $.ajax({
          url: url
        }).done(function(msg) {
          response(_.map(msg.hits, function(item) {
            return {
              value: item.fields.item_name + ' / ' + item.fields.brand_name,
              nfCalories: item.fields.nf_calories,
              nfServingSizeUnit: item.fields.nf_serving_size_unit,
              nfServingSizeQty: item.fields.nf_serving_size_qty,
              nfServingWeightGrams: item.fields.nf_serving_weight_grams,
              obj: item
            };
          }));
        });
      },
      select: function(event, ui) {
        var calorie = parseFloat(ui.item.nfCalories) * parseFloat(ui.item.nfServingSizeQty);

        foodname.val(ui.item.value);
        foodquantity.val('1');
        foodcalorie.val(ui.item.nfCalories);
        servingSizeUnit.text(ui.item.nfServingSizeUnit);
        itemCalorie.text(calorie);

      },
      error: function(event, ui) {
        console.log( "Request failed: " + textStatus );
      },
      messages: {
        noResults: '',
        results: function() {}
      }
    });


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



  updateTotal: function() {
    var calorie_per_unit = parseFloat(this.$foodcalorie.val().trim());
    var quantity = parseFloat(this.$foodquantity.val().trim());
    var calorie = (!isNaN(calorie_per_unit) && !isNaN(quantity)) ? (calorie_per_unit * quantity).toFixed(2) : '-';

    this.$itemCalorie.text(calorie);
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
    var quantity = parseInt(this.$foodquantity.val().trim());
    var caloriePerUnit = parseInt(this.$foodcalorie.val().trim());

    return {
      name: name,
      quantity: quantity,
      caloriePerUnit: caloriePerUnit,
      itemCalorie: (function(a, c){
        return a * c;
      })(quantity, caloriePerUnit)
    };
  },

  createOne: function(e) {
    if (!(this.$foodname.val().trim() && this.$foodquantity.val().trim()) ) {
      return;
    }
    app.FoodList.create(this.newAttributes());
    this.$foodname.val('');
    this.$foodquantity.val('');
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