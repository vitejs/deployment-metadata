# Registry Scope Rationale

## Deployment related metadata only

This registry is limited to metadata related to deployment. Deployment has a distinct interoperability problem: deployment platform plugins and meta-frameworks have a many-to-many (M:N) relationship.

On the other hand, a one-to-many (1:N) relationship does not necessarily need a registry. When one plugin integrates with multiple consumers, [an `api` property on the plugin interface](https://rolldown.rs/apis/plugin-api/inter-plugin-communication#direct-plugin-communication), together with a peer dependency, can define the contract with greater flexibility.

## Platform-specific metadata should live outside this repository

This registry and its packages should only define metadata that benefits from a shared, cross-platform contract. Platform-specific metadata does not have that interoperability requirement, so it should be defined and distributed by the platform outside this repository. A platform can declare its own metadata types or expose the metadata through a separate `api` property.

## The metadata should not be read by Vite core

Metadata consumed by Vite core should belongs in Vite itself, where its contract can evolve alongside the consumer. When it's unknown if Vite will need to read the metadata, however, starting in this registry is reasonable because iteration is easier here, and the metadata can move into Vite if and when Vite core needs it. While moving the metadata from Vite is more difficult.
