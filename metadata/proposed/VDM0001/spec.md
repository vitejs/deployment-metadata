# VDM0001: Request Metadata

# Summary

Defines a public deployment value, an ordered list of header or query, or cookie carriers understood by its producer, and a way for consumers to enable it for the carriers they apply.

# Basic example

```ts
import type { RequestMetadata } from "@vitejs/deployment-metadata-types";

// Published by the deployment provider
const metadata: RequestMetadata = {
  id: "VDM0001",
  version: 1,
  value: "abc123",
  carriers: [
    { type: "header", name: "x-deployment-id" },
    { type: "query", name: "__deployment_id" },
    { type: "cookie", name: "__deployment_id" },
  ],
  enable({ carriers }) {
    // Configure the platform for these carrier types at the end of the build.
  },
};

// Called by the framework during config resolution
metadata.enable({ carriers: ["header"] });
// Thread `metadata.value` through to requests via `metadata.carriers`...
```

# Motivation

Deployment providers know public values used for features such as skew protection, while frameworks own the request surfaces where those values may be attached. Standardized data avoids provider-by-framework adapters.

Providers also need to know whether a framework applies the value, and how. Without that, a provider has to guess when to enable a feature like skew protection and which carriers to configure it for.

# Detailed design

`value` is a public string or a zero-argument synchronous/asynchronous producer. `carriers` is non-empty and ordered by producer preference. Header carriers preserve the given HTTP field name. Query carriers set or replace the named URL search parameter rather than appending a duplicate. Cookie carriers set the named cookie.

Consumers decide whether and where they can apply a carrier. They must not add metadata to arbitrary user requests or cross-origin requests, although in the case of cookies browsers send them with every request in their scope, including requests the consumer doesn't make. This standard defines no URL, header, cookie, or request mutation utility.

Values must be safe in client bundles, request headers, URLs, cookies, logs, browser developer tools, and source maps. They must never contain credentials, tokens, private environment variables, or other secrets. Header names must be valid HTTP field names, and query names must be non-empty and usable with `URLSearchParams`, and cookie names must be valid cookie names.

## `enable()`

A consumer that applies the value calls `enable()` with `carriers`, the carrier types it applies. Producers ignore types they don't offer.

Consumers must call `enable()` before the build starts, for example during config resolution, so producers can configure their platform when the build ends. Consumers should call it once. Producers may ignore later calls.

Producers should only enable the feature for the carrier types passed to `enable()`, and not at all if it was never called.
