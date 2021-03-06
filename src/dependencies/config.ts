import dotenv from 'dotenv'
import Debug from 'debug'
dotenv.config({ path: `.env${process.env.NODE_ENV !== undefined ? '.' + process.env.NODE_ENV : ''}` })

export const ENVIRONMENT = process.env.NODE_ENV as string || 'development'

export const HOST = process.env.HOST as string || '127.0.0.1'
export const PORT = parseInt(process.env.PORT as string) || 9999

export const DEBUG = process.env.DEBUG as string || ''

export const DB_HOST = process.env.DB_HOST ?? '127.0.0.1'
export const DB_PORT = process.env.DB_PORT !== undefined ? parseInt(process.env.DB_PORT) : 3306
export const DB_USER = process.env.DB_USER ?? 'root'
export const DB_PASSWORD = process.env.DB_PASSWORD ?? ''
export const DB_DATABASE = process.env.DB_DATABASE ?? 'demo-database'
export const jwksUri = process.env.jwksUri ?? ''
export const issuer = process.env.issuer ?? ''
Debug.enable(DEBUG)
