# ICDex-Frontend

## Introduction

ICDex frontend canister.The project is based on vue2.0+Typescript implementation

## Installation

### Web Environment

1. Project setup

   ````javascript
   npm install
   ````

2. Compiles and hot-reloads for development

   ````tex
   npm run serve
   ````

3. Compiles and minifies for production

   ````tex
   npm run build
   ````

4. Lints and fixes files

   ````tex
   npm run lint
   ````

### Canister Deploy

````tex
dfx start --clean --background
````

````tex 
dfx deploy 
````

## Usages

See [web home](https://iclight.io/).	


## Project Architecture

1. src/assets: Resource directory, storing image resources

2. src/components：public component

3. src/router： Routing configuration

4. src/directives：Customizing public commands

5. src/filters: Customized public filters

6. src/Ic: api-service and public functions

7. src/store: veux configuration

8. src/styles: public css

9. src/views:  page

10. src/app.vue: vue entrance component

11. src/main.ts: vue configuration

### Order process

1. Selecting a Trading Pair.

2. Get nonce with `getTxAccount()`.

3. Place an order with `trade()`(order interval 3s).

   1) Push quantities and prices into the orderQueue array in the order in which they were placed.(setPrepare).
   2) add order info to Open Orders,set order status to Prepared(setPending).
   3) the trading pair nonce+1.
   4) triggers the orderQueue's prepare method.
   5) call `trade()`.
   6) get the txid then update the order status(getStatusByTxid).

### Order status:

1. Prepared: Click the buy/sell button but not calling `trade()`. For example, ICRC1 standard tokens need to be first `transfer()`
2. Pending: Order status after successful trade call.
3. Closing: The order has been matched and the task is being executed.
4. Closed: Orders are matched exactly.