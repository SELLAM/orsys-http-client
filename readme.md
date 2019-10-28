# Orsys-HTTP-client


Available via:

- NPM: `npm install --save orsys-http-client`
- YARN: `yarn add orsys-http-client`

## Usage

All you need to do is :

**1- Create Instance of HTTPClient**

```js
    const api = new HTTPClient(Store, {
        baseURL: "http://localhost:8081/api",
    })
```

**2- Register the endpoints**

```js
    api.registerEP('test', {
        payload: {},
        url: "/url/test",
    })
```


**3- Usage of the endpoints**
```js
    api.fetch({ endpoint: 'test' }).then(function(result){
        // do somthing with result
    }).catch(function(error){
        // error
    })
```

OR

```js
    api.fetch({ endpoint: 'test' }, 'key')
    // key: is the key in the store where the result will set
```