`import { test, moduleForComponent } from 'ember-qunit'`
`import hbs from 'htmlbars-inline-precompile'`

moduleForComponent 'default-slider', 'Integration | Component | default slider', {
  integration: true
}

test 'it renders', (assert) ->
  assert.expect 2

  # Set any properties with @set 'myProperty', 'value'
  # Handle any actions with @on 'myAction', (val) ->

  @render hbs """{{default-slider}}"""

  assert.equal @$().text().trim(), ''

  # Template block usage:
  @render hbs """
    {{#default-slider}}
      template block text
    {{/default-slider}}
  """

  assert.equal @$().text().trim(), 'template block text'
