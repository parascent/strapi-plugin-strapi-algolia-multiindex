"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformNullToBoolean = void 0;
const transformNullToBoolean = (obj, transformToBooleanFields) => {
    const newObj = Array.isArray(obj) ? [] : {};
    for (const key in obj) {
        if (obj[key] === null) {
            if (transformToBooleanFields.includes(key)) {
                newObj[key] = false;
            }
            else {
                newObj[key] = null;
            }
        }
        else if (typeof obj[key] === 'object') {
            newObj[key] = (0, exports.transformNullToBoolean)(obj[key], transformToBooleanFields);
        }
        else {
            newObj[key] = obj[key];
        }
    }
    return newObj;
};
exports.transformNullToBoolean = transformNullToBoolean;
