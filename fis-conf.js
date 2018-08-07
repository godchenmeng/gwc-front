fis.match('/{script,components}/**.{js,jsx}', {
  isMod: true
});

fis.match('script/modules/common/views/{index,login,admin,monitor,dispatch,resource,statistics}.js', {
    isMod: false
});
fis.hook('commonjs');

fis.match('::package', {
    postpackager: fis.plugin('loader')
});

fis.match('{/{script,components}/**.js,*.jsx}', {
    parser: fis.plugin('babel-5.x', {
        sourceMaps: false
    }),
    rExt: '.js'
});

//此行以上内容随意改动会引发错误

fis.media('gwc'). match('*.{js,jsx}', {
    optimizer: fis.plugin('uglify-js')
}).match('*.{js,css,png,jpg,gif}', {
    useHash: true,
    excluded: 'static/images/car/**'
}).match('static/**.js',{
    release:'static/js/$1'
}).match('script/**.js',{
    release: 'static/com/$1'
}).match('static/**.css',{
    release:'static/css/$1'
}).match('static/**.{png,jpg,gif,cur}',{
    release:'static/images/$1',
    excluded: 'static/images/car/**.{png,jpg,gif}'
});


