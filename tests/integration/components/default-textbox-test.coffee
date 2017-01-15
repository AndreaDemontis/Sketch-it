`import { test, moduleForComponent } from 'ember-qunit'`
`import hbs from 'htmlbars-inline-precompile'`

moduleForComponent 'default-textbox', 'Integration | Component | default textbox', {
  integration: true
}

test 'it renders', (assert) ->
  assert.expect 2

  # Set any properties with @set 'myProperty', 'value'
  # Handle any actions with @on 'myAction', (val) ->

  @render hbs """{{default-textbox}}"""

  assert.equal @$().text().trim(), ''

  # Template block usage:
  @render hbs """
    {{#default-textbox}}
      template block text
    {{/default-textbox}}
  """

  assert.equal @$().text().trim(), 'template block text'
