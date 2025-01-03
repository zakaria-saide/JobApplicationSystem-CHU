/**
 * Converts a base64 string to a Blob URL.
 * @param {string} base64 - The base64 string to convert.
 * @param {string} mimeType - The MIME type of the file.
 * @returns {string} - A URL that can be used to view or download the Blob.
 */
function convertBase64ToBlobURL(base64, mimeType) {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });
    return URL.createObjectURL(blob);
  }
  
  export default convertBase64ToBlobURL;
  