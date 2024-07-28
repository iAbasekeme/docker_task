import {
  PhoneNumberFormat as PNF,
  PhoneNumberUtil,
} from 'google-libphonenumber';
import {
  isString,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import * as crypto from 'crypto';
import { PromisePool } from '@supercharge/promise-pool/dist';
import * as R from 'ramda';
import { customAlphabet } from 'nanoid';
import * as moment from 'moment';
import { SHA_512_HASH } from 'src/config/env.config';
import { Point } from 'src/common/types';

const phoneUtil = PhoneNumberUtil.getInstance();

export function normalizePhoneNumber(phoneNumber: string, countryCode: string) {
  const number = phoneUtil.parseAndKeepRawInput(
    phoneNumber,
    countryCode || 'NG',
  );
  return phoneUtil.format(number, PNF.E164);
}

export function extractPhoneNumberInfo(phoneNumber: string) {
  if (phoneNumber) {
    const phoneNumberUtil = PhoneNumberUtil.getInstance();
    const parsedNumber = phoneNumberUtil.parse(phoneNumber, 'ZZ'); // 'ZZ' means unknown region

    const countryCode = phoneNumberUtil.getRegionCodeForNumber(parsedNumber);
    const nationalNumber = phoneNumberUtil.format(parsedNumber, PNF.NATIONAL);

    return {
      countryCode,
      nationalNumber,
    };
  }
  return {
    countryCode: '',
    nationalNumber: '',
  };
}

/* 
  sorting should take the pattern:
  https://example.com?sort=fieldName1:order,fieldName2:order

  e.g https://shuttlers.ng/products?sort=name:asc,createdAt:desc,category:asc
*/
export function buildEntitySortObjectFromQueryParam(sort: string) {
  const sortOrder: any = {};
  if (sort) {
    const sortFields = sort.split(/\s*,\s*/);
    sortFields.forEach((sortField) => {
      const [field, orderValue] = sortField
        .split(/\s*:\s*/)
        .map((str) => str.trim());
      sortOrder[field] = (orderValue || '').toUpperCase();
    });
  }
  return sortOrder;
}

export function printObject(obj: any) {
  return obj ? JSON.stringify(obj) : '';
}

export const hashUtils = {
  hash: async function hash(plainText: string) {
    const hash: string = await new Promise((resolve, reject) => {
      crypto.pbkdf2(
        plainText,
        SHA_512_HASH,
        100000,
        64,
        'sha512',
        (err, derivedKey) => {
          if (err) reject(err);
          resolve(derivedKey.toString('hex'));
        },
      );
    });
    return hash;
  },
  compare: async function verifyPassword(password: string, hash: string) {
    const key: string = await new Promise((resolve, reject) => {
      crypto.pbkdf2(
        password,
        SHA_512_HASH,
        100000,
        64,
        'sha512',
        (err, derivedKey) => {
          if (err) reject(err);
          resolve(derivedKey.toString('hex'));
        },
      );
    });
    return key === hash;
  },
  shortSignature(plainText: string) {
    return cyrb53(plainText);
  },
};

export function cyrb53(str: string, seed = 1) {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch: number; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }

  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
    Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
    Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

export function isEmail(str: string) {
  if (str.includes('@')) {
    return true;
  }
  return false;
}

export function IsEmailOrHandle(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isEmailOrHandle',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === 'string' && validateEmailOrHandle(value);
        },
      },
    });
  };
}

function validateEmailOrHandle(str: string) {
  if (isEmail(str) || (isString(str) && str.length >= 3)) {
    return true;
  }
  return false;
}

export function generateTokenNumeric(length = 4) {
  let randomNumber = '';
  for (let i = 0; i < length; i++) {
    randomNumber += Math.floor(Math.random() * 10); // Generate a random digit (0-9) and append it
  }
  return randomNumber;
}

export function generateTokenChar(length = 4) {
  const chars =
    'X7m6sRnQpZj4cSfO3qPbBd2e8Ll5JgAaGhWuYtUy1vVwVx0z9NkKoIiMmHrRfF3DdEeLlCc1Yy2jJb6aA5nN7W8uU4xX9pPcCgGyYtTlLvVdDoOeEwWqQ';
  let token = '';
  const charsetLength = chars.length;
  for (let i = 0; i < length; i++) {
    const randomCharIdx = Math.round(Math.random() * (charsetLength - 1));
    token += chars[randomCharIdx];
  }
  return token;
}

export function generateVerificationString(
  id: string,
  token: string,
  iat: number,
) {
  return `id:${id}.token:${token}.iat:${iat}`;
}

export function stripOffNonEntityProps(params: any) {
  const fieldsToStripOff = ['page', 'perPage', 'sort'];
  if (params && typeof params === 'object') {
    for (const prop of fieldsToStripOff) {
      delete params[prop];
    }
  }
}

export const camelCase = (str: string) =>
  str.replace(/-([a-z])/g, (matchedLetter) => matchedLetter[1].toUpperCase());

export async function runConcurrently<T>(
  data: T[],
  concurrentCount: number,
  process: (each: T) => any,
) {
  return await new PromisePool(data)
    .withConcurrency(concurrentCount)
    .process(process);
}

export function getKeyFromS3Url(s3Url: string) {
  const url = new URL(s3Url);
  const key = url.pathname.substring(1);
  return key;
}
export const capitalize = (str: string) =>
  str ? `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}` : str;

export function resolvePointCoordinateFromLatLon(latLon: {
  longitude: number;
  latitude: number;
}): Point {
  const { longitude, latitude } = latLon || {};
  return longitude && latitude
    ? {
        type: 'Point',
        coordinates: [longitude, latitude],
      }
    : null;
}

// Function to get a random item from a list
export const getRandomItem = <T>(list: T[]) => {
  const randomIndex = Math.floor(Math.random() * R.length(list));
  return R.nth(randomIndex, list);
};

export function referenceIdFromName(name: {
  firstName: string;
  lastName: string;
}) {
  const alphabet = '0123456789';
  const nanoid = customAlphabet(alphabet, 7);
  const { firstName, lastName } = name;
  return `${firstName[0].toUpperCase()}${lastName[0].toUpperCase()}-${nanoid()}`;
}

export function keyBy<O>(list: O[], key: string) {
  const obj: Record<string, O> = {};
  for (let item of list) {
    obj[item[key]] = item;
  }
  return obj;
}

export const optionalBooleanMapper = new Map([
  ['undefined', undefined],
  ['true', true],
  ['false', false],
  ['0', false],
  ['1', true],
]);

export function time(t1?: string | Date) {
  return {
    init(t?: string | Date) {
      return moment(t1 || t);
    },
    toDate(t?: string | Date) {
      return moment(t1 || t).toDate();
    },
  };
}

export function roundToNearestDecimal(value: number, decimals: number): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}

export function roundToNearestHalf(value: number): number {
  return Math.round(value * 2) / 2;
}

export function prettyPrintArray<T>(arr: T[]) {
  return arr.length > 1
    ? arr
        .map((a) => (typeof a === 'object' ? JSON.stringify(a) : a))
        .slice(0, arr.length - 1)
        .join(', ') +
        ' and ' +
        arr[arr.length - 1]
    : arr[0];
}
