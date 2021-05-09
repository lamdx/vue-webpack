// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: "babel-eslint"
  },
  env: {
    browser: true,
    es6: true
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    "plugin:vue/essential",
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    "standard"
  ],
  // required to lint *.vue files
  plugins: ["vue"],
  // add your custom rules here
  rules: {
    // allow async-await
    "generator-star-spacing": "off",
    // allow debugger during development
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    semi: ["error", "always"],
    // no space before function name
    "space-before-function-paren": 0,
    "no-var": 2,
    "no-eq-null": 2, // 不允许对 null用==或者!=
    "no-eval": 2, // 不允许使用eval()
    "no-empty": 2, // 块语句中的内容不能为空
    // "brace-style": [1, "1tbs"], //大括号风格
    "vue/html-closing-bracket-newline": [
      "error",
      {
        singleline: "never",
        multiline: "always"
      }
    ],
    // 以方括号取对象属性时，[ 后面和 ] 前面是否需要空格，可选参数 never, always
    "computed-property-spacing": 0
  }
};
