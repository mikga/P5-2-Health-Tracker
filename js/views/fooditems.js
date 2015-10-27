var app = app || {};

// Food item view
// ----------------

app.FoodView = Backbone.View.extend({

  tagName: 'li',
  template: _.template($('#food-item-template').html()),

  events: {
    'click .destroy': 'clear',
    'dblclick span': 'edit',
    'keypress .edit-food-amount': 'updateOnEnter',
    'blur .edit-food-amount': 'close'
  },

  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.remove);
  },

  render: function() {
    this.$el.html(this.template(this.model.attributes));

    this.$foodamount = this.$('.edit-food-amount');
    return this;
  },

  edit: function() {
    this.$el.addClass('editing');
    this.$foodamount.focus();
  },

  close: function() {
    var value = this.$foodamount.val().trim();

    if (value) {
      this.model.save({amount: value});
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