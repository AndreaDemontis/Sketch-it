`import { test, moduleForComponent } from 'ember-qunit'`
`import hbs from 'htmlbars-inline-precompile'`

moduleForComponent 'default-radiobutton', 'Integration | Component | default radiobutton', {
  integration: true
}

test 'it renders', (assert) ->
  assert.expect 2

  # Set any properties with @set 'myProperty', 'value'
  # Handle any actions with @on 'myAction', (val) ->

  @render hbs """{{default-radiobutton}}"""

  assert.equal @$().text().trim(), ''

  # Template block usage:
  @render hbs """
    {{#default-radiobutton}}
      template block text
    {{/default-radiobutton}}
  """

  assert.equal @$().text().trim(), 'template block text'
