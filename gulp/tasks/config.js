// Config file outputs the config for the gulp tasks
var srcPath = './src';
var distPath = './dist';

module.exports = {
  // top level props
  distPath: distPath,
  srcPath: srcPath,
  // copy task settings
  copy: {
    paths: [
        // array of paths to copy over to dist, static files, for example fonts ..
        srcPath + '/fonts/**/*',
        srcPath + '/svgs/**/*',
        srcPath + '/images/**/*',
        srcPath + '/sounds/**/*'
    ],
    base: srcPath,
  },
  // props for the watch tasks
  watch: {
    js: [
      srcPath + '/scripts/modules/**/**',
      srcPath + '/scripts/app.js'
    ],
    css: [
      srcPath + '/styles/**/*.scss'
    ],
    index: srcPath + '/index.html'
  },
  bundle: {
    entry: srcPath + '/scripts/app.js',
    output: 'app.js',
    outputPath: distPath + '/scripts'
  },
  styles: {
    output: distPath + '/styles'
  },
  browserSync: {
    ghostMode: false,
    server: {
      baseDir: [distPath]
    },
    files: [
      distPath + '/**'
    ]
  },
  lint: [
    srcPath + '/scripts/modules/**/*.js',
    srcPath + '/scripts/app.js'
  ],
};
