"use strict";

module.exports = function (lookup) {

    if (typeof lookup != 'function' || lookup.length != 3) {
        throw new TypeError("lookup function must be in the form function(bundle, callback) { ... }");
    }

    return {
        registerWith: function registerWith(dust) {
            dust.helpers.useContent = useContent;
        }
    };

    function useContent(chunk, ctx, bodies, params) {
        if (!bodies.block) {
            return chunk;
        }

        return chunk.map(function (chunk) {
            lookup(ctx.get('locality'), params.bundle, function (err, content) {
                if (err) {
                    chunk.setError(err);
                } else {
                    ctx = ctx.push({intl: { messages: content }});
                    bodies.block(chunk, ctx).end();
                }
            });
        });
    }
};

module.exports.withLoader = module.exports;
