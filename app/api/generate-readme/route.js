import { NextResponse } from 'next/server';
import path from 'path';
import {
  generateReadme,
  detectTechStack,
  generateFileTree,
} from '@/lib/readmeGenerator';

function normalizeRepoInput(input) {
  if (!input) return {};

  const value = String(input).trim();
  const match = value.match(/github\.com\/([^/]+)\/([^/?#]+)/);

  if (match) {
    return {
      owner: match[1],
      repo: match[2].replace(/\.git$/, ''),
    };
  }

  const parts = value.split('/').filter(Boolean);
  if (parts.length === 2) {
    return {
      owner: parts[0],
      repo: parts[1].replace(/\.git$/, ''),
    };
  }

  return {};
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const repo = normalizeRepoInput(
      body.repo ||
        body.repository ||
        body.repositoryUrl ||
        body.repoUrl ||
        body.url ||
        body.searchQuery ||
        body.githubRepo
    );

    const config = {
      projectName: body.projectName || repo.repo || 'My Project',
      description: body.description || 'Project description',
      author: body.author || 'Author',
      license: body.license || 'MIT',
      version: body.version || '1.0.0',
      status: body.status || 'stable',
      projectPath: process.cwd(),
      includeFileTree: body.includeFileTree !== false,
      includeTechStack: body.includeTechStack !== false,
    };

    const readme = generateReadme(config);

    return NextResponse.json({
      success: true,
      content: readme,
      repository: repo,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const projectPath = process.cwd();
    const packageJsonPath = path.join(projectPath, 'package.json');

    return NextResponse.json({
      success: true,
      detectedTechs: detectTechStack(packageJsonPath),
      fileTree: generateFileTree(projectPath, '', 2),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
