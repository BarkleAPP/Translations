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
        let translation;
        
        try {
            translation = JSON.parse(content);
            console.log(`✓ ${path.basename(filePath)} is valid JSON`);
        } catch (parseError) {
            // Handle JSON parsing errors
            const lines = content.split('\n');
            let lineNo = 0;
            let charNo = 0;
            
            for (let i = 0; i < parseError.pos; i++) {
                if (content[i] === '\n') {
                    lineNo++;
                    charNo = 0;
                } else {
                    charNo++;
                }
            }
            
            results.valid = false;
            results.errors.push(`Invalid JSON at line ${lineNo + 1}, column ${charNo + 1}`);
            results.errors.push(`Hint: Check for missing commas, quotes, or brackets near this location`);
            return false;
        }
        
        // Get keys from both files
        const baseKeys = Object.keys(baseTranslation);
        const translationKeys = Object.keys(translation);
        
        // Check for missing and extra keys
        const missingKeys = baseKeys.filter(key => !translationKeys.includes(key));
        const extraKeys = translationKeys.filter(key => !baseKeys.includes(key));
        
        if (missingKeys.length > 0) {
            results.valid = false;
            results.errors.push(`Missing keys in ${path.basename(filePath)}: ${missingKeys.join(', ')}`);
        }
        
        if (extraKeys.length > 0) {
            results.valid = false;
            results.errors.push(`Extra keys in ${path.basename(filePath)} that don't exist in en-US.json: ${extraKeys.join(', ')}`);
        }
        
        return results.valid;
    } catch (error) {
        results.valid = false;
        results.errors.push(`Error reading file ${filePath}: ${error.message}`);
        return false;
    }
}

async function main() {
    try {
        // Load base translation
        const baseTranslationPath = path.join(__dirname, '..', 'en-US.json');
        if (!fs.existsSync(baseTranslationPath)) {
            throw new Error('Base translation file (en-US.json) not found');
        }
        const baseTranslation = JSON.parse(fs.readFileSync(baseTranslationPath, 'utf8'));
        
        // Get translation files to validate
        const translationsDir = path.join(__dirname, '..', 'translations');
        const changedFiles = process.env.CHANGED_FILES ? 
            process.env.CHANGED_FILES.split(',').filter(f => f.trim()) : 
            fs.readdirSync(translationsDir).filter(f => f.endsWith('.json'));
        
        if (changedFiles.length === 0) {
            console.log('No translation files to validate');
            process.exit(0);
        }
        
        // Validate each file
        changedFiles.forEach(file => {
            const filePath = path.join(translationsDir, file);
            if (fs.existsSync(filePath)) {
                console.log(`\nValidating ${file}...`);
                validateTranslation(filePath, baseTranslation);
            } else {
                results.valid = false;
                results.errors.push(`File not found: ${file}`);
            }
        });
        
        // Save results
        fs.writeFileSync(
            path.join(__dirname, 'validation-results.json'), 
            JSON.stringify(results, null, 2)
        );
        
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

// Run the script
main().catch(error => {
    console.error(`\n❌ Fatal error: ${error.message}`);
    process.exit(1);
});
