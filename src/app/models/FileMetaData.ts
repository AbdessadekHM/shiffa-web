export interface FileMetadata {
  id: string;
  user_id: string;
  file_url: string;
  description?: string;
  type: 'report' | 'prescription' | 'certificate' | 'image' | 'other';
  created_at: string;
}

