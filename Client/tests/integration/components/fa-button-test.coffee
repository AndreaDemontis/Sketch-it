`import { test, moduleForComponent } from 'ember-qunit'`
`import hbs from 'htmlbars-inline-precompile'`

moduleForComponent 'fa-button', 'Integration | Component | fa button', {
  integration: true
}

test 'it renders', (assert) ->
  assert.expect 2

  # Set any properties with @set 'myProperty', 'value'
  # Handle any actions with @on 'myAction', (val) ->

  @render hbs """{{fa-button}}"""

  assert.equal @$().text().trim(), ''

  # Template block usage:
  @render hbs """
    {{#fa-button}}
      template block text
    {{/fa-button}}
  """

  assert.equal @$().text().trim(), 'template block text'
