
var buildConfig = {
    'protocore': {
        'src': 'dev/src',
        'dist': {
            'dir': 'dist',
            'name': 'c.js',
            'min_name': 'c.min.js'
        },
        'deploy': {
            PROTOCORE_JS       : '/protocore.js'
        }
    },
    'enviroment': {
        'src': 'dev/src/enviroment',
        'dist': {
            'dir': 'dist',
            'name': 'c.enviroment.js',
            'min_name': 'c.enviroment.min.js'
        },
        'deploy': {
            OBJECT_JS          : '/object.js',
            EVENT_DATA_JS      : '/event-data.js',
            EVENT_JS           : '/event.js',
            LOADER_JS          : '/loader.js',
            TASK_JS            : '/task.js'
        }
    },
    'collection': {
        'src': 'dev/src/collection',
        'dist': {
            'dir': 'dist',
            'name': 'c.collection.js',
            'min_name': 'c.collection.min.js'
        },
        'deploy': {
            BASE_JS            : '/base.js',
            ARRAY_JS           : '/array.js',
            STORAGE_JS         : '/storage.js'
        }
    },
    'http': {
        'src': 'dev/src/http',
        'dist': {
            'dir': 'dist',
            'name': 'c.http.js',
            'min_name': 'c.http.min.js'
        },
        'deploy': {
            DATA_JS          : '/data.js',
            URI_JS          : '/uri.js',
            REQUEST_JS          : '/request.js',
            RESPONSE_JS      : '/response.js',
            CLIENT_JS           : '/client.js'
        }
    }
};

var FILE_ENCODING = 'utf-8',
    SRC_DIR = 'dev/src',
    DIST_DIR = 'dist',
    DIST_NAME = 'protocore.js',
    DIST_MIN_NAME = 'protocore.min.js',
    LICENSE_PATH = SRC_DIR + '/license.txt',
    DIST_PATH = DIST_DIR +'/'+ DIST_NAME,
    DIST_MIN_PATH = DIST_DIR +'/'+ DIST_MIN_NAME;

var _fs = require('fs'),
    _path = require('path'),
    _pkg = JSON.parse(readFile('package.json')),
    _now = new Date(),
    _replacements = {
        NAME : _pkg.name,
        AUTHOR : _pkg.author.name,
        VERSION_NUMBER : _pkg.version,
        HOMEPAGE : _pkg.homepage,
        LICENSE : _pkg.licenses[0].type,
        BUILD_DATE : _now.getUTCFullYear() +'/'+ pad(_now.getUTCMonth() + 1) +'/'+ pad(_now.getUTCDate()) +' '+ pad(_now.getUTCHours()) +':'+ pad(_now.getUTCMinutes())
    };


function purgeDeploy(distPath, distMinPath) {
    [distPath, distMinPath].forEach(function(filePath){
        if( _fs.existsSync(filePath) ){
            _fs.unlinkSync(filePath);
        }
    });
    console.log(' purged deploy.');
}


function build(config) {
    var deployFiles = {
        LICENSE: readFile(LICENSE_PATH)
    };
    
    for (var fileKey in config['deploy']) {
        deployFiles[fileKey] = readFile(config['src'] + config['deploy'][fileKey]);
    }
    
    var distPath = config['dist']['dir'] + '/' + config['dist']['name'];
    
    var wrapper = readFile(config['src'] + '/wrapper.js'),
        deploy = tmpl(wrapper, deployFiles, /\/\/::(\w+)::\/\//g);

    _fs.writeFileSync(distPath, tmpl(deploy, _replacements), FILE_ENCODING);
    console.log(' '+ distPath +' built.');
}


function readFile(filePath) {
    return _fs.readFileSync(filePath, FILE_ENCODING);
}


function tmpl(template, data, regexp){
    function replaceFn(match, prop){
        return (prop in data)? data[prop] : '';
    }
    return template.replace(regexp || /::(\w+)::/g, replaceFn);
}


function uglify(srcPath) {
    var
      uglyfyJS = require('uglify-js'),
      jsp = uglyfyJS.parser,
      pro = uglyfyJS.uglify,
      ast = jsp.parse( _fs.readFileSync(srcPath, FILE_ENCODING) );

    ast = pro.ast_mangle(ast);
    ast = pro.ast_squeeze(ast);

    return pro.gen_code(ast);
}


function minify(config) {
    var distPath = config['dist']['dir'] + '/' + config['dist']['name'];
    var distMinPath = config['dist']['dir'] + '/' + config['dist']['min_name'];
    
    var license = tmpl( readFile(LICENSE_PATH), _replacements );
    
    // we add a leading/trailing ";" to avoid concat issues (#73)
    _fs.writeFileSync(distMinPath, license + ';' + uglify(distPath) + ';', FILE_ENCODING);
    console.log(' '+ distMinPath +' built.');
}


function pad(val){
    val = String(val);
    if (val.length < 2) {
        return '0'+ val;
    } else {
        return val;
    }
}


// --- run ---
for (var buildScript in buildConfig) {
    purgeDeploy(buildConfig[buildScript]);
    build(buildConfig[buildScript]);
    minify(buildConfig[buildScript]);
}

