export interface newDocumentDto {
  id?: number;
  // identifier: string;
  title: string;
  description: string;
  filePath?: string;
  status?: string;
  createdAt?: Date;
  // etc...
}

export interface DocumentFile {
  id: number;
  name: string;
  description: string;
  type: string;
  downloadUrl: string;
  status: string;
}
