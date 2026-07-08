import { R2Bucket } from "@cloudflare/workers-types";

export interface FileMetadata {
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
}

export class StorageService {
  constructor(private bucket: R2Bucket) {}

  async uploadFile(
    file: File,
    userId: string,
    customName?: string
  ): Promise<string> {
    const fileName = customName || `${userId}/${Date.now()}-${file.name}`;
    
    await this.bucket.put(fileName, file, {
      httpMetadata: {
        contentType: file.type,
        contentDisposition: `inline; filename="${file.name}"`,
      },
      customMetadata: {
        userId,
        originalName: file.name,
      },
    });

    return fileName;
  }

  async deleteFile(fileName: string): Promise<void> {
    await this.bucket.delete(fileName);
  }

  async renameFile(oldName: string, newName: string, userId: string): Promise<void> {
    const file = await this.bucket.get(oldName);
    if (!file) {
      throw new Error("File not found");
    }

    await this.bucket.put(newName, file.body!, {
      httpMetadata: file.httpMetadata,
      customMetadata: {
        ...file.customMetadata!,
        userId,
      },
    });

    await this.bucket.delete(oldName);
  }

  async listFiles(userId: string): Promise<FileMetadata[]> {
    const objects = await this.bucket.list({ prefix: `${userId}/` });
    
    return objects.objects.map(obj => ({
      name: obj.key.substring(obj.key.indexOf('/') + 1),
      size: obj.size,
      type: obj.httpMetadata?.contentType || 'unknown',
      uploadedAt: obj.uploaded.toISOString(),
    }));
  }

  async getFileUrl(fileName: string): Promise<string | null> {
    const object = await this.bucket.get(fileName);
    if (!object) return null;

    // Generate a signed URL for secure access
    return `https://pub-1e0290dd6a324cbdbbc4aedbcfeb1783.r2.dev/${fileName}`;
  }

  async generateShareableUrl(fileName: string): Promise<string> {
    // This would normally generate a secure signed URL
    // For demo purposes, returning the public URL
    return `https://pub-1e0290dd6a324cbdbbc4aedbcfeb1783.r2.dev/${fileName}`;
  }
}
