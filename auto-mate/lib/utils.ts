import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseStringify(value:unknown) {
  return JSON.parse(JSON.stringify(value))
}

/**
 * 根据文件名获取文件类型
 * @param fileName 文件名（带扩展名）
 * @returns 文件类型（'image' | 'video' | 'audio' | 'document' | 'archive' | 'code' | 'spreadsheet' | 'presentation' | 'other'）
 */
export function getFileType(fileName: string): string {
  if (!fileName || typeof fileName !== 'string') {
    return 'other';
  }

  // 获取文件扩展名（转换为小写）
  const extension = fileName.split('.').pop()?.toLowerCase() || '';

  // 图片类型
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'ico', 'tiff'];
  if (imageExtensions.includes(extension)) {
    return 'image';
  }

  // 视频类型
  const videoExtensions = ['mp4', 'mov', 'avi', 'mkv', 'flv', 'wmv', 'webm', 'mpeg', 'mpg'];
  if (videoExtensions.includes(extension)) {
    return 'video';
  }

  // 音频类型
  const audioExtensions = ['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a', 'wma'];
  if (audioExtensions.includes(extension)) {
    return 'audio';
  }

  // 文档类型
  const documentExtensions = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt', 'tex'];
  if (documentExtensions.includes(extension)) {
    return 'document';
  }

  // 电子表格类型
  const spreadsheetExtensions = ['xls', 'xlsx', 'csv', 'ods', 'tsv'];
  if (spreadsheetExtensions.includes(extension)) {
    return 'spreadsheet';
  }

  // 演示文稿类型
  const presentationExtensions = ['ppt', 'pptx', 'odp', 'key'];
  if (presentationExtensions.includes(extension)) {
    return 'presentation';
  }

  // 压缩包类型
  const archiveExtensions = ['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz'];
  if (archiveExtensions.includes(extension)) {
    return 'archive';
  }

  // 代码文件类型
  const codeExtensions = ['js', 'jsx', 'ts', 'tsx', 'html', 'css', 'scss', 'less', 'json', 'xml', 'py', 'java', 'c', 'cpp', 'h', 'sh', 'php', 'rb', 'go', 'rs', 'swift', 'kt'];
  if (codeExtensions.includes(extension)) {
    return 'code';
  }

  // 其他类型
  return 'other';
}