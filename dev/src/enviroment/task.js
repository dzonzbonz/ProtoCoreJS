/**
 * @constructor
 * @extends C.Enviroment.Object
 * @param {Function} actionAfter
 * @param {Function} actionBefore
 * @param {Object} callContext
 * 
 * @returns {C.Enviroment.Task}
 */
C.Enviroment.Task = function (callable) {
    
    this.onMessage = new C.Enviroment.Event();
    this.onStop = new C.Enviroment.Event();
    this.onRun = new C.Enviroment.Event();
        
    this.run = function () {
    };

    this.pipe = function () {
    };

    this.stop = function () {
    };

};

C.factory(C.Enviroment, 'Task', function () {

    var thread = window.Worker;
    var URL = window.URL || window.webkitURL;

    function encodeArguments (args) {
        try {
            var data = JSON.stringify(args);
        } catch (e) {
            throw new Error('Arguments provided to parallel function must be JSON serializable');
        }
        var len = typeof (data) === 'undefined' ? 0 : data.length;
        var buffer = new ArrayBuffer(len);
        var view = new DataView(buffer);
        for (var i = 0; i < len; i++) {
            view.setUint8(i, data.charCodeAt(i) & 255);
        }
        return buffer;
    };

    function decodeArguments (data) {
        var view = new DataView(data);
        var len = data.byteLength;
        var str = Array(len);
        for (var i = 0; i < len; i++) {
            str[i] = String.fromCharCode(view.getUint8(i));
        }
        if (!str.length) {
            return;
        } else {
            return JSON.parse(str.join(''));
        }
    };

    var resourceTemplate = function () {
        
        var decodeArguments = (/**/decodeFunc/**/);
        
        var encodeArguments = (/**/encodeFunc/**/);
        
        var /**/name/**/ = (/**/func/**/);
        
    // send message to the initiator
        /**/name/**/.pipe = function (messageID, messageData) {
//            var pipeData = encodeArguments({
//                'message': messageID,
//                'data': messageData
//            });
//            self.postMessage(pipeData, [pipeData]);
            self.postMessage({
                'message': messageID,
                'data': messageData
            });
        };
        
        /**/name/**/.sleep = function (sleepDuration) {
            var now = new Date().getTime();
            while (new Date().getTime() < now + sleepDuration) { /* do nothing */ }
        };
        
        self.addEventListener('message', function (e) {
//            var inputArgs = decodeArguments(e.data);
            var inputArgs = e.data;
            
            var value = (/**/name/**/).apply(/**/name/**/, inputArgs);
            
//            var buffer = encodeArguments({
//                'message': false,
//                'data': value
//            });
            
            self.postMessage({
                'message': false,
                'data': value
            });
//            self.postMessage(buffer, [buffer]);
            self.close();
        });
    };

    var prepareResource = function (callback) {

        callback = callback;
        
        var name = callback.name;
        var fnStr = callback.toString();
        if (!name) {
            name = '$' + ((Math.random() * 10) | 0);
            while (fnStr.indexOf(name) !== -1) {
                name += ((Math.random() * 10) | 0);
            }
        }

        var script = resourceTemplate
                .toString()
                .replace(/^.*?[\n\r]+/gi, '')
                .replace(/\}[\s]*$/, '')
                .replace(/\/\*\*\/name\/\*\*\//gi, name)
                .replace(/\/\*\*\/func\/\*\*\//gi, fnStr)
                .replace(/\/\*\*\/decodeFunc\/\*\*\//gi, decodeArguments.toString() )
                .replace(/\/\*\*\/encodeFunc\/\*\*\//gi, encodeArguments.toString() );

        var resource = URL.createObjectURL(new Blob([script], {type: 'text/javascript'}));

        return resource;

    };

    var startProcess = function (resource, callback, pipe, params) {
        
        var worker = new Worker(resource);
        
        var self = this;
//        var buffer = encodeArguments(params);
        
        var listener = function (e) {
//            var piped = decodeArguments(e.data);
            var piped = e.data;
            
            if (piped.message) {
                pipe.call(self, piped);
            }
            else {
                callback.call(self, piped);
            }
        };
        
    // listen to the messages comming from worker
        worker.addEventListener('message', listener);
//        worker.postMessage(buffer, [buffer]);
        worker.postMessage(params);
        
        return worker;
    };

    /**
     * @constructor
     * @extends C.Enviroment.Object
     * @returns {C.Enviroment.Task}
     */
    var __constructor = function (callable, callback, pipe) {
        var running = false;
        var debug = {
            start: 0,
            end: 0,
            time: 0
        };
        var worker = null;
        
        this.onMessage = new C.Enviroment.Event();
        this.onStop = new C.Enviroment.Event();
        this.onRun = new C.Enviroment.Event();
        
        this.run = function () {
            if (!running) {
                running = true;
//                var self = this;
                var processResource = prepareResource(callable);
                
                var eventData = new C.Enviroment.EventData();
                
                worker = startProcess(
                    processResource, 
                    function (e) {
                        eventData.data(e);
                        eventData.assumeDefault();
                        eventData.continuePropagation();
                        self.onStop.notify(eventData);
                    }, 
                    function (e) {
                        eventData.data(e);
                        eventData.assumeDefault();
                        eventData.continuePropagation();
                        self.onMessage.notify(eventData);
                    }, 
                    [].slice.call(arguments)
                );
//                worker = startProcess(
//                    processResource, 
//                    callback, 
//                    pipe, 
//                    [].slice.call(arguments)
//                );
        
                this.onRun.notify(new C.Enviroment.EventData());
            }
        };

        this.pipe = function () {
            if (running) {
//                var buffer = encodeArguments({
//                    'message': messageID,
//                    'data': messageData
//                });
                
                worker.postMessage([].slice.call(arguments));
//                worker.postMessage(buffer, [buffer]);
            }
        };

        this.stop = function () {
            if (running) {                
                worker.terminate();
                
                running = false;
            }
        };
        
        var self = this;
        
        C.mode(this, [ 'run', 'pipe', 'onMessage', 'onStop', 'onRun' ], C.MODE_LOCKED);
    };
    
    __constructor.prototype = new C.Enviroment.Task();
    __constructor.prototype.constructor = C.Enviroment.Task;
    
    return __constructor;
});