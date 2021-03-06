import test from 'ava';
import Optimization from '../src/Optimization';

class StringifyPlugin {
  constructor(...args) {
    this.values = args;
  }

  apply() {
    return JSON.stringify(this.values);
  }
}

test('is Chainable', t => {
  const parent = { parent: true };
  const optimization = new Optimization(parent);

  t.is(optimization.end(), parent);
});

test('shorthand methods', t => {
  const optimization = new Optimization();
  const obj = {};

  optimization.shorthands.forEach(method => {
    obj[method] = 'alpha';
    t.is(optimization[method]('alpha'), optimization);
  });

  t.deepEqual(optimization.entries(), obj);
});

test('minimizer plugin empty', t => {
  const optimization = new Optimization();
  const instance = optimization
    .minimizer('stringify')
    .use(StringifyPlugin)
    .end();

  t.is(instance, optimization);
  t.true(optimization.minimizers.has('stringify'));
  t.deepEqual(optimization.minimizers.get('stringify').get('args'), []);
});

test('minimizer plugin with args', t => {
  const optimization = new Optimization();

  optimization.minimizer('stringify').use(StringifyPlugin, ['alpha', 'beta']);

  t.true(optimization.minimizers.has('stringify'));
  t.deepEqual(optimization.minimizers.get('stringify').get('args'), [
    'alpha',
    'beta',
  ]);
});

test('optimization merge', t => {
  const optimization = new Optimization();
  const obj = {
    minimizer: {
      stringify: {
        plugin: StringifyPlugin,
        args: ['alpha', 'beta'],
      },
    },
  };

  t.is(optimization.merge(obj), optimization);
  t.true(optimization.minimizers.has('stringify'));
  t.deepEqual(optimization.minimizers.get('stringify').get('args'), [
    'alpha',
    'beta',
  ]);
});
