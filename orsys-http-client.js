import axios from 'axios';
import * as _ from 'lodash';

export function HTTPClient(store, conf) {

    const endpoints = {}

    function fetch(p, storeKey) {

        return new Promise(async function (resolve, reject) {
            p.baseURL = p.baseURL || conf.baseURL

            if (p.endpoint) {
                const endpoint = endpoints[p.endpoint]
                if (!endpoint) {
                    throw new Error("The endpoint is not registered");
                } else {
                    p.url = p.url || endpoint.url
                    p.method = p.method || endpoint.method

                    if (_.lowerCase(p.method) === 'post') {
                        p.data = fillPayload(endpoint.payload, p.data);
                    } else {
                        p.params = fillPayload(endpoint.payload, p.data);
                    }
                }
            }

            p.method = p.method || 'post'

            await axios(p).then(function (rep) {
                if (rep.status >= 200 && rep.status < 300) {
                    if (rep.data.error) {
                        reject(rep.data.cause)
                        // throw new Error(rep.data.cause);
                    } else {
                        if (storeKey) {
                            store.set(storeKey, rep.data.data || rep.data || {})
                        }

                        resolve(rep.data.data || rep.data || {})
                    }
                } else {
                    // throw new Error("HTTP ERROR CODE: " + rep.status);
                    reject("HTTP ERROR CODE: " + rep.status)
                }
            }).catch(err => {
                reject(err.message);
                // throw new Error(err.message);
            })
        });


    }

    function registerEP(name, config) {
        endpoints[name] = config
    }

    function fillPayload(payloadSchema, data) {
        const payload = {};
        _.forEach(payloadSchema, (val, key) => {
            if (_.isPlainObject(val)) {
                payload[key] = fillPayload(val, data);
            } else if (_.isArray(val)) {
                payload[key] = [];

                payload[key] = _.map(findParam(key, data), (row) => {
                    return fillPayload(val[0], row);
                });
            } else {
                payload[key] = findParam(key, data);
            }
        });

        return payload;
    }

    function findParam(key, data) {
        key = store.localKey(key);
        if (key in data) return store(key, null, data);

        for (const k in data) {
            if (_.isObject(data[k])) {
                const result = findParam(key, data[k]);
                if (result !== null) return result;
            }
        }
        return null;
    }


    return {
        fetch,
        registerEP,
    }
}
