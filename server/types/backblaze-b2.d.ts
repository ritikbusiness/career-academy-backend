declare module 'backblaze-b2' {
  export class B2 {
    constructor(options: { applicationKeyId: string; applicationKey: string });
    authorize(): Promise<any>;
    getUploadUrl(options: { bucketId: string }): Promise<{ data: { uploadUrl: string; authorizationToken: string } }>;
    uploadFile(options: { 
      uploadUrl: string; 
      uploadAuthToken: string; 
      fileName: string; 
      data: Buffer 
    }): Promise<any>;
    listFileNames(options: { bucketId: string; prefix?: string }): Promise<{ data: { files: Array<{ fileId: string; fileName: string }> } }>;
    deleteFileVersion(options: { fileId: string; fileName: string }): Promise<any>;
  }
}