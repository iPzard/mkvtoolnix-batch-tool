module.exports = {
  env: {
    browser: true,
    es6: true,
    mocha: true
  },
  extends: ['plugin:react/recommended', 'airbnb'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: ['react'],
  rules: {
    'array-bracket-spacing': [0],
    'arrow-body-style': [0],
    'arrow-parens': ['warn'],
    'brace-style': [0],
    'comma-dangle': ['warn', 'never'],
    'consistent-return': [0],
    'eol-last': [0],
    'func-names': ['warn', 'always', {
      generators: 'as-needed'
    }],
    'global-require': ['warn'],
    'implicit-arrow-linebreak': [0],
    'import/no-dynamic-require': ['warn'],
    'import/no-extraneous-dependencies': [0],
    'import/order': ['warn'],
    'import/prefer-default-export': [0],
    'indent': ['warn', 2, {
      SwitchCase: 1
    }],
    'jsx-a11y/anchor-is-valid': ['warn'],
    'jsx-a11y/click-events-have-key-events': [0],
    'jsx-a11y/interactive-supports-focus': [0],
    'jsx-a11y/label-has-associated-control': [0],
    'jsx-a11y/no-noninteractive-element-interactions': [0],
    'keyword-spacing': ['warn'],
    'linebreak-style': [0],
    'max-len': ['warn'],
    'no-console': ['warn', {
      allow: ['warn', 'error']
    }],
    'no-nested-ternary': [0],
    'no-param-reassign': [0],
    'no-mixed-spaces-and-tabs': ['warn'],
    'no-multi-spaces': ['warn'],
    'no-multiple-empty-lines': [0],
    'no-restricted-syntax': [0],
    'no-tabs': ['warn'],
    'no-trailing-spaces': ['warn'],
    'no-unneeded-ternary': ['warn'],
    'no-underscore-dangle': ['warn'],
    'no-unused-expressions': [0],
    'no-unused-vars': ['warn'],
    'no-use-before-define': ['error', {
      'functions': false
    }],
    'object-curly-newline': [0],
    'object-curly-spacing': ['warn'],
    'object-shorthand': ['warn', 'always'],
    'one-var': ['warn', {
      'initialized': 'never'
    }],
    'one-var-declaration-per-line': ['warn', 'initializations'],
    'operator-linebreak': ['warn'],
    'padded-blocks': [0],
    'prefer-arrow-callback': ['warn'],
    'prefer-const': ['warn'],
    'prefer-destructuring': [
      'warn',
      {
        array: true,
        object: true
      },
      {
        enforceForRenamedProperties: false
      }
    ],
    'prefer-template': ['warn'],
    'quotes': ['warn'],
    'quote-props': ['warn', 'consistent'],
    'rest-spread-spacing': ['warn', 'never'],
    'semi': ['warn'],
    'spaced-comment': ['warn'],
    'space-before-function-paren': ['warn'],
    'react/destructuring-assignment': [0],
    'react/forbid-prop-types': [0],
    'react/jsx-closing-bracket-location': ['warn'],
    'react/jsx-curly-newline': ['warn'],
    'react/jsx-curly-spacing': ['warn', 'always'],
    'react/jsx-filename-extension': [0],
    'react/jsx-fragments': [0],
    'react/jsx-indent': ['warn', 2],
    'react/jsx-equals-spacing': ['warn'],
    'react/jsx-one-expression-per-line': ['warn'],
    'react/jsx-props-no-spreading': [0],
    'react/jsx-tag-spacing': ['warn'],
    'react/jsx-wrap-multilines': ['warn'],
    'react/no-access-state-in-setstate': [0],
    'react/no-array-index-key': [0],
    'react/no-unused-state': ['warn'],
    'react/prop-types': ['warn'],
    'react/prefer-stateless-function': ['warn'],
    'react/require-default-props': ['warn'],
    'react/sort-comp': [0],
    'react/state-in-constructor': ['warn', 'never']
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['./', 'src']
      }
    }
  }
};