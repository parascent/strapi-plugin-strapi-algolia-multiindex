"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => ({
    async contentTypes(ctx) {
        const { contentTypes } = strapi.config.get('plugin.strapi-algolia');
        if (!contentTypes) {
            return;
        }
        ctx.body = {
            contentTypes: contentTypes.map((contentType) => contentType.name),
        };
    },
});
