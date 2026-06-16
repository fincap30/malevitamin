-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "txRef" TEXT NOT NULL,
    "transactionId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "paymentType" TEXT,
    "demo" BOOLEAN NOT NULL DEFAULT false,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'ZAR',
    "productPrice" DOUBLE PRECISION NOT NULL,
    "gatewayFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "deliveryOption" TEXT NOT NULL DEFAULT 'normal',
    "deliveryFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ownerShare" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "partnerShare" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT,
    "customerAddress" TEXT NOT NULL,
    "notificationsSent" BOOLEAN NOT NULL DEFAULT false,
    "notificationLog" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "paidAt" TIMESTAMP(3),

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WhatsAppMessage" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "fromName" TEXT,
    "message" TEXT NOT NULL,
    "messageId" TEXT,
    "intent" TEXT,
    "direction" TEXT NOT NULL DEFAULT 'inbound',
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WhatsAppMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_txRef_key" ON "Order"("txRef");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE INDEX "Order_customerEmail_idx" ON "Order"("customerEmail");

-- CreateIndex
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");

-- CreateIndex
CREATE INDEX "WhatsAppMessage_phone_idx" ON "WhatsAppMessage"("phone");

-- CreateIndex
CREATE INDEX "WhatsAppMessage_createdAt_idx" ON "WhatsAppMessage"("createdAt");

-- CreateIndex
CREATE INDEX "WhatsAppMessage_messageId_idx" ON "WhatsAppMessage"("messageId");
