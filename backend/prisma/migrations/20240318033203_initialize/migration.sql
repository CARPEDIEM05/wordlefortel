-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Score" (
    "id" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Word" (
    "id" SERIAL NOT NULL,
    "todaysword" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Word_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tracker" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "guesses" INTEGER NOT NULL,
    "date" TEXT NOT NULL,

    CONSTRAINT "Tracker_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Score_id_key" ON "Score"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Word_todaysword_key" ON "Word"("todaysword");

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_id_fkey" FOREIGN KEY ("id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
