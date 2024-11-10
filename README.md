![Barkle Translations](https://media.barkle.chat/bk_/2962d0fa-ff2a-49e2-956f-e6f300ed4bd7.png)

# 🌎 Barkle Translation Project

Welcome to the official translation project for Barkle.chat! We're on a mission to make Barkle accessible to users worldwide by providing high-quality translations for both our app and website.

## 🚀 Getting Started with GitHub

1. **Fork the Repository**
   ```bash
   # Clone your forked repository
   git clone https://github.com/BarkleAPP/Translations.git
   cd barkle-translations
   ```

2. **Create a New Branch**
   ```bash
   # Create a branch for your language
   git checkout -b Translation/LANGUAGE_CODE
   ```

3. **File Structure**
   ```
   /
   ├── en_US.json    # Base translation file
   ├── README.md
   └── translations/  # Add your translation file here
       ├── es_ES.json
       ├── fr_FR.json
       └── ...
   ```

4. **Submit Your Translation**
   - Copy `en_US.json` to `translations/LANGUAGE_CODE.json`
   - Translate the content
   - Commit your changes
   - Create a pull request

## 💻 Development Workflow

1. **Sync with Main Repository**
   ```bash
   # Add the upstream remote
   git remote add upstream https://github.com/BarkleAPP/Translations.git
   
   # Keep your fork updated
   git fetch upstream
   git merge upstream/main
   ```

2. **Create Your Translation**
   - Use a proper code editor (VSCode, Sublime, etc.)
   - Ensure JSON validity
   - Maintain the same structure as `en_US.json`

3. **Testing**
   ```bash
   # Validate JSON structure
   npm i
   npm run validate
   ```

4. **Submit Pull Request**
   - Push to your fork
   - Create PR against main repository
   - Fill out the PR template

## 🎯 Project Goals

- Create accurate and culturally appropriate translations
- Build a multilingual community experience
- Ensure consistent terminology across all languages
- Maintain the friendly and engaging tone of Barkle

## 📜 Translation Rules

To maintain the highest quality standards:

- ❌ **No online translators** (Google Translate, DeepL, etc.)
- ❌ **No AI-assisted translations**
- ✅ **Only human-made translations** from native or fluent speakers
- ✅ **Maintain context and tone** appropriate for the Barkle community

## 🌟 Rewards

Successfully approved translations will earn you:
- 🏆 Official Translator Badge on your Barkle profile
- 🎉 Recognition in our growing international community
- 👥 Opportunity to shape Barkle's global presence

## 🔄 Review Process

1. **Initial Submission**
   - Submit PR on GitHub
   - Post in Barkle translation channel
   
2. **Review Phases**
   - Technical validation (JSON structure)
   - Community verification
   - Staff quality check
   - Cultural appropriateness assessment

3. **Approval**
   - Translation merged to main
   - Badge automatically awarded
   - Implementation into Barkle platform

## 🤝 Support

- **GitHub Issues**: For technical problems or suggestions
- **Barkle Platform**: Contact @Barkle for general questions
- **Discord**: Join our translator community

## 🌍 Contributing Languages

We welcome translations for any language! Priority languages include:
- Spanish
- French
- German
- Japanese
- Portuguese
- And many more!

## ⚠️ Quality Guidelines

- Maintain Barkle's friendly tone
- Use appropriate cultural references
- Keep technical terms consistent
- Preserve formatting and placeholders
- Ensure grammatical accuracy

## 💡 Tips for Success

- Review existing translations for consistency
- Test your JSON file before submitting
- Document any cultural adaptations in PR comments
- Stay active in the community for updates

## 📝 Note

The Translator Badge is awarded per language contribution. Multiple contributions in different languages can be recognized!

---

*Join us in making Barkle a truly global community! Your expertise in languages helps us connect people worldwide.*
