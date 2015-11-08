var app = app || {};

/**
 * The Application view
 */
app.AppView = Backbone.View.extend({
  el: '.ctapp',

  // Template for the total calories field
  totalCaloriesTemplate: _.template($('#total-calories').html()),

  // Event handlers
  events: {
    'keyup .new-food-quantity': 'updateTotal',
    'keyup .new-food-calorie': 'updateTotal',
    'click .add-food': 'createOne',
    'click .new-food-name': 'clearErrorMessage',
    'click .new-food-quantity': 'clearErrorMessage',
    'click .new-food-calorie': 'clearErrorMessage'

  },

  /** Initialise the applicaiton view */
  initialize: function() {
    this.$main = this.$('main');
    this.$tableHeader = this.$('.table-header');
    this.$footer = this.$('footer');
    this.$foodname = this.$('.new-food-name');
    this.$foodquantity = this.$('.new-food-quantity');
    this.$foodcalorie = this.$('.new-food-calorie');
    this.$servingSizeUnit = this.$('.serving-size-unit');
    this.$itemCalorie = this.$('.item-calorie');
    this.$errorMessage = this.$('.error-message');

    // Listen to events
    this.listenTo(app.FoodList, 'add', this.addOne);
    this.listenTo(app.FoodList, 'reset', this.addAll);
    this.listenTo(app.FoodList, 'all', this.render);

    // Variable for autocomplete
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

        // Update the fields with the selected item
        foodname.val(ui.item.value);
        foodquantity.val('1');
        foodcalorie.val(ui.item.nfCalories);
        servingSizeUnit.text(ui.item.nfServingSizeUnit);
        itemCalorie.text(calorie);

      },
      error: function(event, ui) {
        // When the ajax request fails, a message is shown to the console but nothing is shown to the browser
        // because the autocomplete is not a critical functionality
        console.log( "Request failed: " + textStatus );
      },
      messages: {
        noResults: '',
        results: function() {}
      },
      appendTo: '.food-name-input'
    });

  },

  /** Render the application view */
  render: function() {

    var totalCalories = app.FoodList.totalCalories();

    // Display or hide the list of food and total calories information
    if (app.FoodList.length) {
      this.$main.show();
      this.$tableHeader.show();
      this.$footer.show();

      this.$footer.html(this.totalCaloriesTemplate({
        totalCalories: totalCalories
      }));
    } else {
      this.$main.hide();
      this.$tableHeader.hide();
      this.$footer.hide();
    }
  },

  /** Update total calorie */
  updateTotal: function() {
    var calorie_per_unit = parseFloat(this.$foodcalorie.val().trim());
    var quantity = parseFloat(this.$foodquantity.val().trim());
    var calorie = (!isNaN(calorie_per_unit) && !isNaN(quantity)) ? (calorie_per_unit * quantity).toFixed(2) : '-';

    this.$itemCalorie.text(calorie);
  },

  /** Add a food item to the view */
  addOne: function(food) {
    var view = new app.FoodView({model: food});
    $('.food-list').append(view.render().el);
  },

  /** Add all food items to the view */
  addAll: function() {
    this.$('food-list').html('');
    app.FoodList.each(this.addOne, this);
  },

  /** Helper function to create a food item */
  newAttributes: function() {
    var name = this.$foodname.val().trim();
    var quantity = parseInt(this.$foodquantity.val().trim());
    var caloriePerUnit = parseInt(this.$foodcalorie.val().trim());
    var servingSizeUnit = this.$servingSizeUnit.text();

    return {
      name: name,
      quantity: quantity,
      caloriePerUnit: caloriePerUnit,
      itemCalorie: (function(a, c){
        return a * c;
      })(quantity, caloriePerUnit),
      servingSizeUnit: servingSizeUnit
    };
  },

  /** Add a food item to the list */
  createOne: function(e) {

    var food = new app.Food(this.newAttributes());

    // Check if the input values are valid and if not, add the error messages
    if (!food.isValid()) {
      var errs = food.validationError;
      var elem;
      for (var i = 0, len = errs.length; i < len; i++) {
        if (errs[i].attr === 'name') {
          elem = this.$foodname;
        } else if (errs[i].attr === 'quantity') {
          elem = this.$foodquantity;
        } else if (errs[i].attr === 'caloriePerUnit') {
          elem = this.$foodcalorie;
        }
        elem.addClass('invalid');
        elem.parent().append('<p class="error-message">' + errs[i].message + '</p>');
      }
      return;
    }

    app.FoodList.create(this.newAttributes());
    this.$foodname.val('');
    this.$foodquantity.val('');
    this.$foodcalorie.val('');
    this.$servingSizeUnit.text('Unit');
    this.$itemCalorie.text('-');
  },

  clearErrorMessage: function(e){
    $('.invalid').removeClass('invalid');
    $('.error-message').remove();
  }

});