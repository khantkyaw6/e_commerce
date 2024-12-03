const cld = require('cld');

const langDetector = {
  checkLanguageText: async (text, targetLanguageCode, thresholdPercentage) => {
    const result = await cld.detect(text);

    const detectedLanguages = result.languages.map((lang) => lang.code);

    const targetLanguageChunks = result.chunks.filter(
      (chunk) => chunk.code === targetLanguageCode,
    );
    const targetLanguageBytes = targetLanguageChunks.reduce(
      (total, chunk) => total + chunk.bytes,
      0,
    );
    const totalBytes = result.textBytes;

    const targetLanguagePercentage = (targetLanguageBytes / totalBytes) * 100;

    if (
      detectedLanguages.includes(targetLanguageCode) &&
      targetLanguagePercentage >= thresholdPercentage
    ) {
      console.log(
        `Detected language is predominantly ${targetLanguageCode.toUpperCase()}`,
      );
      
      return result;
    } else {
      console.log(
        `Text is not predominantly in ${targetLanguageCode.toUpperCase()}`,
      );
      return null; // or handle the error case as needed
    }
  },
};

module.exports = langDetector;
