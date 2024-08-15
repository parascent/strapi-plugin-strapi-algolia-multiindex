"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validate_1 = require("../../utils/validate");
exports.default = {
    default: {
        indexPrefix: `${strapi.config.environment}_`,
    },
    validator: (config) => (0, validate_1.validateConfig)(config),
};
