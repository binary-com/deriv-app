# Modules

**In this document**

-   [Socket Base](#socket-base)
    -   [One time requests](#one-time-requests)
    -   [Subscriptions](#subscriptions)
    -   [Cache](#cache)
    -   [Storage](#storage)
    -   [Authorized](#authorized)

## Socket Base

The purpose of this module is to provide an abstract API for the rest of the application.
Under the hood, it uses the `DerivAPIBasic` package which is part of the `@deriv/DerivAPI`
package.

The reason we need such abstractions is to hide the complexities of dealing with API
and keep accessing to the API data fast and easy.

### One time requests

Requests are sent via calls (usually a camelCase version of the message type).
The requests return a Promise which resolves when the response comes back from the API
regardless of the success or failure of the request.

The original response is returned to the caller wrapped in the resolved promise.

This is conceptually wrong, but it's a compromise to make the Deriv API work with
the current FE code.

Other users of `DerivAPI` can simply rely on the `resolve`/`reject`/`pending` state
of the `Promise` based calls and `RxJS` subscriptions.

```JavaScript
const poc = await WS.proposalOpenContract(contract_id);
```

### Subscriptions

Subscription is done using `subscribe[RequestType]` calls available from the socket
base module. They all expect to receive a request and a callback, the callback is
called whenever there's a new response (regardless of success or failure).

Under the hood the subscribe calls are made on an `RxJS` based subscription, and
a `Subscriber` object is returned from each subscription.

The use is required to keep the `Subscriber` object for calling `Subscriber.unsubscribe()`
on that later.

```JavaScript
const subscriber = WS.subscribeProposal(proposalRequest, cb);

// later
await WS.buy(buy_request);
subscriber.unsubscribe();
```

### Cache

`WS.cache` provides an in-memory fast cache that currently lives as long as the
page is visible, when you refresh the page, the cache will be reset automatically.

To use the cache you can call `WS.cache` following the method call:

```JavaScript
const active_symbols = await WS.cache.activeSymbols('brief');
```

Beware that using the cache will provide the method matching the `DerivAPI`
specifications, and any override we have in the socket base won't work, this results
in a potentially inconsistent API. Fortunately, currently most of the overridden
calls are not supposed to work with caching, so we've dodged that bullet for now.

In the future, it's best to avoid adding new method overrides in the Socket base
and if a different set of arguments/behavior is desired, a middleware should
be created for that.

### Storage

Very similar to `WS.cache`, `WS.storage` provides an interface to read information
from permanent storage, if available. The permanent storage currently used is
the socket cache module, therefore the expiry of the fields related to the
storage is defined in there.

By default `WS.cache` looks up `WS.storage` first, if it's unavailable then looks up
the API.

Same as cache, method calls on the `WS.storage` are passed to `DerivAPI` so the method
overrides won't work.

### Authorized

There's a `WS.authorized` interface that can be used to make sure the API is authorized
before making the requests. The method calls used with `authorize` are passed
to the socket base and support overrides.

```JavaScript
// Waits for the API to be authorized (by another call) or buys immediately if already authorized
const buy_response = await WS.authorized.buy(buy_params);
```

`WS.authorized` can be used with `cache` and `storage`:

```JavaScript
// This tries to lookup the storage for the payout currencies
// if not found it'll make the payout currencies request
// but all of this happens after the API is authorized
// NOTE: This doesn't prevent somewhere else from requesting an unauthorized
// payout currencies, and filling the storage with it, so use with caution
const payout_currencies = WS.authorized.storage.payoutCurrencies();
```
