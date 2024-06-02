-- CreateTable
CREATE TABLE "SubScription" (
    "id" TEXT NOT NULL,
    "username" TEXT,
    "email" TEXT,
    "subscriptiontype" TEXT,
    "Credits" INTEGER,
    "paymentmethod" TEXT,
    "plantype" TEXT,

    CONSTRAINT "SubScription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payments" (
    "id" TEXT NOT NULL,
    "username" TEXT,
    "email" TEXT,
    "recieveDate" TIMESTAMP(3),
    "Credits" INTEGER,
    "plantype" TEXT,
    "amount" INTEGER,

    CONSTRAINT "Payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cards" (
    "id" TEXT NOT NULL,
    "username" TEXT,
    "email" TEXT,
    "Holder" TEXT,
    "recieveDate" TIMESTAMP(3),
    "Address" TEXT,
    "Country" TEXT,
    "State" TEXT,
    "cvv" TEXT,
    "expiration" TEXT,

    CONSTRAINT "Cards_pkey" PRIMARY KEY ("id")
);
