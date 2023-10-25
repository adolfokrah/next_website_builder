/*
  Warnings:

  - You are about to drop the `PageComponent` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `components` to the `Page` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PageComponent";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Page" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "components" TEXT NOT NULL
);
INSERT INTO "new_Page" ("id", "name") SELECT "id", "name" FROM "Page";
DROP TABLE "Page";
ALTER TABLE "new_Page" RENAME TO "Page";
CREATE UNIQUE INDEX "Page_name_key" ON "Page"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
