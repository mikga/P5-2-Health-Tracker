var app = app || {};

// Food item view
// ----------------

app.FoodView = Backbone.View.extend({

  tagName: 'li',
  template: _.template($('#food-item-template').html()),

  events: {
    'click .destroy': 'clear',
    'dblclick span': 'edit',
    'keypress .edit-food-quantity': 'updateOnEnter',
    'blur .edit-food-quantity': 'close'
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

  edit: function() {
    this.$el.addClass('editing');
    this.$foodquantity.focus();
  },

  close: function() {
    var value = this.$foodquantity.val().trim();

    if (value) {
      this.model.save({quantity: value});
    }

    this.$el.removeClass('editing');
  },

  updateOnEnter: function(e) {
    if (e.which === ENTER_KEY) {
      this.close();
    }
  },

  clear: function() {
    this.model.destroy();
  }

});