"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => ({
    async loadLifecycleMethods() {
        var _a;
        const { indexPrefix = '', contentTypes, applicationId, apiKey, } = strapi.config.get('plugin.strapi-algolia');
        if (!contentTypes) {
            return;
        }
        const strapiAlgolia = strapi.plugin('strapi-algolia');
        const algoliaService = strapiAlgolia.service('algolia');
        const strapiService = strapiAlgolia.service('strapi');
        const client = await algoliaService.getAlgoliaClient(applicationId, apiKey);
        for (const contentType of contentTypes) {
            const { name, index, idPrefix = '', populate = '*', hideFields = [], transformToBooleanFields = [], } = contentType;
            if (strapi.contentTypes[name]) {
                const indexName = `${indexPrefix}${index !== null && index !== void 0 ? index : name}`;
                const algoliaIndex = client.initIndex(indexName);
                (_a = strapi.db) === null || _a === void 0 ? void 0 : _a.lifecycles.subscribe({
                    models: [name],
                    afterCreate: async (event) => {
                        await strapiService.afterUpdateAndCreate([event], populate, hideFields, transformToBooleanFields, idPrefix, algoliaIndex);
                    },
                    afterUpdate: async (event) => {
                        await strapiService.afterUpdateAndCreate([event], populate, hideFields, transformToBooleanFields, idPrefix, algoliaIndex);
                    },
                    afterDelete: async (event) => {
                        await strapiService.afterDeleteOneOrMany(event, idPrefix, algoliaIndex, false);
                    },
                    afterDeleteMany: async (event) => {
                        await strapiService.afterDeleteOneOrMany(event, idPrefix, algoliaIndex, true);
                    },
                });
            }
        }
    },
});
