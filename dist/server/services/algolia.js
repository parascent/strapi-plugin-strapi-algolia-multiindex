"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils/utils");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
exports.default = ({ strapi }) => ({
    getAlgoliaClient: async (applicationId, apiKey) => {
        const algoliasearch = await Promise.resolve().then(() => __importStar(require('algoliasearch'))).then((a) => a.default);
        const client = algoliasearch(applicationId, apiKey);
        return client;
    },
    createOrDeleteObjects: async (objectsToSave, objectsIdsToDelete, algoliaIndex, transformToBooleanFields = []) => {
        const strapiAlgolia = strapi.plugin('strapi-algolia');
        const utilsService = strapiAlgolia.service('utils');
        if (objectsIdsToDelete.length) {
            const chunkedObjectsToDelete = utilsService.getChunksRequests(objectsIdsToDelete);
            for (const chunk of chunkedObjectsToDelete) {
                await algoliaIndex.deleteObjects(chunk);
            }
        }
        if (objectsToSave.length) {
            const chunkedObjectsToSave = utilsService.getChunksRequests(objectsToSave);
            for (const chunk of chunkedObjectsToSave) {
                const cleanedChunk = chunk.map((c) => (0, utils_1.transformNullToBoolean)(c, transformToBooleanFields));
                await algoliaIndex.saveObjects(cleanedChunk);
            }
        }
    },
});
