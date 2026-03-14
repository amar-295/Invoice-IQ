"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TopNav } from "@/components/layout/TopNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { SellerCard } from "@/components/sellers/SellerCard";
import { Card, CardContent } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { MOCK_SUPPLIERS, CATEGORIES } from "@/lib/mock-data";
import { Plus } from "lucide-react";

/**
 * PRD Alignment: Home is Sellers List
 * 
 * Audit Implementation:
 * 1. Category Filter Chips added at top.
 * 2. Header renamed to "Sellers".
 * 3. Cards show Spike Counts and Item Counts.
 * 4. Realistic Kirana Supplier names used.
 */
export default function SellersPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredSellers = MOCK_SUPPLIERS.filter(s => 
    activeCategory === "All" || s.category === activeCategory
  );

  return (
    <div className="responsive-layout bg-muted">
      <Sidebar />

      <main className="app-content relative min-h-screen shadow-2xl md:my-4 md:rounded-3xl md:border md:border-border/40 overflow-hidden flex flex-col bg-surface">
        {/* Decorative Background Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-secondary/5 blur-[100px] rounded-full pointer-events-none" />

        <TopNav />
        
        <div className="flex-1 p-6 md:p-10 space-y-12 overflow-y-auto pb-32 md:pb-16 z-10 pt-12">
          {/* Header Section */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
            <div className="space-y-2">
              <h1 className="text-5xl font-black text-primary tracking-tighter leading-none">Sellers</h1>
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <span className="w-2 h-2 rounded-full bg-green-500 block" />
                  <span className="w-2 h-2 rounded-full bg-green-500 absolute inset-0 animate-ping opacity-75" />
                </div>
                <p className="text-[14px] text-muted-foreground font-bold tracking-tight">
                  Amar Kirana Store • {MOCK_SUPPLIERS.length} Active Distributors
                </p>
              </div>
            </div>
            <Button variant="premium" className="px-8 h-12 gap-2 text-sm shadow-btn">
              <Plus className="w-4 h-4 stroke-[3px]" /> Create Seller
            </Button>
          </header>

          {/* Category Filter Chips */}
          <div className="space-y-5">
            <h2 className="text-[11px] font-black text-muted-foreground/70 uppercase tracking-[0.2em] px-1">Filter by Category</h2>
            <section className="flex gap-3 overflow-x-auto pb-2 no-scrollbar px-1 -mx-1">
              {CATEGORIES.map(cat => (
                <Chip 
                  key={cat} 
                  label={cat} 
                  active={activeCategory === cat}
                  onClick={() => setActiveCategory(cat)}
                  className="transition-all duration-300"
                />
              ))}
            </section>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <Card className="border-border/40 shadow-card overflow-hidden min-h-[400px] rounded-3xl">
              <CardContent className="p-0">
                {filteredSellers.length > 0 ? (
                  filteredSellers.map((seller) => (
                    <SellerCard key={seller.id} seller={seller} />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center space-y-3 px-6">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                      <Plus className="text-muted-foreground w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">No sellers found</h3>
                      <p className="text-xs text-muted-foreground max-w-[200px]">Try a different category or add a new seller to start tracking.</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
