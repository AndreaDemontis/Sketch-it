`import { test, moduleForComponent } from 'ember-qunit'`
`import hbs from 'htmlbars-inline-precompile'`

moduleForComponent 'default-checkbox', 'Integration | Component | default checkbox', {
  integration: true
}

test 'it renders', (assert) ->
  assert.expect 2

  # Set any properties with @set 'myProperty', 'value'
  # Handle any actions with @on 'myAction', (val) ->

  @render hbs """{{default-checkbox}}"""

  assert.equal @$().text().trim(), ''

  # Template block usage:
  @render hbs """
    {{#default-checkbox}}
      template block text
    {{/default-checkbox}}
  """

  assert.equal @$().text().trim(), 'template block text'
