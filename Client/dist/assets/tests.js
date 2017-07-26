'use strict';

define('Sketch-it/tests/app.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | app.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app.js should pass jshint.');
  });
});
define('Sketch-it/tests/components/animations/fade-slide.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | components/animations/fade-slide.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/animations/fade-slide.js should pass jshint.');
  });
});
define('Sketch-it/tests/components/charts/radial-chart.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | components/charts/radial-chart.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/charts/radial-chart.js should pass jshint.');
  });
});
define('Sketch-it/tests/components/chat-controller.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | components/chat-controller.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/chat-controller.js should pass jshint.\ncomponents/chat-controller.js: line 35, col 51, \'value\' is defined but never used.\ncomponents/chat-controller.js: line 35, col 48, \'i\' is defined but never used.\ncomponents/chat-controller.js: line 35, col 13, \'$\' is not defined.\ncomponents/chat-controller.js: line 37, col 36, \'$\' is not defined.\n\n4 errors');
  });
});
define('Sketch-it/tests/components/draw-area.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | components/draw-area.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/draw-area.js should pass jshint.\ncomponents/draw-area.js: line 5, col 96, Expected \'===\' and instead saw \'==\'.\ncomponents/draw-area.js: line 6, col 94, Expected \'===\' and instead saw \'==\'.\ncomponents/draw-area.js: line 7, col 97, Expected \'===\' and instead saw \'==\'.\ncomponents/draw-area.js: line 8, col 100, Expected \'===\' and instead saw \'==\'.\ncomponents/draw-area.js: line 9, col 97, Expected \'===\' and instead saw \'==\'.\ncomponents/draw-area.js: line 10, col 95, Expected \'===\' and instead saw \'==\'.\ncomponents/draw-area.js: line 33, col 19, Expected \'===\' and instead saw \'==\'.\ncomponents/draw-area.js: line 217, col 42, \'mouse\' is defined but never used.\ncomponents/draw-area.js: line 239, col 10, Missing semicolon.\ncomponents/draw-area.js: line 243, col 17, \'context\' is defined but never used.\ncomponents/draw-area.js: line 241, col 33, \'mouse\' is defined but never used.\ncomponents/draw-area.js: line 264, col 31, Expected \'!==\' and instead saw \'!=\'.\ncomponents/draw-area.js: line 264, col 51, Expected \'!==\' and instead saw \'!=\'.\ncomponents/draw-area.js: line 286, col 31, Expected \'===\' and instead saw \'==\'.\ncomponents/draw-area.js: line 298, col 34, Expected \'===\' and instead saw \'==\'.\ncomponents/draw-area.js: line 335, col 18, Expected \'{\' and instead saw \'this\'.\ncomponents/draw-area.js: line 351, col 22, \'i\' is already defined.\ncomponents/draw-area.js: line 385, col 21, Expected \'{\' and instead saw \'continue\'.\ncomponents/draw-area.js: line 447, col 21, Function declarations should not be placed in blocks. Use a function expression or move the statement to the top of the outer function.\ncomponents/draw-area.js: line 472, col 21, Function declarations should not be placed in blocks. Use a function expression or move the statement to the top of the outer function.\ncomponents/draw-area.js: line 475, col 22, Unnecessary semicolon.\ncomponents/draw-area.js: line 477, col 21, Function declarations should not be placed in blocks. Use a function expression or move the statement to the top of the outer function.\ncomponents/draw-area.js: line 518, col 22, Unnecessary semicolon.\ncomponents/draw-area.js: line 520, col 21, Function declarations should not be placed in blocks. Use a function expression or move the statement to the top of the outer function.\ncomponents/draw-area.js: line 531, col 22, Unnecessary semicolon.\ncomponents/draw-area.js: line 533, col 21, Function declarations should not be placed in blocks. Use a function expression or move the statement to the top of the outer function.\ncomponents/draw-area.js: line 609, col 22, Unnecessary semicolon.\ncomponents/draw-area.js: line 621, col 92, Expected \'!==\' and instead saw \'!=\'.\ncomponents/draw-area.js: line 636, col 63, Missing semicolon.\ncomponents/draw-area.js: line 642, col 22, \'i\' is already defined.\n\n30 errors');
  });
});
define('Sketch-it/tests/components/friend-block.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | components/friend-block.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/friend-block.js should pass jshint.');
  });
});
define('Sketch-it/tests/components/game-result.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | components/game-result.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/game-result.js should pass jshint.\ncomponents/game-result.js: line 132, col 13, \'that\' is defined but never used.\ncomponents/game-result.js: line 139, col 75, \'rev\' is defined but never used.\n\n2 errors');
  });
});
define('Sketch-it/tests/components/inputs/default-button.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | components/inputs/default-button.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/inputs/default-button.js should pass jshint.');
  });
});
define('Sketch-it/tests/components/inputs/default-checkbox.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | components/inputs/default-checkbox.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/inputs/default-checkbox.js should pass jshint.');
  });
});
define('Sketch-it/tests/components/inputs/default-color.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | components/inputs/default-color.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/inputs/default-color.js should pass jshint.');
  });
});
define('Sketch-it/tests/components/inputs/default-confirm-button.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | components/inputs/default-confirm-button.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/inputs/default-confirm-button.js should pass jshint.');
  });
});
define('Sketch-it/tests/components/inputs/default-numberbox.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | components/inputs/default-numberbox.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/inputs/default-numberbox.js should pass jshint.');
  });
});
define('Sketch-it/tests/components/inputs/default-radiobutton.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | components/inputs/default-radiobutton.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/inputs/default-radiobutton.js should pass jshint.');
  });
});
define('Sketch-it/tests/components/inputs/default-select.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | components/inputs/default-select.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/inputs/default-select.js should pass jshint.');
  });
});
define('Sketch-it/tests/components/inputs/default-slider.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | components/inputs/default-slider.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/inputs/default-slider.js should pass jshint.');
  });
});
define('Sketch-it/tests/components/inputs/default-textbox.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | components/inputs/default-textbox.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/inputs/default-textbox.js should pass jshint.');
  });
});
define('Sketch-it/tests/components/inputs/fa-button.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | components/inputs/fa-button.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/inputs/fa-button.js should pass jshint.');
  });
});
define('Sketch-it/tests/components/inputs/select-item.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | components/inputs/select-item.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/inputs/select-item.js should pass jshint.');
  });
});
define('Sketch-it/tests/components/notifications-menu.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | components/notifications-menu.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/notifications-menu.js should pass jshint.');
  });
});
define('Sketch-it/tests/components/room-list-entry.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | components/room-list-entry.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/room-list-entry.js should pass jshint.\ncomponents/room-list-entry.js: line 39, col 16, Missing \'new\' prefix when invoking a constructor.\ncomponents/room-list-entry.js: line 3, col 14, \'require\' is not defined.\n\n2 errors');
  });
});
define('Sketch-it/tests/components/room-list-new.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | components/room-list-new.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/room-list-new.js should pass jshint.');
  });
});
define('Sketch-it/tests/components/top-bar.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | components/top-bar.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/top-bar.js should pass jshint.\ncomponents/top-bar.js: line 2, col 16, \'require\' is not defined.\n\n1 error');
  });
});
define('Sketch-it/tests/components/user-profile.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | components/user-profile.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/user-profile.js should pass jshint.\ncomponents/user-profile.js: line 42, col 13, \'that\' is defined but never used.\ncomponents/user-profile.js: line 47, col 75, \'rev\' is defined but never used.\n\n2 errors');
  });
});
define('Sketch-it/tests/electron', ['exports'], function (exports) {
    /* jshint undef: false */

    var BrowserWindow = require('electron').BrowserWindow;
    var app = require('electron').app;

    var mainWindow = null;

    app.on('window-all-closed', function onWindowAllClosed() {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    app.on('ready', function onReady() {
        mainWindow = new BrowserWindow({
            width: 800,
            height: 600,
            backgroundThrottling: false
        });

        delete mainWindow.module;

        if (process.env.EMBER_ENV === 'test') {
            mainWindow.loadURL('file://' + __dirname + '/index.html');
        } else {
            mainWindow.loadURL('file://' + __dirname + '/dist/index.html');
        }

        mainWindow.on('closed', function onClosed() {
            mainWindow = null;
        });
    });

    /* jshint undef: true */
});
define('Sketch-it/tests/electron.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | electron.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'electron.js should pass jshint.');
  });
});
define('Sketch-it/tests/helpers/destroy-app', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = destroyApp;

  function destroyApp(application) {
    _ember['default'].run(application, 'destroy');
  }
});
define('Sketch-it/tests/helpers/destroy-app.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | helpers/destroy-app.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/destroy-app.js should pass jshint.');
  });
});
define('Sketch-it/tests/helpers/module-for-acceptance', ['exports', 'qunit', 'ember', 'Sketch-it/tests/helpers/start-app', 'Sketch-it/tests/helpers/destroy-app'], function (exports, _qunit, _ember, _SketchItTestsHelpersStartApp, _SketchItTestsHelpersDestroyApp) {
  var Promise = _ember['default'].RSVP.Promise;

  exports['default'] = function (name) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    (0, _qunit.module)(name, {
      beforeEach: function beforeEach() {
        this.application = (0, _SketchItTestsHelpersStartApp['default'])();

        if (options.beforeEach) {
          return options.beforeEach.apply(this, arguments);
        }
      },

      afterEach: function afterEach() {
        var _this = this;

        var afterEach = options.afterEach && options.afterEach.apply(this, arguments);
        return Promise.resolve(afterEach).then(function () {
          return (0, _SketchItTestsHelpersDestroyApp['default'])(_this.application);
        });
      }
    });
  };
});
define('Sketch-it/tests/helpers/module-for-acceptance.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | helpers/module-for-acceptance.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/module-for-acceptance.js should pass jshint.');
  });
});
define('Sketch-it/tests/helpers/resolver', ['exports', 'Sketch-it/resolver', 'Sketch-it/config/environment'], function (exports, _SketchItResolver, _SketchItConfigEnvironment) {

  var resolver = _SketchItResolver['default'].create();

  resolver.namespace = {
    modulePrefix: _SketchItConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _SketchItConfigEnvironment['default'].podModulePrefix
  };

  exports['default'] = resolver;
});
define('Sketch-it/tests/helpers/resolver.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | helpers/resolver.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/resolver.js should pass jshint.');
  });
});
define('Sketch-it/tests/helpers/start-app', ['exports', 'ember', 'Sketch-it/app', 'Sketch-it/config/environment'], function (exports, _ember, _SketchItApp, _SketchItConfigEnvironment) {
  exports['default'] = startApp;

  function startApp(attrs) {
    var application = undefined;

    // use defaults, but you can override
    var attributes = _ember['default'].assign({}, _SketchItConfigEnvironment['default'].APP, attrs);

    _ember['default'].run(function () {
      application = _SketchItApp['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }
});
define('Sketch-it/tests/helpers/start-app.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | helpers/start-app.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/start-app.js should pass jshint.');
  });
});
define('Sketch-it/tests/initializers/flags.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | initializers/flags.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'initializers/flags.js should pass jshint.');
  });
});
define('Sketch-it/tests/initializers/global-router.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | initializers/global-router.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'initializers/global-router.js should pass jshint.');
  });
});
define('Sketch-it/tests/instance-initializers/server-data.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | instance-initializers/server-data.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'instance-initializers/server-data.js should pass jshint.\ninstance-initializers/server-data.js: line 1, col 28, \'container\' is defined but never used.\n\n1 error');
  });
});
define('Sketch-it/tests/integration/components/animations/fade-slide-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('animations/fade-slide', 'Integration | Component | animations/fade slide', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'nso5Pudd',
      'block': '{"statements":[["append",["unknown",["animations/fade-slide"]],false]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'Y+DI2rHL',
      'block': '{"statements":[["text","\\n"],["block",["animations/fade-slide"],null,null,0],["text","  "]],"locals":[],"named":[],"yields":[],"blocks":[{"statements":[["text","      template block text\\n"]],"locals":[]}],"hasPartials":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('Sketch-it/tests/integration/components/animations/fade-slide-test.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | integration/components/animations/fade-slide-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/animations/fade-slide-test.js should pass jshint.');
  });
});
define('Sketch-it/tests/integration/components/charts/radial-chart-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('charts/radial-chart', 'Integration | Component | charts/radial chart', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'dQIkJor+',
      'block': '{"statements":[["append",["unknown",["charts/radial-chart"]],false]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': '6he846YQ',
      'block': '{"statements":[["text","\\n"],["block",["charts/radial-chart"],null,null,0],["text","  "]],"locals":[],"named":[],"yields":[],"blocks":[{"statements":[["text","      template block text\\n"]],"locals":[]}],"hasPartials":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('Sketch-it/tests/integration/components/charts/radial-chart-test.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | integration/components/charts/radial-chart-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/charts/radial-chart-test.js should pass jshint.');
  });
});
define('Sketch-it/tests/integration/components/chat-controller-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('chat-controller', 'Integration | Component | chat controller', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'Y9ATN1h8',
      'block': '{"statements":[["append",["unknown",["chat-controller"]],false]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'Spyhbbqr',
      'block': '{"statements":[["text","\\n"],["block",["chat-controller"],null,null,0],["text","  "]],"locals":[],"named":[],"yields":[],"blocks":[{"statements":[["text","      template block text\\n"]],"locals":[]}],"hasPartials":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('Sketch-it/tests/integration/components/chat-controller-test.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | integration/components/chat-controller-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/chat-controller-test.js should pass jshint.');
  });
});
define('Sketch-it/tests/integration/components/draw-area-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('draw-area', 'Integration | Component | draw area', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': '8asDvSBd',
      'block': '{"statements":[["append",["unknown",["draw-area"]],false]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'C6RORllq',
      'block': '{"statements":[["text","\\n"],["block",["draw-area"],null,null,0],["text","  "]],"locals":[],"named":[],"yields":[],"blocks":[{"statements":[["text","      template block text\\n"]],"locals":[]}],"hasPartials":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('Sketch-it/tests/integration/components/draw-area-test.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | integration/components/draw-area-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/draw-area-test.js should pass jshint.');
  });
});
define('Sketch-it/tests/integration/components/friend-block-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('friend-block', 'Integration | Component | friend block', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'P5M/5O18',
      'block': '{"statements":[["append",["unknown",["friend-block"]],false]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'ywWKZYlF',
      'block': '{"statements":[["text","\\n"],["block",["friend-block"],null,null,0],["text","  "]],"locals":[],"named":[],"yields":[],"blocks":[{"statements":[["text","      template block text\\n"]],"locals":[]}],"hasPartials":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('Sketch-it/tests/integration/components/friend-block-test.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | integration/components/friend-block-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/friend-block-test.js should pass jshint.');
  });
});
define('Sketch-it/tests/integration/components/game-result-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('game-result', 'Integration | Component | game result', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'G+23cIM3',
      'block': '{"statements":[["append",["unknown",["game-result"]],false]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'AMAK2LaS',
      'block': '{"statements":[["text","\\n"],["block",["game-result"],null,null,0],["text","  "]],"locals":[],"named":[],"yields":[],"blocks":[{"statements":[["text","      template block text\\n"]],"locals":[]}],"hasPartials":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('Sketch-it/tests/integration/components/game-result-test.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | integration/components/game-result-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/game-result-test.js should pass jshint.');
  });
});
define('Sketch-it/tests/integration/components/inputs/default-color-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('inputs/default-color', 'Integration | Component | inputs/default color', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'X4sTWR+c',
      'block': '{"statements":[["append",["unknown",["inputs/default-color"]],false]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'cBS8oe9C',
      'block': '{"statements":[["text","\\n"],["block",["inputs/default-color"],null,null,0],["text","  "]],"locals":[],"named":[],"yields":[],"blocks":[{"statements":[["text","      template block text\\n"]],"locals":[]}],"hasPartials":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('Sketch-it/tests/integration/components/inputs/default-color-test.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | integration/components/inputs/default-color-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/inputs/default-color-test.js should pass jshint.');
  });
});
define('Sketch-it/tests/integration/components/inputs/default-confirm-button-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('inputs/default-confirm-button', 'Integration | Component | inputs/default confirm button', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'dkQH++00',
      'block': '{"statements":[["append",["unknown",["inputs/default-confirm-button"]],false]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'LUPkFXLt',
      'block': '{"statements":[["text","\\n"],["block",["inputs/default-confirm-button"],null,null,0],["text","  "]],"locals":[],"named":[],"yields":[],"blocks":[{"statements":[["text","      template block text\\n"]],"locals":[]}],"hasPartials":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('Sketch-it/tests/integration/components/inputs/default-confirm-button-test.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | integration/components/inputs/default-confirm-button-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/inputs/default-confirm-button-test.js should pass jshint.');
  });
});
define('Sketch-it/tests/integration/components/inputs/default-numberbox-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('inputs/default-numberbox', 'Integration | Component | inputs/default numberbox', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': '0nTMaQ6z',
      'block': '{"statements":[["append",["unknown",["inputs/default-numberbox"]],false]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'xdVzR3pW',
      'block': '{"statements":[["text","\\n"],["block",["inputs/default-numberbox"],null,null,0],["text","  "]],"locals":[],"named":[],"yields":[],"blocks":[{"statements":[["text","      template block text\\n"]],"locals":[]}],"hasPartials":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('Sketch-it/tests/integration/components/inputs/default-numberbox-test.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | integration/components/inputs/default-numberbox-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/inputs/default-numberbox-test.js should pass jshint.');
  });
});
define('Sketch-it/tests/integration/components/notifications-menu-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('notifications-menu', 'Integration | Component | notifications menu', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': '7n/sauKF',
      'block': '{"statements":[["append",["unknown",["notifications-menu"]],false]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': '62kyonLE',
      'block': '{"statements":[["text","\\n"],["block",["notifications-menu"],null,null,0],["text","  "]],"locals":[],"named":[],"yields":[],"blocks":[{"statements":[["text","      template block text\\n"]],"locals":[]}],"hasPartials":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('Sketch-it/tests/integration/components/notifications-menu-test.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | integration/components/notifications-menu-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/notifications-menu-test.js should pass jshint.');
  });
});
define('Sketch-it/tests/integration/components/room-list-entry-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('room-list-entry', 'Integration | Component | room list entry', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': '1KHC+6Yc',
      'block': '{"statements":[["append",["unknown",["room-list-entry"]],false]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': '1MNgz+am',
      'block': '{"statements":[["text","\\n"],["block",["room-list-entry"],null,null,0],["text","  "]],"locals":[],"named":[],"yields":[],"blocks":[{"statements":[["text","      template block text\\n"]],"locals":[]}],"hasPartials":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('Sketch-it/tests/integration/components/room-list-entry-test.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | integration/components/room-list-entry-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/room-list-entry-test.js should pass jshint.');
  });
});
define('Sketch-it/tests/integration/components/room-list-new-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('room-list-new', 'Integration | Component | room list new', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'klRP9R5M',
      'block': '{"statements":[["append",["unknown",["room-list-new"]],false]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'gB2BrAKE',
      'block': '{"statements":[["text","\\n"],["block",["room-list-new"],null,null,0],["text","  "]],"locals":[],"named":[],"yields":[],"blocks":[{"statements":[["text","      template block text\\n"]],"locals":[]}],"hasPartials":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('Sketch-it/tests/integration/components/room-list-new-test.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | integration/components/room-list-new-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/room-list-new-test.js should pass jshint.');
  });
});
define('Sketch-it/tests/integration/components/user-profile-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleForComponent)('user-profile', 'Integration | Component | user profile', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      'id': 'LXB/z2Tt',
      'block': '{"statements":[["append",["unknown",["user-profile"]],false]],"locals":[],"named":[],"yields":[],"blocks":[],"hasPartials":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      'id': 'uDIuplMu',
      'block': '{"statements":[["text","\\n"],["block",["user-profile"],null,null,0],["text","  "]],"locals":[],"named":[],"yields":[],"blocks":[{"statements":[["text","      template block text\\n"]],"locals":[]}],"hasPartials":false}',
      'meta': {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('Sketch-it/tests/integration/components/user-profile-test.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | integration/components/user-profile-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/user-profile-test.js should pass jshint.');
  });
});
define('Sketch-it/tests/resolver.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | resolver.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'resolver.js should pass jshint.');
  });
});
define('Sketch-it/tests/router.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | router.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'router.js should pass jshint.');
  });
});
define('Sketch-it/tests/routes/gameplay.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | routes/gameplay.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/gameplay.js should pass jshint.\nroutes/gameplay.js: line 80, col 61, Expected \'===\' and instead saw \'==\'.\nroutes/gameplay.js: line 80, col 87, Expected \'!==\' and instead saw \'!=\'.\nroutes/gameplay.js: line 81, col 25, Expected \'{\' and instead saw \'restartTimer\'.\nroutes/gameplay.js: line 87, col 104, Missing semicolon.\nroutes/gameplay.js: line 96, col 44, Expected \'!==\' and instead saw \'!=\'.\nroutes/gameplay.js: line 108, col 25, Expected \'{\' and instead saw \'setTimeout\'.\nroutes/gameplay.js: line 108, col 48, Expected a \'break\' statement before \'case\'.\nroutes/gameplay.js: line 126, col 13, \'that\' is already defined.\nroutes/gameplay.js: line 3, col 17, \'require\' is not defined.\nroutes/gameplay.js: line 3, col 7, \'DataURI\' is defined but never used.\n\n10 errors');
  });
});
define('Sketch-it/tests/routes/index.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | routes/index.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/index.js should pass jshint.\nroutes/index.js: line 102, col 17, Expected \'{\' and instead saw \'server\'.\nroutes/index.js: line 103, col 18, Expected \'{\' and instead saw \'server\'.\nroutes/index.js: line 98, col 17, \'that\' is defined but never used.\n\n3 errors');
  });
});
define('Sketch-it/tests/routes/lobby.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | routes/lobby.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/lobby.js should pass jshint.\nroutes/lobby.js: line 68, col 52, Expected \'===\' and instead saw \'==\'.\n\n1 error');
  });
});
define('Sketch-it/tests/routes/register.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | routes/register.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'routes/register.js should pass jshint.\nroutes/register.js: line 97, col 56, Expected \'===\' and instead saw \'==\'.\n\n1 error');
  });
});
define('Sketch-it/tests/services/server.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | services/server.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(false, 'services/server.js should pass jshint.\nservices/server.js: line 18, col 38, Missing semicolon.\nservices/server.js: line 40, col 32, Missing semicolon.\nservices/server.js: line 50, col 32, Expected \'===\' and instead saw \'==\'.\nservices/server.js: line 51, col 21, Expected \'{\' and instead saw \'consecutive\'.\nservices/server.js: line 52, col 22, Expected \'{\' and instead saw \'consecutive\'.\nservices/server.js: line 54, col 38, Expected \'!==\' and instead saw \'!=\'.\nservices/server.js: line 56, col 39, Expected \'===\' and instead saw \'==\'.\nservices/server.js: line 56, col 56, Expected \'===\' and instead saw \'==\'.\nservices/server.js: line 57, col 25, Expected \'{\' and instead saw \'starterIndex\'.\nservices/server.js: line 59, col 55, Expected \'===\' and instead saw \'==\'.\nservices/server.js: line 60, col 25, Expected \'{\' and instead saw \'data\'.\nservices/server.js: line 63, col 38, Expected \'!==\' and instead saw \'!=\'.\nservices/server.js: line 65, col 39, Expected \'===\' and instead saw \'==\'.\nservices/server.js: line 65, col 56, Expected \'===\' and instead saw \'==\'.\nservices/server.js: line 66, col 25, Expected \'{\' and instead saw \'endIndex\'.\nservices/server.js: line 68, col 55, Expected \'===\' and instead saw \'==\'.\nservices/server.js: line 69, col 25, Expected \'{\' and instead saw \'data\'.\nservices/server.js: line 90, col 48, Expected \'===\' and instead saw \'==\'.\nservices/server.js: line 92, col 35, Expected \'===\' and instead saw \'==\'.\nservices/server.js: line 93, col 21, Expected \'{\' and instead saw \'endIndex\'.\nservices/server.js: line 98, col 21, \'sendData\' is already defined.\nservices/server.js: line 164, col 34, Expected \'===\' and instead saw \'==\'.\nservices/server.js: line 172, col 18, Expected \'{\' and instead saw \'seq\'.\nservices/server.js: line 174, col 34, Expected \'===\' and instead saw \'==\'.\nservices/server.js: line 182, col 18, Expected \'{\' and instead saw \'sseq\'.\nservices/server.js: line 3, col 11, \'require\' is not defined.\n\n26 errors');
  });
});
define('Sketch-it/tests/test-helper', ['exports', 'Sketch-it/tests/helpers/resolver', 'ember-qunit'], function (exports, _SketchItTestsHelpersResolver, _emberQunit) {

  (0, _emberQunit.setResolver)(_SketchItTestsHelpersResolver['default']);
});
define('Sketch-it/tests/test-helper.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | test-helper.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'test-helper.js should pass jshint.');
  });
});
define('Sketch-it/tests/unit/initializers/flags-test', ['exports', 'ember', 'sketch-it/initializers/flags', 'qunit', 'Sketch-it/tests/helpers/destroy-app'], function (exports, _ember, _sketchItInitializersFlags, _qunit, _SketchItTestsHelpersDestroyApp) {

  (0, _qunit.module)('Unit | Initializer | flags', {
    beforeEach: function beforeEach() {
      var _this = this;

      _ember['default'].run(function () {
        _this.application = _ember['default'].Application.create();
        _this.application.deferReadiness();
      });
    },
    afterEach: function afterEach() {
      (0, _SketchItTestsHelpersDestroyApp['default'])(this.application);
    }
  });

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    (0, _sketchItInitializersFlags.initialize)(this.application);

    // you would normally confirm the results of the initializer here
    assert.ok(true);
  });
});
define('Sketch-it/tests/unit/initializers/flags-test.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/initializers/flags-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/initializers/flags-test.js should pass jshint.');
  });
});
define('Sketch-it/tests/unit/initializers/global-router-test', ['exports', 'ember', 'sketch-it/initializers/global-router', 'qunit', 'Sketch-it/tests/helpers/destroy-app'], function (exports, _ember, _sketchItInitializersGlobalRouter, _qunit, _SketchItTestsHelpersDestroyApp) {

  (0, _qunit.module)('Unit | Initializer | global router', {
    beforeEach: function beforeEach() {
      var _this = this;

      _ember['default'].run(function () {
        _this.application = _ember['default'].Application.create();
        _this.application.deferReadiness();
      });
    },
    afterEach: function afterEach() {
      (0, _SketchItTestsHelpersDestroyApp['default'])(this.application);
    }
  });

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    (0, _sketchItInitializersGlobalRouter.initialize)(this.application);

    // you would normally confirm the results of the initializer here
    assert.ok(true);
  });
});
define('Sketch-it/tests/unit/initializers/global-router-test.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/initializers/global-router-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/initializers/global-router-test.js should pass jshint.');
  });
});
define('Sketch-it/tests/unit/instance-initializers/server-data-test', ['exports', 'ember', 'sketch-it/instance-initializers/server-data', 'qunit', 'Sketch-it/tests/helpers/destroy-app'], function (exports, _ember, _sketchItInstanceInitializersServerData, _qunit, _SketchItTestsHelpersDestroyApp) {

  (0, _qunit.module)('Unit | Instance Initializer | server data', {
    beforeEach: function beforeEach() {
      var _this = this;

      _ember['default'].run(function () {
        _this.application = _ember['default'].Application.create();
        _this.appInstance = _this.application.buildInstance();
      });
    },
    afterEach: function afterEach() {
      _ember['default'].run(this.appInstance, 'destroy');
      (0, _SketchItTestsHelpersDestroyApp['default'])(this.application);
    }
  });

  // Replace this with your real tests.
  (0, _qunit.test)('it works', function (assert) {
    (0, _sketchItInstanceInitializersServerData.initialize)(this.appInstance);

    // you would normally confirm the results of the initializer here
    assert.ok(true);
  });
});
define('Sketch-it/tests/unit/instance-initializers/server-data-test.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/instance-initializers/server-data-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/instance-initializers/server-data-test.js should pass jshint.');
  });
});
define('Sketch-it/tests/unit/routes/gameplay-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:gameplay', 'Unit | Route | gameplay', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('Sketch-it/tests/unit/routes/gameplay-test.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/routes/gameplay-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/gameplay-test.js should pass jshint.');
  });
});
define('Sketch-it/tests/unit/routes/lobby-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:lobby', 'Unit | Route | lobby', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('Sketch-it/tests/unit/routes/lobby-test.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/routes/lobby-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/lobby-test.js should pass jshint.');
  });
});
define('Sketch-it/tests/unit/routes/register-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('route:register', 'Unit | Route | register', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
define('Sketch-it/tests/unit/routes/register-test.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/routes/register-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/register-test.js should pass jshint.');
  });
});
define('Sketch-it/tests/unit/services/server-test', ['exports', 'ember-qunit'], function (exports, _emberQunit) {

  (0, _emberQunit.moduleFor)('service:server', 'Unit | Service | server', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  });

  // Replace this with your real tests.
  (0, _emberQunit.test)('it exists', function (assert) {
    var service = this.subject();
    assert.ok(service);
  });
});
define('Sketch-it/tests/unit/services/server-test.jshint.lint-test', ['exports'], function (exports) {
  'use strict';

  QUnit.module('JSHint | unit/services/server-test.js');
  QUnit.test('should pass jshint', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/services/server-test.js should pass jshint.');
  });
});
/* jshint ignore:start */

require('Sketch-it/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;

/* jshint ignore:end */
//# sourceMappingURL=tests.map
