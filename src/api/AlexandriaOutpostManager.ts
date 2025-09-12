import { ProjectRegistryStore } from 'a24z-memory/dist/projects-core/ProjectRegistryStore';
import { MemoryPalace } from 'a24z-memory/dist/MemoryPalace';
import type { AlexandriaRepository, AlexandriaEntry } from 'a24z-memory/dist/pure-core/types/repository';
import type { CodebaseViewSummary } from 'a24z-memory/dist/pure-core/types/summary';
import { extractCodebaseViewSummary } from 'a24z-memory/dist/pure-core/types/summary';
import type { ValidatedRepositoryPath } from 'a24z-memory/dist/pure-core/types/index';
import { homedir } from 'os';

import { FileSystemAdapter } from 'a24z-memory/dist/pure-core/abstractions/filesystem';

export class AlexandriaOutpostManager {
  private readonly projectRegistry: ProjectRegistryStore;

  constructor(private readonly fsAdapter: FileSystemAdapter) {
    // Create the ProjectRegistryStore internally with the user's home directory
    this.projectRegistry = new ProjectRegistryStore(fsAdapter, homedir());
  }

  async getAllRepositories(): Promise<AlexandriaRepository[]> {
    // Get all registered projects from existing registry
    const entries = this.projectRegistry.listProjects();

    // Transform each to API format
    const repositories = await Promise.all(entries.map((entry) => this.transformToRepository(entry)));

    return repositories.filter((repo) => repo !== null) as AlexandriaRepository[];
  }

  async getRepository(name: string): Promise<AlexandriaRepository | null> {
    const entry = this.projectRegistry.getProject(name);
    if (!entry) return null;

    return this.transformToRepository(entry);
  }

  async registerRepository(name: string, path: string): Promise<AlexandriaRepository> {
    // Use existing registry's register method
    this.projectRegistry.registerProject(name, path as ValidatedRepositoryPath);

    // Return the transformed repository
    const entry = this.projectRegistry.getProject(name);
    if (!entry) {
      throw new Error(`Failed to register repository ${name}`);
    }
    return this.transformToRepository(entry);
  }

  async getRepositoryByPath(path: string): Promise<AlexandriaRepository | null> {
    // Find repository by path
    const entries = this.projectRegistry.listProjects();
    const entry = entries.find((e) => e.path === path);

    if (!entry) return null;
    return this.transformToRepository(entry);
  }

  getRepositoryCount(): number {
    return this.projectRegistry.listProjects().length;
  }

  private async transformToRepository(entry: AlexandriaEntry): Promise<AlexandriaRepository> {
    // Load views if not already loaded
    let views: CodebaseViewSummary[] = entry.views || [];

    if (views.length === 0) {
      try {
        // Create a new MemoryPalace instance for this repository
        const memoryPalace = new MemoryPalace(entry.path, this.fsAdapter);

        // Get views from the memory palace
        views = memoryPalace.listViews().map((v) => extractCodebaseViewSummary(v));
      } catch (error) {
        // If we can't load views, continue with empty array
        console.debug(`Could not load views for ${entry.name}:`, error);
        views = [];
      }
    }

    // Extract owner from remote URL if available
    const owner = this.extractOwner(entry.remoteUrl);

    // Build the repository data according to AlexandriaRepository type
    const repo: AlexandriaRepository = {
      name: entry.name,
      remoteUrl: entry.remoteUrl,
      registeredAt: entry.registeredAt,
      hasViews: views.length > 0,
      viewCount: views.length,
      views,
      // Only include github if we have github data or can construct it
      github:
        entry.github ||
        (owner
          ? {
              id: `${owner}/${entry.name}`,
              owner: owner,
              name: entry.name,
              stars: 0,
              lastUpdated: new Date().toISOString(),
            }
          : undefined),
    };

    return repo;
  }

  private extractOwner(remoteUrl?: string): string | null {
    if (!remoteUrl) return null;
    // Extract owner from git URL
    const match = remoteUrl.match(/github\.com[:/]([^/]+)/);
    return match ? match[1] : null;
  }
}
