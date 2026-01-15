-- DropIndex
DROP INDEX "Order_userId_key";

-- CreateIndex
CREATE INDEX "Cart_userId_idx" ON "Cart"("userId");

-- CreateIndex
CREATE INDEX "Order_userId_idx" ON "Order"("userId");
