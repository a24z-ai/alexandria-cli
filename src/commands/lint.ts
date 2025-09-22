import { Command } from 'commander';
import { LibraryRulesEngine, NodeFileSystemAdapter, NodeGlobAdapter } from '@a24z/core-library';
import chalk from 'chalk';

function getBasicLintConfig() {
  return {
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
          severity: 'warning',
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

function getAdvancedLintConfig() {
  return {
    $schema: 'https://raw.githubusercontent.com/a24z-ai/alexandria-cli/main/schema/alexandriarc.json',
    version: '1.0.0',
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
            rootExceptions: ['README.md', 'AGENTS.md', 'CHANGELOG.md'],
            documentFolders: ['docs', 'documentation'],
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
      ],
    },
  };
}

function getExampleConfigForRule(ruleId: string, rule: any) {
  const baseConfig = {
    $schema: 'https://raw.githubusercontent.com/a24z-ai/alexandria-cli/main/schema/alexandriarc.json',
    version: '1.0.0',
    context: {
      rules: [
        {
          id: ruleId,
          severity: rule.severity,
          enabled: true,
          options: {},
        },
      ],
    },
  };

  // Add rule-specific example options
  switch (ruleId) {
    case 'document-organization':
      if (baseConfig.context.rules[0]) {
        baseConfig.context.rules[0].options = {
          rootExceptions: ['README.md', 'AGENTS.md', 'CHANGELOG.md'],
          documentFolders: ['docs', 'documentation'],
          checkNested: true,
        };
      }
      break;
    case 'filename-convention':
      if (baseConfig.context.rules[0]) {
        baseConfig.context.rules[0].options = {
          style: 'kebab-case',
          extensions: ['.md', '.mdx'],
          exceptions: ['README.md', 'CHANGELOG.md'],
          documentFoldersOnly: true,
          autoFix: false,
        };
      }
      break;
    case 'stale-references':
      if (baseConfig.context.rules[0]) {
        baseConfig.context.rules[0].options = {
          maxAgeDays: 30,
        };
      }
      break;
    case 'require-references':
      if (baseConfig.context.rules[0]) {
        baseConfig.context.rules[0].options = {
          excludeFiles: ['tmp/**/*', 'draft/**/*'],
        };
      }
      break;
    case 'orphaned-references':
      // This rule typically doesn't have configurable options
      break;
  }

  return baseConfig;
}

export const lintCommand = new Command('lint')
  .description('Lint your Alexandria library for context quality issues')
  .option('--fix', 'Automatically fix fixable violations')
  .option('--json', 'Output results as JSON')
  .option('--quiet', 'Only show errors')
  .option('--errors-only', 'Exit with error code only if there are errors (not warnings)')
  .option('--enable <rules...>', 'Enable specific rules')
  .option('--disable <rules...>', 'Disable specific rules')
  .option('--list-rules', 'List all available lint rules and their configurations')
  .option('--help-rule <rule>', 'Show detailed help for a specific rule')
  .action(async (options) => {
    const fsAdapter = new NodeFileSystemAdapter();
    const globAdapter = new NodeGlobAdapter();
    const engine = new LibraryRulesEngine(fsAdapter, globAdapter);

    // Handle --help-rule option
    if (options.helpRule) {
      console.log(chalk.blue(`📋 Alexandria Lint Rule: ${options.helpRule}\n`));

      const rules = engine.getAllRules();
      const rule = rules.get(options.helpRule);

      if (!rule) {
        console.error(chalk.red(`❌ Rule '${options.helpRule}' not found`));
        console.log(chalk.dim('\nAvailable rules:'));
        for (const [ruleId] of rules) {
          console.log(chalk.dim(`  • ${ruleId}`));
        }
        process.exit(1);
      }

      console.log(chalk.bold(`${rule.name}`));
      console.log(`${rule.description}\n`);
      console.log(chalk.gray('Details:'));
      console.log(`  ${chalk.gray('Severity:')} ${rule.severity}`);
      console.log(`  ${chalk.gray('Category:')} ${rule.category}`);
      console.log(`  ${chalk.gray('Impact:')} ${rule.impact}`);
      console.log(`  ${chalk.gray('Fixable:')} ${rule.fixable ? chalk.green('Yes') : chalk.red('No')}`);
      console.log(`  ${chalk.gray('Enabled by default:')} ${rule.enabled ? chalk.green('Yes') : chalk.red('No')}\n`);

      // Show configuration example
      console.log(chalk.blue('Configuration Example:'));
      console.log('Add this to your .alexandriarc.json:\n');

      const exampleConfig = getExampleConfigForRule(options.helpRule, rule);
      console.log(JSON.stringify(exampleConfig, null, 2));

      console.log('\n' + chalk.dim('Use --enable or --disable flags to override configuration for this run.'));
      process.exit(0);
    }

    // Handle --list-rules option
    if (options.listRules) {
      console.log(chalk.blue('📋 Available Alexandria Lint Rules:\n'));

      const rules = engine.getAllRules();
      for (const [ruleId, rule] of rules) {
        console.log(chalk.bold(`${ruleId}`));
        console.log(`  ${chalk.gray('Description:')} ${rule.description}`);
        console.log(`  ${chalk.gray('Default Severity:')} ${rule.severity}`);
        console.log(`  ${chalk.gray('Impact:')} ${rule.impact}`);

        if (rule.fixable) {
          console.log(`  ${chalk.gray('Fixable:')} ${chalk.green('Yes')}`);
        }

        console.log();
      }

      console.log(chalk.blue('\n📝 Configuration Examples:\n'));
      console.log('Basic .alexandriarc.json with lint configuration:');
      console.log(JSON.stringify(getBasicLintConfig(), null, 2));

      console.log('\n' + chalk.blue('Advanced configuration with rule-specific options:'));
      console.log(JSON.stringify(getAdvancedLintConfig(), null, 2));

      console.log('\n' + chalk.dim('Use "alexandria lint --help-rule <rule-name>" for rule-specific help.'));
      console.log(chalk.dim('Use --enable or --disable flags to override configuration for this run.'));
      process.exit(0);
    }

    console.log(chalk.blue('🔍 Linting Alexandria library...\n'));

    const result = await engine.lint(process.cwd(), {
      enabledRules: options.enable,
      disabledRules: options.disable,
      fix: options.fix,
    });

    if (options.json) {
      console.log(JSON.stringify(result, null, 2));
      const exitCode = options.errorsOnly ? (result.errorCount > 0 ? 1 : 0) : result.violations.length > 0 ? 1 : 0;
      process.exit(exitCode);
    }

    // Format output similar to ESLint
    const { violations, errorCount, warningCount, infoCount, fixableCount } = result;

    // Filter violations based on --errors-only flag
    const displayViolations = options.errorsOnly ? violations.filter((v) => v.severity === 'error') : violations;

    if (displayViolations.length === 0) {
      if (options.errorsOnly && violations.length > 0) {
        console.log(chalk.green('✨ No errors found! (warnings and info suppressed)'));
      } else {
        console.log(chalk.green('✨ No issues found!'));
      }
      process.exit(0);
    }

    // Group violations by file
    const violationsByFile = new Map<string, typeof violations>();
    for (const violation of displayViolations) {
      const file = violation.file || 'General';
      if (!violationsByFile.has(file)) {
        violationsByFile.set(file, []);
      }
      violationsByFile.get(file)!.push(violation);
    }

    // Display violations
    for (const [file, fileViolations] of violationsByFile) {
      console.log(chalk.underline(file));

      for (const violation of fileViolations) {
        const icon = violation.severity === 'error' ? '✖' : violation.severity === 'warning' ? '⚠' : 'ℹ';
        const color =
          violation.severity === 'error' ? chalk.red : violation.severity === 'warning' ? chalk.yellow : chalk.blue;

        // Include line number if available
        const location = violation.line ? chalk.gray(`  ${violation.line}:1`) : '  ';

        console.log(`${location}  ${color(icon)} ${violation.message}`);
        if (!options.quiet) {
          console.log(chalk.gray(`      rule: ${violation.ruleId}`));
          console.log(chalk.gray(`      impact: ${violation.impact}`));
        }
      }
      console.log();
    }

    // Summary
    const parts = [];
    const displayedErrors = options.errorsOnly ? errorCount : errorCount;
    const displayedWarnings = options.errorsOnly ? 0 : warningCount;
    const displayedInfo = options.errorsOnly ? 0 : infoCount;

    if (displayedErrors > 0) {
      parts.push(chalk.red(`${displayedErrors} error${displayedErrors !== 1 ? 's' : ''}`));
    }
    if (displayedWarnings > 0) {
      parts.push(chalk.yellow(`${displayedWarnings} warning${displayedWarnings !== 1 ? 's' : ''}`));
    }
    if (displayedInfo > 0 && !options.quiet) {
      parts.push(chalk.blue(`${displayedInfo} info`));
    }

    console.log(
      chalk.bold(
        `✖ ${displayViolations.length} problem${displayViolations.length !== 1 ? 's' : ''} (${parts.join(', ')})`,
      ),
    );

    if (fixableCount > 0 && !options.fix) {
      console.log(
        chalk.dim(
          `\n${fixableCount} error${fixableCount !== 1 ? 's' : ''} and warning${fixableCount !== 1 ? 's' : ''} potentially fixable with --fix`,
        ),
      );
    }

    // Determine exit code based on options
    const exitCode = options.errorsOnly ? (errorCount > 0 ? 1 : 0) : violations.length > 0 ? 1 : 0;
    process.exit(exitCode);
  });
