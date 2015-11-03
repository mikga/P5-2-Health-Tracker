var app = app || {};

// Food item view
// ----------------

app.FoodView = Backbone.View.extend({

  tagName: 'li',
  template: _.template($('#food-item-template').html()),

  events: {
    'click .destroy': 'clear',
  },

  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.remove);
  },

  render: function() {
    this.$el.html(this.template(this.model.attributes));

    this.$foodquantity = this.$('.edit-food-quantity');
    return this;
  },

  clear: function() {
    this.model.destroy();
  }

});