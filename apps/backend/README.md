![Dojo Starter](./assets/cover.png)

<picture>
  <source media="(prefers-color-scheme: dark)" srcset=".github/mark-dark.svg">
  <img alt="Dojo logo" align="right" width="120" src=".github/mark-light.svg">
</picture>

<a href="https://x.com/ohayo_dojo">
<img src="https://img.shields.io/twitter/follow/dojostarknet?style=social"/>
</a>
<a href="https://github.com/dojoengine/dojo/stargazers">
<img src="https://img.shields.io/github/stars/dojoengine/dojo?style=social"/>
</a>

[![discord](https://img.shields.io/badge/join-dojo-green?logo=discord&logoColor=white)](https://discord.com/invite/dojoengine)
[![Telegram Chat][tg-badge]][tg-url]

[tg-badge]: https://img.shields.io/endpoint?color=neon&logo=telegram&label=chat&style=flat-square&url=https%3A%2F%2Ftg.sumanjay.workers.dev%2Fdojoengine
[tg-url]: https://t.me/dojoengine

# 🔧 Setup
## Install prerequisites:

follow installation guide in dojo documentation https://www.dojoengine.org/installation

Rust: curl https://sh.rustup.rs -sSf | sh
Scarb (Cairo): curl https://setup.swmansion.com | bash
DojoUp: curl -L https://install.dojoengine.org | bash

### Add Dojo binaries to PATH:
export PATH="$HOME/.dojo/bin:$PATH"

### Install Dojo tools:
dojoup install

| Tool     | Purpose                            | Run Command      |
| -------- | ---------------------------------- | ---------------- |
| `dojoup` | Installs Dojo tools                | `dojoup install` |
| `katana` | Local Starknet devnet              | `katana`         |
| `torii`  | Event/state indexer                | `torii`          |
| `sozo`   | Contract deploy and migration tool | `sozo migrate`   |
| `scarb`  | Cairo package manager              | `scarb build`    |


follow guide in dojo documentation https://www.dojoengine.org/tutorial/dojo-starter

# Dojo Starter: Official Guide

A quickstart guide to help you build and deploy your first Dojo provable game.

Read the full tutorial [here](https://dojoengine.org/tutorial/dojo-starter).

## Running Locally

#### Terminal one (Make sure this is running)

```bash
# Run Katana
katana --dev --dev.no-fee
```

#### Terminal two

```bash
# Build the example
sozo build

# Inspect the world
sozo inspect

# Migrate the example
sozo migrate

# Start Torii
# Replace <WORLD_ADDRESS> with the address of the deployed world from the previous step
torii --world <WORLD_ADDRESS> --http.cors_origins "*"
```

## Docker
You can start stack using docker compose. [Here are the installation instruction](https://docs.docker.com/engine/install/)

```bash
docker compose up
```
You'll get all services logs in the same terminal instance. Whenever you want to stop just ctrl+c

---

## Updating Cairo Version
If your project runs into errors due to a mismatch in Cairo versions, follow these steps to update:

### 1. Check Your Cairo Version
Compare cairo version with the version required by the project (often specified in Scarb.toml or implicitly required by Dojo).

### 2. Update Scarb.toml
Edit the Cairo version in your Scarb.toml file:


[package]
name = "dojo_starter"
version = "0.1.0"
cairo-version = "2.5.4" # Change to match your installed version

Replace 2.5.4 with the correct version installed on your system.

### 3. Rebuild the Project
After updating the version:

```bash
scarb build
```
If errors persist, ensure all packages in [dependencies] are compatible with the new Cairo version.

---

## Contribution

1. **Report a Bug**

    - If you think you have encountered a bug, and we should know about it, feel free to report it [here](https://github.com/dojoengine/dojo-starter/issues) and we will take care of it.

2. **Request a Feature**

    - You can also request for a feature [here](https://github.com/dojoengine/dojo-starter/issues), and if it's viable, it will be picked for development.

3. **Create a Pull Request**
    - It can't get better then this, your pull request will be appreciated by the community.

Happy coding!
