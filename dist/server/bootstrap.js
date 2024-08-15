"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const permissions_actions_1 = require("./permissions-actions");
exports.default = async ({ strapi }) => {
    var _a;
    const strapiAlgolia = strapi.plugin('strapi-algolia');
    try {
        await ((_a = strapi.admin) === null || _a === void 0 ? void 0 : _a.services.permission.actionProvider.registerMany(permissions_actions_1.permissionsActions));
    }
    catch (error) {
        strapi.log.error(`'strapi-algolia' permissions bootstrap failed. ${error.message}`);
    }
    try {
        await strapiAlgolia.service('lifecycles').loadLifecycleMethods();
    }
    catch (error) {
        strapi.log.error(`'strapi-algolia' plugin bootstrap lifecycles failed. ${error.message}`);
    }
};
