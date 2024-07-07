if (process.env && process.env.NODE_ENV === 'production') {
    module.exports = require('./cjs/native-state.prod.min.js');
} else {
    module.exports = require('./cjs/native-state.dev.js');
}