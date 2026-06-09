-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "txRef" TEXT NOT NULL,
    "transactionId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "paymentType" TEXT,
    "demo" BOOLEAN NOT NULL DEFAULT false,
    "amount" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'ZAR',
    "productPrice" REAL NOT NULL,
    "gatewayFee" REAL NOT NULL DEFAULT 0,
    "deliveryOption" TEXT NOT NULL DEFAULT 'normal',
    "deliveryFee" REAL NOT NULL DEFAULT 0,
    "ownerShare" REAL NOT NULL DEFAULT 0,
    "partnerShare" REAL NOT NULL DEFAULT 0,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT,
    "customerAddress" TEXT NOT NULL,
    "notificationsSent" BOOLEAN NOT NULL DEFAULT false,
    "notificationLog" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "paidAt" DATETIME
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_txRef_key" ON "Order"("txRef");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "Order_customerEmail_idx" ON "Order"("customerEmail");

-- CreateIndex
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");
