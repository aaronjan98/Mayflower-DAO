<h1 align="center">Welcome to Mayflower DAO 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="https://documentation.com" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
  <a href="https://twitter.com/AJanovitch" target="_blank">
    <img alt="Twitter: AJanovitch" src="https://img.shields.io/twitter/follow/AJanovitch.svg?style=social" />
  </a>
</p>

> Purchase tokens to join and make proposals on behalf of the DAO

## Links

- 🏠 [Homepage](https://github.com/aaronjan98/Mayflower-DAO)
- ✨ [Live Site](https://gnfc6-qaaaa-aaaad-qe22a-cai.ic.fleek.co/)
- [Token Contract on Goerli](https://goerli.etherscan.io/address/0xA59441900763bE3c7aF1B47f7106D2372ddc796C)
- [DAO Contract on Goerli](https://goerli.etherscan.io/address/0xf92f381C155089422f0775f474fBaA2413D376e7)

## Install

```sh
npm install
```

## Usage

- Run web server

```sh
npm run start
```

- Run local blockchain

```sh
npm run ganache
```

- Deploy Token and DAO contract

```sh
npx hardhat run scripts/deploy.js --network ganache
```

- Seed DAO with proposals

```sh
npx hardhat run scripts/seed.js --network ganache
```

- View hardhat/ganache accounts' Ether & token balances

```sh
npx hardhat run scripts/getBalances.js --network ganache
```

## Run tests

```sh
npx hardhat test
```

## Author

👤 **aaronjanovitch@gmail.com**

- Website: [aaronjanovitch.com](https://aaronjanovitch.com)
- Twitter: [@AJanovitch](https://twitter.com/AJanovitch)
- Github: [@aaronjan98](https://github.com/aaronjan98)
- LinkedIn: [@aaron-janovitch](https://linkedin.com/in/aaron-janovitch)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/aaronjan98/Mayflower-DAO/issues).

## Show your support

Give a ⭐️ if this project helped you!
