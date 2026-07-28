# VDM0001: Request Metadata

# Summary

Defines a public deployment value and an ordered list of header or query carriers understood by its producer.

# Basic example

```ts
import type { RequestMetadata } from "@vitejs/deployment-metadata-types";

const metadata: RequestMetadata = {
  id: "VDM0001",
  version: 1,
  value: "abc123",
  carriers: [
    { type: "header", name: "x-deployment-id" },
    { type: "query", name: "__deployment_id" },
  ],
};
```

# Motivation

Deployment providers know public values used for features such as skew protection, while frameworks own the request surfaces where those values may be attached. Standardized data avoids provider-by-framework adapters.

# Detailed design

`value` is a public string or a zero-argument synchronous/asynchronous producer. `carriers` is non-empty and ordered by producer preference. Header carriers preserve the given HTTP field name. Query carriers set or replace the named URL search parameter rather than appending a duplicate.

Consumers decide whether and where they can apply a carrier. They must not add metadata to arbitrary user requests or cross-origin requests. This standard defines no URL, header, or request mutation utility.

Values must be safe in client bundles, request headers, URLs, logs, browser developer tools, and source maps. They must never contain credentials, tokens, private environment variables, or other secrets. Header names must be valid HTTP field names, and query names must be non-empty and usable with `URLSearchParams`.
