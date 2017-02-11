import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('inputs/default-confirm-button', 'Integration | Component | inputs/default confirm button', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{inputs/default-confirm-button}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#inputs/default-confirm-button}}
      template block text
    {{/inputs/default-confirm-button}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
