const fs = require('fs');
const path = require('path');

const results = {
    valid: true,
    errors: []
};

function validateTranslation(filePath, baseTranslation) {
    try {
        // Read and parse the translation file
        const content = fs.readFileSync(filePath, 'utf8');
        const translation = JSON.parse(content);
        console.log(`✓ ${path.basename(filePath)} is valid JSON`);
        
        // Get keys from both files
        const baseKeys = Object.keys(baseTranslation);
        const translationKeys = Object.keys(translation);
        
        // Check for missing and extra keys
        const missingKeys = baseKeys.filter(key => !translationKeys.includes(key));
        const extraKeys = translationKeys.filter(key => !baseKeys.includes(key));
        
        if (missingKeys.length > 0) {
            results.valid = false;
            results.errors.push(`Missing keys: ${missingKeys.join(', ')}`);
        }
        
        if (extraKeys.length > 0) {
            results.valid = false;
            results.errors.push(`Extra keys that don't exist in enUS.json: ${extraKeys.join(', ')}`);
        }
        
        return results.valid;
    } catch (error) {
        results.valid = false;
        if (error instanceof SyntaxError) {
            // Get line and column from JSON syntax error
            const lines = content.split('\n');
            let lineNo = 0;
            let charNo = 0;
            
            for (let i = 0; i < error.pos; i++) {
                if (content[i] === '\n') {
                    lineNo++;
                    charNo = 0;
                } else {
                    charNo++;
                }
            }
            
            results.errors.push(`Invalid JSON at line ${lineNo + 1}, column ${charNo + 1}`);
            results.errors.push(`Hint: Check for missing commas, quotes, or brackets near this location`);
        } else {
            results.errors.push(`Error reading file: ${error.message}`);
        }
        return false;
    }
}

function main() {
    try {
        // Load base translation without validation
        const baseTranslation = require('../en-US.json');
        
        // Only validate files that changed
        const changedFiles = process.env.CHANGED_FILES ? 
            process.env.CHANGED_FILES.split(',') : 
            fs.readdirSync('translations').filter(f => f.endsWith('.json'));
            
        changedFiles.forEach(file => {
            const filePath = path.join('translations', file);
            if (fs.existsSync(filePath)) {
                console.log(`\nValidating ${file}...`);
                validateTranslation(filePath, baseTranslation);
            }
        });
        
        // Save results for GitHub Actions
        fs.writeFileSync('validation-results.json', JSON.stringify(results, null, 2));
        
        if (!results.valid) {
            console.error('\nValidation failed:');
            results.errors.forEach(error => console.error(`❌ ${error}`));
            process.exit(1);
        } else {
            console.log('\n✅ All validations passed!');
            process.exit(0);
        }
        
    } catch (error) {
        console.error(`\n❌ Validation script error: ${error.message}`);
        process.exit(1);
    }
}

main();