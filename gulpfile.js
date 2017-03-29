var gulp = require('gulp');
var del = require('del');
var merge = require('merge-stream');
var uglify = require('gulp-uglify');
var rev = require('gulp-rev');
var replace = require('gulp-rev-replace');
var RevAll = require('gulp-rev-all');
var less = require('gulp-less');
var spritesmith = require('gulp.spritesmith');

var path = require('path');
var fs = require('fs');

var webpack = require('webpack');
// var HtmlwebpackPlugin = require('html-webpack-plugin') ;
var colors = require('colors') ;

var revAll = new RevAll() ;

(function() {
    //colors
    var colorsMaps = {
        silly: 'rainbow',
        input: 'grey',
        verbose: 'cyan',
        prompt: 'red',
        info: 'green',
        data: 'blue',
        help: 'cyan',
        warn: 'yellow',
        debug: 'magenta',
        error: 'red'
    }
    colors.setTheme(Object.assign({}, colorsMaps));
    gulp.task('showColor', function () {
        for (var _o in colorsMaps) {
            if (colorsMaps.hasOwnProperty(_o)) {
                console.log(( ' this color is ' + _o + '!' )[_o]);
            }
        }
    });
})() ;

(function(){
    //project
    gulp.task('clean', function () {
        return del(['dist']);
    });
    gulp.task('compile', ['clean','webpackProduction'], function () {
        // var js = gulp.src('src/static/scripts/*.js', {base: 'src/static'}).pipe(uglify());
        var jsStream = gulp.src([
            'src/static/**/*.js'
        ],{
            base: 'src/static'
        }) ;
        var lessStream = gulp.src('src/static/resource/styles/**/*.less',{base: 'src/static'}).pipe(less());
        var cssStream = gulp.src('src/static/resource/styles/**/*.css', {base: 'src/static'}) ;
        var imgStream = gulp.src('src/static/resource/images/**', {base: 'src/static'});
        var fontStream = gulp.src('src/static/resource/fonts/**', {base: 'src/static'});
        var swfStream = gulp.src('src/static/resource/swf/**' , {base: 'src/static'});
        // return merge(jsStream, lessStream, cssStream, imgStream, fontStream)
        //     .pipe(rev())
        //     .pipe(gulp.dest('dist/static'))
        //     .pipe(rev.manifest())
        //     .pipe(gulp.dest('dist/tmp'));
        return merge(jsStream, lessStream, cssStream, imgStream, fontStream, swfStream)
            .pipe(revAll.revision())
            .pipe(gulp.dest('dist/static'))
            .pipe(revAll.manifestFile())
            .pipe(gulp.dest('dist/tmp'));
    });
    gulp.task('revision', ['compile'], function () {
        return gulp.src('dist/static/**')
            .pipe(rev())
            .pipe(gulp.dest('dist/static'))
            .pipe(rev.manifest())
            .pipe(gulp.dest('dist/tmp'));
    });
    gulp.task('replace', ['compile'], function () {
        return gulp.src([
            'src/views/**/*.hbs'
        ])
            .pipe(replace({manifest: gulp.src('dist/tmp/rev-manifest.json')}))
            .pipe(gulp.dest('dist/views'));
    });
    gulp.task('copy', ['clean', 'compile', 'replace'], function () {
        return gulp.src([
            'src/**',
            '!src/static/**',
            '!src/views/**'
        ])
            .pipe(gulp.dest('dist'));
    });
    gulp.task('build', ['clean', 'compile', 'replace', 'copy'], function () {
        return del(['dist/tmp']);
    });
    gulp.task('default', ['clean', 'build']);
})() ;

(function () {
    //webpack
    var webpackConfig = function ( project ) {
        var projPath =  project.path || 'index' ;
        return {
            entry: {
                app: './src/static' + projPath + '/index.js',
                vendor: [
                    'jquery',
                    'signals',
                    'react',
                    'react-dom',
                    'react-redux',
                    'react-router',
                    'react-router-redux',
                    'redux'
                ]
            },
            output: {
                path: './src/static' + projPath　,
                filename: 'bundle.js'
            },
            //启动sourcemap
            
            devtool: ( gulp.env.webpackenv && gulp.env.webpackenv == 'production' )
                ? false
                : 'eval-source-map' ,
            
            // devtool: false ,
            // devServer: {
            //     historyApiFallback: true,
            //     // hot: true,
            //     inline: true,
            //     progress: true
            // },
            module: {
                perLoaders: [
                    {
                        test: /\.jsx?$/,
                        include: 'src',
                        loader: 'jshint-loader'
                    }
                ],
                loaders: [{
                    test: /\.jsx?$/,
                    loader: 'babel',
                    exclude: /node_modules/,
                    query: {
                        presets: ['es2015', 'react', "stage-1"] //等同于.babelrc配置
                    }
                },{
                    test: /\.css$/,
                    loader: 'style-loader!css-loader'
                }]
            },
            // 配置jshint的选项，支持es6的校验
            jshint: {
                "esnext": true
            },
            resolve: {
                extensions: ['', '.css','jsx', '.js']
            },
            plugins: [
                // new HtmlwebpackPlugin({
                //    title : 'html plugin'
                // }),
                new webpack.ProvidePlugin({
                    $: 'jquery',
                    jQuery: 'jquery',
                    'window.jQuery': 'jquery',
                    'signals': 'signals',
                    'window.signals': 'signals'
                }),
                new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js')
            ]
        };
    }　;
    //single　page　list!
    var　singlePageList　=　[{
        name　:　'index'　,
        path　:　'/index'　
    },{
        name　:　'admin'　,
        path　:　'/admin'
    },{
        name　:　'passportLogin'　,
        path　:　'/passport/login'
    },{
        name　:　'passportRegister'　,
        path　:　'/passport/register'
    },{
        name　:　'passportFindpwd'　,
        path　:　'/passport/findpwd'
    }]　;
    singlePageList.forEach(function ( projValue , index) {
        (function (projValue) {
            gulp.task( 'webpack-' + projValue.name , function(){
                webpack( webpackConfig( projValue ) , function (err, state) {
                    console.info( state.toString().info ) ;
                } ) ;
                watching( projValue ) ;
            }) ;
        })(projValue) ;
    }) ;
    var isWatching = false ;
    var watching = function( projValue ){
        if ( isWatching ){
            // return ;
        }
        isWatching = gulp.watch( [
            './src/static/**/*.js' ,
            '!./src/static/**/bundle.js' ,
            '!./src/static/**/vendor.bundle.js' ,
        ], function (event) {
            console.log( ('this file : ' + event.path.data + ' has '　+ event.type.debug ).warn ) ;
            (function (projValue) {
                webpack( webpackConfig( projValue ) , function( err, state ){
                    console.info( state.toString().info ) ;
                }) ;
            })(projValue)
        } ) ;
    } ;
    /*remain*/
    gulp.task( 'webpack' , function(){
        webpack( webpackConfig , function( err, state ){
            console.info( state.toString().info ) ;
        }) ;
        gulp.watch( [
            './src/static/**/*.js' ,
            '!./src/static/**/bundle.js' ,
            '!./src/static/**/vendor.bundle.js' ,
            '!./src/static/passport/**/*.js'
        ], function (event) {
            console.log( ('this file : ' + event.path.data + ' has '　+ event.type.debug ).warn ) ;
            webpack( webpackConfig , function( err, state ){
                console.info( state.toString().info ) ;
            }) ;
        } ) ;
    }) ;
    /*remain*/

    //no watch
    gulp.task( 'webpackProduction' , ['clean'] ,function () {
        // webpack( webpackConfig() , function( err, state ){
            // console.info( state.toString().info ) ;
        // }) ;
        singlePageList.forEach(function ( projValue , index) {
            (function (projValue) {
                webpack( webpackConfig( projValue ) , function (err, state) {
                    // console.info( state.toString().info ) ;
                    console.log( 'Build project : '.data + projValue.name.info + ' success!'.data ) ;
                } ) ;
            })(projValue) ;
        }) ;
    })
})() ;

(function(){
    //create　sprite
    gulp.task('sprite', ['createSpriteCss'] , function(){
        //sprite.css => sprite.less
        fs.rename('./src/static/resource/styles/sprite.css','./src/static/resource/styles/sprite.less', function(err){
            if(err){
                throw err;
            }
            console.log('rename sprite.css to sprite.less!'.info);
        }) ;
    }) ;
    gulp.task('createSpriteCss', function(){
        var spriteDate = gulp.src('src/static/resource/images/sprite/**/*.png').pipe(spritesmith({
            imgName : 'sprite.png' ,
            imgPath : '../images/sprite.png' ,
            cssName : 'sprite.css' ,
            retinaSrcFilter: '**/*@2x.png',
            retinaImgName: 'sprite@2x.png',
            retinaImgPath: '../images/sprite@2x.png',
            cssOpts : {
                cssSelector : function (item) {
                    var name = ( item.name || '' ).toLowerCase() ;
                    name = name.replace( '_hover' , ':hover' ) ;
                    name = name.replace( '_checked' , ':checked' ) ;
                    name = name.replace( '_disabled' , ':disabled' ) ;
                    return '.sprite-' + name　;
                }
            }
        }))　;
        var　imgStream　=　spriteDate.img.pipe(gulp.dest('src/static/resource/images/'))　;
        var　cssStream　=　spriteDate.css.pipe(gulp.dest('src/static/resource/styles/'))　;
        return　merge(imgStream,　cssStream)　;
    })
})() ;