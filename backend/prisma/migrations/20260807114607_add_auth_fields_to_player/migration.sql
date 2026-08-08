-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'JOGADOR');

-- AlterTable
ALTER TABLE "players" ADD COLUMN     "password" TEXT,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'JOGADOR';
