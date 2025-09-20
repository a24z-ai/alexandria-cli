# Alexandria CLI

Unified Context Management CLI for the a24z ecosystem. This tool provides command-line access to manage codebase views, documentation, and project context using the Alexandria knowledge management system.

## Installation

```bash
# Using npm
npm install -g @a24z/alexandria-cli

# Using bun
bun add -g @a24z/alexandria-cli
```

## Dependencies

This CLI depends on the `@a24z/core-library` package which provides the core MemoryPalace functionality.

## Usage

### Initialize Alexandria in your project

```bash
alexandria init
```

### View project status

```bash
alexandria status
```

### Manage codebase views

```bash
# List all views
alexandria list

# Validate a view
alexandria validate <view-name>

# Save a new view
alexandria save <view-file>

# Add documentation as a view
alexandria add-doc <doc-file>
```

### Project management

```bash
# Register a project
alexandria projects register

# List registered projects
alexandria projects list
```

### Context coverage

```bash
# Check context coverage
alexandria coverage
```

### API Outpost

```bash
# Start the Alexandria API server
alexandria outpost start

# Check server status
alexandria outpost status

# Stop the server
alexandria outpost stop
```

## Development

This project uses Bun for package management and building.

### Setup

```bash
# Install dependencies
bun install

# Build the project
bun run build

# Run tests
bun test
```

### Project Structure

```
alexandria-cli/
├── src/
│   ├── index.ts           # Main CLI entry point
│   ├── commands/          # CLI command implementations
│   ├── utils/             # Utility functions
│   ├── api/               # API server implementation
│   └── templates/         # Template files
├── tests/                 # Test files
├── build/                 # Build scripts
└── dist/                  # Compiled output
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
