'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

const DocumentationPage = () => {
  const [tocItems] = useState<TOCItem[]>([
    { id: 'introduction', title: 'Introduction', level: 1 },
    { id: 'problem-statement', title: 'Problem Statement', level: 1 },
    { id: 'solution-overview', title: 'Solution Overview', level: 1 },
    { id: 'core-features', title: 'Core Features', level: 1 },
    { id: 'system-architecture', title: 'System Architecture', level: 1 },
    { id: 'database-design', title: 'Database Design', level: 1 },
    { id: 'data-flow', title: 'Data Flow', level: 1 },
    { id: 'api-design', title: 'API Design', level: 1 },
    { id: 'ui-ux-overview', title: 'UI/UX Overview', level: 1 },
    { id: 'performance-scalability', title: 'Performance & Scalability', level: 1 },
    { id: 'future-enhancements', title: 'Future Enhancements', level: 1 },
    { id: 'conclusion', title: 'Conclusion', level: 1 },
  ]);

  const [showTableOfContents, setShowTableOfContents] = useState(true);

  return (
    <div className="min-h-screen pt-36 bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Invoice IQ
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-2">
            AI-Powered Purchase Intelligence Platform
          </p>
          <p className="text-slate-500 dark:text-slate-500">
            Complete Technical Documentation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar TOC */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <button
                onClick={() => setShowTableOfContents(!showTableOfContents)}
                className="lg:hidden mb-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
              >
                {showTableOfContents ? 'Hide' : 'Show'} Table of Contents
              </button>

              {showTableOfContents && (
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                    Table of Contents
                  </h2>
                  <nav className="space-y-2">
                    {tocItems.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className="block text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors py-1"
                      >
                        {item.title}
                      </a>
                    ))}
                  </nav>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <article className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 md:p-12">
              {/* Introduction */}
              <section id="introduction" className="mb-12">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                  Introduction
                </h2>
                <div className="text-slate-700 dark:text-slate-300 space-y-4">
                  <p>
                    <strong>Invoice IQ</strong> is an AI-powered purchase intelligence platform designed to help users track, manage, and analyze purchases made from multiple suppliers. Built with modern cloud-native technologies, Invoice IQ transforms unstructured invoice data into actionable business intelligence through a seamless combination of OCR, machine learning, and intelligent analytics.
                  </p>

                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mt-6 mb-3">
                    Product Tier
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
                    <li>SaaS (Software as a Service)</li>
                    <li>B2B Focus</li>
                    <li>Mobile-first responsive design</li>
                    <li>Real-time analytics and insights</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mt-6 mb-3">
                    Target Users
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
                    <li>Kirana store owners</li>
                    <li>Retail shop operators (electronics, cosmetics, etc.)</li>
                    <li>Restaurant and small business managers</li>
                    <li>Household expense trackers</li>
                    <li>Any business requiring purchase order visibility</li>
                  </ul>
                </div>
              </section>

              <hr className="my-12 border-slate-200 dark:border-slate-700" />

              {/* Problem Statement */}
              <section id="problem-statement" className="mb-12">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                  Problem Statement
                </h2>
                <div className="text-slate-700 dark:text-slate-300 space-y-6">
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                    Current Market Pain Points
                  </h3>

                  <div className="space-y-4">
                    <div className="border-l-4 border-red-500 pl-4 py-2">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                        Data Loss & Fragmentation
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Invoice data scattered across paper documents, WhatsApp messages, and memory</li>
                        <li>No centralized record-keeping system</li>
                        <li>High risk of data loss</li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-amber-500 pl-4 py-2">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                        Lack of Historical Visibility
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Unable to track pricing changes over time</li>
                        <li>Cannot identify seasonal pricing trends</li>
                        <li>No audit trail for financial reconciliation</li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-orange-500 pl-4 py-2">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                        Inefficient Supplier Comparison
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Manual analysis required to compare supplier pricing</li>
                        <li>Time-consuming spreadsheet maintenance</li>
                        <li>Difficult to identify best-value suppliers</li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-yellow-500 pl-4 py-2">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                        Poor Financial Intelligence
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>No clear visibility into spending patterns</li>
                        <li>Cannot forecast future expenses</li>
                        <li>Difficult to optimize procurement strategy</li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-rose-500 pl-4 py-2">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                        Manual Data Entry Burden
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Time-consuming manual entry processes</li>
                        <li>High error rates in data capture</li>
                        <li>Inconsistent product naming and categorization</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mt-4">
                    <h4 className="font-semibold text-red-900 dark:text-red-200 mb-2">
                      Business Impact
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-red-800 dark:text-red-300">
                      <li>Significant operational overhead</li>
                      <li>Suboptimal purchasing decisions</li>
                      <li>Inability to leverage supplier discounts through data-driven negotiation</li>
                      <li>Poor cash flow visibility</li>
                    </ul>
                  </div>
                </div>
              </section>

              <hr className="my-12 border-slate-200 dark:border-slate-700" />

              {/* Solution Overview */}
              <section id="solution-overview" className="mb-12">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                  Solution Overview
                </h2>
                <div className="text-slate-700 dark:text-slate-300 space-y-6">
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                    Core Value Proposition
                  </h3>
                  <p>
                    Invoice IQ eliminates the friction of purchase data management by providing:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { title: 'Multiple Data Entry Modalities', desc: 'Choose your preferred method (manual, OCR, or natural language)' },
                      { title: 'Intelligent Data Normalization', desc: 'AI automatically cleans, validates, and structures raw data' },
                      { title: 'Smart Product Matching', desc: 'Prevents duplicates and ensures consistency across records' },
                      { title: 'Real-Time Analytics', desc: 'Comprehensive dashboards with instant insights' },
                      { title: 'Price Intelligence', desc: 'Automatic detection of price changes and trend analysis' },
                      { title: 'Supplier Analytics', desc: 'Deep insights into supplier performance and spending patterns' },
                    ].map((feature, idx) => (
                      <div key={idx} className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                        <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                          {feature.title}
                        </h4>
                        <p className="text-sm text-blue-800 dark:text-blue-300">{feature.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <hr className="my-12 border-slate-200 dark:border-slate-700" />

              {/* Core Features */}
              <section id="core-features" className="mb-12">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                  Core Features
                </h2>
                <div className="text-slate-700 dark:text-slate-300 space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
                      1. Multi-Mode Delivery Entry
                    </h3>
                    <p>
                      Invoice IQ supports three distinct modes of data entry, optimized for different user preferences and scenarios:
                    </p>

                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                        <h4 className="font-bold text-purple-900 dark:text-purple-200 mb-2">
                          Manual Entry
                        </h4>
                        <p className="text-sm text-purple-800 dark:text-purple-300 mb-2">
                          Perfect for users who prefer direct control and have structured data.
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-sm text-purple-800 dark:text-purple-300">
                          <li>Select supplier from existing list or create new</li>
                          <li>Smart autocomplete for products</li>
                          <li>Enter quantity, price, and date</li>
                          <li>System validates input and suggests matching products</li>
                        </ul>
                      </div>

                      <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                        <h4 className="font-bold text-green-900 dark:text-green-200 mb-2">
                          Photo Upload (OCR + AI)
                        </h4>
                        <p className="text-sm text-green-800 dark:text-green-300 mb-2">
                          Best for invoice digitization at point of purchase.
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-sm text-green-800 dark:text-green-300">
                          <li>Upload invoice images (JPG, PNG, PDF)</li>
                          <li>OCR extracts text automatically</li>
                          <li>AI parses and structures data</li>
                          <li>User review interface for verification</li>
                        </ul>
                      </div>

                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                        <h4 className="font-bold text-blue-900 dark:text-blue-200 mb-2">
                          AI Prompt Entry
                        </h4>
                        <p className="text-sm text-blue-800 dark:text-blue-300 mb-2">
                          Fastest method for users who prefer conversational input.
                        </p>
                        <ul className="list-disc list-inside space-y-1 text-sm text-blue-800 dark:text-blue-300">
                          <li>Describe purchase in natural language</li>
                          <li>AI converts to structured format</li>
                          <li>System suggests products and sellers</li>
                          <li>One-click confirmation</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
                      2. Smart Product Matching System
                    </h3>
                    <p>
                      The intelligent product matching system is the backbone of data quality in Invoice IQ.
                    </p>
                    <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4">
                      <ul className="list-disc list-inside space-y-2 text-slate-800 dark:text-slate-200">
                        <li>Fuzzy matching algorithm with typo tolerance</li>
                        <li>Case-insensitive and whitespace handling</li>
                        <li>Phonetic matching for commonly misspelled items</li>
                        <li>Prevents duplicate product entries</li>
                        <li>85% similarity threshold for auto-matching</li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
                      3. Delivery Management System
                    </h3>
                    <p>
                      Centralized repository for all purchase records with powerful querying capabilities. Fast retrieval by userId, sellerId, productId, or date range.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
                      4. Price Change Detection
                    </h3>
                    <p>
                      Intelligent price monitoring system that identifies opportunities and alerts users to changes. Detects price variations &gt; 10% automatically.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
                      5. Analytics Dashboard
                    </h3>
                    <p>
                      Real-time business intelligence dashboards providing:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
                      <li>Total spend metrics (time-based)</li>
                      <li>Active suppliers count</li>
                      <li>Spending over time (line chart)</li>
                      <li>Supplier comparison (bar chart)</li>
                      <li>Top products (horizontal bar chart)</li>
                      <li>Price alerts and trends</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
                      6. Seller Management
                    </h3>
                    <p>
                      Add and manage suppliers with detailed analytics including total spend, purchase history, and drill-down capabilities.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
                      7. Product-Level Insights
                    </h3>
                    <p>
                      Deep product analytics for informed purchasing decisions including price trends, supplier mix, and purchase frequency.
                    </p>
                  </div>
                </div>
              </section>

              <hr className="my-12 border-slate-200 dark:border-slate-700" />

              {/* System Architecture */}
              <section id="system-architecture" className="mb-12">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                  System Architecture
                </h2>
                <div className="text-slate-700 dark:text-slate-300 space-y-6">
                  <p>
                    Invoice IQ is built on a modern, scalable architecture supporting the full data pipeline from user input to actionable intelligence.
                  </p>

                  <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                    Technology Stack
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                        Frontend
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Next.js with TypeScript</li>
                        <li>Tailwind CSS</li>
                        <li>React Context API</li>
                        <li>Recharts for data visualization</li>
                        <li>Axios HTTP client</li>
                      </ul>
                    </div>

                    <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                        Backend
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Node.js + Express.js</li>
                        <li>TypeScript</li>
                        <li>JWT Authentication</li>
                        <li>Bcrypt for password hashing</li>
                        <li>Input validation (Zod/Joi)</li>
                      </ul>
                    </div>

                    <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                        Database
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>MongoDB (Primary)</li>
                        <li>Strategic indexing</li>
                        <li>Redis caching (optional)</li>
                        <li>Cloud Atlas or self-hosted</li>
                      </ul>
                    </div>

                    <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                        External Services
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>AWS Textract (OCR)</li>
                        <li>OpenAI GPT-4 (AI)</li>
                        <li>AWS S3 (Storage)</li>
                        <li>SendGrid (Email)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <hr className="my-12 border-slate-200 dark:border-slate-700" />

              {/* Database Design */}
              <section id="database-design" className="mb-12">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                  Database Design
                </h2>
                <div className="text-slate-700 dark:text-slate-300 space-y-6">
                  <p>
                    MongoDB collections with strategic indexing for optimal query performance and data integrity.
                  </p>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                      Collections
                    </h3>
                    <div className="space-y-3">
                      {[
                        { name: 'Users', desc: 'User profiles and authentication' },
                        { name: 'Sellers', desc: 'Supplier information and contacts' },
                        { name: 'Products', desc: 'Product catalog with normalized names' },
                        { name: 'Deliveries', desc: 'Purchase records with full lineage' },
                        { name: 'Alerts', desc: 'Price change notifications' },
                      ].map((col, idx) => (
                        <div key={idx} className="flex items-start space-x-4 p-3 bg-slate-100 dark:bg-slate-700 rounded">
                          <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-bold flex-shrink-0">
                            {idx + 1}
                          </span>
                          <div>
                            <h4 className="font-semibold text-slate-900 dark:text-white">
                              {col.name}
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {col.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="text-sm italic text-slate-600 dark:text-slate-400">
                    Full MongoDB schema validation, indexes, and relationships are documented in the complete documentation file.
                  </p>
                </div>
              </section>

              <hr className="my-12 border-slate-200 dark:border-slate-700" />

              {/* Data Flow */}
              <section id="data-flow" className="mb-12">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                  Data Flow
                </h2>
                <div className="text-slate-700 dark:text-slate-300 space-y-6">
                  <p>
                    Invoice IQ implements a sophisticated data pipeline that handles multiple input modalities and transforms raw data into structured, actionable intelligence.
                  </p>

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                    <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-4">
                      Complete Flow Steps
                    </h3>
                    <ol className="space-y-3 list-decimal list-inside text-sm text-blue-800 dark:text-blue-300">
                      <li>User selects input method (Manual, Photo, or Prompt)</li>
                      <li>Frontend validates input and uploads to cloud storage if needed</li>
                      <li>OCR/AI processing extracts and structures data</li>
                      <li>Normalization cleans and standardizes values</li>
                      <li>Fuzzy matching identifies existing products and prevents duplicates</li>
                      <li>User review confirmation step</li>
                      <li>Database insertion with all statistics updates</li>
                      <li>Alerts generated for price changes</li>
                      <li>Real-time dashboard update for user</li>
                    </ol>
                  </div>
                </div>
              </section>

              <hr className="my-12 border-slate-200 dark:border-slate-700" />

              {/* API Design */}
              <section id="api-design" className="mb-12">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                  API Design
                </h2>
                <div className="text-slate-700 dark:text-slate-300 space-y-6">
                  <p>
                    RESTful API with comprehensive endpoints for all operations. Complete request/response examples provided in full documentation.
                  </p>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                      API Endpoint Categories
                    </h3>
                    {[
                      { method: 'POST', path: '/api/auth/signup', desc: 'User registration' },
                      { method: 'POST', path: '/api/auth/login', desc: 'User login' },
                      { method: 'POST', path: '/api/deliveries', desc: 'Create delivery (manual entry)' },
                      { method: 'POST', path: '/api/deliveries/process-photo', desc: 'Process invoice photo (OCR)' },
                      { method: 'POST', path: '/api/deliveries/process-prompt', desc: 'Process natural language prompt' },
                      { method: 'GET', path: '/api/deliveries', desc: 'Get deliveries with filters' },
                      { method: 'GET', path: '/api/products/:id/insights', desc: 'Get product insights' },
                      { method: 'GET', path: '/api/sellers/:id', desc: 'Get seller analytics' },
                      { method: 'GET', path: '/api/analytics/dashboard', desc: 'Get dashboard data' },
                    ].map((endpoint, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-700 rounded border-l-4 border-blue-500"
                      >
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className={`px-2 py-1 text-xs font-bold rounded ${
                              endpoint.method === 'POST'
                                ? 'bg-green-200 text-green-900 dark:bg-green-800 dark:text-green-200'
                                : 'bg-blue-200 text-blue-900 dark:bg-blue-800 dark:text-blue-200'
                            }`}>
                              {endpoint.method}
                            </span>
                            <code className="text-sm font-mono text-slate-900 dark:text-white">
                              {endpoint.path}
                            </code>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {endpoint.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <hr className="my-12 border-slate-200 dark:border-slate-700" />

              {/* UI/UX Overview */}
              <section id="ui-ux-overview" className="mb-12">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                  UI/UX Overview
                </h2>
                <div className="text-slate-700 dark:text-slate-300 space-y-6">
                  <p>
                    Invoice IQ features a modern, dark/light mode SaaS dashboard with mobile-first responsive design.
                  </p>

                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                    Design System
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: 'Primary', color: 'bg-blue-600' },
                      { label: 'Success', color: 'bg-green-600' },
                      { label: 'Warning', color: 'bg-amber-600' },
                      { label: 'Danger', color: 'bg-red-600' },
                    ].map((col, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className={`${col.color} w-full h-12 rounded`}></div>
                        <p className="text-xs font-semibold text-slate-900 dark:text-white">
                          {col.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mt-6">
                    Key User Experience Principles
                  </h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li><strong>Minimal Input Effort</strong>: &lt; 10 seconds per entry</li>
                    <li><strong>Mobile-First Design</strong>: Touch-friendly on all devices</li>
                    <li><strong>Visual Clarity</strong>: Avoids information overload</li>
                    <li><strong>Dark/Light Mode</strong>: System preference detection</li>
                    <li><strong>Accessibility</strong>: WCAG 2.1 AA compliance</li>
                  </ul>
                </div>
              </section>

              <hr className="my-12 border-slate-200 dark:border-slate-700" />

              {/* Performance & Scalability */}
              <section id="performance-scalability" className="mb-12">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                  Performance & Scalability
                </h2>
                <div className="text-slate-700 dark:text-slate-300 space-y-6">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                    Performance Targets
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { metric: 'First Contentful Paint', target: '< 1.5s' },
                      { metric: 'Largest Contentful Paint', target: '< 2.5s' },
                      { metric: 'Time to Interactive', target: '< 3.5s' },
                      { metric: 'Lighthouse Score', target: '> 90' },
                    ].map((perf, idx) => (
                      <div key={idx} className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                          {perf.metric}
                        </p>
                        <p className="font-bold text-green-700 dark:text-green-300">
                          {perf.target}
                        </p>
                      </div>
                    ))}
                  </div>

                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mt-6">
                    Scaling Strategy
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                        Phase 1: Foundation (0-1000 users)
                      </h4>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        <li>Single backend instance</li>
                        <li>MongoDB Atlas shared cluster</li>
                        <li>CDN for static assets</li>
                      </ul>
                    </div>

                    <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                        Phase 2: Growth (1000-10k users)
                      </h4>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        <li>Load-balanced backend (2-3 instances)</li>
                        <li>MongoDB with read replicas</li>
                        <li>Redis caching layer</li>
                      </ul>
                    </div>

                    <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                        Phase 3: Enterprise (10k+ users)
                      </h4>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        <li>Auto-scaling backend (Kubernetes)</li>
                        <li>MongoDB sharded cluster</li>
                        <li>Multi-region deployment</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <hr className="my-12 border-slate-200 dark:border-slate-700" />

              {/* Future Enhancements */}
              <section id="future-enhancements" className="mb-12">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                  Future Enhancements
                </h2>
                <div className="text-slate-700 dark:text-slate-300 space-y-6">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                    Short-Term (3-6 months)
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
                    <li>Advanced price analytics and forecasting</li>
                    <li>Bulk import features (CSV, Excel, API)</li>
                    <li>Notification system (Email, Slack, Telegram)</li>
                    <li>Export & reporting capabilities</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mt-6">
                    Medium-Term (6-12 months)
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
                    <li>AI-powered insights and anomaly detection</li>
                    <li>Native mobile applications (iOS/Android)</li>
                    <li>Supplier portal for two-way communication</li>
                    <li>Multi-currency and multi-language support</li>
                  </ul>

                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mt-6">
                    Long-Term (1-2 years)
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
                    <li>Marketplace integration and automated procurement</li>
                    <li>Advanced analytics suite and financial modeling</li>
                    <li>Public API and ERP system integrations</li>
                    <li>White-label solution for resellers</li>
                  </ul>
                </div>
              </section>

              <hr className="my-12 border-slate-200 dark:border-slate-700" />

              {/* Conclusion */}
              <section id="conclusion" className="mb-12">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                  Conclusion
                </h2>
                <div className="text-slate-700 dark:text-slate-300 space-y-6">
                  <p>
                    <strong>Invoice IQ</strong> represents a paradigm shift in how small businesses and retailers manage their procurement operations. By eliminating manual data entry, leveraging AI for intelligent processing, and providing actionable insights, Invoice IQ empowers users to make data-driven purchasing decisions that directly impact their bottom line.
                  </p>

                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                    Key Differentiators
                  </h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li><strong>AI-First Approach</strong>: Leverages cutting-edge AI to understand and structure invoice data automatically</li>
                    <li><strong>Multi-Modal Input</strong>: Supports manual entry, photo uploads (OCR), and natural language prompts</li>
                    <li><strong>Purchase Intelligence Focus</strong>: Delivers actionable insights beyond simple record-keeping</li>
                    <li><strong>Minimal Friction</strong>: Reduces data entry time to under 10 seconds per transaction</li>
                    <li><strong>Scalable Architecture</strong>: Built on modern cloud-native technologies</li>
                  </ul>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800 mt-6">
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-4">
                      Business Impact
                    </h3>
                    <ul className="space-y-2 text-blue-800 dark:text-blue-300">
                      <li className="flex items-start space-x-3">
                        <span className="text-2xl">🛒</span>
                        <span><strong>Kirana Store Owners</strong>: Negotiate better prices with data-backed evidence</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="text-2xl">🍽️</span>
                        <span><strong>Restaurants</strong>: Monitor food cost inflation and optimize spending</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <span className="text-2xl">🏪</span>
                        <span><strong>Retailers</strong>: Compare supplier pricing and track product margins</span>
                      </li>
                    </ul>
                  </div>

                  <p className="text-sm italic text-slate-600 dark:text-slate-400 mt-6">
                    Invoice IQ is positioned at the intersection of SaaS, AI, and SMB operations. With a clear roadmap, scalable architecture, and deep focus on user needs, Invoice IQ is poised to become the go-to platform for purchase intelligence.
                  </p>
                </div>
              </section>

              {/* CTA Section */}
              <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-8 text-white">
                  <h3 className="text-2xl font-bold mb-2">
                    Ready to Transform Your Procurement?
                  </h3>
                  <p className="text-blue-100 mb-6">
                    Join businesses already using Invoice IQ to make smarter purchasing decisions.
                  </p>
                  <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors">
                    Get Started Today
                  </button>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;
