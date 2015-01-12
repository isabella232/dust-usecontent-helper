"use strict";

module.exports = function (lookup) {

    if (typeof lookup !== 'function' || lookup.length !== 3) {
        throw new TypeError("lookup function must be in the form function(locale, bundle, callback) { ... }");
    }

    var registerWith = function registerWith(dust) {
        dust.helpers.useContent = useContent;
    };

    registerWith.registerWith = registerWith;

    return registerWith;

    function useContent(chunk, ctx, bodies, params) {
        var locals = ctx.get('context') || {};
        if (!bodies.block) {
            return chunk;
        }

        return chunk.map(function (chunk) {
            /* Accept either simply-named "locale" or paypal "locality" */
            lookup(locals.contentLocale || locals.contentLocality || locals.locale || locals.locality || {}, params.bundle, function (err, content) {
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
