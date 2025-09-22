/**
 * Schema command - Display the JSON schema and examples for CodebaseView
 */

import { Command } from 'commander';

export function createSchemaCommand(): Command {
  const command = new Command('schema');

  command
    .description('Show the JSON schema and examples for Alexandria configuration (.alexandriarc.json)')
    .option('-f, --format <type>', 'Output format: json, typescript, or markdown (default: json)', 'json')
    .option('--type <schemaType>', 'Schema type: config (default), codebase-view, or lint', 'config')
    .option('--example <type>', 'Show specific example: basic, full, or minimal (default: basic)', 'basic')
    .action((options) => {
      const format = options.format.toLowerCase();
      const schemaType = options.type.toLowerCase();
      const exampleType = options.example.toLowerCase();

      if (schemaType === 'config' || schemaType === 'lint') {
        if (format === 'json') {
          showConfigSchema(exampleType, schemaType === 'lint');
        } else if (format === 'typescript') {
          showConfigTypeScriptInterface(schemaType === 'lint');
        } else if (format === 'markdown') {
          showConfigMarkdownDocumentation(schemaType === 'lint');
        } else {
          console.error(`Error: Unknown format '${format}'. Use 'json', 'typescript', or 'markdown'.`);
          process.exit(1);
        }
      } else if (schemaType === 'codebase-view') {
        if (format === 'json') {
          showJsonSchema(exampleType);
        } else if (format === 'typescript') {
          showTypeScriptInterface();
        } else if (format === 'markdown') {
          showMarkdownDocumentation();
        } else {
          console.error(`Error: Unknown format '${format}'. Use 'json', 'typescript', or 'markdown'.`);
          process.exit(1);
        }
      } else {
        console.error(`Error: Unknown schema type '${schemaType}'. Use 'config', 'codebase-view', or 'lint'.`);
        process.exit(1);
      }
    });

  return command;
}

function showJsonSchema(exampleType: string) {
  const examples: Record<string, Record<string, unknown>> = {
    minimal: {
      id: 'my-view',
      version: '1.0.0',
      name: 'My Codebase View',
      description: 'A minimal codebase view',
      referenceGroups: {
        'Main Components': {
          coordinates: [0, 0],
          files: ['src/index.ts', 'src/app.ts'],
        },
      },
    },
    basic: {
      id: 'architecture-overview',
      version: '1.0.0',
      name: 'Architecture Overview',
      description: 'High-level system architecture organized by layers',
      rows: 2,
      cols: 3,
      category: 'architecture',
      overviewPath: 'docs/ARCHITECTURE.md',
      referenceGroups: {
        Authentication: {
          coordinates: [0, 0],
          files: ['src/auth/provider.ts', 'src/auth/middleware.ts', 'src/auth/types.ts'],
          priority: 0,
        },
        'API Layer': {
          coordinates: [0, 1],
          files: ['src/api/routes/index.ts', 'src/api/controllers/user.ts', 'src/api/middleware/error.ts'],
          priority: 1,
        },
        'Data Models': {
          coordinates: [0, 2],
          files: ['src/models/user.ts', 'src/models/session.ts', 'src/models/index.ts'],
          priority: 0,
        },
        'Business Logic': {
          coordinates: [1, 0],
          files: ['src/services/user.service.ts', 'src/services/auth.service.ts'],
          priority: 0,
        },
        Database: {
          coordinates: [1, 1],
          files: ['src/db/connection.ts', 'src/db/migrations/001_init.ts'],
          priority: 0,
        },
        Utilities: {
          coordinates: [1, 2],
          files: ['src/utils/crypto.ts', 'src/utils/validators.ts', 'src/utils/logger.ts'],
          priority: 0,
        },
      },
    },
    full: {
      id: 'complete-system',
      version: '1.0.0',
      name: 'Complete System View',
      description: 'Full example showing all available fields',
      rows: 3,
      cols: 3,
      category: 'product',
      displayOrder: 1,
      timestamp: new Date().toISOString(),
      overviewPath: 'docs/SYSTEM.md',
      referenceGroups: {
        'Frontend Components': {
          coordinates: [0, 0],
          files: ['src/components/Header.tsx', 'src/components/Footer.tsx'],
          priority: 2,
          links: {
            views: ['ui-components'],
            external: ['https://design-system.example.com'],
          },
          metadata: {
            ui: {
              color: '#3B82F6',
            },
          },
        },
        'Backend Services': {
          coordinates: [1, 1],
          files: ['src/services/api.ts', 'src/services/database.ts'],
          priority: 1,
        },
      },
      scope: {
        basePath: 'src',
        includePatterns: ['**/*.ts', '**/*.tsx'],
        excludePatterns: ['**/*.test.ts', '**/*.spec.ts'],
      },
      metadata: {
        generationType: 'user',
        ui: {
          enabled: true,
          rows: 3,
          cols: 3,
          showCellLabels: true,
          cellLabelPosition: 'top',
        },
      },
      links: {
        views: ['related-view-1', 'related-view-2'],
        external: ['https://docs.example.com'],
      },
    },
  };

  const example = examples[exampleType] || examples.basic;

  console.log('📋 Alexandria CodebaseView Schema\n');
  console.log('═══════════════════════════════════════════════════════════════\n');

  console.log('Example JSON structure:\n');
  console.log(JSON.stringify(example, null, 2));

  console.log('\n═══════════════════════════════════════════════════════════════\n');
  console.log('Field Descriptions:\n');
  console.log('Required fields:');
  console.log('  • id: Unique identifier for the view');
  console.log('  • version: Schema version (use "1.0.0")');
  console.log('  • name: Human-readable name');
  console.log('  • description: What this view represents');
  console.log('  • referenceGroups: Map of section names to file groups\n');

  console.log('Optional fields:');
  console.log('  • rows/cols: Grid dimensions (auto-calculated if omitted)');
  console.log('  • category: Grouping category (e.g., "architecture", "docs")');
  console.log('  • overviewPath: Path to markdown documentation');
  console.log('  • displayOrder: Sort order within category');
  console.log('  • timestamp: ISO timestamp of creation');
  console.log('  • scope: File filtering configuration');
  console.log('  • metadata: Additional UI and configuration data');
  console.log('  • links: References to other views or external resources\n');

  console.log('Reference Group structure:');
  console.log('  • coordinates: [row, col] - Zero-indexed grid position');
  console.log('  • files: Array of file paths relative to repo root');
  console.log('  • priority: Resolution priority for conflicts (default: 0)');
  console.log('  • links: Optional links to other resources');
  console.log('  • metadata: Optional additional metadata');
}

function showTypeScriptInterface() {
  const typeDefinition = `// Alexandria CodebaseView TypeScript Interface

interface CodebaseView {
  // Required fields
  id: string;                              // Unique identifier
  version: string;                          // Schema version (e.g., "1.0.0")
  name: string;                             // Human-readable name
  description: string;                      // Description of the view
  referenceGroups: Record<string, ReferenceGroup>; // File groups by section

  // Optional fields
  rows?: number;                            // Number of grid rows
  cols?: number;                            // Number of grid columns
  category?: string;                        // View category
  displayOrder?: number;                    // Sort order
  timestamp?: string;                       // ISO timestamp
  overviewPath?: string;                    // Path to documentation
  scope?: ViewScope;                        // File filtering
  metadata?: ViewMetadata;                  // Additional metadata
  links?: ViewLinks;                        // External links
}

interface ReferenceGroup {
  coordinates: [number, number];            // [row, col] position
  files: string[];                          // File paths
  priority?: number;                        // Conflict resolution priority
  links?: ViewLinks;                        // Group-specific links
  metadata?: {                              // Group metadata
    ui?: {
      color?: string;                        // Highlight color
    };
    [key: string]: unknown;                  // Custom fields
  };
}

interface ViewScope {
  basePath?: string;                        // Base directory path
  includePatterns?: string[];               // Include glob patterns
  excludePatterns?: string[];                // Exclude glob patterns
}

interface ViewMetadata {
  generationType?: 'user' | 'generated';    // How view was created
  ui?: {                                    // UI configuration
    enabled?: boolean;
    rows?: number;
    cols?: number;
    showCellLabels?: boolean;
    cellLabelPosition?: 'top' | 'bottom' | 'left' | 'right';
  };
  [key: string]: unknown;                   // Custom fields
}

interface ViewLinks {
  views?: string[];                          // Related view IDs
  external?: string[];                       // External URLs
}`;

  console.log('📘 Alexandria CodebaseView TypeScript Interface\n');
  console.log('═══════════════════════════════════════════════════════════════\n');
  console.log(typeDefinition);
}

function showMarkdownDocumentation() {
  const markdown = `# Alexandria CodebaseView Schema

## Overview

A CodebaseView is a JSON file that defines how to organize and visualize your codebase in a spatial grid layout.

## Basic Structure

\`\`\`json
{
  "id": "unique-view-id",
  "version": "1.0.0",
  "name": "View Name",
  "description": "What this view represents",
  "referenceGroups": {
    "Section Name": {
      "coordinates": [0, 0],
      "files": ["src/file1.ts", "src/file2.ts"]
    }
  }
}
\`\`\`

## Required Fields

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier for the view |
| version | string | Schema version (use "1.0.0") |
| name | string | Human-readable display name |
| description | string | Brief description of the view |
| referenceGroups | object | Map of section names to file groups |

## Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| rows | number | Number of grid rows (auto-calculated if omitted) |
| cols | number | Number of grid columns (auto-calculated if omitted) |
| category | string | Category for grouping views (e.g., "architecture") |
| displayOrder | number | Sort order within category |
| timestamp | string | ISO timestamp of creation |
| overviewPath | string | Path to markdown documentation file |
| scope | object | File filtering configuration |
| metadata | object | Additional UI and custom metadata |
| links | object | Links to other views or external resources |

## Reference Groups

Each reference group represents a section of related files positioned in the grid:

\`\`\`json
{
  "Section Name": {
    "coordinates": [row, col],  // Zero-indexed position
    "files": [                  // List of file paths
      "src/auth/login.ts",
      "src/auth/logout.ts"
    ],
    "priority": 0               // Optional: conflict resolution
  }
}
\`\`\`

## Coordinates System

- Coordinates are zero-indexed: [row, column]
- Top-left is [0, 0]
- Maximum recommended: 6 rows × 6 columns
- Example 2×3 grid:
  - [0,0] [0,1] [0,2]
  - [1,0] [1,1] [1,2]

## File Paths

- Always relative to repository root
- No leading slash: ✅ "src/index.ts" ❌ "/src/index.ts"
- Use forward slashes even on Windows
- Can include glob patterns in scope, but not in files array

## Best Practices

1. **Group related files** - Put files that work together in the same section
2. **Use meaningful names** - Section names should describe the functionality
3. **Keep grids small** - 2-4 rows and 2-4 columns work best
4. **Document with overviewPath** - Link to markdown files for detailed docs
5. **Use categories** - Organize multiple views by category

## Examples

### Minimal Example
\`\`\`json
{
  "id": "api",
  "version": "1.0.0",
  "name": "API Structure",
  "description": "REST API endpoints",
  "referenceGroups": {
    "Endpoints": {
      "coordinates": [0, 0],
      "files": ["src/api/routes.ts"]
    }
  }
}
\`\`\`

### Full Example
See the full example by running: \`alexandria schema --example full\`
`;

  console.log(markdown);
}

function showConfigSchema(exampleType: string, lintFocus: boolean = false) {
  const examples: Record<string, Record<string, unknown>> = {
    minimal: {
      $schema: 'https://raw.githubusercontent.com/a24z-ai/alexandria-cli/main/schema/alexandriarc.json',
      version: '1.0.0',
      context: {
        useGitignore: true,
        patterns: {
          exclude: ['.alexandria/**'],
        },
      },
    },
    basic: {
      $schema: 'https://raw.githubusercontent.com/a24z-ai/alexandria-cli/main/schema/alexandriarc.json',
      version: '1.0.0',
      project: {
        name: 'my-project',
        description: 'A sample project with Alexandria configuration',
        type: 'library',
        language: ['typescript', 'javascript'],
      },
      context: {
        useGitignore: true,
        patterns: {
          exclude: ['.alexandria/**', 'dist/**', 'node_modules/**'],
        },
        rules: [
          {
            id: 'document-organization',
            severity: 'warning',
            enabled: true,
            options: {
              rootExceptions: ['README.md', 'AGENTS.md'],
            },
          },
          {
            id: 'filename-convention',
            severity: 'error',
            enabled: true,
            options: {
              style: 'kebab-case',
              exceptions: ['README.md', 'CHANGELOG.md'],
            },
          },
        ],
      },
    },
    full: {
      $schema: 'https://raw.githubusercontent.com/a24z-ai/alexandria-cli/main/schema/alexandriarc.json',
      version: '1.0.0',
      project: {
        name: 'complete-project',
        description: 'Complete example showing all available fields',
        version: '1.2.3',
        type: 'application',
        language: ['typescript', 'javascript', 'python'],
        framework: ['react', 'node', 'fastapi'],
      },
      context: {
        useGitignore: true,
        maxDepth: 10,
        followSymlinks: false,
        patterns: {
          include: ['src/**/*', 'docs/**/*'],
          exclude: ['.alexandria/**', 'dist/**', 'node_modules/**', '__pycache__/**'],
          priority: [
            { pattern: 'src/**/*', priority: 10 },
            { pattern: 'docs/**/*', priority: 5 },
          ],
        },
        rules: [
          {
            id: 'document-organization',
            severity: 'warning',
            enabled: true,
            options: {
              rootExceptions: ['README.md', 'AGENTS.md', 'CHANGELOG.md'],
              documentFolders: ['docs', 'documentation'],
              checkNested: true,
            },
          },
          {
            id: 'filename-convention',
            severity: 'error',
            enabled: true,
            options: {
              style: 'kebab-case',
              extensions: ['.md', '.mdx'],
              exceptions: ['README.md', 'CHANGELOG.md', 'AGENTS.md'],
              documentFoldersOnly: true,
              autoFix: false,
            },
          },
          {
            id: 'stale-references',
            severity: 'info',
            enabled: true,
            options: {
              maxAgeDays: 30,
            },
          },
          {
            id: 'require-references',
            severity: 'error',
            enabled: true,
            options: {
              excludeFiles: ['tmp/**/*', 'draft/**/*'],
            },
          },
          {
            id: 'orphaned-references',
            severity: 'warning',
            enabled: true,
          },
        ],
      },
      reporting: {
        output: 'both',
        format: 'json',
        path: 'reports/alexandria.json',
        verbose: true,
      },
    },
  };

  if (lintFocus) {
    examples.basic = {
      $schema: 'https://raw.githubusercontent.com/a24z-ai/alexandria-cli/main/schema/alexandriarc.json',
      version: '1.0.0',
      context: {
        useGitignore: true,
        patterns: {
          exclude: ['.alexandria/**'],
        },
        rules: [
          {
            id: 'document-organization',
            severity: 'warning',
            enabled: true,
            options: {
              rootExceptions: ['README.md', 'AGENTS.md'],
            },
          },
          {
            id: 'filename-convention',
            severity: 'error',
            enabled: true,
            options: {
              style: 'kebab-case',
              exceptions: ['README.md', 'CHANGELOG.md'],
            },
          },
        ],
      },
    };
  }

  const example = examples[exampleType] || examples.basic;

  console.log(lintFocus ? '📋 Alexandria Lint Configuration Schema\n' : '📋 Alexandria Configuration Schema\n');
  console.log('═══════════════════════════════════════════════════════════════\n');

  console.log('Example .alexandriarc.json structure:\n');
  console.log(JSON.stringify(example, null, 2));

  console.log('\n═══════════════════════════════════════════════════════════════\n');
  console.log('Field Descriptions:\n');

  if (lintFocus) {
    console.log('Lint Configuration Fields:');
    console.log('  • context.rules: Array of lint rule configurations');
    console.log('  • rules[].id: Rule identifier (e.g., "document-organization")');
    console.log('  • rules[].severity: "error" | "warning" | "info"');
    console.log('  • rules[].enabled: Enable/disable the rule');
    console.log('  • rules[].options: Rule-specific configuration options\n');

    console.log('Available Rules:');
    console.log('  • document-organization: Enforces documentation structure');
    console.log('  • filename-convention: Enforces consistent filename patterns');
    console.log('  • stale-references: Detects outdated documentation');
    console.log('  • require-references: Ensures docs have proper references');
    console.log('  • orphaned-references: Finds broken file references\n');

    console.log('Common Rule Options:');
    console.log('  • rootExceptions: Files to exclude at root level');
    console.log('  • style: Filename style ("kebab-case", "snake_case", etc.)');
    console.log('  • exceptions: Specific filenames to allow');
    console.log('  • maxAgeDays: Maximum age threshold for stale detection');
  } else {
    console.log('Required fields:');
    console.log('  • $schema: Schema URL for validation');
    console.log('  • version: Configuration version (use "1.0.0")');
    console.log('  • context: Core configuration settings\n');

    console.log('Optional fields:');
    console.log('  • project: Project metadata (name, type, language, etc.)');
    console.log('  • context.rules: Lint rule configurations');
    console.log('  • context.patterns: File inclusion/exclusion patterns');
    console.log('  • context.useGitignore: Respect .gitignore files');
    console.log('  • reporting: Output and format configuration');
  }

  console.log(
    '\n' +
      (lintFocus
        ? 'Use "alexandria lint --help-rule <rule>" for rule-specific help.'
        : 'Use "alexandria schema --type lint" for lint-focused documentation.'),
  );
}

function showConfigTypeScriptInterface(lintFocus: boolean = false) {
  const typeDefinition = `// Alexandria Configuration TypeScript Interface

interface AlexandriaConfig {
  // Required fields
  $schema?: string;                         // Schema URL for validation
  version: '1.0.0';                        // Configuration version

  // Optional project metadata
  project?: {
    name: string;                          // Project name
    description?: string;                  // Project description
    version?: string;                      // Project version
    type?: ProjectType;                    // 'library' | 'application' | 'service'
    language?: string | string[];          // Programming languages
    framework?: string | string[];         // Frameworks used
  };

  // Core context configuration
  context?: {
    rules?: ContextRule[];                 // Lint rule configurations
    patterns?: {
      include?: string[];                  // Include glob patterns
      exclude?: string[];                  // Exclude glob patterns
      priority?: PriorityPattern[];        // Pattern priorities
    };
    useGitignore?: boolean;               // Respect .gitignore files
    maxDepth?: number;                    // Max directory traversal depth
    followSymlinks?: boolean;             // Follow symbolic links
  };

  // Reporting configuration
  reporting?: {
    output?: 'console' | 'file' | 'both'; // Output destination
    format?: 'text' | 'json' | 'html';   // Output format
    path?: string;                        // Output file path
    verbose?: boolean;                    // Verbose output
  };
}

// Lint rule configuration
interface ContextRule {
  id: string;                             // Rule identifier
  severity: 'error' | 'warning' | 'info'; // Rule severity
  enabled?: boolean;                      // Enable/disable rule
  options?: RuleOptions;                  // Rule-specific options
  fix?: {
    type: 'replace' | 'remove' | 'add';   // Fix type
    suggestion?: string;                  // Fix suggestion
  };
}

// Rule-specific options (examples)
interface DocumentOrganizationOptions {
  rootExceptions?: string[];              // Root-level file exceptions
  documentFolders?: string[];             // Documentation directories
  checkNested?: boolean;                  // Check nested structures
}

interface FilenameConventionOptions {
  style?: 'kebab-case' | 'snake_case' | 'camelCase' | 'PascalCase';
  extensions?: string[];                  // File extensions to check
  exceptions?: string[];                  // Filename exceptions
  documentFoldersOnly?: boolean;          // Only check doc folders
  autoFix?: boolean;                      // Enable auto-fix
}

interface StaleReferencesOptions {
  maxAgeDays?: number;                    // Maximum age threshold
}

interface RequireReferencesOptions {
  excludeFiles?: string[];                // Files to exclude
}`;

  console.log(
    lintFocus
      ? '📘 Alexandria Lint Configuration TypeScript Interface\n'
      : '📘 Alexandria Configuration TypeScript Interface\n',
  );
  console.log('═══════════════════════════════════════════════════════════════\n');
  console.log(typeDefinition);
}

function showConfigMarkdownDocumentation(lintFocus: boolean = false) {
  const markdown = `# Alexandria Configuration Schema

## Overview

The .alexandriarc.json file configures Alexandria for your project, including context management${lintFocus ? ' and lint rules' : ''}.

## Basic Structure

\`\`\`json
{
  "$schema": "https://raw.githubusercontent.com/a24z-ai/alexandria-cli/main/schema/alexandriarc.json",
  "version": "1.0.0",
  "context": {
    "useGitignore": true,
    "patterns": {
      "exclude": [".alexandria/**"]
    }${
      lintFocus
        ? `,
    "rules": [
      {
        "id": "document-organization",
        "severity": "warning",
        "enabled": true,
        "options": {
          "rootExceptions": ["README.md", "AGENTS.md"]
        }
      }
    ]`
        : ''
    }
  }
}
\`\`\`

## Required Fields

| Field | Type | Description |
|-------|------|-------------|
| $schema | string | Schema URL for validation and IDE support |
| version | string | Configuration version (use "1.0.0") |

## Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| project | object | Project metadata (name, type, language, etc.) |
| context | object | Core configuration settings |
| reporting | object | Output and format configuration |

${
  lintFocus
    ? `## Lint Rules Configuration

### Rule Structure

Each rule in the \`context.rules\` array has:

- **id**: Rule identifier (must match available rules)
- **severity**: "error" | "warning" | "info"
- **enabled**: true/false to enable/disable
- **options**: Rule-specific configuration

### Available Rules

#### document-organization
Enforces proper documentation structure and organization.

**Options:**
- \`rootExceptions\`: Files allowed at repository root
- \`documentFolders\`: Directories considered for documentation
- \`checkNested\`: Whether to check nested structures

**Example:**
\`\`\`json
{
  "id": "document-organization",
  "severity": "warning",
  "enabled": true,
  "options": {
    "rootExceptions": ["README.md", "AGENTS.md", "CHANGELOG.md"],
    "documentFolders": ["docs", "documentation"],
    "checkNested": true
  }
}
\`\`\`

#### filename-convention
Enforces consistent filename patterns for documentation.

**Options:**
- \`style\`: "kebab-case" | "snake_case" | "camelCase" | "PascalCase"
- \`extensions\`: File extensions to check
- \`exceptions\`: Specific filenames to allow
- \`documentFoldersOnly\`: Only check documentation folders
- \`autoFix\`: Enable automatic fixing

**Example:**
\`\`\`json
{
  "id": "filename-convention",
  "severity": "error",
  "enabled": true,
  "options": {
    "style": "kebab-case",
    "extensions": [".md", ".mdx"],
    "exceptions": ["README.md", "CHANGELOG.md"],
    "documentFoldersOnly": true,
    "autoFix": false
  }
}
\`\`\`

#### stale-references
Detects documentation that may be outdated based on git history.

**Options:**
- \`maxAgeDays\`: Maximum age threshold in days

**Example:**
\`\`\`json
{
  "id": "stale-references",
  "severity": "info",
  "enabled": true,
  "options": {
    "maxAgeDays": 30
  }
}
\`\`\`

#### require-references
Ensures documentation files have proper cross-references.

**Options:**
- \`excludeFiles\`: File patterns to exclude from checking

**Example:**
\`\`\`json
{
  "id": "require-references",
  "severity": "error",
  "enabled": true,
  "options": {
    "excludeFiles": ["tmp/**/*", "draft/**/*"]
  }
}
\`\`\`

#### orphaned-references
Finds and reports broken file references in documentation.

This rule typically doesn't have configurable options.

**Example:**
\`\`\`json
{
  "id": "orphaned-references",
  "severity": "warning",
  "enabled": true
}
\`\`\`

### Built-in Exceptions

The \`document-organization\` rule has built-in exceptions for common files:
- README.md
- AGENTS.md
- CHANGELOG.md
- LICENSE
- CONTRIBUTING.md

You can add additional exceptions using the \`rootExceptions\` option.
`
    : ''
}
## Context Configuration

### Patterns

Control which files are included or excluded:

\`\`\`json
{
  "context": {
    "patterns": {
      "include": ["src/**/*", "docs/**/*"],
      "exclude": [".alexandria/**", "node_modules/**"],
      "priority": [
        { "pattern": "src/**/*", "priority": 10 },
        { "pattern": "docs/**/*", "priority": 5 }
      ]
    }
  }
}
\`\`\`

### Git Integration

- \`useGitignore\`: Respect .gitignore patterns (default: true)
- \`maxDepth\`: Limit directory traversal depth
- \`followSymlinks\`: Follow symbolic links (default: false)

## Examples

### Basic Configuration
\`\`\`json
{
  "$schema": "https://raw.githubusercontent.com/a24z-ai/alexandria-cli/main/schema/alexandriarc.json",
  "version": "1.0.0",
  "context": {
    "useGitignore": true,
    "patterns": {
      "exclude": [".alexandria/**"]
    }
  }
}
\`\`\`

### Complete Configuration
See full example: \`alexandria schema --example full\`

## Command Line Usage

- \`alexandria schema\` - Show configuration schema
- \`alexandria schema --type lint\` - Focus on lint configuration
- \`alexandria lint --list-rules\` - List all available rules
- \`alexandria lint --help-rule <rule>\` - Get help for specific rule
`;

  console.log(markdown);
}
