/**
 * Schema command - Display the JSON schema and examples for CodebaseView
 */

import { Command } from 'commander';

export function createSchemaCommand(): Command {
  const command = new Command('schema');

  command
    .description('Show the JSON schema and examples for Alexandria CodebaseViews')
    .option('-f, --format <type>', 'Output format: json, typescript, or markdown (default: json)', 'json')
    .option('--example <type>', 'Show specific example: basic, full, or minimal (default: basic)', 'basic')
    .action((options) => {
      const format = options.format.toLowerCase();
      const exampleType = options.example.toLowerCase();

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
