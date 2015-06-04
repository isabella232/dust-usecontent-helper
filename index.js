"use strict";

module.exports = function (lookup) {

    if (typeof lookup !== 'function' || lookup.length !== 3) {
        throw new TypeError("lookup function must be in the form function(context, bundle, callback) { ... }");
    }

    var registerWith = function registerWith(dust) {
        dust.helpers.useContent = useContent;
    };

    registerWith.registerWith = registerWith;

    return registerWith;

    function useContent(chunk, ctx, bodies, params) {
        if (!bodies.block) {
            return chunk;
        }

        return chunk.map(function (chunk) {
            lookup(ctx, params.bundle, function (err, content) {
                if (err) {
                    chunk.setError(err);
                } else {
                    ctx = ctx.push({ intl: { messages: content } });
                    hackGibson(ctx, content);
                    bodies.block(chunk, ctx).end();
                }
            });
        });
    }
};

function hackGibson(ctx, content) {
    var oldShiftBlocks = ctx.shiftBlocks;
    var oldPush = ctx.push;
    ctx.shiftBlocks = function(locals) {
        return oldShiftBlocks.call(this, objMap(locals, function (l) {
            return wrapBlock(l, content);
        }));
    };

    ctx.push = function(head, idx, len) {
        var newCtx = oldPush.apply(this, arguments);
        hackGibson(newCtx, content);
        return newCtx;
    };
}

function wrapBlock(block, content) {
    return function (chunk, ctx) {
        ctx = ctx.push({intl: { messages: content }});
        return block(chunk, ctx);
    }
}

function objMap(obj, fn) {
    var n = {};
    Object.keys(obj).forEach(function (e) {
        n[e] = fn(obj[e]);
    });
    return n;
}

module.exports.withLoader = module.exports;
