"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateConfig = void 0;
const utils_1 = require("@strapi/utils");
const validateConfig = (config) => {
    try {
        utils_1.yup
            .object()
            .shape({
            applicationId: utils_1.yup.string().required(),
            apiKey: utils_1.yup.string().required(),
            indexPrefix: utils_1.yup.string(),
            contentTypes: utils_1.yup.array().of(utils_1.yup.object().shape({
                name: utils_1.yup.string().required(),
                index: utils_1.yup.string(),
                idPrefix: utils_1.yup.string(),
                // https://docs.strapi.io/dev-docs/api/entity-service/populate
                populate: utils_1.yup.object(),
                hideFields: utils_1.yup.array().of(utils_1.yup.string()),
                transformToBooleanFields: utils_1.yup.array().of(utils_1.yup.string()),
            })),
        })
            .validateSync(config);
    }
    catch (error) {
        throw new Error(`Algolia plugin configuration error: ${error.errors}`);
    }
};
exports.validateConfig = validateConfig;
