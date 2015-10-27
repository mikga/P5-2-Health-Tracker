var app = app || {};

// The Application
// ---------------

app.AppView = Backbone.View.extend({
  el: '.ctapp',

  totalCaloriesTemplate: _.template($('#total-calories').html()),

  events: {
    'keypress .new-food-name': 'createOnEnter',
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
  }

});