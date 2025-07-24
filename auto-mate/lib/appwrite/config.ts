// src/config/appwrite.ts
export const appwriteConfig = {
  endpoint: process.env.VITE_APPWRITE_ENDPOINT,
  projectId: process.env.VITE_APPWRITE_PROJECT_ID,
  databaseId: process.env.VITE_APPWRITE_DATABASE_ID,
  bucketId: process.env.VITE_APPWRITE_BUCKET_ID,
  secretKey: process.env.VITE_APPWRITE_SECRETKEY,
  collections: {
    users: process.env.VITE_APPWRITE_USERS_COLLECTION_ID,
    files: process.env.VITE_APPWRITE_FILES_COLLECTION_ID
  }
}

// 类型定义（推荐）
export type AppwriteConfig = {
  endpoint: string
  projectId: string
  databaseId: string
  bucketId: string
  collections: {
    users: string
    files: string
  }
}