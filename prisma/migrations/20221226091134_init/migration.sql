-- CreateTable
CREATE TABLE "comments" (
    "comment_id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "time_stamp" TIMESTAMP(6) NOT NULL,
    "text" TEXT NOT NULL,
    "upvotes_count" INTEGER DEFAULT 0,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("comment_id")
);

-- CreateTable
CREATE TABLE "posts" (
    "post_id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "text" TEXT DEFAULT '',
    "img_path" VARCHAR(255) DEFAULT '',
    "yt_path" VARCHAR(255) DEFAULT '',
    "upvotes_count" INTEGER DEFAULT 0,
    "user_id" INTEGER NOT NULL,
    "time_stamp" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("post_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "user_name" VARCHAR(24) NOT NULL,
    "avatar_path" VARCHAR(255) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "fk_post_id" FOREIGN KEY ("post_id") REFERENCES "posts"("post_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "fk_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "fk_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;
