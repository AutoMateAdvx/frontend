'use server'
import { Account, Avatars, Client, Databases, Storage } from "node-appwrite"
import { appwriteConfig } from "./config"
import { cookies } from 'next/headers'
import { parseStringify } from "../utils";


export const createSessionClient = async () => {
    const cookieStore = await cookies()
    const session = cookieStore.get('appwrite-session')

    if (!session) {
        throw new Error('No session found')
    }

    const client = new Client()
        .setEndpoint(appwriteConfig.endpoint!)
        .setProject(appwriteConfig.projectId!)
        .setSession(session.value)
    // return parseStringify({
    //     account: new Account(client),
    //     Databases: new Databases(client),

    // })
    return {
    account: new Account(client),
    databases: new Databases(client),
    storage: new Storage(client),
    // avatars: new Avatars(client),
  };
    // return {
    //     get account() {
    //         return new Account(client)
    //     },
    //     get databases() {
    //         return new Databases(client)
    //     },
    //     get storage() {
    //         return new Storage(client)
    //     },
    //     get avatars() {
    //         return new Avatars(client)
    //     }
    // }
};

export const createAdminClient = async () => {
    const client = new Client()
        .setEndpoint(appwriteConfig.endpoint!)
        .setProject(appwriteConfig.projectId!)
        .setKey(appwriteConfig.secretKey!);
    return {
        get account() {
            return new Account(client)
        },
        get databases() {
            return new Databases(client)
        },
        get storage() {
            return new Storage(client)
        },
        get avatars() {
            return new Avatars(client)
        }
    }
};