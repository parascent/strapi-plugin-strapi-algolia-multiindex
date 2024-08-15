"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => ({
    async index(ctx) {
        var _a, _b, _c, _d, _e;
        const { indexPrefix = '', contentTypes, applicationId, apiKey, } = strapi.config.get('plugin.strapi-algolia');
        if (!contentTypes) {
            return;
        }
        const strapiAlgolia = strapi.plugin('strapi-algolia');
        const algoliaService = strapiAlgolia.service('algolia');
        const strapiService = strapiAlgolia.service('strapi');
        const utilsService = strapiAlgolia.service('utils');
        const client = await algoliaService.getAlgoliaClient(applicationId, apiKey);
        const body = ctx.request.body;
        if (!body.name) {
            return ctx.throw(400, `Missing name in body`);
        }
        const validContentTypes = contentTypes.filter((contentType) => contentType.name === body.name);
        if (!validContentTypes) {
            return ctx.throw(400, `Content type not found in config with ${body.name}`);
        }
        var messages;
        messages = [];
        for (let contentType of validContentTypes) {
            const { name, index, idPrefix = '', populate = '*', hideFields = [], transformToBooleanFields = [], } = contentType;
            const indexName = `${indexPrefix}${index !== null && index !== void 0 ? index : name}`;
            const algoliaIndex = client.initIndex(indexName);
            const allLocales = await ((_d = (_c = (_b = (_a = strapi.plugins) === null || _a === void 0 ? void 0 : _a.i18n) === null || _b === void 0 ? void 0 : _b.services) === null || _c === void 0 ? void 0 : _c.locales) === null || _d === void 0 ? void 0 : _d.find());
            const localeFilter = allLocales === null || allLocales === void 0 ? void 0 : allLocales.map((locale) => locale.code);
            const findManyBaseOptions = { populate };
            const findManyOptions = localeFilter
                ? {
                    ...findManyBaseOptions,
                    locale: localeFilter,
                }
                : { ...findManyBaseOptions };
            const articlesStrapi = await ((_e = strapi.entityService) === null || _e === void 0 ? void 0 : _e.findMany(name, findManyOptions));
            const articles = (articlesStrapi !== null && articlesStrapi !== void 0 ? articlesStrapi : []).map((article) => utilsService.filterProperties(article, hideFields));
            await strapiService.afterUpdateAndCreateAlreadyPopulate(articles, idPrefix, algoliaIndex, transformToBooleanFields);
            messages.push(`Indexing articles type ${body.name} to index ${indexName}`);
        }
        return ctx.send({
            message: messages.join(', ') + '.'
        });
    },
});
