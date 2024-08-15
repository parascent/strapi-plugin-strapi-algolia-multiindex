"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line @typescript-eslint/no-unused-vars
exports.default = ({ strapi }) => ({
    filterProperties: (object, hiddenFields) => Object.keys(object).reduce((acc, key) => {
        if (hiddenFields.includes(key)) {
            return acc;
        }
        return { ...acc, [key]: object[key] };
    }, {}),
    getEntryId: (event) => { var _a, _b, _c, _d; return (_b = (_a = event === null || event === void 0 ? void 0 : event.result) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : (_d = (_c = event === null || event === void 0 ? void 0 : event.params) === null || _c === void 0 ? void 0 : _c.where) === null || _d === void 0 ? void 0 : _d.id; },
    getChunksRequests: (array, chunkSize = 600) => {
        if (chunkSize <= 0) {
            throw new Error('chunkSize must be greater than 0');
        }
        const chunks = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            chunks.push(array.slice(i, i + chunkSize));
        }
        return chunks;
    },
});
