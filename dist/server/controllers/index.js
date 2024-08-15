"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./config"));
const index_all_1 = __importDefault(require("./index-all"));
exports.default = {
    'strapi-algolia-index-articles': index_all_1.default,
    'strapi-algolia-config': config_1.default,
};
