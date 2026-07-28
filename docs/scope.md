# Registry Scope

## Deployment related metadata only

Metadata in this registry should relate to deployment. The registry exists to support interoperability between deployment platform plugins and meta-frameworks. This relationship is many-to-many (M:N), so a shared contract allows any participating platform plugin to interoperate with any participating meta-framework.

## Platform-specific metadata should live outside this repository

Platform-specific metadata must not be declared in this registry or by packages in this repository. A platform should declare and distribute its own metadata types or expose the metadata through a separate `api` property.

## The metadata should not be read by Vite core

Metadata in this registry is not intended to be read by Vite core. Metadata read by Vite core should live in Vite. If it is not yet clear if Vite core will need to read it, it should begin in this registry for faster iteration.
