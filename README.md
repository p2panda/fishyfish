# 🐡 fishyfish

Command line interface for p2panda [`nodes`](https://github.com/p2panda/aquadoggo).

## Features

- Query entries by schema
- Create schemas
- List schemas

## Usage

```bash
# List all schemas on node
fishy schema list

# Create a new schema
fishy schema create record "Releases for the record shop" name artist year price
fishy schema list

# Query a schema
fishy query schema 0020c65567ae37efea293e34a9c7d13f8f2bf23dbdc3b5c7b9ab46293111c48fc78b
```

Omit a command's parameters to see a more detailed usage reference.

## Development

```bash
# Install dependencies
npm install

# Use CLI in development mode.
npm start

# Pass <args> using two dashes.
npm start -- query schema 0020c65567ae37efea293e34a9c7d13f8f2bf23dbdc3b5c7b9ab46293111c48fc78b --node https://welle.liebechaos.org/ --long

# Build
npm run build
```

## License

[`MIT`](LICENSE)
