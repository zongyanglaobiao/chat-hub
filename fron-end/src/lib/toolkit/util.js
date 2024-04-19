import {nanoid} from "nanoid";

/**
 * 判断一个对象是否为空
 * @param text
 * @returns {boolean}
 */
export function isBlank(text) {
    return text === undefined || text === null;
}

/**
 * 判断字符串是否为空字符串
 * @param text
 * @returns {boolean}
 */
export function isStrBlank(text) {
    return !(typeof text === 'string') ||  text === '' || text.trim() === '';
}

/**
 * 判断数组是否为空
 * @returns {boolean}
 * @param arr
 */
export function isArrayBlank(arr) {
    if (isBlank(arr) || arr.length === 0) {
        return  true
    }
    return false
}

export function  isUndefined(obj) {
    return obj === undefined;
}

export function  isNullOrUndefined(obj) {
    return obj === null || obj === undefined;
}

export function  isNulls(...obj) {
    for (const oj of obj) {
        if (isNullOrUndefined(oj)){
            return true
        }
    }
    return  false
}

/**
 * 是否是一个对象类型 === {}
 * @param obj
 * @returns {boolean}
 */
export function isObject(obj){
    if (isNullOrUndefined(obj)) {
        return false;
    }
    return   typeof obj === 'object'
}

export function toJSON(obj) {
    return JSON.stringify(obj);
}

/**
 * 获取随机颜色值0 ~ 255
 * @returns {number}
 */
export function getRandomColor() {
    return Math.floor(Math.random() * 255);
}

/**
 * 获取随机ID，底层使用nanoId
 * @returns {string}
 */
export function getRandomId() {
    return nanoid();
}


/**
 * 检查对象是否为空，空则报错
 * @param obj
 * @returns {*}
 */
export function checkObj(obj) {
    if (isNullOrUndefined(obj)) {
        //todo 返回什么
        throw new Error('obj is null or undefined');
    }
    return obj;
}

/**
 * 检查字符串是否复合email格式
 * @param str
 */
export function isEmail(str) {
    if (isBlank(str)) {
        return false
    }

    // 使用正则表达式验证email格式
    return /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/.test(str);
}
