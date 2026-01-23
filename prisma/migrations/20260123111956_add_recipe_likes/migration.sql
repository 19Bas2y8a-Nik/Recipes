-- CreateTable
CREATE TABLE "recipe_likes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recipe_likes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "recipe_likes_recipeId_idx" ON "recipe_likes"("recipeId");

-- CreateIndex
CREATE UNIQUE INDEX "recipe_likes_userId_recipeId_key" ON "recipe_likes"("userId", "recipeId");

-- AddForeignKey
ALTER TABLE "recipe_likes" ADD CONSTRAINT "recipe_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipe_likes" ADD CONSTRAINT "recipe_likes_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recips"("id") ON DELETE CASCADE ON UPDATE CASCADE;
