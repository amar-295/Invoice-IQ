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
export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredSellers = MOCK_SUPPLIERS.filter(s => 
    activeCategory === "All" || s.category === activeCategory
  );

  return (
    <div className="responsive-layout">
      <Sidebar />

      <main className="app-content relative min-h-screen shadow-2xl md:my-4 md:rounded-xl md:border md:border-border/40 overflow-hidden flex flex-col">
        <TopNav />
        
        <div className="flex-1 p-6 space-y-6 overflow-y-auto pb-24 md:pb-8">
          {/* Header Section */}
          <header className="flex justify-between items-end px-1 border-b border-border/10 pb-4">
            <div className="space-y-0.5">
              <h1 className="text-2xl font-bold text-primary tracking-tight">Sellers</h1>
              <p className="text-[13px] text-muted-foreground font-semibold">
                Amar Kirana Store • {MOCK_SUPPLIERS.length} Distributors
              </p>
            </div>
            <Button size="sm" className="hidden md:flex h-9 gap-2 font-bold shadow-md shadow-primary/10">
              <Plus className="w-4 h-4" /> Create Seller
            </Button>
          </header>

          {/* Category Filter Chips */}
          <section className="flex gap-2 overflow-x-auto pb-4 no-scrollbar px-1 -mx-1">
            {CATEGORIES.map(cat => (
              <Chip 
                key={cat} 
                label={cat} 
                active={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
              />
            ))}
          </section>
          
          <div className="grid grid-cols-1 gap-6">
            <Card className="border-border/40 glow-shadow overflow-hidden min-h-[400px]">
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

          {/* PRD CTA Buttons - Placed at bottom/post-data */}
          <section className="grid grid-cols-2 gap-4 px-1 py-4">
            <Button size="lg" className="h-12 text-sm font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95">
              Add Delivery
            </Button>
            <Button variant="outline" size="lg" className="h-12 text-sm font-bold border-2 hover:bg-muted transition-all">
              View Sellers
            </Button>
          </section>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
