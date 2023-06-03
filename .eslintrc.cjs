module.exports = {
  env: {
    commonjs: true,
    es6: true,
    jest: true,
    node: true,
  },
  extends: [
    "eslint:all",
    "plugin:@typescript-eslint/all",
    "plugin:eslint-comments/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:jest/all",
    "plugin:node/recommended",
    "plugin:optimize-regex/all",
    "plugin:prettier/recommended",
    "plugin:promise/recommended",
    "plugin:regexp/recommended",
    "plugin:security/recommended",
    "standard-with-typescript",
    "prettier",
  ],
  ignorePatterns: ["coverage", "dist", "node_modules", "__generated__"],
  overrides: [
    {
      files: ["*.cjs", "*.js", "*.mjs"],
      rules: {
        "@typescript-eslint/naming-convention": ["off"],
        "@typescript-eslint/no-require-imports": ["off"],
        "@typescript-eslint/no-unsafe-assignment": ["off"],
        "@typescript-eslint/no-unsafe-call": ["off"],
        "@typescript-eslint/no-unsafe-member-access": ["off"],
        "@typescript-eslint/no-var-requires": ["off"],
        "unicorn/prefer-module": ["off"],
      },
    },
    {
      files: ["**/?(*.)+(spec|test|it|e2e).[jt]s?(x)"],
      rules: {
        "@typescript-eslint/no-unsafe-assignment": ["off"],
      },
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    project: "tsconfig.json",
    sourceType: "module",
    tsconfigRootDir: __dirname,
  },
  plugins: [
    "@typescript-eslint",
    "eslint-comments",
    "import",
    "jest",
    "node",
    "optimize-regex",
    "prettier",
    "promise",
    "regexp",
    "security",
    "simple-import-sort",
    "tsdoc",
    "unicorn",
  ],
  root: true,
  rules: {
    "@typescript-eslint/no-empty-function": ["off"],
    "@typescript-eslint/member-ordering": ["off"],

    // Explicit types for function return values makes it clear to any calling code what type is returned
    // This ensures that the return value is assigned to a variable of the correct type
    // Or in the case where there is no return value, that the calling code doesn't try to use the undefined value when it shouldn't
    // But, since our TypeScript configuration is strict, we can avoid inferring errors with small price
    // So that we don't enforce to state explicitly return values
    // @see https://github.com/typescript-eslint/typescript-eslint/blob/v4.28.1/packages/eslint-plugin/docs/rules/explicit-function-return-type.md
    "@typescript-eslint/explicit-function-return-type": ["off"],

    // In JavaScript, variables can be assigned during declaration, or at any point afterwards using an assignment statement
    // This rule is aimed at enforcing or eliminating variable initializations during declaration
    // As well as to bring consistency to variable initializations and declarations
    // However, we are indifferent as to how our variables are initialized, so that, I'm disabling the rule
    // @see https://github.com/typescript-eslint/typescript-eslint/blob/v4.31.0/packages/eslint-plugin/docs/rules/init-declarations.md
    "@typescript-eslint/init-declarations": ["off"],

    // Using the any type defeats the purpose of using TypeScript
    // When any is used, all compiler type checks around that value are ignored
    // This rule doesn't allow any types to be defined and aims to keep TypeScript maximally useful
    // But, if an unknown type or a library without typings is used and you want to be able to specify any, you can do it
    // So that, I'm disabling this rule to allow developer specify any type in the places, where no types exist
    // The only thing I really hope for is that in such cases, libraries will be wrapped in safe abstractions
    // @see https://github.com/typescript-eslint/typescript-eslint/blob/v4.26.1/packages/eslint-plugin/docs/rules/no-explicit-any.md
    "@typescript-eslint/no-explicit-any": ["off"],

    // Magic numbers are numbers that occur multiple times in code without an explicit meaning
    // They should preferably be replaced by named constants
    // It is true, and in some sense, I agree with it
    // But, pretty often number literals are not magic numbers but obvious values
    // So I’m disabling the rule and prefer a common sense about it
    // @see https://github.com/typescript-eslint/typescript-eslint/blob/v4.22.0/packages/eslint-plugin/docs/rules/no-magic-numbers.md
    "@typescript-eslint/no-magic-numbers": ["off"],

    // This rule forbids using promises in places where the TypeScript compiler allows them but they are not handled properly
    // These situations can often arise due to a missing await keyword or just a misunderstanding of how async functions work
    // But there are scenarios when we don't want functions that return promises where a void return is expected to be checked
    // E.g. eventEmitter.on('event', async () => {})
    // In such case we deliver the job to do in background and don't expect to await it somehow
    // So that, I'm tweaking this rule to ignore checks for the places where the void return is expected
    // @see https://github.com/typescript-eslint/typescript-eslint/blob/v4.26.1/packages/eslint-plugin/docs/rules/no-misused-promises.md
    "@typescript-eslint/no-misused-promises": [
      "error",
      { checksVoidReturn: false },
    ],

    // Parameter properties can be confusing to those new to TypeScript as they are less explicit
    // This rule can be tweaked to have a whitelist of modifiers we allow to have in parameters list
    // But, our team knows that when parameter list has modifiers in constructor, it means it is a property
    // So that, I'm disabling this rule to simplify property declaration on the class
    // @see https://github.com/typescript-eslint/typescript-eslint/blob/v4.26.1/packages/eslint-plugin/docs/rules/no-parameter-properties.md
    "@typescript-eslint/no-parameter-properties": ["off"],

    // In TypeScript, type aliases serve three purposes
    // Aliasing other types so that we can refer to them using a simpler name
    // Act sort of like an interface, providing a set of methods and properties that must exist in the objects implementing the type
    // Act like mapping tools between types to allow quick modifications
    // When aliasing, the type alias does not create a new type, it just creates a new name to refer to the original type
    // So aliasing primitives and other simple types, tuples, unions or intersections can some times be redundant
    // On the other hand, type aliases simplify creating utility types, generic types, etc
    // So that, I'm disabling this rule to allow developers use these advanced techniques when writing TypeScript code
    // @see https://github.com/typescript-eslint/typescript-eslint/blob/v4.26.1/packages/eslint-plugin/docs/rules/no-type-alias.md
    "@typescript-eslint/no-type-alias": ["off"],

    "@typescript-eslint/parameter-properties": ["off"],

    // Mutating function arguments can lead to confusing, hard to debug behavior
    // Whilst it's easy to implicitly remember to not modify function arguments
    // Explicitly typing arguments as readonly provides clear contract to consumers
    // This contract makes it easier for a consumer to reason about if a function has side-effects
    // But, it forces us to write readonly anytime, anywhere and more often it is not so simple
    // So that, we do not prefer to have readonly keyword for any parameter in the function
    // @see https://github.com/typescript-eslint/typescript-eslint/blob/v4.26.0/packages/eslint-plugin/docs/rules/prefer-readonly-parameter-types.md
    "@typescript-eslint/prefer-readonly-parameter-types": ["off"],

    // Requires any function or method that returns a Promise to be marked async
    // Ensures that each function is only capable of:
    // - Returning a rejected promise, or
    // - Throwing an Error object
    // In contrast, non-async Promise - returning functions are technically capable of either
    // Code that handles the results of those functions will often need to handle both cases, which can get complex
    // This rule's practice removes a requirement for creating code to handle both cases
    // However, we usually use arrow functions with a simpler syntax that returns Promise instances instead
    // So that, I'm fine-tuning the rule to allow arrow functions without async modifier on them
    // @see https://github.com/typescript-eslint/typescript-eslint/blob/v5.10.1/packages/eslint-plugin/docs/rules/promise-function-async.md
    "@typescript-eslint/promise-function-async": [
      "error",
      { checkArrowFunctions: false },
    ],

    // Asynchronous functions in JavaScript behave differently than other functions
    // The primary reason to use asynchronous functions is typically to use the await operator
    // Asynchronous functions that don't use await might not need to be asynchronous functions
    // But, with all that to be true it is not a requirement
    // We can have some cases, when, by contract, the method is asynchronous but the embedder don't use await keyword
    // So that, I'm disabling this rule to allow having asynchronous function that don't use await keyword
    // @see https://github.com/typescript-eslint/typescript-eslint/blob/v4.26.0/packages/eslint-plugin/docs/rules/require-await.md
    "@typescript-eslint/require-await": ["off"],

    // Warns when a method is used outside of a method call
    // Class functions don't preserve the class scope when passed as standalone variables
    // However, sometimes we are passing class methods deliberately
    // E.g. in tests we can provide the class method to expect() that does not work with `this` context
    // In the worst case scenario, I believe, such a problem with `this` context will be caught by the tests
    // So that, we are disabling the rule to allow us passing unbound class methods to other functions
    // @see https://github.com/typescript-eslint/typescript-eslint/blob/v4.30.0/packages/eslint-plugin/docs/rules/unbound-method.md
    "@typescript-eslint/unbound-method": ["off"],

    // Comments are useful for leaving information for future developers
    // In order for that information to be useful and not distracting
    // It is sometimes desirable for comments to follow a particular style
    // One element of comment formatting styles is whether the first word of a comment should be capitalized or lowercase
    // The problem team has is when they are playing around with the code, they usually commenting the code sometimes
    // Having a code action on save that fixes all the violations, it results into having the code upper-cased in comments
    // So that, we decided to turn the rule off in order to not distract local development flow
    // @see https://eslint.org/docs/rules/capitalized-comments
    "capitalized-comments": ["off"],

    // If a class method does not use this, it can sometimes be made into a static function
    // But, in the case of Single Runtime project, it is ok to have a method in the class, that don't use this
    // The reason for that is we don't know if the embedder will use this at all - he could use or not - we don't know
    // So that, I'm disabling this rule to allow class methods that don't use this, maybe they will use it later
    // @see https://eslint.org/docs/rules/class-methods-use-this
    "class-methods-use-this": ["off"],

    // Unlike statically-typed languages which enforce that a function returns a specified type of value
    // JavaScript allows different code paths in a function to return different types of values
    // If any code paths in a function return a value explicitly but some code path do not return a value explicitly
    // It might be a typing mistake, especially in a large function
    // But, in our scenario, we do use a statically-typed language, TypeScript, to be more specific
    // So that, this rule has nothing valuable for us and triggers a false negatives only
    // @see https://eslint.org/docs/rules/consistent-return
    "consistent-return": ["off"],

    // There are two ways of defining functions in JavaScript: function declarations and function expressions
    // Declarations contain the function keyword first, followed by a name and then its arguments and the function body
    // Equivalent function expressions begin with the const/let keyword, followed by a name and then the function itself
    // The primary difference between function declarations and function expressions is simple
    // Function declarations are hoisted to the top of the scope in which they are defined
    // Which allows you to write code that uses the function before its declaration
    // For function expressions, you must define the function before it is used, otherwise it causes an error
    // But, we all know about the differences between those so that I'm disabling the rule
    // Which style to use is totally on developers' common sense
    // @see https://eslint.org/docs/rules/func-style
    "func-style": ["off"],

    // Enforce `it`, `test` and `describe` to have descriptions that begin with a lowercase letter
    // It provides more readable test failures, when investigating and reading expectations in the console
    // However, having such descriptions means the team must think about it
    // Which is a no go for most of us, who don't want spend time on thinking the correct "should ..." phrasing
    // That is why I'm disabling the rule (it is just a preference, after all)
    // @see https://github.com/jest-community/eslint-plugin-jest/blob/v24.4.0/docs/rules/lowercase-name.md
    "jest/lowercase-name": ["off"],

    // This rule enforces a maximum number of expect() calls.
    // The following patterns are considered warnings (with the default option of { "max": 5 } ):
    "jest/max-expects": ["warn"],

    // Jest provides global functions for setup and teardown tasks, which are called before/after each test case
    // The use of these hooks promotes shared state between tests, which is bad, I agree
    // But, we prefer using the setup and teardown hooks provided by Jest in order to prepare the testing environment
    // So that I'm disabling the rule to allow developers incorporate hooks for environment bootstrap
    // @see https://github.com/jest-community/eslint-plugin-jest/blob/v24.3.6/docs/rules/no-hooks.md
    "jest/no-hooks": ["off"],

    // This rule enforces `it`, `test` and `describe` to have descriptions that begin with a lowercase letter
    // It provides more readable test failures (when writing test scenarios, not the method names, obviously)
    // However our team was strongly against it and preferred to write classes and method names instead
    // That is why I'm disabling the rule for this project here
    // @see https://github.com/jest-community/eslint-plugin-jest/blob/v25.3.0/docs/rules/prefer-lowercase-title.md
    "jest/prefer-lowercase-title": ["off"],

    // Often while writing tests you have some setup work that needs to happen before tests run
    // And you have some finishing work that needs to happen after tests run
    // Jest provides helper functions to handle this
    // Because Jest executes all describe handlers in a test file before it executes any of the actual tests
    // It's important to ensure setup and teardown work is done inside before* and after* handlers respectively
    // Rather than inside the describe blocks
    // However, there are some cases with false positive and me, personally, don't see any benefit from this rule
    // So I'm disabling this one until further notices from the plugin of an real-life example
    // @see https://github.com/jest-community/eslint-plugin-jest/blob/v25.3.0/docs/rules/require-hook.md
    "jest/require-hook": ["off"],

    "jest/prefer-expect-assertions": ["off"],
    "jest/no-conditional-in-test": ["off"],

    // Some people consider large files a code smell
    // Large files tend to do a lot of things and can make it hard following what's going
    // While there is not an objective maximum number of lines considered acceptable in a file
    // Most people would agree it should not be in the thousands
    // Recommendations usually range from 100 to 500 lines
    // We prefer to use the same limitation, but we don't count the blank lines or comments
    // So that, I'm tweaking the rule to count only the code itself, that must not be greater than threshold
    // @see https://eslint.org/docs/rules/max-lines
    "max-lines": ["off"],

    // Some people consider large functions a code smell
    // Large functions tend to do a lot of things and can make it hard following what's going on
    // Many coding style guides dictate a limit of the number of lines that a function can comprise of
    // This rule can help enforce that style in order to aid in maintainability and reduce complexity
    // But, we turn the rule off because we are not concerned with the number of lines in our functions
    // @see https://eslint.org/docs/rules/max-lines-per-function
    "max-lines-per-function": ["off"],

    // Functions that take numerous parameters can be difficult to read and write
    // It requires the memorization of what each parameter is, its type, and the order they should appear in
    // As a result, many coders adhere to a convention that caps the number of parameters a function can take
    // We are not an exception from the rules and adhere to the same rules
    // Although, we are tuning the maximum to more than the default value, which is equal to 3 parameters
    // @see https://eslint.org/docs/rules/max-params
    "max-params": ["error", { max: 4 }],

    // Some people consider large functions a code smell
    // Large functions tend to do a lot of things and can make it hard following what's going on
    // Many coding style guides dictate a limit of the statements that a function can comprise of
    // This rule allows you to specify the maximum number of statements allowed in a function
    // But, we turn the rule off because we are not concerned with the number of statements in our functions
    // @see https://eslint.org/docs/rules/max-statements
    "max-statements": ["off"],

    // Many style guides require a particular style for comments that span multiple lines
    // For example, some style guides prefer the use of a single block comment for multiline comments
    // Whereas other style guides prefer consecutive line comments
    // But, using multiline comments breaks a lot of things for us
    // E.g. ts-expect-error directive won't work in multiline comments or FIXME and TODO comments are not highlighted in VSCode
    // That is why I'm tweaking this rule to having consecutive line comments
    // @see https://eslint.org/docs/rules/multiline-comment-style
    "multiline-comment-style": ["error", "separate-lines"],

    // In JavaScript that is designed to be executed in the browser, it's considered a best practice to avoid using methods on console
    // Such messages are considered to be for debugging purposes and therefore not suitable to ship to the client
    // In general, calls using console should be stripped before being pushed to production
    // However, we are using Node.js and console is used to output information to the user
    // So is not strictly used for debugging purposes and sometimes preferable to use console instead of custom loggers
    // That is why I'm disabling the rule to allow developers use console methods
    // @see https://eslint.org/docs/rules/no-console
    "no-console": ["off"],

    // Replace by import/no-duplicates
    "no-duplicate-imports": ["off"],

    "no-negated-condition": ["off"],

    // The ternary operator is used to conditionally assign a value to a variable
    // Some believe that the use of ternary operators leads to unclear code
    // Thanks God, we are not one of them and we encourage using ternary operators for variable definition
    // It allows to write one-liners for conditional value of the variable
    // @see https://eslint.org/docs/rules/no-ternary
    "no-ternary": ["off"],

    // The undefined variable in JavaScript is actually a property of the global object
    // As such, in ECMAScript 3 it was possible to overwrite the value of undefined
    // While ECMAScript 5 disallows overwriting undefined, it's still possible to shadow undefined in another scope
    // Because undefined can be overwritten or shadowed, reading undefined can give an unexpected value
    // To guard against this, you can avoid all uses of undefined, which is what some style guides recommend
    // But, we have the TypeScript compiler that guards against improper usage of undefined
    // As well as another ESLint rules that guard against assignment to the global property and shadowing restricted names
    // So that, we can freely use undefined in our code and do not afraid of overriding the actual undefined value
    // @see https://eslint.org/docs/rules/no-undefined
    "no-undefined": ["off"],

    // There is a long history of using dangling underscores to indicate "private" members of objects in JavaScript
    // This began with SpiderMonkey adding nonstandard methods such as __defineGetter__()
    // The intent with the underscores was to make it obvious that this method was special in some way
    // Since that time, using a single underscore prefix has become popular as a way to indicate "private" members of objects
    // Whether or not you choose to allow dangling underscores in identifiers is purely a convention
    // It has no effect on performance, readability, or complexity, it's purely a preference
    // So that, we are disabling the rule
    // @see https://eslint.org/docs/rules/no-underscore-dangle
    "no-underscore-dangle": ["off"],

    // Developers often add comments to code which is not complete or needs review
    // Most likely you want to fix the code, and then remove the comment, before you consider the code to be production ready
    // But, we use these kinds of comments to notify other members of the team about long-standing process, e.g.
    // It is OK to have TODO, FIXME and other comments in the code
    // So I'm disabling the rule here
    // @see https://eslint.org/docs/rules/no-warning-comments
    "no-warning-comments": ["off"],

    // Disallow import declarations which import non-existence modules
    // But we are using TypeScript here, so it will compile our modules later
    // For such cases, I’m tweaking the configuration for the rule to probe .ts files as well
    // @see https://github.com/mysticatea/eslint-plugin-node/blob/v11.1.0/docs/rules/no-missing-import.md
    "node/no-missing-import": [
      "error",
      { tryExtensions: [".ts", ".d.ts", ".js", ".json", ".node"] },
    ],

    // ECMAScript standard is updating every two months
    // You can check node.green to know which Node.js version supports each ECMAScript feature
    // This rule reports unsupported ECMAScript syntax on the configured Node.js version as lint errors
    // Editor integrations of ESLint would be useful to know it in real-time
    // Since we are using TypeScript compiler, the modules problem delegates to compiler
    // So I’m tweaking this rule to ignore modules for Node.js since they will be treated by TypeScript, anyway
    // @see https://github.com/mysticatea/eslint-plugin-node/blob/v11.1.0/docs/rules/no-unsupported-features/es-syntax.md
    "node/no-unsupported-features/es-syntax": [
      "error",
      { ignores: ["modules", "dynamicImport"] },
    ],

    // When we make a CLI tool with Node.js, we add bin field to package.json, then we add a shebang to the entry file
    // This rule suggests correct usage of shebang, checking the bin field in package.json
    // If a target file matches one of bin files, it checks whether or not there is a correct shebang
    // Otherwise it checks whether or not there is not a shebang
    // But, since we are using TypeScript, the location of files with shebang differs
    // So that, I'm tweaking the configuration to match where the actual compiled files will be
    // @see https://github.com/mysticatea/eslint-plugin-node/blob/v11.1.0/docs/rules/shebang.md
    "node/shebang": [
      "error",
      {
        convertPath: [
          {
            include: ["src/**/*.ts"],
            replace: ["^src/(.+).ts$", "dist/$1.js"],
          },
        ],
      },
    ],

    // TODO: the rule enforces you to use Object.hasOwn() instead of .hasOwnProperty()
    // That is great, but our current target ES2020 does not support it
    // So that, I'm temporarily disabling this rule and we will remove it later, after moving to ES2022
    // @see https://eslint.org/docs/rules/prefer-object-has-own
    "prefer-object-has-own": ["off"],

    // Detects variable in filename argument of fs calls, which might allow an attacker to access anything on your system
    // It is true, for the cases when the un-trusted user is able to provide a path on his own
    // But, we don't accept any custom path from outside of Wix, so we "trust" anything that goes into the variable for fs call
    // @see https://github.com/nodesecurity/eslint-plugin-security#detect-non-literal-fs-filename
    // @see https://owasp.org/www-community/attacks/Path_Traversal
    "security/detect-non-literal-fs-filename": ["off"],

    // Square bracket notation for objects in JavaScript provides a convenient way to dynamically access a specific property
    // The end result of this feature is something that is very similar to Ruby's Mass Assignment
    // Given an object, you are able to dynamically assign and retrieve properties of this object
    // Without specifying this property should be accessible, of course
    // The most direct fix here is going to be to avoid the use of user input in property name fields
    // Although, we don't work much with the user input and even if so - our users are Wix internal developers
    // So we (kind of) "trust" our users and don't take seriously such a security breach
    // @see https://github.com/nodesecurity/eslint-plugin-security/blob/master/docs/the-dangers-of-square-bracket-notation.md
    "security/detect-object-injection": ["off"],

    // This plugin is supposed to be used with autofix, ideally directly in your editor via an ESLint extension
    // It sorts the import by the following order: grouping imports\exports by third-party, own modules and then sorting
    // @see https://github.com/lydell/eslint-plugin-simple-import-sort
    "simple-import-sort/exports": ["error"],
    "simple-import-sort/imports": ["error"],

    // The import statement is used to import members that have been exported from an external module
    // When declaring multiple imports, a sorted list of declarations make it easier to read the code
    // This rule is purely a matter of style, but, it can be auto-fixed by using external plugin
    // That is why I'm disabling this rule here, it can't auto-fix the issues
    // Instead, I'm using simple-import-sort plugin to provide an auto-fix for developers
    // @see https://eslint.org/docs/rules/sort-imports
    "sort-imports": ["off"],

    // When declaring multiple properties, some developers prefer to sort property names alphabetically
    // It allows more easily find and/or diff necessary properties at a later time
    // Others feel that it adds complexity and becomes burden to maintain and they are right
    // When we are creating an object with two fields in one line, e.g. { a: 2, b: 3 }
    // It does not make sense to sort them, it is a one-liner
    // But, it will be a problem to quickly "scan" the object when there are more than 5 keys and each on new line
    // So that, I'm tweaking this rule to require sorted keys only when a specified threshold is passed
    // @see https://eslint.org/docs/rules/sort-keys
    "sort-keys": ["off"],

    // This ESLint plugin provides a rule for validating that TypeScript doc comments conform to the TSDoc specification
    // TSDoc is a proposal to standardize the doc comments used in TypeScript code
    // So that different tools can extract content without getting confused by each other’s markup
    // @see https://github.com/microsoft/tsdoc/tree/master/eslint-plugin
    "tsdoc/syntax": ["error"],

    "unicorn/prefer-module": ["error"],

    // When importing builtin modules, it's better to use the node: protocol as it makes it perfectly clear that the
    // package is a Node.js builtin module.
    "unicorn/prefer-node-protocol": ["error"],
  },
  settings: {
    "import/resolver": { typescript: {} },
    jest: { version: 27 },
  },
};
