import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('inputs/default-color', 'Integration | Component | inputs/default color', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{inputs/default-color}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#inputs/default-color}}
      template block text
    {{/inputs/default-color}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
