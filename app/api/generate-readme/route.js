import { NextResponse } from 'next/server';
import { generateReadme, detectTechStack, generateFileTree } from '@/lib/readmeGenerator';
import path from 'path';

export async function POST(request) {
  try {
    const body = await request.json();

    const config = {
      projectName: body.projectName || 'My Project',
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
