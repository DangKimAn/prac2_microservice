-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "product";

-- CreateTable
CREATE TABLE "product"."categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product"."products" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "image_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "category_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "product"."categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "product"."categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "product"."products"("slug");

-- CreateIndex
CREATE INDEX "products_category_id_idx" ON "product"."products"("category_id");

-- CreateIndex
CREATE INDEX "products_is_active_idx" ON "product"."products"("is_active");

-- AddForeignKey
ALTER TABLE "product"."products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "product"."categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

