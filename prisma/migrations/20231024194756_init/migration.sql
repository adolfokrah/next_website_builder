/*
  Warnings:

  - You are about to drop the column `components` on the `Page` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "PageComponent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pageId" INTEGER NOT NULL,
    "components" TEXT NOT NULL,
    CONSTRAINT "PageComponent_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Page" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);
INSERT INTO "new_Page" ("id", "name") SELECT "id", "name" FROM "Page";
DROP TABLE "Page";
ALTER TABLE "new_Page" RENAME TO "Page";
CREATE UNIQUE INDEX "Page_name_key" ON "Page"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
