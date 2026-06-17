import { NextResponse } from 'next/server';
import { generateReadme, detectTechStack, generateFileTree } from '@/lib/readmeGenerator';
import path from 'path';

async function fetchGitHubRepo(owner, repo) {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
  if (!res.ok) return null;
  return res.json();
}

async function fetchGitHubTree(owner, repo, branch) {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${encodeURIComponent(branch)}?recursive=1`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.tree || [];
}

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
    const body = await request.json();
    const repo = normalizeRepoInput(
      body.repo ||
        body.repository ||
        body.repositoryUrl ||
        body.repoUrl ||
        body.url ||
        body.searchQuery ||
        body.githubRepo
    );
    const githubRepo = repo.owner && repo.repo ? await fetchGitHubRepo(repo.owner, repo.repo) : null;
    const branch = body.branch || githubRepo?.default_branch || 'main';
    const githubTree = repo.owner && repo.repo
      ? await fetchGitHubTree(repo.owner, repo.repo, branch)
      : null;

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
      githubProjectTree: githubTree,
      repositoryOwner: githubRepo?.owner?.login || body.author || 'Author',
      repositoryUrl: githubRepo?.html_url || '',
    };

    const readme = generateReadme(config);

    return NextResponse.json({
      success: true,
      content: readme,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: error.message 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const projectPath = process.cwd();
    const packageJsonPath = path.join(projectPath, 'package.json');

    const techs = detectTechStack(packageJsonPath);
    const fileTree = generateFileTree(projectPath, '', 2);

    return NextResponse.json({
      success: true,
      detectedTechs: techs,
      fileTree: fileTree,
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: error.message 
      },
      { status: 500 }
    );
  }
}
