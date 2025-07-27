declare module 'backblaze-b2' {
  interface B2 {
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
  
  function B2(options: { applicationKeyId: string; applicationKey: string }): B2;
  export = B2;
}