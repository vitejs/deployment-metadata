# Standards Process

Vite Deployment Metadata standards advance through three maturity stages. A proposal number is permanent, never reused, and follows the proposal through every stage.

## PS: Proposed Standard

PS documents live in `metadata/proposed`. A PS is complete enough for early experimentation, review, and implementation, but implementations do not need to be public before entry. A PS may introduce breaking changes as the contract evolves.

## DS: Draft Standard

DS documents live in `metadata/draft`. Promotion from PS requires evidence of at least two independent experiments or implementations and resolution of material interoperability questions found during that work. A DS must not introduce breaking changes within an existing metadata `version`; incompatible changes require a new metadata `version` as defined in [VDM0000](../metadata/draft/VDM0000/spec.md).

## FS: Finalized Standard

FS documents live in `metadata/standard`. Promotion from DS requires at least two independent implementations released as stable features and evidence that they interoperate without implementation-specific coordination. An FS must not introduce breaking changes within an existing metadata `version`; incompatible changes require a new metadata `version` as defined in [VDM0000](../metadata/draft/VDM0000/spec.md).

## Creating and promoting proposals

Create a proposal from `metadata/spec-template.md`, allocate the next unused four-digit VDM number, and add `spec.md` plus `types.d.ts`. Promotion moves the whole `VDMxxxx` directory to its new stage and updates maturity JSDoc in every exported declaration. Reviewers verify the evidence threshold, backwards compatibility, security considerations, and package export impact.
