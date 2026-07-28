# Vite Deployment Metadata

This repository defines shared contracts for exchanging deployment metadata between deployment-platform integrations and meta-frameworks. It avoids requiring a separate adapter for every platform and framework combination.

The repository contains metadata standards and packages for using them with Vite. See the [registry scope](docs/scope.md) for what belongs here.

## I want to propose metadata

Review the [registry scope](docs/scope.md) and [standards process](docs/process.md), then use the [proposal template](metadata/spec-template.md) to create a proposal under `metadata/proposed/`.

## I want to understand the metadata

Each Vite Deployment Metadata (VDM) specification defines a contract and its canonical TypeScript declarations.

- [Proposed Standards](metadata/proposed/) are open to early experimentation and change.
- [Draft Standards](metadata/draft/) have implementation experience.
- [Finalized Standards](metadata/standard/) have demonstrated stable interoperability.

See the [standards process](docs/process.md) for maturity requirements.

## I want to use the packages

- [`@vitejs/deployment-metadata-types`](packages/deployment-metadata-types/) provides tool-agnostic TypeScript declarations for the metadata standards.
- [`@vitejs/deployment-metadata-helper`](packages/deployment-metadata-helper/) helps Vite plugins advertise and discover deployment metadata participants.

See each package’s README for installation and usage examples.
