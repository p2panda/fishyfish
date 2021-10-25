# 🐡 fishyfish

Command line interface for p2panda [`nodes`](https://github.com/p2panda/aquadoggo).

## Features

- Query entries by schema
- Create schemas
- List schemas

## Development

```bash
# Install dependencies
npm install

# Use CLI in development mode.
npm start

# Pass <args> using two dashes.
npm start -- query schema 0040cf94f6d605657e90c543b0c919070cdaaf7209c5e1ea58acb8f3568fa2114268dc9ac3bafe12af277d286fce7dc59b7c0c348973c4e9dacbe79485e56ac2a702 --node https://welle.liebechaos.org/ --long

# Create a new schema
npm start -- schema create record "Releases for the record shop" name,artist,year,price

# Build
npm run build
```

## License

[`MIT`](LICENSE)
