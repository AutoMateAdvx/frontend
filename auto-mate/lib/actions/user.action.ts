"use server"

import { ID, Query } from "node-appwrite"
import { createAdminClient, createSessionClient } from "../appwrite"
import { appwriteConfig } from "../appwrite/config"
import { parseStringify } from "../utils"

import { cookies } from 'next/headers'

export const signInAccount = async ({ email }: { email: string }) => {
  try {
    const { databases } = await createAdminClient()

    // 1. 查询用户是否存在
    const userResponse = await databases.listDocuments(
      appwriteConfig.databaseId!,
      appwriteConfig.collections.users!,
      [Query.equal("email", email)]
    )

    if (userResponse.total === 0) {
      throw new Error("用户不存在")
    }

    const user = userResponse.documents[0]
    const accountId = await sendEmailOTP({ email })
    return parseStringify({
      code: 0,
      message: "验证码已发送，请查收邮件",
      accountId: accountId
    })

  } catch (error: any) {
    return parseStringify({
      code: -1,
      message: error.message || "登录失败"
    })
  }
}

export const createAccount = async ({ email, fullName
}: { email: string, fullName: string }) => {
  try {
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      throw new Error("该邮箱已被注册")
    }

    const accountId = await sendEmailOTP({ email })
    if (!accountId) throw new Error("failed to send an otp")

    // 2. 创建账户


    return parseStringify({
      code: 0,
      message: "验证码已发送，请查收邮件",
      accountId: accountId
    })

  } catch (error: any) {
    return parseStringify({
      code: -1,
      message: error.message || "注册失败"
    })
  }
}

const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminClient()
  const res = await databases.listDocuments(
    appwriteConfig.databaseId!,
    appwriteConfig.collections.users!,
    [Query.equal("email", email)] // 移除了多余的数组包裹
  )
  return res.total > 0 ? res.documents[0] : null
}

export async function saveAccount(accountId: string, email: string, fullName: string) {
  try {
    const { account, databases } = await createAdminClient()
    const userId = ID.unique()
    // 4. 保存用户到数据库
    await databases.createDocument(
      appwriteConfig.databaseId!,
      appwriteConfig.collections.users!,
      userId,
      {
        accountId,
        email,
        fullName,
        avatar: "https://tse3-mm.cn.bing.net/th/id/OIP-C.rPQTtL06uTRQSkiUvIGykwAAAA?w=209&h=209&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"
      }
    )
    return parseStringify({
      code: 0,
      message: "注册成功"
    })
  } catch (error) {
    return parseStringify({
      code: -1,
      message: "注册失败"
    })
  }
}

export const getCurrentUser = async () => {
  const { account,databases } = await createSessionClient()
  try {
    const result = await account.get()
    const res = await databases.listDocuments(appwriteConfig.databaseId!,appwriteConfig.collections.users!,
      [Query.equal("accountId",result.$id)]
    )
    
    return res.total>=0?res.documents[0]:null
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

const sendEmailOTP = async ({ email }: { email: string }) => {
  const { account } = await createAdminClient()
  try {
    const session = await account.createEmailToken(ID.unique(), email)
    return session.userId
  } catch (error) {
    handlerError(error, "fail to send emial otp")
  }
}

function handlerError(error: unknown, msg: string) {
  console.log(error, msg);
  throw error
}

export async function verifyOTP({ userId, otp }: { userId: string, otp: string }) {
  try {
    // 1. 基本验证
    if (!userId || !otp || otp.length !== 6) {
      return parseStringify({
        code: -1,
        message: "无效的验证码"
      })
    }

    // 2. 创建会话
    const { account } = await createAdminClient()
    const session = await account.createSession(userId, otp)

    // 3. 设置Cookie (Next.js 13+ 方式)
    const cookieStore = await cookies()
    cookieStore.set('appwrite-session', session.secret, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: false, // 根据环境设置secure
      maxAge: 30 * 24 * 60 * 60 // 30天有效期
    })

    // 4. 返回成功响应
    return parseStringify({
      code: 0,
      message: "验证成功",
      sessionId: session.$id,
      userId: session.userId
    })

  } catch (error: any) {
    // 统一错误响应格式
    return parseStringify({
      code: -1,
      message: error.message || "验证码无效或已过期"
    })
  }
}

/**
 * 上传文件到 Appwrite Storage
 * @param file - 文件数据 (Buffer 或 File)
 * @param bucketId - 存储桶 ID
 * @param permissions - 可选的文件权限
 * @returns 上传结果
 */
export const uploadFile = async ({
  file,
  bucketId = appwriteConfig.bucketId!,
  permissions = ['read("any")']
}: {
  file: File | Buffer | Blob,
  bucketId?: string,
  permissions?: string[]
}) => {
  try {
    // 1. 验证文件是否存在
    if (!file) {
      throw new Error("未提供文件");
    }

    // 2. 获取存储客户端
    const { storage } = await createAdminClient();

    // 3. 生成唯一文件ID
    const fileId = ID.unique();

    // 4. 上传文件
    const result = await storage.createFile(
      bucketId,
      fileId,
      file as File,
      permissions
    );

    // 5. 返回成功响应
    return parseStringify({
      code: 0,
      message: "文件上传成功",
      fileId: result.$id,
      bucketId: result.bucketId,
      fileUrl: `${appwriteConfig.endpoint}/storage/buckets/${bucketId}/files/${result.$id}/view?project=${appwriteConfig.projectId}`
    });

  } catch (error: any) {
    console.error('文件上传失败:', error);
    return parseStringify({
      code: -1,
      message: error.message || "文件上传失败"
    });
  }
};

/**
 * 删除文件
 * @param fileId - 文件ID
 * @param bucketId - 存储桶ID
 * @returns 删除结果
 */
export const deleteFile = async ({
  fileId,
  bucketId = appwriteConfig.bucketId!
}: {
  fileId: string,
  bucketId?: string
}) => {
  try {
    const { storage } = await createAdminClient();
    await storage.deleteFile(bucketId, fileId);
    
    return parseStringify({
      code: 0,
      message: "文件删除成功"
    });
  } catch (error: any) {
    return parseStringify({
      code: -1,
      message: error.message || "文件删除失败"
    });
  }
};