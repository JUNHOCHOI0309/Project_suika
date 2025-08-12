declare namespace NodeJS {
        interface ProcessEnv {
                PORT?:string;
                MONGODB_URI: string;
                FRONTEND_ORIGIN?:string;
        }
}