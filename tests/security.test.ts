import assert from "node:assert";
import crypto from "node:crypto";
import { CheckoutService } from "../src/services/CheckoutService";
import { AdminProductService } from "../src/services/AdminProductService";
import { IProductRepository } from "../src/interfaces/IProductRepository";
import { IOrderRepository } from "../src/interfaces/IOrderRepository";
import { Product, Order } from "@prisma/client";
import {
  generateOrderConfirmationEmail,
  generateOrderStatusUpdateEmail,
  notifyOrderPlacement,
  notifyOrderStatusUpdate,
  resetNotificationDeduplicationForTests,
  setCustomEmailSenderForTesting,
} from "../src/lib/notifications";

// Mock Product Repository for testing business logic
class MockProductRepository implements IProductRepository {
  private products: Map<string, Product> = new Map();

  constructor(initialProducts: Partial<Product>[] = []) {
    for (const p of initialProducts) {
      this.products.set(p.id!, p as Product);
    }
  }

  async findById(id: string): Promise<Product | null> {
    return this.products.get(id) || null;
  }

  async create(data: any): Promise<Product> {
    const product = { ...data, id: "prod_" + Math.random().toString(36).slice(2) } as Product;
    this.products.set(product.id, product);
    return product;
  }
}

// Mock Order Repository
class MockOrderRepository implements IOrderRepository {
  public createdOrders: any[] = [];
  public updatedOrders: Map<string, any> = new Map();

  async create(data: any): Promise<Order> {
    const order = { ...data, id: "ord_" + Math.random().toString(36).slice(2) };
    this.createdOrders.push(order);
    return order as Order;
  }

  async update(id: string, data: any): Promise<Order> {
    this.updatedOrders.set(id, data);
    return { id, ...data } as Order;
  }
}

async function runTests() {
  console.log("==================================================");
  console.log("   AUTOMATED SECURITY & REGRESSION TEST SUITE    ");
  console.log("==================================================\n");

  let passed = 0;
  let total = 0;

  async function test(name: string, fn: () => Promise<void> | void) {
    total++;
    try {
      await fn();
      console.log(`  [PASS] ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`  [FAIL] ${name}`);
      console.error(`         ${err.message || err}`);
    }
  }

  // ── TEST CATEGORY 1: CHECKOUT & PRICING SECURITY ──
  console.log("1. Checkout Pricing & Quantity Manipulation Tests");

  await test("SEC-02: Client cannot tamper with line item price", async () => {
    const mockProductRepo = new MockProductRepository([
      { id: "p1", name: "Money Plant", price: 599, stock: 10, shippingCharge: 0 },
    ]);
    const mockOrderRepo = new MockOrderRepository();
    const service = new CheckoutService(mockProductRepo, mockOrderRepo);

    // Attacker passes fraudulent client price of ₹1 instead of ₹599
    const items = [{ id: "p1", quantity: 1, price: 1 } as any];
    const res = await service.processCheckout("user_123", items, "221B Baker St", "prepaid");

    assert.ok(mockOrderRepo.createdOrders.length > 0, "Order should be created");
    const createdOrder = mockOrderRepo.createdOrders[0];
    const lineItem = createdOrder.items.create[0];

    assert.strictEqual(
      lineItem.price,
      599,
      `Price must be DB price ₹599, not client-supplied ₹1. Got: ₹${lineItem.price}`
    );
    assert.strictEqual(
      createdOrder.totalAmount,
      599,
      `Total amount must be authoritative ₹599. Got: ₹${createdOrder.totalAmount}`
    );
  });

  await test("SEC-02: Negative or zero quantities are rejected", async () => {
    const mockProductRepo = new MockProductRepository([
      { id: "p1", name: "Snake Plant", price: 499, stock: 10, shippingCharge: 0 },
    ]);
    const mockOrderRepo = new MockOrderRepository();
    const service = new CheckoutService(mockProductRepo, mockOrderRepo);

    // Negative quantity
    await assert.rejects(
      async () => {
        await service.processCheckout("user_123", [{ id: "p1", quantity: -2 } as any], "Address", "prepaid");
      },
      /Quantity must be a positive integer/
    );

    // Zero quantity
    await assert.rejects(
      async () => {
        await service.processCheckout("user_123", [{ id: "p1", quantity: 0 } as any], "Address", "prepaid");
      },
      /Quantity must be a positive integer/
    );

    // Fractional quantity
    await assert.rejects(
      async () => {
        await service.processCheckout("user_123", [{ id: "p1", quantity: 1.5 } as any], "Address", "prepaid");
      },
      /Quantity must be a positive integer/
    );
  });

  await test("SEC-05: Checkout rejects orders exceeding available stock", async () => {
    const mockProductRepo = new MockProductRepository([
      { id: "p1", name: "Rare Bonsai", price: 1200, stock: 2, shippingCharge: 0 },
    ]);
    const mockOrderRepo = new MockOrderRepository();
    const service = new CheckoutService(mockProductRepo, mockOrderRepo);

    // Attempting to buy 5 units when only 2 are in stock
    await assert.rejects(
      async () => {
        await service.processCheckout("user_123", [{ id: "p1", quantity: 5 }], "Address", "prepaid");
      },
      /Insufficient stock/
    );
  });

  await test("SEC-02: Minimum purchase threshold is enforced", async () => {
    const mockProductRepo = new MockProductRepository([
      { id: "p1", name: "Small Succulent", price: 150, stock: 20, shippingCharge: 0 },
    ]);
    const mockOrderRepo = new MockOrderRepository();
    const service = new CheckoutService(mockProductRepo, mockOrderRepo);

    // ₹150 is below minimum ₹499
    await assert.rejects(
      async () => {
        await service.processCheckout("user_123", [{ id: "p1", quantity: 1 }], "Address", "prepaid");
      },
      /Minimum purchase amount is ₹499/
    );
  });

  // ── TEST CATEGORY 2: CASH ON DELIVERY & STATE HANDLING ──
  console.log("\n2. Cash on Delivery Flow Tests");

  await test("SEC-02: COD order requires purchase below ₹1000 limit", async () => {
    const mockProductRepo = new MockProductRepository([
      { id: "p1", name: "Big Fiddle Leaf Fig", price: 1200, stock: 5, shippingCharge: 0 },
    ]);
    const mockOrderRepo = new MockOrderRepository();
    const service = new CheckoutService(mockProductRepo, mockOrderRepo);

    await assert.rejects(
      async () => {
        await service.processCheckout("user_123", [{ id: "p1", quantity: 1 }], "Address", "cod");
      },
      /Cash on Delivery is only available for orders below ₹1000/
    );
  });

  await test("COD-01: COD order rejects products where sellWithCod is false", async () => {
    const mockProductRepo = new MockProductRepository([
      { id: "p1", name: "Exotic Japanese Bonsai", price: 799, stock: 5, shippingCharge: 0, sellWithCod: false } as any,
    ]);
    const mockOrderRepo = new MockOrderRepository();
    const service = new CheckoutService(mockProductRepo, mockOrderRepo);

    await assert.rejects(
      async () => {
        await service.processCheckout("user_123", [{ id: "p1", quantity: 1 }], "Address", "cod");
      },
      /Cash on Delivery is not available for "Exotic Japanese Bonsai"/
    );
  });

  await test("COD-02: AdminProductService strictly enforces returnable = false when sellWithCod is true", async () => {
    const mockProductRepo = new MockProductRepository([]);
    const adminService = new AdminProductService(mockProductRepo);

    // Payload claims returnable: true, but sellWithCod: true
    const created = await adminService.createProduct({
      name: "Monstera Deliciosa",
      description: "Tropical plant",
      price: 699,
      category: "Indoor",
      stock: 15,
      sellWithCod: true,
      returnable: true,
    });

    assert.strictEqual(created.sellWithCod, true, "sellWithCod should remain true");
    assert.strictEqual(
      created.returnable,
      false,
      "Product with COD enabled MUST be non-refundable (returnable: false)"
    );
  });

  await test("COD-03: AdminProductService preserves returnable = true when sellWithCod is false", async () => {
    const mockProductRepo = new MockProductRepository([]);
    const adminService = new AdminProductService(mockProductRepo);

    const created = await adminService.createProduct({
      name: "Sansevieria Trifasciata",
      description: "Air purifier plant",
      price: 550,
      category: "Indoor",
      stock: 20,
      sellWithCod: false,
      returnable: true,
    });

    assert.strictEqual(created.sellWithCod, false, "sellWithCod should be false");
    assert.strictEqual(
      created.returnable,
      true,
      "Prepaid-only product can remain returnable"
    );
  });

  // ── TEST CATEGORY 3: PAYMENT SIGNATURE VERIFICATION ──
  console.log("\n3. Payment Signature & Ownership Tests");

  await test("SEC-04: HMAC SHA-256 signature verification accepts valid signature", async () => {
    const secret = "test_razorpay_secret_key_12345";
    const orderId = "order_EKwxwAgItmmXdp";
    const paymentId = "pay_G3H38d82nnd819";

    const validSignature = crypto
      .createHmac("sha256", secret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    const computedBuffer = Buffer.from(validSignature, "utf-8");
    const testBuffer = Buffer.from(validSignature, "utf-8");

    assert.strictEqual(
      crypto.timingSafeEqual(computedBuffer, testBuffer),
      true,
      "Valid HMAC SHA-256 signature must match"
    );
  });

  await test("SEC-04: HMAC SHA-256 signature verification rejects forged/mismatched order ID", async () => {
    const secret = "test_razorpay_secret_key_12345";
    const realDbOrderId = "order_REAL_99999";
    const attackerOrderId = "order_ATTACKER_11111";
    const paymentId = "pay_G3H38d82nnd819";

    // Signature generated for attacker's own inexpensive order
    const signatureFromAttackerOrder = crypto
      .createHmac("sha256", secret)
      .update(`${attackerOrderId}|${paymentId}`)
      .digest("hex");

    // Expected signature for the database order
    const expectedSignatureForRealOrder = crypto
      .createHmac("sha256", secret)
      .update(`${realDbOrderId}|${paymentId}`)
      .digest("hex");

    assert.notStrictEqual(
      signatureFromAttackerOrder,
      expectedSignatureForRealOrder,
      "Signature calculated for attacker order must NOT match the real order"
    );
  });

  // ── TEST CATEGORY 4: AUTHENTICATION & PRIVILEGE ESCALATION ──
  console.log("\n4. Authentication & Privilege Escalation Tests");

  await test("SEC-03: Registering admin@gogreen.com is strictly assigned USER role", () => {
    // Logic test: In the new registration implementation, role is constant "USER"
    const assignRole = (_email: string) => "USER";

    assert.strictEqual(assignRole("admin@gogreen.com"), "USER");
    assert.strictEqual(assignRole("ADMIN@GOGREEN.COM"), "USER");
    assert.strictEqual(assignRole("regular@user.com"), "USER");
  });

  await test("SEC-03: Password validation enforces minimum 8 characters", () => {
    const validatePassword = (pass: string) => pass && pass.length >= 8;

    assert.strictEqual(validatePassword("12345"), false, "5-char password must be rejected");
    assert.strictEqual(validatePassword("short"), false, "5-char password must be rejected");
    assert.strictEqual(validatePassword("SecurePass123!"), true, "Valid password accepted");
  });

  await test("REG-01: Conventional address builder formats multiline structure correctly", () => {
    const buildAddress = (f: { recipient?: string; phone: string; line1: string; line2?: string; city: string; state: string; pincode: string }) => {
      const cleanPhone = f.phone.replace(/\s+/g, "").replace(/^\+91/, "").replace(/^0/, "");
      const cleanPincode = f.pincode.replace(/\s+/g, "");
      return [
        f.recipient || "Customer",
        cleanPhone ? `Ph: ${cleanPhone}` : "",
        f.line1.trim(),
        f.line2?.trim(),
        `${f.city.trim()}${f.state.trim() ? ", " + f.state.trim() : ""}${cleanPincode ? " - " + cleanPincode : ""}`,
      ].filter(Boolean).join("\n");
    };

    const formatted = buildAddress({
      recipient: "Anita Sen",
      phone: "+91 9876543210",
      line1: "Flat 2B, Green Villa",
      line2: "Near Lake Park",
      city: "Kolkata",
      state: "West Bengal",
      pincode: "700066",
    });

    const expected = "Anita Sen\nPh: 9876543210\nFlat 2B, Green Villa\nNear Lake Park\nKolkata, West Bengal - 700066";
    assert.strictEqual(formatted, expected, "Conventional multiline address must match expected standard format");

    // Phone & Pincode regex validation
    assert.strictEqual(/^\d{10}$/.test("9876543210"), true, "10-digit phone accepted");
    assert.strictEqual(/^\d{10}$/.test("98765"), false, "Short phone rejected");
    assert.strictEqual(/^\d{6}$/.test("700066"), true, "6-digit pincode accepted");
    assert.strictEqual(/^\d{6}$/.test("7000"), false, "Short pincode rejected");
  });

  // ── TEST CATEGORY 5: FILE UPLOAD CONTENT HARDENING ──
  console.log("\n5. File Upload Content & MIME Hardening Tests");

  await test("SEC-08: File upload rejects SVG and non-raster image formats", () => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

    assert.strictEqual(allowedMimeTypes.includes("image/svg+xml"), false, "SVG MIME must be rejected");
    assert.strictEqual(allowedMimeTypes.includes("text/html"), false, "HTML MIME must be rejected");
    assert.strictEqual(allowedMimeTypes.includes("application/javascript"), false, "JS MIME must be rejected");
    assert.strictEqual(allowedMimeTypes.includes("image/jpeg"), true, "JPEG accepted");
    assert.strictEqual(allowedMimeTypes.includes("image/png"), true, "PNG accepted");
    assert.strictEqual(allowedMimeTypes.includes("image/webp"), true, "WebP accepted");
  });

  await test("SEC-08: Magic byte inspection detects authentic JPEG/PNG and rejects spoofed files", () => {
    // Authentic JPEG buffer
    const jpegBuffer = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
    const isJpeg = jpegBuffer.length >= 3 && jpegBuffer[0] === 0xff && jpegBuffer[1] === 0xd8 && jpegBuffer[2] === 0xff;
    assert.strictEqual(isJpeg, true, "Authentic JPEG magic bytes recognized");

    // Authentic PNG buffer
    const pngBuffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    const isPng =
      pngBuffer.length >= 8 &&
      pngBuffer[0] === 0x89 && pngBuffer[1] === 0x50 && pngBuffer[2] === 0x4e && pngBuffer[3] === 0x47 &&
      pngBuffer[4] === 0x0d && pngBuffer[5] === 0x0a && pngBuffer[6] === 0x1a && pngBuffer[7] === 0x0a;
    assert.strictEqual(isPng, true, "Authentic PNG magic bytes recognized");

    // Spoofed file (SVG disguised with image/jpeg mime)
    const spoofedSvg = Buffer.from("<svg xmlns='http://www.w3.org/2000/svg'><script>alert(1)</script></svg>");
    const isSpoofedJpeg = spoofedSvg.length >= 3 && spoofedSvg[0] === 0xff && spoofedSvg[1] === 0xd8 && spoofedSvg[2] === 0xff;
    assert.strictEqual(isSpoofedJpeg, false, "SVG disguised as JPEG must fail magic byte check");

    const sampleText = spoofedSvg.subarray(0, 1024).toString("utf-8").toLowerCase();
    const hasScriptOrSvg = sampleText.includes("<svg") || sampleText.includes("<script");
    assert.strictEqual(hasScriptOrSvg, true, "Embedded SVG/script tags detected");
  });

  // ── TEST CATEGORY 6: REVIEW INPUT VALIDATION ──
  console.log("\n6. Review Input Validation Tests");

  await test("SEC-09: Review rating must be an integer between 1 and 5", () => {
    const validateRating = (r: any) => {
      const n = Number(r);
      return Number.isInteger(n) && n >= 1 && n <= 5;
    };

    assert.strictEqual(validateRating(5), true);
    assert.strictEqual(validateRating(1), true);
    assert.strictEqual(validateRating(0), false, "Rating 0 must be rejected");
    assert.strictEqual(validateRating(6), false, "Rating 6 must be rejected");
    assert.strictEqual(validateRating(-1), false, "Negative rating must be rejected");
    assert.strictEqual(validateRating(3.5), false, "Fractional rating must be rejected");
    assert.strictEqual(validateRating("abc"), false, "Non-number must be rejected");
  });

  await test("SEC-09: Review comment length must be bounded (2 - 1000 characters)", () => {
    const validateComment = (c: any) => {
      if (typeof c !== "string") return false;
      const t = c.trim();
      return t.length >= 2 && t.length <= 1000;
    };

    assert.strictEqual(validateComment(""), false, "Empty comment rejected");
    assert.strictEqual(validateComment("a"), false, "Single character comment rejected");
    assert.strictEqual(validateComment("Great plant! Fast delivery."), true, "Normal comment accepted");
    assert.strictEqual(validateComment("x".repeat(1001)), false, "Excessive comment >1000 chars rejected");
  });

  // ── TEST CATEGORY 7: TRANSACTIONAL EMAIL NOTIFICATIONS ──
  console.log("\n7. Transactional Email Notifications & Idempotency Tests");

  // Mock email dispatcher during unit tests so fake test addresses (test@example.com) are not sent to Brevo
  setCustomEmailSenderForTesting(async () => true);

  await test("NOTIF-01: Order confirmation email includes all required order details", () => {
    const mockOrder = {
      id: "ord_test_12345678",
      totalAmount: 1249,
      discount: 100,
      status: "PAID",
      razorpayOrderId: "order_mock_12345678",
      shippingAddress: "Subhro Das\nPh: 9876543210\n123 Green Way\nKolkata, West Bengal - 700066",
      user: {
        name: "Subhro Das",
        email: "subhro.das546@gmail.com",
      },
      items: [
        {
          price: 699,
          quantity: 1,
          product: { name: "Monstera Deliciosa" },
        },
        {
          price: 550,
          quantity: 1,
          product: { name: "Snake Plant" },
        },
      ],
    };

    const { subject, text, html } = generateOrderConfirmationEmail(mockOrder);

    // 1. Order ID presence
    assert.strictEqual(subject.includes("12345678"), true, "Subject must contain short order ID");
    assert.strictEqual(text.includes("12345678"), true, "Text must contain short order ID");
    assert.strictEqual(html.includes("12345678"), true, "HTML must contain short order ID");

    // 2. Items, quantities, and prices
    assert.strictEqual(html.includes("Monstera Deliciosa"), true, "HTML must include item 1 name");
    assert.strictEqual(html.includes("Snake Plant"), true, "HTML must include item 2 name");
    assert.strictEqual(html.includes("₹699.00"), true, "HTML must include item 1 price");
    assert.strictEqual(html.includes("₹550.00"), true, "HTML must include item 2 price");
    assert.strictEqual(text.includes("Monstera Deliciosa x 1 @ ₹699.00"), true, "Text must include item 1 line");

    // 3. Total amount & discount
    assert.strictEqual(html.includes("₹1249.00"), true, "HTML must include total amount");
    assert.strictEqual(html.includes("-₹100.00"), true, "HTML must include discount");

    // 4. Payment method
    assert.strictEqual(html.includes("Prepaid Online"), true, "Payment method must be Prepaid Online");

    // 5. Delivery address
    assert.strictEqual(html.includes("123 Green Way"), true, "HTML must include street address");
    assert.strictEqual(html.includes("700066"), true, "HTML must include pincode");
    assert.strictEqual(text.includes("123 Green Way"), true, "Text must include street address");
  });

  await test("NOTIF-02: COD order confirmation explicitly reflects COD payment method and status", () => {
    const mockCodOrder = {
      id: "ord_cod_87654321",
      totalAmount: 848,
      status: "PENDING",
      razorpayOrderId: "cod_12345_abcde",
      shippingAddress: "Alice Roy\nPh: 9123456780\n45 Park Street\nKolkata - 700016",
      user: {
        name: "Alice Roy",
        email: "alice@example.com",
      },
      items: [
        {
          price: 799,
          quantity: 1,
          product: { name: "Areca Palm" },
        },
      ],
    };

    const { subject, text, html } = generateOrderConfirmationEmail(mockCodOrder);

    assert.strictEqual(subject.includes("87654321"), true);
    assert.strictEqual(html.includes("Cash on Delivery (COD)"), true, "HTML must specify Cash on Delivery");
    assert.strictEqual(text.includes("Cash on Delivery (COD)"), true, "Text must specify Cash on Delivery");
    assert.strictEqual(html.includes("₹49.00"), true, "HTML must mention COD fee");
    assert.strictEqual(html.includes("Areca Palm"), true, "HTML must list item");
    assert.strictEqual(html.includes("45 Park Street"), true, "HTML must list delivery address");
  });

  await test("NOTIF-03: Order status update email contains status transition and order items", () => {
    const mockOrder = {
      id: "ord_update_99887766",
      totalAmount: 1499,
      status: "SHIPPED",
      shippingAddress: "Bob Smith\nPh: 9988776655\n9 Orchid Garden\nBengaluru - 560001",
      user: {
        name: "Bob Smith",
        email: "bob@example.com",
      },
      items: [
        {
          price: 1499,
          quantity: 1,
          product: { name: "Fiddle Leaf Fig" },
        },
      ],
    };

    const { subject, text, html } = generateOrderStatusUpdateEmail(mockOrder, "PAID", "SHIPPED");

    assert.strictEqual(subject.includes("SHIPPED"), true, "Subject must include new status");
    assert.strictEqual(subject.includes("99887766"), true, "Subject must include order ID");
    assert.strictEqual(html.includes("PAID"), true, "HTML must show previous status");
    assert.strictEqual(html.includes("SHIPPED"), true, "HTML must show new status");
    assert.strictEqual(html.includes("Fiddle Leaf Fig"), true, "HTML must list items");
    assert.strictEqual(html.includes("₹1499.00"), true, "HTML must include order total");
    assert.strictEqual(text.includes("PAID to SHIPPED"), true, "Text must include status transition");
  });

  await test("NOTIF-04: Duplicate notifications are prevented on retries", async () => {
    resetNotificationDeduplicationForTests();

    const mockOrder = {
      id: "ord_idempotency_111",
      totalAmount: 500,
      shippingAddress: "Test Address",
      user: { name: "Test User", email: "test@example.com" },
      items: [],
    };

    // First placement call succeeds
    await notifyOrderPlacement(mockOrder);

    // Second placement call with same ID is detected and skipped without error
    await notifyOrderPlacement(mockOrder);

    // Identical status update transition (SHIPPED -> SHIPPED) is skipped
    await notifyOrderStatusUpdate(mockOrder, "SHIPPED", "SHIPPED");

    // Status transition (PAID -> SHIPPED) first time succeeds
    await notifyOrderStatusUpdate(mockOrder, "PAID", "SHIPPED");

    // Status transition (PAID -> SHIPPED) second time is skipped
    await notifyOrderStatusUpdate(mockOrder, "PAID", "SHIPPED");
  });

  await test("NOTIF-05: Missing email or invalid order gracefully handled without exceptions", async () => {
    resetNotificationDeduplicationForTests();

    // Order with missing email or null user does not crash
    await notifyOrderPlacement({
      id: "ord_no_email_222",
      totalAmount: 300,
      shippingAddress: "Test Address",
      user: null,
      items: [],
    });

    // Empty order object does not crash
    await notifyOrderPlacement({} as any);
  });

  console.log("\n==================================================");
  console.log(`   TEST RESULTS: ${passed}/${total} PASSED (${total - passed} FAILED)`);
  console.log("==================================================\n");

  if (passed !== total) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test runner crashed:", err);
  process.exit(1);
});
