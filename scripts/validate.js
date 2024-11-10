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
            results.valid = false;
            results.errors.push(`Invalid JSON in ${path.basename(filePath)}: ${parseError.message}`);
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
        results.errors.push(`Error reading file ${path.basename(filePath)}: ${error.message}`);
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
            results.valid = true;
            results.errors = ['No translation files to validate'];
        } else {
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
        }
        
    } catch (error) {
        results.valid = false;
        results.errors.push(`Validation script error: ${error.message}`);
    } finally {
        // Always write results file
        fs.writeFileSync(
            path.join(__dirname, '..', 'validation-results.json'),
            JSON.stringify(results, null, 2)
        );
        
        // Log results
        if (!results.valid) {
            console.error('\nValidation failed:');
            results.errors.forEach(error => console.error(`❌ ${error}`));
        } else {
            console.log('\n✅ All validations passed!');
        }
        
        // Exit with appropriate code
        process.exit(results.valid ? 0 : 1);
    }
}

// Run the script
main().catch(error => {
    results.valid = false;
    results.errors.push(`Fatal error: ${error.message}`);
    fs.writeFileSync(
        path.join(__dirname, '..', 'validation-results.json'),
        JSON.stringify(results, null, 2)
    );
    process.exit(1);
});
