/**
 * 受信データハンドラ
 */
var Handler = function() {};

/**
 * 受信データの振り分け
 * @param {Object} data
 * @throws {Error} 
 */
Handler.prototype.invoke = function(data) {
    try {
        var idx = data.indexOf(":");
        if (idx > 0) {
            var method = data.substr(0, idx);
            var category = '';
            if (method.indexOf('.') >= 0) {
                category = method.substr(0, method.indexOf('.'));
                method = method.substr(method.indexOf('.')+1);
            }
            var ext = data.substr(idx+1);
            eval('var obj = ' + ext);
            if (method == '_' && obj._req) {
                var callback = callbacks[obj._req];
                callback(obj);
            } else {
                if (obj && obj._req)
                    delete callbacks[obj._req];
                var func = (category) ? this[category][method] : this[method];
                if (func == null) {
                    throw new Error('no such method ['+ data.substr(0,idx) + ']');
                } else {
                    func(obj);
                }
            }
        }
    } catch (e) {
        if (e.stack) {
            App.client.showError(e.stack);
            console.log(e.stack);
        } else {
            App.client.showError(e.message);
            console.log(e.message);
        }
    }
};

/**
 * サーバーからエラーを受信
 * @param {Obejct} data
 */
Handler.prototype.error = function(data) {
    if (data.stack) {
        App.client.showError(data.stack);
    } else if (data.message) {
        App.client.showError(data.message);
    } else {
        App.client.showError(data.name);
    }
};

