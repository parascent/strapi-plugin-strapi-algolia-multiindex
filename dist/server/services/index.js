"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lifecycles_1 = __importDefault(require("./lifecycles"));
const algolia_1 = __importDefault(require("./algolia"));
const strapi_1 = __importDefault(require("./strapi"));
const utils_1 = __importDefault(require("./utils"));
exports.default = {
    algolia: algolia_1.default,
    strapi: strapi_1.default,
    lifecycles: lifecycles_1.default,
    utils: utils_1.default,
};
