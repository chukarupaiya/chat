(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.snap = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.myFunction = myFunction;

async function myFunction() {
  
  
  
  
  
  
  
  const resp = await fetch("https://backend-staging.epns.io/apis/v1/users/eip155:80001:0xdb340A9B85b9C2C5b25aA06E182472B02edC8Cde/feeds?limit=1&&spam=true");
  const json = await resp.json();
  console.log(json);
  const persistedData = await snap.request({
    method: "snap_manageState",
    params: {
      operation: "get"
    }
  });

  if (persistedData == undefined) {
    await snap.request({
      method: "snap_manageState",
      params: {
        operation: "update",
        newState: {
          time: json.epoch
        }
      }
    }); 

    const stringifiedResponse = JSON.stringify(json);
    const hlo = JSON.parse(stringifiedResponse);
    const notification = hlo.feeds[0].payload.notification.body; 

    const body = notification.body; 

    return notification;
  } else {
    if (persistedData.time < json.epoch) {
      
      const stringifiedResponse = JSON.stringify(json);
      const hlo = JSON.parse(stringifiedResponse);
      const notification = hlo.feeds[0].payload.notification.body; 

      const body = notification.body;
      await snap.request({
        method: 'snap_manageState',
        params: {
          operation: 'clear'
        }
      });
      await snap.request({
        method: "snap_manageState",
        params: {
          operation: "update",
          newState: {
            time: json.epoch
          }
        }
      }); 

      return notification;
    } else {
      return null;
    }
  }
}

},{}],2:[function(require,module,exports){
"use strict";

var _fetch = require("./fetch");

module.exports.onCronjob = async ({
  request
}) => {
  switch (request.method) {
    case 'inApp':
      return wallet.request({
        method: 'snap_notify',
        params: [{
          type: 'inApp',
          message: await (0, _fetch.myFunction)()
        }]
      });

    case 'native':
      return wallet.request({
        method: 'snap_notify',
        params: [{
          type: 'native',
          message: `Hello`
        }]
      });

    default:
      throw new Error('Method not found.');
  }
};

},{"./fetch":1}]},{},[2])(2)
});