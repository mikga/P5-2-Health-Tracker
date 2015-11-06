var app = app || {};

/**
 * Food item view
 */
app.FoodView = Backbone.View.extend({

  // Generates a <li> tag
  tagName: 'li',

  // Uses a template
  template: _.template($('#food-item-template').html()),

  // Event handler
  events: {
    'click .destroy': 'clear',
  },

  /** Initialise the view */
  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.remove);
  },

  /** Render the view */
  render: function() {
    this.$el.html(this.template(this.model.attributes));

    this.$foodquantity = this.$('.edit-food-quantity');
    return this;
  },

  /** Delete the food item */
  clear: function() {
    this.model.destroy();
  }

});