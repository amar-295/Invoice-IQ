# Invoice IQ - Technical Documentation

## Table of Contents

1. [Introduction](#introduction)
2. [Problem Statement](#problem-statement)
3. [Solution Overview](#solution-overview)
4. [Core Features](#core-features)
5. [System Architecture](#system-architecture)
6. [Database Design](#database-design)
7. [Data Flow](#data-flow)
8. [API Design](#api-design)
9. [UI/UX Overview](#ui-ux-overview)
10. [Performance & Scalability](#performance--scalability)
11. [Future Enhancements](#future-enhancements)
12. [Conclusion](#conclusion)

---

## Introduction

**Invoice IQ** is an AI-powered purchase intelligence platform designed to help users track, manage, and analyze purchases made from multiple suppliers. Built with modern cloud-native technologies, Invoice IQ transforms unstructured invoice data into actionable business intelligence through a seamless combination of OCR, machine learning, and intelligent analytics.

### Product Tier
- SaaS (Software as a Service)
- B2B Focus
- Mobile-first responsive design
- Real-time analytics and insights

### Target Users
- Kirana store owners
- Retail shop operators (electronics, cosmetics, etc.)
- Restaurant and small business managers
- Household expense trackers
- Any business requiring purchase order visibility

---

## Problem Statement

### Current Market Pain Points

Users managing purchases from multiple suppliers face critical challenges:

#### 1. **Data Loss & Fragmentation**
- Invoice data scattered across paper documents, WhatsApp messages, and memory
- No centralized record-keeping system
- High risk of data loss

#### 2. **Lack of Historical Visibility**
- Unable to track pricing changes over time
- Cannot identify seasonal pricing trends
- No audit trail for financial reconciliation

#### 3. **Inefficient Supplier Comparison**
- Manual analysis required to compare supplier pricing
- Time-consuming spreadsheet maintenance
- Difficult to identify best-value suppliers

#### 4. **Poor Financial Intelligence**
- No clear visibility into spending patterns
- Cannot forecast future expenses
- Difficult to optimize procurement strategy

#### 5. **Manual Data Entry Burden**
- Time-consuming manual entry processes
- High error rates in data capture
- Inconsistent product naming and categorization

### Business Impact
- Significant operational overhead
- Suboptimal purchasing decisions
- Inability to leverage supplier discounts through data-driven negotiation
- Poor cash flow visibility

---

## Solution Overview

### Core Value Proposition

Invoice IQ eliminates the friction of purchase data management by providing:

1. **Multiple Data Entry Modalities** - Choose your preferred method (manual, OCR, or natural language)
2. **Intelligent Data Normalization** - AI automatically cleans, validates, and structures raw data
3. **Smart Product Matching** - Prevents duplicates and ensures consistency across records
4. **Real-Time Analytics** - Comprehensive dashboards with instant insights
5. **Price Intelligence** - Automatic detection of price changes and trend analysis
6. **Supplier Analytics** - Deep insights into supplier performance and spending patterns

### How It Works

```
User Input → Data Extraction → Normalization → Matching → Storage → Analytics
                ↓                  ↓                ↓         ↓
        [Manual/Photo/AI]    [OCR/AI]      [Fuzzy Match]  [MongoDB]
```

---

## Core Features

### 1. Multi-Mode Delivery Entry

Invoice IQ supports three distinct modes of data entry, optimized for different user preferences and scenarios:

#### A. Manual Entry
Perfect for users who prefer direct control and have structured data.

**Workflow:**
- User selects supplier from existing list or creates new
- System provides smart autocomplete for products
- User enters quantity, price, and date
- System validates input and suggests matching products
- Data automatically saved and indexed

**Key Features:**
- Auto-complete product suggestions based on historical data
- Real-time validation and error messages
- Quick-add template for bulk entry
- Keyboard shortcuts for power users

#### B. Photo Upload (OCR + AI)
Best for invoice digitization at point of purchase.

**Workflow:**
```
Upload Image → OCR Extraction → Text Cleaning → AI Parsing → 
JSON Conversion → Product Matching → Data Validation → Save
```

**Technical Details:**
- Supports multiple image formats (JPG, PNG, PDF)
- OCR engine: AWS Textract or Tesseract
- AI parser: GPT-4 or similar LLM
- Confidence scoring for extracted data
- User review interface for verification

**Example OCR Processing:**
```
Input Image: [Invoice photograph]
↓
OCR Output: "Invoice #2026-001234\nDate: 15-Mar-2026\n
            Item: Basmati Rice\nQty: 50 kg\nPrice: ₹6000"
↓
AI Parsing:
{
  "items": [
    {
      "productName": "Basmati Rice",
      "quantity": 50,
      "unit": "kg",
      "totalPrice": 6000,
      "unitPrice": 120,
      "confidence": 0.98
    }
  ],
  "date": "2026-03-15",
  "vendor": "ABC Suppliers",
  "invoiceNumber": "2026-001234"
}
```

#### C. AI Prompt Entry
Fastest method for users who prefer conversational input.

**Workflow:**
- User describes purchase in natural language
- AI converts to structured format
- System suggests products and sellers
- One-click confirmation

**Example Input/Output:**
```
User Input: "Bought 50kg of Basmati rice from ABC Suppliers for 6000 rupees 
            on March 15th. Also got 10 liters of mustard oil for 1500."

AI Output:
{
  "deliveries": [
    {
      "seller": "ABC Suppliers",
      "product": "Basmati Rice",
      "quantity": 50,
      "unit": "kg",
      "totalPrice": 6000,
      "date": "2026-03-15"
    },
    {
      "seller": "ABC Suppliers",
      "product": "Mustard Oil",
      "quantity": 10,
      "unit": "liters",
      "totalPrice": 1500,
      "date": "2026-03-15"
    }
  ]
}
```

---

### 2. Smart Product Matching System

The intelligent product matching system is the backbone of data quality in Invoice IQ.

**Features:**

#### Normalization Pipeline
- **Case Insensitivity**: "BASMATI RICE" = "basmati rice"
- **Whitespace Handling**: "Basmati  Rice" = "Basmati Rice"
- **Special Character Removal**: "Basmati-Rice" → "Basmati Rice"
- **Diacritic Removal**: "Basmāti" → "Basmati"
- **Unit Standardization**: "kg" = "kilogram", "L" = "liters"

#### Fuzzy Matching Algorithm
- Levenshtein distance for typo tolerance
- Threshold: 85% similarity match existing products
- Phonetic matching for commonly misspelled items
- Prevents duplicate product entries

#### Matching Strategy
```
New Product Input → Normalize → Fuzzy Match Against Existing → 
Match Found? 
  ├─ Yes (>85% similarity) → Use existing product
  ├─ Maybe (70-85%) → Ask user confirmation
  └─ No → Create new product
```

**Example Variations Matched:**
- "Basmati Rice" ✓
- "basmati rice" ✓
- "Basmti rice" ✓ (typo tolerance)
- "Basmati white rice" ✓ (flexible matching)
- "Basmati Rice Premium Grade" ✓ (descriptors)

---

### 3. Delivery Management System

Centralized repository for all purchase records with powerful querying capabilities.

**Delivery Record Structure:**
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "sellerId": "ObjectId",
  "productId": "ObjectId",
  "productNameNormalized": "basmati_rice",
  "quantity": 50,
  "unit": "kg",
  "unitPrice": 120,
  "totalPrice": 6000,
  "date": "2026-03-12",
  "source": "photo",
  "invoiceUrl": "s3://invoices/invoice_001.pdf",
  "invoiceNumber": "INV-2026-001234",
  "notes": "Premium grade, bulk discount applied",
  "createdAt": "2026-03-12T10:30:00Z",
  "updatedAt": "2026-03-12T10:30:00Z"
}
```

**Key Capabilities:**
- Fast retrieval by userId, sellerId, productId, or date range
- Bulk import from various sources
- Edit and version history tracking
- Soft delete (archive instead of remove)
- Batch operations on multiple deliveries

---

### 4. Price Change Detection

Intelligent price monitoring system that identifies opportunities and alerts users to changes.

**Detection Algorithm:**
```
New Delivery Price → Compare with Historical Average → 
Variance > 10%?
  ├─ Yes, Increase → Create PRICE_INCREASE alert
  ├─ Yes, Decrease → Create PRICE_DECREASE alert
  └─ No → No alert
```

**Alert Attributes:**
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "productId": "ObjectId",
  "sellerId": "ObjectId",
  "alertType": "PRICE_INCREASE|PRICE_DECREASE",
  "oldPrice": 120,
  "newPrice": 135,
  "percentageChange": 12.5,
  "historicalAverage": 122,
  "createdAt": "2026-03-15T14:20:00Z",
  "isRead": false,
  "actionType": "ignore|review|compare"
}
```

**Use Cases:**
- Detect price hikes from regular suppliers
- Identify deal opportunities
- Automatic price comparison for bulk purchases
- Negotiation leverage with suppliers

---

### 5. Analytics Dashboard

Real-time business intelligence dashboards providing actionable insights.

**Key Metrics:**

#### Overview Section
| Metric | Purpose | Calculation |
|--------|---------|-------------|
| **Total Spend** | Current period spending | Σ (totalPrice) for date range |
| **Active Suppliers** | Supplier diversity | COUNT (DISTINCT sellerId) |
| **Total Deliveries** | Transaction volume | COUNT (deliveries) |
| **Average Spend per Delivery** | Efficiency metric | Total Spend / Total Deliveries |
| **Most Purchased Product** | Demand indicator | MAX frequency product |

#### Charts & Visualizations

**1. Spending Over Time (Line Chart)**
- X-axis: Date (daily/weekly/monthly aggregation)
- Y-axis: Cumulative or daily spend
- Interactive zoom and range selection
- Trend line overlay (7-day moving average)

**Data Structure:**
```json
[
  { "date": "2026-03-01", "spend": 15000 },
  { "date": "2026-03-02", "spend": 12500 },
  { "date": "2026-03-03", "spend": 18200 },
  ...
]
```

**2. Supplier Comparison (Bar Chart)**
- X-axis: Supplier names
- Y-axis: Total spend per supplier
- Color-coded by supplier
- Hover details show transaction count

**Data Structure:**
```json
[
  { "sellerName": "ABC Suppliers", "totalSpend": 45000, "deliveries": 12 },
  { "sellerName": "XYZ Wholesalers", "totalSpend": 38500, "deliveries": 10 },
  ...
]
```

**3. Top Products (Horizontal Bar Chart)**
- Shows most frequently purchased items
- Sortable by quantity or spend
- Quick drill-down to product details

**Data Structure:**
```json
[
  { "productName": "Basmati Rice", "totalSpend": 28000, "quantity": 200, "unit": "kg" },
  { "productName": "Mustard Oil", "totalSpend": 18500, "quantity": 85, "unit": "liters" },
  ...
]
```

**4. Price Alerts Panel**
- Highlighted price changes
- Color: Red (increase), Green (decrease)
- Sortable by date or magnitude
- Quick action buttons

---

### 6. Seller Management

Complete supplier lifecycle management with detailed analytics.

**Seller Profile Fields:**
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "sellerName": "ABC Wholesale Distributors",
  "email": "contact@abc-supplies.com",
  "phone": "+91-XXXXXXXXXX",
  "address": "123 Market Street, City",
  "pincode": "123456",
  "gstNumber": "27AABCD1234A1Z0",
  "paymentTerms": "Net 30",
  "isActive": true,
  "rating": 4.5,
  "notes": "Reliable supplier, monthly discounts available",
  "createdAt": "2026-01-15T10:00:00Z"
}
```

**Analytics Metrics:**
- **Total Spend**: Sum of all deliveries from this seller
- **Last Delivery Date**: Most recent purchase
- **Average Order Value**: Mean price per delivery
- **Delivery Frequency**: Purchases per month
- **Product Variety**: Number of different products supplied

**Drill-Down Navigation:**
```
Seller Profile
├─ Overview (Summary metrics)
├─ Purchase History (List of all deliveries)
├─ Products Supplied (Product breakdown)
│  └─ Per-Product Analysis
│     ├─ Price history
│     ├─ Quantity trends
│     └─ Last purchase details
├─ Price Trends (Historical data visualization)
└─ Contact & Documents (Email, phone, invoices)
```

**Use Cases:**
- Seller performance evaluation
- Renegotiation of terms based on history
- Loyalty program tracking
- Competitive bidding scenarios

---

### 7. Product-Level Insights

Deep product analytics for informed purchasing decisions.

**Product Profile:**
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "productName": "Basmati Rice",
  "productNameNormalized": "basmati_rice",
  "category": "Grains & Cereals",
  "standardUnit": "kg",
  "firstPurchaseDate": "2025-12-01",
  "totalPurchases": 24,
  "totalQuantity": 500,
  "totalSpent": 58000,
  "averageUnitPrice": 116
}
```

**Insights Available:**

#### Time-Based Metrics
- **Last 7 Days**: Recent purchase pattern
- **Last 30 Days**: Monthly trend
- **Last 90 Days**: Quarterly perspective
- **Custom Range**: User-defined date selection

#### Analysis Dimensions
| Dimension | Shows |
|-----------|-------|
| **Quantity Purchased** | Consumption/demand pattern |
| **Price Trends** | Cost inflation analysis |
| **Supplier Mix** | Which sellers provide this product |
| **Frequency** | Purchase interval (weekly, bi-weekly, etc.) |

**Visualization Examples:**

**Price Trend Chart:**
```
Date        | Supplier | Unit Price | Quantity | Total
2026-03-10  | ABC      | ₹120       | 50kg     | ₹6,000
2026-02-25  | ABC      | ₹118       | 50kg     | ₹5,900
2026-02-10  | XYZ      | ₹122       | 40kg     | ₹4,880
```

**Quantity Trends:**
- Line chart showing purchase volumes over time
- Helps identify seasonal patterns
- Forecasting capability for inventory planning

---

## System Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend Layer                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Next.js React SPA (Dark/Light Mode)                 │   │
│  │  ├─ Dashboard                                         │   │
│  │  ├─ Delivery Entry (Manual/Photo/Prompt)            │   │
│  │  ├─ Seller Management                                │   │
│  │  ├─ Product Analytics                                │   │
│  │  └─ Settings & Profile                               │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓ API Calls
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway Layer                         │
│  ├─ Rate Limiting & Authentication                          │
│  ├─ Request Validation                                      │
│  └─ Error Handling & Logging                                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Express.js REST API Server                            │ │
│  │ ├─ Auth Controller (Login, Signup, JWT)              │ │
│  │ ├─ Delivery Controller (CRUD operations)             │ │
│  │ ├─ Product Controller (Matching, normalization)      │ │
│  │ ├─ Seller Controller (Management & analytics)        │ │
│  │ ├─ Analytics Controller (Dashboard data)             │ │
│  │ └─ User Interface Controller (UI data)               │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                 Services & Utilities Layer                   │
│  ├─ OCR Service (AWS Textract / Tesseract)                 │
│  ├─ AI Parsing Service (OpenAI GPT-4)                      │
│  ├─ Authentication Service (JWT, bcrypt)                   │
│  ├─ Product Matching Service (Fuzzy matching)              │
│  ├─ Alert Generation Service                               │
│  ├─ Aggregation Service (Analytics queries)                │
│  └─ Email Notification Service                             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Database Layer                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ MongoDB (Cloud Atlas or Self-hosted)                  │ │
│  │ ├─ Users Collection                                    │ │
│  │ ├─ Sellers Collection (Indexed by userId)            │ │
│  │ ├─ Products Collection (Indexed by userId)           │ │
│  │ ├─ Deliveries Collection (Indexed for queries)       │ │
│  │ └─ Alerts Collection                                  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              External Services Integration                   │
│  ├─ Cloud Storage (AWS S3 for invoices)                    │
│  ├─ Email Service (SendGrid / AWS SES)                     │
│  └─ AI/ML Services (OpenAI API)                            │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

#### Frontend
- **Framework**: Next.js with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API / Zustand
- **Charts**: Recharts or Chart.js
- **HTTP Client**: Axios or Fetch API
- **Theming**: Dark/Light mode support

#### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Authentication**: JWT with bcrypt
- **Input Validation**: Zod or Joi

#### Database
- **Primary DB**: MongoDB
- **Indexing Strategy**: Composite indexes on frequently queried fields
- **Caching**: Redis (optional, for analytics caching)

#### External Services
- **OCR**: AWS Textract or Tesseract.js
- **AI/LLM**: OpenAI GPT-4 (or similar)
- **Cloud Storage**: AWS S3
- **Email**: SendGrid or AWS SES
- **Deployment**: AWS EC2/ECS, Vercel (frontend), Railway/Render (backend)

---

## Database Design

### Collections Schema

#### 1. Users Collection
```javascript
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "password", "createdAt"],
      properties: {
        _id: { bsonType: "objectId" },
        email: { bsonType: "string", pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$" },
        password: { bsonType: "string", minLength: 60 }, // bcrypt hash
        firstName: { bsonType: "string" },
        lastName: { bsonType: "string" },
        businessName: { bsonType: "string" },
        phone: { bsonType: "string" },
        address: { bsonType: "string" },
        city: { bsonType: "string" },
        pincode: { bsonType: "string" },
        state: { bsonType: "string" },
        gstNumber: { bsonType: "string" },
        businessType: { enum: ["retail", "restaurant", "wholesale", "household"] },
        subscriptionTier: { enum: ["free", "pro", "enterprise"] },
        subscriptionEndDate: { bsonType: "date" },
        isActive: { bsonType: "bool" },
        lastLogin: { bsonType: "date" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

// Indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ createdAt: -1 });
db.users.createIndex({ businessType: 1 });
```

#### 2. Sellers Collection
```javascript
db.createCollection("sellers", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "sellerName", "createdAt"],
      properties: {
        _id: { bsonType: "objectId" },
        userId: { bsonType: "objectId" },
        sellerName: { bsonType: "string" },
        email: { bsonType: "string" },
        phone: { bsonType: "string" },
        address: { bsonType: "string" },
        pincode: { bsonType: "string" },
        city: { bsonType: "string" },
        gstNumber: { bsonType: "string" },
        paymentTerms: { bsonType: "string" },
        isActive: { bsonType: "bool" },
        rating: { bsonType: "double", minimum: 0, maximum: 5 },
        notes: { bsonType: "string" },
        tags: { bsonType: "array", items: { bsonType: "string" } },
        lastPurchaseDate: { bsonType: "date" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

// Indexes
db.sellers.createIndex({ userId: 1, createdAt: -1 });
db.sellers.createIndex({ userId: 1, sellerName: 1 });
db.sellers.createIndex({ userId: 1, isActive: 1 });
db.sellers.createIndex({ lastPurchaseDate: -1 });
```

#### 3. Products Collection
```javascript
db.createCollection("products", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "productName", "productNameNormalized", "standardUnit", "createdAt"],
      properties: {
        _id: { bsonType: "objectId" },
        userId: { bsonType: "objectId" },
        productName: { bsonType: "string" },
        productNameNormalized: { bsonType: "string" }, // lowercase, no spaces
        category: { bsonType: "string" },
        standardUnit: { enum: ["kg", "g", "liters", "ml", "pieces", "boxes", "packs"] },
        description: { bsonType: "string" },
        sku: { bsonType: "string" },
        totalPurchases: { bsonType: "int" },
        totalQuantity: { bsonType: "double" },
        totalSpent: { bsonType: "double" },
        averageUnitPrice: { bsonType: "double" },
        firstPurchaseDate: { bsonType: "date" },
        lastPurchaseDate: { bsonType: "date" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

// Indexes
db.products.createIndex({ userId: 1, productNameNormalized: 1 }, { unique: true });
db.products.createIndex({ userId: 1, category: 1 });
db.products.createIndex({ userId: 1, lastPurchaseDate: -1 });
db.products.createIndex({ userId: 1, totalPurchases: -1 });
```

#### 4. Deliveries Collection
```javascript
db.createCollection("deliveries", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "sellerId", "productId", "quantity", "totalPrice", "date", "createdAt"],
      properties: {
        _id: { bsonType: "objectId" },
        userId: { bsonType: "objectId" },
        sellerId: { bsonType: "objectId" },
        productId: { bsonType: "objectId" },
        productNameNormalized: { bsonType: "string" },
        quantity: { bsonType: "double" },
        unit: { enum: ["kg", "g", "liters", "ml", "pieces", "boxes", "packs"] },
        unitPrice: { bsonType: "double" },
        totalPrice: { bsonType: "double" },
        date: { bsonType: "date" },
        source: { enum: ["manual", "photo", "prompt"] },
        invoiceUrl: { bsonType: "string" },
        invoiceNumber: { bsonType: "string" },
        notes: { bsonType: "string" },
        isApproved: { bsonType: "bool" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
        deletedAt: { bsonType: ["date", "null"] } // Soft delete
      }
    }
  }
});

// Indexes (Critical for performance)
db.deliveries.createIndex({ userId: 1, date: -1 });
db.deliveries.createIndex({ userId: 1, sellerId: 1, date: -1 });
db.deliveries.createIndex({ userId: 1, productId: 1, date: -1 });
db.deliveries.createIndex({ userId: 1, source: 1 });
db.deliveries.createIndex({ date: -1 });
db.deliveries.createIndex({ userId: 1, createdAt: -1 });
```

#### 5. Alerts Collection
```javascript
db.createCollection("alerts", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "alertType", "createdAt"],
      properties: {
        _id: { bsonType: "objectId" },
        userId: { bsonType: "objectId" },
        productId: { bsonType: "objectId" },
        sellerId: { bsonType: "objectId" },
        deliveryId: { bsonType: "objectId" },
        alertType: { enum: ["PRICE_INCREASE", "PRICE_DECREASE", "NEW_PRODUCT", "STOCK_WARNING"] },
        title: { bsonType: "string" },
        description: { bsonType: "string" },
        metadata: { bsonType: "object" }, // Flexible for alert-specific data
        isRead: { bsonType: "bool" },
        actionType: { enum: ["ignore", "review", "compare"] },
        createdAt: { bsonType: "date" },
        readAt: { bsonType: ["date", "null"] }
      }
    }
  }
});

// Indexes
db.alerts.createIndex({ userId: 1, createdAt: -1 });
db.alerts.createIndex({ userId: 1, isRead: 1 });
db.alerts.createIndex({ createdAt: 1 }, { expireAfterSeconds: 2592000 }); // 30-day TTL
```

### Database Relationships

```
Users (1) ─────── (Many) Sellers
  │                        │
  │                        └─── (Many) Deliveries
  │
  ├─ (Many) Products
  │
  ├─ (Many) Deliveries
  │
  └─ (Many) Alerts
```

### Query Optimization Strategies

#### Aggregation Pipeline Examples

**Example 1: Monthly Spending by Supplier**
```javascript
db.deliveries.aggregate([
  {
    $match: {
      userId: ObjectId("..."),
      date: { $gte: ISODate("2026-01-01"), $lt: ISODate("2026-04-01") }
    }
  },
  {
    $lookup: {
      from: "sellers",
      localField: "sellerId",
      foreignField: "_id",
      as: "seller"
    }
  },
  {
    $group: {
      _id: "$sellerId",
      sellerName: { $first: "$seller.sellerName" },
      totalSpend: { $sum: "$totalPrice" },
      deliveriesCount: { $sum: 1 }
    }
  },
  { $sort: { totalSpend: -1 } }
]);
```

**Example 2: Price Trend for Product**
```javascript
db.deliveries.aggregate([
  {
    $match: {
      userId: ObjectId("..."),
      productId: ObjectId("..."),
      date: { $gte: ISODate("2025-12-01") }
    }
  },
  {
    $sort: { date: 1 }
  },
  {
    $lookup: {
      from: "sellers",
      localField: "sellerId",
      foreignField: "_id",
      as: "seller"
    }
  },
  {
    $project: {
      date: 1,
      sellerName: { $arrayElemAt: ["$seller.sellerName", 0] },
      unitPrice: 1,
      quantity: 1
    }
  }
]);
```

---

## Data Flow

### End-to-End Data Flow Diagram

```
                           ┌─────────────────────┐
                           │   User Interface    │
                           └──────────┬──────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    │                 │                 │
                    ▼                 ▼                 ▼
            ┌─────────────┐  ┌──────────────┐  ┌─────────────┐
            │Manual Entry │  │Photo Upload  │  │AI Prompt    │
            └──────┬──────┘  └──────┬───────┘  └──────┬──────┘
                   │                │                 │
                   ▼                ▼                 ▼
            ┌──────────────────────────────────────────────────┐
            │        Input Validation & Normalization         │
            │  ├─ Basic validation (required fields)          │
            │  ├─ Data type conversion                        │
            │  └─ Date parsing & standardization             │
            └──────────────────────┬───────────────────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
                    ▼                             ▼
        ┌────────────────────┐      ┌─────────────────────┐
        │ OCR Processing      │      │ AI Parsing Service  │
        │ (Photo mode only)   │      │ (Photo & Prompt)    │
        └─────────┬──────────┘      └──────────┬──────────┘
                  │                            │
                  └────────────┬───────────────┘
                               │
                        ┌──────▼──────────┐
                        │ Raw Data        │
                        │ {               │
                        │  seller: "ABC"  │
                        │  product: "..." │
                        │  qty: 50,       │
                        │  price: 6000    │
                        │ }               │
                        └──────┬──────────┘
                               │
                   ┌───────────▼────────────┐
                   │ Normalization &        │
                   │ Product Matching       │
                   │ ├─ Lower case          │
                   │ ├─ Remove extras       │
                   │ ├─ Fuzzy match         │
                   │ └─ Suggest duplicates  │
                   └───────────┬────────────┘
                               │
                   ┌───────────▼────────────┐
                   │ User Review & Approval │
                   │ (if needed)            │
                   └───────────┬────────────┘
                               │
        ┌──────────────────────▼─────────────────────┐
        │    Database Insertion                      │
        │    ├─ Update/Create Product                │
        │    ├─ Insert Delivery Record               │
        │    ├─ Update Seller Stats                  │
        │    └─ Trigger Alert Generation             │
        └──────────────┬───────────────────────────┐─┘
                       │                           │
                       ▼                           │
        ┌──────────────────────┐                  │
        │ Alert Service        │                  │
        │ ├─ Check price delta  │                  │
        │ ├─ Compare with avg   │                  │
        │ └─ Create alert       │                  │
        └──────────┬───────────┘                   │
                   │                               │
                   │                               │
                   └────────────┬──────────────────┘
                                │
                       ┌────────▼────────┐
                       │ Update Database │
                       │ (Stats, Alerts) │
                       └────────┬────────┘
                                │
                         ┌──────▼──────┐
                         │ User Feed   │
                         │ ├─ Toast    │
                         │ ├─ Alerts   │
                         │ └─ Dashboard│
                         └─────────────┘
```

### Detailed Flow Steps

#### Step 1: Photo Upload Flow

```
User selects image file
        ↓
Frontend validates:
  ├─ File type (JPG, PNG, PDF)
  ├─ File size (< 10MB)
  └─ Image dimensions

        ↓
Upload to S3 / Cloud Storage
        ↓
Backend initiates OCR:
  ├─ Send image to AWS Textract / Tesseract
  ├─ Extract raw text
  └─ Clean/format text

        ↓
Raw OCR Output Example:
"Invoice #2026-001234
Date: 15-Mar-2026
Basmati Rice         50 kg    ₹6000
Mustard Oil          10 liters ₹1500
Total: ₹7500"

        ↓
Send to AI Parser (GPT-4):
  └─ "Convert this invoice text to JSON with fields:
      seller, items (name, qty, unit, price), date, total"

        ↓
AI Output (Structured JSON):
{
  "seller": "ABC Supplies",
  "invoiceNumber": "2026-001234",
  "date": "2026-03-15",
  "items": [
    {
      "name": "Basmati Rice",
      "quantity": 50,
      "unit": "kg",
      "unitPrice": 120,
      "totalPrice": 6000
    },
    {
      "name": "Mustard Oil",
      "quantity": 10,
      "unit": "liters",
      "unitPrice": 150,
      "totalPrice": 1500
    }
  ],
  "total": 7500
}

        ↓
User Review Screen:
  ├─ Displays extracted data
  ├─ Allows edits
  ├─ Suggests seller match
  └─ One-click confirm

        ↓
On Confirmation:
  ├─ Match products (fuzzy)
  ├─ Create/update seller record
  ├─ Insert delivery records
  ├─ Update product stats
  └─ Generate alerts
```

#### Step 2: Product Matching Flow

```
New Product Input: "basmati rice"
        ↓
Normalization:
  "basmati rice" → "basmati rice" (normalize)
  Remove extra spaces, special chars
  Lowercase
        ↓
Query existing products:
  Find in DB where userId = currentUser
  AND productNameNormalized matches fuzzy
        ↓
Results:
  ├─ Exact: "basmati_rice" (100% match)
  ├─ High: "basmati white rice" (92% match)
  └─ Medium: "basmati" (85% match)

        ↓
Decision:
  ┌─ Exact match found?
  │  └─ Use existing product (avoid duplicate)
  │
  ├─ High/Medium match found?
  │  └─ Show user confirmation dialog
  │     "Did you mean existing product?"
  │     ├─ Yes → Use existing
  │     └─ No → Create new
  │
  └─ No match?
     └─ Create new product entry

        ↓
Final Step:
  └─ Store with normalized name for future matching
```

---

## API Design

### Authentication Endpoints

#### 1. User Registration
```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password_123",
  "firstName": "John",
  "lastName": "Doe",
  "businessName": "John's Grocery Store",
  "businessType": "retail",
  "phone": "+91-XXXXXXXXXX",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001"
}

Response: 201 Created
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "_id": "ObjectId",
    "email": "user@example.com",
    "businessName": "John's Grocery Store"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 2. User Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password_123"
}

Response: 200 OK
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "ObjectId",
    "email": "user@example.com",
    "businessName": "John's Grocery Store",
    "subscriptionTier": "pro"
  }
}
```

### Delivery Endpoints

#### 1. Create Delivery (Manual Entry)
```http
POST /api/deliveries
Authorization: Bearer <token>
Content-Type: application/json

{
  "sellerId": "ObjectId",
  "productId": "ObjectId",
  "quantity": 50,
  "unit": "kg",
  "totalPrice": 6000,
  "date": "2026-03-12",
  "source": "manual",
  "invoiceNumber": "INV-2026-001",
  "notes": "Premium grade, bulk discount"
}

Response: 201 Created
{
  "success": true,
  "delivery": {
    "_id": "ObjectId",
    "userId": "ObjectId",
    "sellerId": "ObjectId",
    "productId": "ObjectId",
    "quantity": 50,
    "unit": "kg",
    "unitPrice": 120,
    "totalPrice": 6000,
    "date": "2026-03-12",
    "source": "manual",
    "createdAt": "2026-03-12T10:30:00Z"
  }
}
```

#### 2. Process Photo Upload (OCR + AI)
```http
POST /api/deliveries/process-photo
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "invoiceImage": <file>,
  "sellerId": "ObjectId" (optional, for pre-fill)
}

Response: 200 OK
{
  "success": true,
  "extractedData": {
    "seller": {
      "_id": "ObjectId",
      "sellerName": "ABC Supplies"
    },
    "items": [
      {
        "productName": "Basmati Rice",
        "quantity": 50,
        "unit": "kg",
        "unitPrice": 120,
        "totalPrice": 6000,
        "matchedProductId": "ObjectId",
        "confidence": 0.98
      }
    ],
    "date": "2026-03-15",
    "invoiceNumber": "INV-2026-001234",
    "invoiceUrl": "s3://bucket/invoice_123.pdf"
  }
}
```

#### 3. Submit AI Prompt
```http
POST /api/deliveries/process-prompt
Authorization: Bearer <token>
Content-Type: application/json

{
  "prompt": "Bought 50kg of Basmati rice from ABC Suppliers for 6000 rupees on March 15th. Also got 10 liters of mustard oil for 1500."
}

Response: 200 OK
{
  "success": true,
  "parsedDeliveries": [
    {
      "seller": "ABC Supplies",
      "product": "Basmati Rice",
      "quantity": 50,
      "unit": "kg",
      "totalPrice": 6000,
      "date": "2026-03-15",
      "confidence": 0.97
    },
    {
      "seller": "ABC Supplies",
      "product": "Mustard Oil",
      "quantity": 10,
      "unit": "liters",
      "totalPrice": 1500,
      "date": "2026-03-15",
      "confidence": 0.95
    }
  ]
}
```

#### 4. Get Deliveries (with Filters)
```http
GET /api/deliveries?startDate=2026-03-01&endDate=2026-03-31&sellerId=xyz&productId=abc&limit=20&skip=0
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "total": 45,
  "deliveries": [
    {
      "_id": "ObjectId",
      "sellerId": "ObjectId",
      "sellerName": "ABC Supplies",
      "productId": "ObjectId",
      "productName": "Basmati Rice",
      "quantity": 50,
      "unit": "kg",
      "unitPrice": 120,
      "totalPrice": 6000,
      "date": "2026-03-12",
      "source": "manual",
      "createdAt": "2026-03-12T10:30:00Z"
    }
  ]
}
```

### Product Endpoints

#### 1. Get Product Insights
```http
GET /api/products/:productId/insights?timeRange=30&sortBy=price
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "product": {
    "_id": "ObjectId",
    "productName": "Basmati Rice",
    "category": "Grains & Cereals",
    "standardUnit": "kg",
    "totalPurchases": 24,
    "totalQuantity": 500,
    "totalSpent": 58000,
    "averageUnitPrice": 116,
    "firstPurchaseDate": "2025-12-01",
    "lastPurchaseDate": "2026-03-12"
  },
  "insights": {
    "priceHistory": [
      { "date": "2026-03-12", "unitPrice": 120, "seller": "ABC", "quantity": 50 },
      { "date": "2026-03-01", "unitPrice": 118, "seller": "ABC", "quantity": 50 }
    ],
    "suppliers": [
      { "sellerName": "ABC Supplies", "purchases": 15, "spend": 42000 },
      { "sellerName": "XYZ Wholesalers", "purchases": 9, "spend": 16000 }
    ],
    "quantityTrend": [
      { "date": "2026-03-12", "quantity": 50 },
      { "date": "2026-02-27", "quantity": 45 }
    ],
    "alerts": [
      {
        "type": "PRICE_INCREASE",
        "magnitude": 12.5,
        "previousPrice": 120,
        "currentPrice": 135,
        "date": "2026-03-15"
      }
    ]
  }
}
```

### Seller Endpoints

#### 1. Get Seller Profile & Analytics
```http
GET /api/sellers/:sellerId
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "seller": {
    "_id": "ObjectId",
    "sellerName": "ABC Wholesale Distributors",
    "email": "contact@abc-supplies.com",
    "phone": "+91-XXXXXXXXXX",
    "address": "123 Market Street",
    "city": "Mumbai",
    "pincode": "400001",
    "rating": 4.5,
    "isActive": true
  },
  "analytics": {
    "totalSpend": 125000,
    "deliveryCount": 28,
    "averageOrderValue": 4464,
    "lastPurchaseDate": "2026-03-15",
    "frequencyPerMonth": 9.3,
    "uniqueProducts": 12,
    "priceChange": {
      "increaseCount": 5,
      "decreaseCount": 2,
      "lastChange": {
        "product": "Basmati Rice",
        "changePercent": 12.5,
        "type": "INCREASE",
        "date": "2026-03-15"
      }
    }
  }
}
```

### Analytics Endpoints

#### 1. Dashboard Summary
```http
GET /api/analytics/dashboard?dateRange=30
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "summary": {
    "totalSpend": 285000,
    "activeSellers": 8,
    "totalDeliveries": 92,
    "mostPurchasedProduct": {
      "name": "Basmati Rice",
      "quantity": 500,
      "spend": 58000
    },
    "periodComparison": {
      "current": 285000,
      "previous": 270000,
      "percentChange": 5.56
    }
  },
  "chartData": {
    "spendingOverTime": [
      { "date": "2026-02-15", "spend": 12000 },
      { "date": "2026-02-16", "spend": 15000 },
      ...
    ],
    "supplierComparison": [
      { "sellerName": "ABC Supplies", "totalSpend": 85000, "deliveries": 28 },
      { "sellerName": "XYZ Wholesalers", "totalSpend": 72000, "deliveries": 22 }
    ],
    "topProducts": [
      { "productName": "Basmati Rice", "totalSpend": 58000, "quantity": 500 },
      { "productName": "Mustard Oil", "totalSpend": 45000, "quantity": 380 }
    ],
    "priceAlerts": [
      {
        "id": "ObjectId",
        "product": "Basmati Rice",
        "seller": "ABC Supplies",
        "type": "PRICE_INCREASE",
        "oldPrice": 120,
        "newPrice": 135,
        "percentChange": 12.5,
        "date": "2026-03-15"
      }
    ]
  }
}
```

#### 2. Custom Analytics Query
```http
POST /api/analytics/custom
Authorization: Bearer <token>
Content-Type: application/json

{
  "aggregation": "monthly_spend_by_seller",
  "dateRange": {
    "start": "2026-01-01",
    "end": "2026-03-31"
  },
  "filters": {
    "sellers": ["sellerId1", "sellerId2"],
    "products": ["productId1"]
  }
}

Response: 200 OK
{
  "success": true,
  "data": [
    {
      "month": "2026-01",
      "sellers": [
        { "name": "ABC Supplies", "spend": 35000 },
        { "name": "XYZ Wholesalers", "spend": 28000 }
      ]
    }
  ]
}
```

### Error Handling

All endpoints follow consistent error response format:

```json
{
  "success": false,
  "error": {
    "status": 400,
    "code": "INVALID_INPUT",
    "message": "Quantity must be greater than 0",
    "details": {
      "field": "quantity",
      "value": -5,
      "constraint": "positive_number"
    }
  }
}
```

**Common Error Codes:**
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (duplicate entry)
- `500` - Internal Server Error

---

## UI/UX Overview

### Design System

#### Color Scheme
```
Light Mode:
- Primary: #2563eb (Blue)
- Secondary: #64748b (Slate)
- Success: #10b981 (Green)
- Warning: #f59e0b (Amber)
- Danger: #ef4444 (Red)
- Background: #ffffff (White)
- Surface: #f8fafc (Light Slate)

Dark Mode:
- Primary: #3b82f6 (Lighter Blue)
- Secondary: #94a3b8 (Light Slate)
- Success: #34d399 (Light Green)
- Warning: #fbbf24 (Light Amber)
- Danger: #f87171 (Light Red)
- Background: #0f172a (Dark Navy)
- Surface: #1e293b (Dark Slate)
```

#### Typography
- **Headings**: Inter Bold (24px, 20px, 18px)
- **Body**: Inter Regular (14px, 16px)
- **Captions**: Inter Regular (12px)

### Key Pages & Layouts

#### 1. Dashboard (Home)
**Purpose**: Executive summary and quick insights

**Layout:**
```
┌─────────────────────────────────────────────────────┐
│ Header: Dashboard | Date Range Selector | Settings  │
├─────────────────────────────────────────────────────┤
│                                                      │
│ [Total Spend]  [Active Sellers]  [Total Deliveries]│
│  ₹285,000         8                92              │
│                                                      │
├─────────────────────────────────────────────────────┤
│                                                      │
│ Spending Over Time (Line Chart)                     │
│ ┌────────────────────────────────────────────────┐ │
│ │                    /\      /\    ₹285K        │ │
│ │                   /  \    /  \                 │ │
│ │                  /    \  /    \               │ │
│ │                 /      \/      \              │ │
│ │ Feb 15  Feb 20  Feb 25  Mar 1   Mar 15       │ │
│ └────────────────────────────────────────────────┘ │
│                                                      │
├─────────────────────────────────────────────────────┤
│ Top Suppliers           │  Top Products             │
│ ┌────────────────────┐ │ ┌────────────────────────┐│
│ │ ABC Supplies    │  │ │ Basmati Rice       │    ││
│ │ ₹85,000        │█│ │ ₹58,000           │████││
│ │                │  │ │                    │    ││
│ │ XYZ Wholesalers│  │ │ Mustard Oil       │████││
│ │ ₹72,000        │█│ │ ₹45,000           ││    ││
│ └────────────────────┘ │ └────────────────────────┘│
│                                                      │
├─────────────────────────────────────────────────────┤
│ Price Alerts                                        │
│ ┌──────────────────────────────────────────────┐   │
│ │ 🔴 Basmati Rice (ABC)     ▲ 12.5%  15/Mar  │   │
│ │ 🟢 Mustard Oil (XYZ)      ▼ 8%     10/Mar  │   │
│ └──────────────────────────────────────────────┘   │
│                                                      │
└─────────────────────────────────────────────────────┘
```

#### 2. Add Delivery Page
**Purpose**: Entry point for multiple delivery input methods

**Tab-Based Interface:**
```
┌─────────────────────────────────────────┐
│ Add Delivery | Manual | Photo | Prompt  │
├─────────────────────────────────────────┤
│                                          │
│ [Manual Entry Tab]                      │
│ ┌──────────────────────────────────────┐│
│ │ Seller: [Dropdown v]                 ││
│ │                                       ││
│ │ Product: [Autocomplete field...]      ││
│ │ Suggestions:                         ││
│ │ ├─ Basmati Rice                      ││
│ │ ├─ Mustard Oil                       ││
│ │ └─ Fresh Vegetables                  ││
│ │                                       ││
│ │ Quantity: [Input] Unit: [kg v]       ││
│ │                                       ││
│ │ Total Price: ₹[Input]                ││
│ │                                       ││
│ │ Date: [Date Picker v] 15/Mar/2026    ││
│ │                                       ││
│ │ Invoice Number: [Optional Input]      ││
│ │                                       ││
│ │ [Cancel]  [Save Delivery]            ││
│ └──────────────────────────────────────┘│
│                                          │
└─────────────────────────────────────────┘
```

#### 3. Seller Analytics Page
**Purpose**: Deep dive into supplier performance

**Layout:**
```
┌──────────────────────────────────────────────┐
│ ABC Wholesale Distributors                   │
│ ├─ Email: contact@abc-supplies.com          │
│ ├─ Phone: +91-XXXXXXXXXX                    │
│ ├─ Rating: ⭐⭐⭐⭐⭐ (4.5/5)                   │
│ └─ Member since: Jan 15, 2026               │
├──────────────────────────────────────────────┤
│                                              │
│ Key Metrics:                                 │
│ Total Spend: ₹125,000  |  Deliveries: 28    │
│ Avg Order Value: ₹4,464  |  Last: 15/Mar    │
│                                              │
├──────────────────────────────────────────────┤
│                                              │
│ Purchase History                             │
│ ┌───────────────────────────────────────┐   │
│ │ Date      Product       Qty  Price    │   │
│ │ 15/Mar    Basmati Rice  50kg ₹6,000   │   │
│ │ 10/Mar    Mustard Oil   10L  ₹1,500   │   │
│ │ 05/Mar    Salt          5kg  ₹250     │   │
│ └───────────────────────────────────────┘   │
│                                              │
├──────────────────────────────────────────────┤
│ Products from this Supplier:                 │
│ ┌──────────────────────────────────┐        │
│ │ Basmati Rice        ₹58,000 →    │        │
│ │ Mustard Oil         ₹45,000 →    │        │
│ │ Fresh Vegetables    ₹18,000 →    │        │
│ └──────────────────────────────────┘        │
│                                              │
└──────────────────────────────────────────────┘
```

#### 4. Product Insights Page
**Purpose**: Comprehensive product analytics

**Layout:**
```
┌──────────────────────────────────────────────┐
│ Basmati Rice                                 │
│ Category: Grains & Cereals                   │
├──────────────────────────────────────────────┤
│                                              │
│ Overview:                                    │
│ Purchases: 24 | Quantity: 500kg | Spent: ₹58K│
│ Average Unit Price: ₹116/kg                  │
│                                              │
├──────────────────────────────────────────────┤
│                                              │
│ Price Trend (Past 3 Months)                  │
│ ┌────────────────────────────────────────┐  │
│ │  125 │                                 │  │
│ │  120 │─ ─ ─ ─ ─────                   │  │
│ │  115 │         \                       │  │
│ │  110 │          \_____                 │  │
│ │      └────────────────────────────────┘  │
│ │  Feb  Mid  Mar                           │  │
│ └────────────────────────────────────────┘  │
│                                              │
│ Suppliers:                                   │
│ ├─ ABC Supplies (15 purchases, ₹58K)       │
│ └─ XYZ Wholesalers (9 purchases, ₹28K)     │
│                                              │
│ Recent Purchases:                            │
│ 15/Mar  ABC      50kg  ₹6,000  (₹120/kg)   │
│ 10/Mar  ABC      45kg  ₹5,310  (₹118/kg)   │
│ 05/Mar  XYZ      40kg  ₹4,800  (₹120/kg)   │
│                                              │
└──────────────────────────────────────────────┘
```

### User Experience Principles

#### 1. **Minimal Input Effort**
- Target: < 10 seconds per entry
- Smart autocomplete and defaults
- One-click confirmation after validation

#### 2. **Mobile-First Responsive Design**
- Touch-friendly button sizes (minimum 44px × 44px)
- Vertical layout on mobile, horizontal on desktop
- Swipe gestures for navigation where applicable

#### 3. **Visual Clarity**
- Avoids information overload
- Progressive disclosure (more details on demand)
- Consistent icon usage for actions

#### 4. **Dark/Light Mode Support**
- Automatic theme based on system preference
- Manual toggle in settings
- Smooth color transitions

#### 5. **Accessibility**
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader friendly labels and ARIA attributes

---

## Performance & Scalability

### Frontend Performance

#### Metrics & Targets
| Metric | Target |
|--------|--------|
| First Contentful Paint (FCP) | < 1.5s |
| Largest Contentful Paint (LCP) | < 2.5s |
| Cumulative Layout Shift (CLS) | < 0.1 |
| Time to Interactive (TTI) | < 3.5s |
| Lighthouse Score | > 90 |

#### Optimization Strategies

**Code Splitting:**
```javascript
// Pages are lazy-loaded only when accessed
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Analytics = lazy(() => import('./pages/Analytics'));
const AddDelivery = lazy(() => import('./pages/AddDelivery'));
```

**Image Optimization:**
- WebP format with PNG fallback
- Responsive images using `srcset`
- Lazy loading for below-the-fold images
- Compression via CDN (Cloudflare, AWS CloudFront)

**Caching Strategy:**
- Service Worker for offline capability
- Browser cache headers for static assets
- Cache-busting with versioning for updates

### Backend Performance

#### Database Indexing Strategy
```javascript
// Critical indexes for fast queries
db.deliveries.createIndex({ userId: 1, date: -1 });
db.deliveries.createIndex({ userId: 1, sellerId: 1, date: -1 });
db.deliveries.createIndex({ userId: 1, productId: 1, date: -1 });
```

#### API Response Times
| Endpoint | Target | Typical |
|----------|--------|---------|
| List Deliveries | < 200ms | 50-100ms |
| Dashboard Data | < 500ms | 200-300ms |
| Product Insights | < 300ms | 100-150ms |
| Analytics Query | < 1000ms | 500-800ms |

#### Caching Layers

**Redis Caching for Analytics:**
```
Dashboard Summary → Cache for 5 minutes
Monthly Spend → Cache for 1 hour
Supplier Comparison → Cache for 30 minutes
```

#### Load Handling

**Expected Load:**
- 1,000+ concurrent users during peak hours
- 50+ deliveries submitted per hour
- Dashboard accessed by 30% of users simultaneously

**Scaling Strategy:**
- Horizontal scaling via load balancer (AWS ALB)
- Database sharding by userId for multi-tenant isolation
- Read replicas for analytics queries
- Message queue (RabbitMQ/AWS SQS) for async processing

### Scalability Roadmap

#### Phase 1: Foundation (0-1000 users)
- Single backend instance
- MongoDB Atlas shared cluster
- CDN for static assets
- Email via SendGrid

#### Phase 2: Growth (1000-10k users)
- Load-balanced backend (2-3 instances)
- MongoDB Atlas with read replicas
- Redis caching layer
- Async job processing

#### Phase 3: Enterprise (10k+ users)
- Auto-scaling backend (Kubernetes)
- MongoDB sharded cluster
- GraphQL federation for complex queries
- Dedicated AI model inference clusters
- Multi-region deployment

---

## Future Enhancements

### Short-Term (3-6 months)

#### 1. **Advanced Price Analytics**
- Seasonal price pattern detection
- Price forecasting using ML models
- Supplier price comparison dashboard
- Recommended negotiation points

#### 2. **Bulk Import Features**
- CSV/Excel import with intelligent mapping
- Batch photo upload (multiple invoices at once)
- API endpoint for ERP system integration

#### 3. **Notification System**
- Email alerts for price changes
- Slack/Telegram integrations
- SMS notifications for critical alerts
- Custom alert thresholds

#### 4. **Export & Reporting**
- PDF report generation (monthly, quarterly, annual)
- Excel export with charts
- Automated report scheduling
- Email delivery of reports

### Medium-Term (6-12 months)

#### 1. **AI-Powered Insights**
- Anomaly detection for unusual pricing
- Supplier recommendation engine ("Switch to ABC for 15% savings")
- Demand forecasting
- Inventory optimization suggestions

#### 2. **Mobile Application**
- Native iOS/Android apps
- Offline data capture with sync
- Camera integration for quick photo uploads
- Simplified mobile dashboards

#### 3. **Supplier Portal**
- Suppliers can manage their product catalog
- Bulk listing updates
- Performance metrics visible to suppliers
- Two-way communication channel

#### 4. **Multi-Currency & Multi-Language**
- Support for different currencies
- Localization for major Indian languages
- Tax compliance for different regions

### Long-Term (1-2 years)

#### 1. **Marketplace Integration**
- Direct integration with supplier platforms
- Real-time price syncing
- Automated procurement recommendations
- One-click ordering

#### 2. **Advanced Analytics Suite**
- Predictive inventory management
- Supplier risk assessment
- Financial modeling and forecasting
- Benchmarking against industry standards

#### 3. **API & Integrations**
- Public API for third-party developers
- Pre-built integrations with popular ERP systems
- Webhook support for real-time data sync

#### 4. **White-Label Solution**
- Customizable branding
- Multi-tenant support for resellers
- Private deployment options

---

## Conclusion

Invoice IQ represents a paradigm shift in how small businesses and retailers manage their procurement operations. By eliminating manual data entry, leveraging AI for intelligent processing, and providing actionable insights, Invoice IQ empowers users to make data-driven purchasing decisions that directly impact their bottom line.

### Key Differentiators

1. **AI-First Approach**: Unlike traditional inventory management tools, Invoice IQ leverages cutting-edge AI to understand and structure invoice data automatically.

2. **Multi-Modal Input**: Recognizing that users have different preferences, Invoice IQ supports manual entry, photo uploads (OCR), and natural language prompts.

3. **Purchase Intelligence Focus**: Beyond simple record-keeping, Invoice IQ delivers actionable insights—price trends, supplier performance, spending patterns.

4. **Minimal Friction**: Designed for the busy business owner, Invoice IQ commits to reducing data entry time to under 10 seconds per transaction.

5. **Scalable Architecture**: Built on modern cloud-native technologies, Invoice IQ scales effortlessly from single-user to enterprise deployments.

### Business Impact

**For Kirana Store Owners:**
- Negotiate better prices with data-backed evidence
- Identify seasonal pricing trends
- Track and optimize supplier relationships

**For Restaurants & Small Businesses:**
- Monitor food cost inflation
- Identify cost-saving opportunities
- Streamline procurement workflows

**For Retailers:**
- Compare supplier pricing at a glance
- Track product margins effectively
- Make informed restocking decisions

### The Road Ahead

Invoice IQ is positioned at the intersection of SaaS, AI, and SMB operations. With a clear roadmap, scalable architecture, and deep focus on user needs, Invoice IQ is poised to become the go-to platform for purchase intelligence in emerging markets.

The combination of intelligent data capture, smart analytics, and user-centric design creates a compelling value proposition that solves real-world problems for hundreds of thousands of small business owners globally.

---

## Appendix

### Technical Specifications

- **Frontend Framework**: Next.js 14+
- **Backend Runtime**: Node.js 18+
- **Database**: MongoDB 5.0+
- **API Style**: RESTful with potential GraphQL additions
- **Authentication**: JWT with refresh tokens
- **Hosting**: AWS, Google Cloud, or equivalent
- **CI/CD**: GitHub Actions / GitLab CI

### Deployment Guide

**Docker Setup:**
```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "dist/index.js"]
```

**Environment Variables:**
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/invoiceiq
JWT_SECRET=your_jwt_secret_key
OPENAI_API_KEY=sk-xxx...
AWS_REGION=ap-south-1
AWS_S3_BUCKET=invoiceiq-invoices
NODE_ENV=production
```

### Support & Contribution

For issues, feature requests, or contributions, please refer to the project's GitHub repository documentation.

---

**Document Version**: 1.0  
**Last Updated**: March 2026  
**Author**: Invoice IQ Documentation Team
