"use client"
import React, { useCallback, useState } from 'react'
import { useDropzone } from "react-dropzone"
import { Button } from './ui/button'
import { cn, getFileType } from '@/lib/utils'
import { Upload, X, FileText, ImageIcon, FileArchive, FileVideo2, FileAudio2 } from 'lucide-react'
import { Card, CardContent, CardFooter } from './ui/card'
import { toast } from 'sonner'
import { createSessionClient } from '@/lib/appwrite/index' // 假设您已经配置了 Appwrite 客户端
import { Account, Avatars, Client, Databases, ID, Storage } from "node-appwrite"
import { appwriteConfig } from '@/lib/appwrite/config'
import { uploadFile } from '@/lib/actions/user.action'

interface FileUploaderProps {
    ownId: string
    accountId: string
    className?: string
    maxSize?: number // MB
    allowedTypes?: string[]
    onUploadSuccess?: (fileIds: string[]) => void
    bucketId?: string // Appwrite 存储桶 ID
}

function FileUploader({
    ownId,
    accountId,
    className,
    maxSize = 1000, // 默认10MB
    allowedTypes = ['image/*', 'application/pdf', 'text/plain'],
    onUploadSuccess,
    bucketId = appwriteConfig.bucketId // 默认存储桶
}: FileUploaderProps) {
    const [files, setFiles] = useState<File[]>([])
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})

    const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
        // 处理被拒绝的文件
        if (rejectedFiles.length > 0) {
            rejectedFiles.forEach(({ file, errors }) => {
                errors.forEach((err: { code: string; message: any }) => {
                    if (err.code === 'file-too-large') {
                        toast.error(`文件 ${file.name} 超过大小限制 (${maxSize}MB)`)
                    } else if (err.code === 'file-invalid-type') {
                        toast.error(`不支持的文件类型: ${file.name}`)
                    } else {
                        toast.error(`文件 ${file.name} 无效: ${err.message}`)
                    }
                })
            })
        }

        // 处理接受的文件
        if (acceptedFiles.length > 0) {
            const newFiles = [...files, ...acceptedFiles]
            setFiles(newFiles)
            toast.success(`已添加 ${acceptedFiles.length} 个文件`)
        }
    }, [files, maxSize])

    const removeFile = (index: number) => {
        const newFiles = [...files]
        newFiles.splice(index, 1)
        setFiles(newFiles)
        toast.info('文件已移除')
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxSize: maxSize * 1024 * 1024, // 转换为字节
        multiple: true
    })

    const getFileIcon = (file: File) => {
        const type = getFileType(file.name)
        const className = "w-5 h-5 mr-2"

        switch (type) {
            case 'image':
                return <ImageIcon className={cn(className, "text-blue-500")} />
            case 'video':
                return <FileVideo2 className={cn(className, "text-purple-500")} />
            case 'audio':
                return <FileAudio2 className={cn(className, "text-green-500")} />
            case 'document':
                return <FileText className={cn(className, "text-yellow-500")} />
            case 'archive':
                return <FileArchive className={cn(className, "text-orange-500")} />
            default:
                return <FileText className={cn(className, "text-gray-500")} />
        }
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const uploadFiles = async () => {
        if (files.length === 0) return

        setIsUploading(true)
        const toastId = toast.loading('开始上传文件...')
        const uploadedFileIds: string[] = []

        try {
            for (const file of files) {
                try {
                    const progressCallback = (progress: { $id: string; progress: number }) => {
                        setUploadProgress(prev => ({
                            ...prev,
                            [file.name]: progress.progress
                        }))
                    }

                    toast.loading(`正在上传 ${file.name}...`, { id: toastId })
                    const res = await uploadFile({
                        file,
                        bucketId,
                    })
                    console.log(res);
                    
                    // const session  = await createSessionClient()

                    // // 使用 Appwrite 存储 API 上传文件
                    // const result = await session.storage.createFile(
                    //     bucketId!,
                    //     ID.unique(), // 生成唯一文件ID
                    //     file,
                    // )

                    uploadedFileIds.push(res.fileId)
                    toast.success(`${file.name} 上传成功`, { id: toastId })
                } catch (error) {
                    console.error(`上传 ${file.name} 失败:`, error)
                    toast.error(`${file.name} 上传失败`, { id: toastId })
                }
            }

            // 所有文件上传完成
            toast.success(`成功上传 ${uploadedFileIds.length}/${files.length} 个文件`)
            onUploadSuccess?.(uploadedFileIds)
            setFiles([])
            setUploadProgress({})
        } catch (error) {
            console.error('上传过程中出错:', error)
            toast.error('上传过程中出现错误')
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className={cn("space-y-4", className)}>
            <div
                {...getRootProps()}
                className={cn(
                    "cursor-pointer border-2 border-dashed rounded-lg transition-colors",
                    isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/30 hover:border-muted-foreground/50"
                )}
            >
                <Card className="bg-transparent border-none shadow-none">
                    <CardContent className="flex flex-col items-center justify-center p-6">
                        <input {...getInputProps()} />
                        <Button
                            variant="ghost"
                            type="button"
                            className="mb-2"
                        >
                            <Upload className="w-6 h-6 mr-2" />
                            选择文件
                        </Button>
                        <p className="text-sm text-muted-foreground text-center">
                            {isDragActive ?
                                "松开鼠标上传文件" :
                                `拖放文件到此处，或点击选择文件 (最大 ${maxSize}MB)`
                            }
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* 文件预览列表 */}
            {files.length > 0 && (
                <Card>
                    <CardContent className="p-4">
                        <div className="space-y-2">
                            <h3 className="font-medium">已选文件 ({files.length})</h3>
                            <ul className="divide-y divide-border">
                                {files.map((file, index) => (
                                    <li key={index} className="py-3 flex justify-between items-center">
                                        <div className="flex items-center">
                                            {getFileIcon(file)}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm truncate">{file.name}</p>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-xs text-muted-foreground">
                                                        {formatFileSize(file.size)} • {getFileType(file.name)}
                                                    </p>
                                                    {uploadProgress[file.name] && (
                                                        <span className="text-xs text-primary">
                                                            {uploadProgress[file.name]}%
                                                        </span>
                                                    )}
                                                </div>
                                                {uploadProgress[file.name] && (
                                                    <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                                                        <div
                                                            className="bg-blue-500 h-1 rounded-full"
                                                            style={{ width: `${uploadProgress[file.name]}%` }}
                                                        ></div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                removeFile(index)
                                            }}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between p-4 border-t">
                        <Button
                            variant="outline"
                            onClick={(e) => {
                                e.stopPropagation()
                                setFiles([])
                                setUploadProgress({})
                            }}
                        >
                            清空全部
                        </Button>
                        <Button
                            disabled={isUploading || files.length === 0}
                            onClick={uploadFiles}
                        >
                            {isUploading ? "上传中..." : "上传文件"}
                        </Button>
                    </CardFooter>
                </Card>
            )}
        </div>
    )
}

export default FileUploader