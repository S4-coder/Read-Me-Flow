#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { generateReadme } = require(path.join(__dirname, '../lib/readmeGenerator'));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const inputLines = rl[Symbol.asyncIterator]();

function question(query) {
  if (process.stdin.isTTY) {
    return new Promise(resolve => rl.question(query, resolve));
  }

  process.stdout.write(query);
  return inputLines.next().then(result => result.done ? '' : result.value.trim());
}

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║    📝 README FILE & DOCUMENTATION GENERATOR 📝         ║');
  console.log('║         Professional Markdown Builder                  ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  try {
    // Get user input
    const projectName = await question('🏷️  Project Name (default: readmeflow): ');
    const description = await question('📝 Project Description: ');
    const author = await question('👤 Author Name: ');
    const license = await question('📄 License (default: MIT): ') || 'MIT';
    const version = await question('🔢 Version (default: 1.0.0): ') || '1.0.0';
    const statusInput = await question('⚡ Status (stable/beta/alpha, default: stable): ') || 'stable';
    const includeTreeInput = await question('📁 Include File Tree? (yes/no, default: yes): ') || 'yes';
    const includeTechInput = await question('🛠️  Include Tech Stack Detection? (yes/no, default: yes): ') || 'yes';
    const outputPath = await question('💾 Output path (default: ./README.md): ') || './README.md';

    const config = {
      projectName: projectName || 'readmeflow',
      description,
      author,
      license,
      version,
      status: statusInput.toLowerCase(),
      includeFileTree: includeTreeInput.toLowerCase() !== 'no',
      includeTechStack: includeTechInput.toLowerCase() !== 'no',
      projectPath: process.cwd(),
    };

    console.log('\n⏳ Generating README...\n');

    const readmeContent = generateReadme(config);

    // Save README
    fs.writeFileSync(path.resolve(process.cwd(), outputPath), readmeContent);

    console.log('✅ Success! README generated at:', outputPath);
    console.log('\n📊 Generated README includes:');
    console.log('   ✓ Professional title and description');
    console.log('   ✓ License, version, and status badges');
    if (config.includeTechStack) console.log('   ✓ Auto-detected tech stack with icons');
    console.log('   ✓ Installation instructions');
    console.log('   ✓ Usage examples with development, build, and production commands');
    if (config.includeFileTree) console.log('   ✓ Project file structure with file-type icons');
    console.log('   ✓ API documentation section');
    console.log('   ✓ Testing guidelines and coverage table');
    console.log('   ✓ Deployment instructions for major platforms');
    console.log('   ✓ Project roadmap with milestones');
    console.log('   ✓ FAQ section with collapsible answers');
    console.log('   ✓ Contributing guidelines');
    console.log('   ✓ Author information');
    console.log('   ✓ Support section\n');

    console.log('💡 Tips for customization:');
    console.log('   • Edit each section with your actual project details');
    console.log('   • Customize the Roadmap with your milestone checklist');
    console.log('   • Update the FAQ answers to match your project');
    console.log('   • Add screenshots or GIF demos for better presentation');
    console.log('   • Update GitHub URLs with your actual repository\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    rl.close();
  }
}

main();
