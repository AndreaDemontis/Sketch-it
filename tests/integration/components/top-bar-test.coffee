`import { test, moduleForComponent } from 'ember-qunit'`
`import hbs from 'htmlbars-inline-precompile'`

moduleForComponent 'top-bar', 'Integration | Component | top bar', {
  integration: true
}

test 'it renders', (assert) ->
  assert.expect 2

  # Set any properties with @set 'myProperty', 'value'
  # Handle any actions with @on 'myAction', (val) ->

  @render hbs """{{top-bar}}"""

  assert.equal @$().text().trim(), ''

  # Template block usage:
  @render hbs """
    {{#top-bar}}
      template block text
    {{/top-bar}}
  """

  assert.equal @$().text().trim(), 'template block text'
