"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line @typescript-eslint/no-unused-vars
exports.default = ({ strapi }) => ({
    getStrapiObject: async (event, populate, hideFields) => {
        var _a;
        const strapiAlgolia = strapi.plugin('strapi-algolia');
        const utilsService = strapiAlgolia.service('utils');
        const { model } = event;
        const modelUid = model.uid;
        const entryId = utilsService.getEntryId(event);
        if (!entryId) {
            throw new Error(`No entry id found in event.`);
        }
        const strapiObject = await ((_a = strapi.entityService) === null || _a === void 0 ? void 0 : _a.findOne(modelUid, entryId, { populate }));
        if (!strapiObject) {
            throw new Error(`No entry found for ${modelUid} with ID ${entryId}`);
        }
        return utilsService.filterProperties(strapiObject, hideFields);
    },
    getStrapiObjectWithoutFilters: async (event, populate) => {
        var _a;
        const strapiAlgolia = strapi.plugin('strapi-algolia');
        const utilsService = strapiAlgolia.service('utils');
        const { model } = event;
        const modelUid = model.uid;
        const entryId = utilsService.getEntryId(event);
        if (!entryId) {
            throw new Error(`No entry id found in event.`);
        }
        const strapiObject = await ((_a = strapi.entityService) === null || _a === void 0 ? void 0 : _a.findOne(modelUid, entryId, { populate }));
        if (!strapiObject) {
            throw new Error(`No entry found for ${modelUid} with ID ${entryId}`);
        }
        return strapiObject;
    },
    afterUpdateAndCreate: async (_events, populate, hideFields, transformToBooleanFields, idPrefix, algoliaIndex) => {
        const strapiAlgolia = strapi.plugin('strapi-algolia');
        const algoliaService = strapiAlgolia.service('algolia');
        const strapiService = strapiAlgolia.service('strapi');
        const utilsService = strapiAlgolia.service('utils');
        const objectsToSave = [];
        const objectsIdsToDelete = [];
        const events = _events;
        const indexExist = await algoliaIndex.exists();
        for (const event of events) {
            try {
                const entryId = `${idPrefix}${utilsService.getEntryId(event)}`;
                let strapiObject = await strapiService.getStrapiObjectWithoutFilters(event, populate);
                if (strapiObject.publishedAt === null) {
                    if (indexExist) {
                        objectsIdsToDelete.push(entryId);
                    }
                }
                else if (strapiObject.publishedAt !== null) {
                    strapiObject = utilsService.filterProperties(strapiObject, hideFields);
                    const entryId = strapiObject.id;
                    const entryIdWithPrefix = `${idPrefix}${entryId}`;
                    let objectToSave = {
                        objectID: entryIdWithPrefix,
                        ...strapiObject,
                    };
                    if (idPrefix && idPrefix != '') {
                        objectToSave['collection'] = idPrefix;
                    }
                    objectsToSave.push(objectToSave);
                }
            }
            catch (error) {
                console.error(`Error while updating Algolia index: ${JSON.stringify(error)}`);
            }
        }
        await algoliaService.createOrDeleteObjects(objectsToSave, objectsIdsToDelete, algoliaIndex, transformToBooleanFields);
    },
    afterUpdateAndCreateAlreadyPopulate: async (articles, idPrefix, algoliaIndex, transformToBooleanFields = []) => {
        const strapiAlgolia = strapi.plugin('strapi-algolia');
        const algoliaService = strapiAlgolia.service('algolia');
        const objectsToSave = [];
        const objectsIdsToDelete = [];
        const indexExist = await algoliaIndex.exists();
        for (const article of articles) {
            try {
                const entryId = article.id;
                const entryIdWithPrefix = `${idPrefix}${entryId}`;
                if (article.publishedAt === null) {
                    if (indexExist) {
                        objectsIdsToDelete.push(entryIdWithPrefix);
                    }
                }
                else if (article.publishedAt !== null) {
                    let objectToSave = {
                        objectID: entryIdWithPrefix,
                        ...article,
                    };
                    if (idPrefix && idPrefix != '') {
                        objectToSave['collection'] = idPrefix;
                    }
                    objectsToSave.push(objectToSave);
                }
            }
            catch (error) {
                console.error(`Error while updating Algolia index: ${JSON.stringify(error)}`);
            }
        }
        await algoliaService.createOrDeleteObjects(objectsToSave, objectsIdsToDelete, algoliaIndex, transformToBooleanFields);
    },
    afterDeleteOneOrMany: async (_event, idPrefix, algoliaIndex, many) => {
        var _a, _b, _c;
        try {
            const event = _event;
            const strapiIds = many
                ? (_c = (_b = (_a = event === null || event === void 0 ? void 0 : event.params) === null || _a === void 0 ? void 0 : _a.where) === null || _b === void 0 ? void 0 : _b['$and'][0]) === null || _c === void 0 ? void 0 : _c.id['$in']
                : [event.params.where.id];
            const objectIDs = strapiIds.map((id) => `${idPrefix}${id}`);
            await algoliaIndex.deleteObjects(objectIDs);
        }
        catch (error) {
            console.error(`Error while deleting object(s) from Algolia index: ${error}`);
        }
    },
});
