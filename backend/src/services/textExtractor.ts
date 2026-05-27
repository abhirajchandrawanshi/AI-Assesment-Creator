import pdfParse from 'pdf-parse';

/**
 * Extracts plain text from a file buffer based on the file name extension.
 * Supports PDF and TXT.
 */
export async function extractText(fileBuffer: Buffer, fileName: string): Promise<string> {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  if (extension === 'pdf') {
    try {
      const data = await pdfParse(fileBuffer);
      return data.text || '';
    } catch (error: any) {
      throw new Error(`Failed to parse PDF file: ${error.message}`);
    }
  }
  
  if (extension === 'txt') {
    return fileBuffer.toString('utf-8');
  }

  // Fallback to utf-8 conversion for other text-based extensions
  return fileBuffer.toString('utf-8');
}
