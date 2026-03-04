// prisma.config.ts
import "dotenv/config";
const databaseUrl= process.env.DATABASE_URL;

if(!databaseUrl){
  throw new Error("DATABASE_URL is not set in your .env file");
}

const prismaConfig={
  schema:"./prisam/schema.prisma",
  migrations:{
    path:"./prisam/migrations",
  },
  datasource:{
    url:databaseUrl,
  },
};

export default prismaConfig;