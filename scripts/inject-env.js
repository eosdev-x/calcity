// This script injects environment variables into the HTML at build time
const fs = require('fs');
const path = require('path');

// Function to inject environment variables into HTML
function injectEnvironmentVariables() {
  try {
    // Create scripts directory if it doesn't exist
    if (!fs.existsSync(path.resolve(__dirname, '../dist'))) {
      console.log('Build directory not found. Skipping environment variable injection.');
      return;
    }

    // Create the env.js file in the dist directory
    const envJsContent = `
// This file is generated at build time to expose environment variables to the browser
window.env = {
  VITE_SUPABASE_URL: "${process.env.VITE_SUPABASE_URL || 'https://qbuhadgmvrwquufqhmrz.supabase.co'}",
  VITE_SUPABASE_ANON_KEY: "${process.env.VITE_SUPABASE_ANON_KEY || ''}"
};
`;

    fs.writeFileSync(path.resolve(__dirname, '../dist/env.js'), envJsContent);
    console.log('✅ Created env.js with environment variables');

    // Read the index.html file
    const indexHtmlPath = path.resolve(__dirname, '../dist/index.html');
    let indexHtmlContent = fs.readFileSync(indexHtmlPath, 'utf8');

    // Inject the script tag for env.js before the closing head tag
    indexHtmlContent = indexHtmlContent.replace(
      '</head>',
      '  <script src="/env.js"></script>\n  </head>'
    );

    // Write the modified index.html file
    fs.writeFileSync(indexHtmlPath, indexHtmlContent);
    console.log('✅ Injected env.js script into index.html');

  } catch (error) {
    console.error('❌ Error injecting environment variables:', error);
  }
}

// Run the function
injectEnvironmentVariables();
