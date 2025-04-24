
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import { AuthGuard } from "@/components/AuthGuard";
import { toast } from "@/components/ui/sonner";

const Credits = () => {
  const { user, updateCredits } = useAuth();
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);

  const creditPackages = [
    { id: 1, amount: 100, price: "$0.99", originalPrice: "$1.99" },
    { id: 2, amount: 500, price: "$3.99", originalPrice: "$6.99" },
    { id: 3, amount: 1000, price: "$6.99", originalPrice: "$9.99" },
    { id: 4, amount: 2500, price: "$14.99", originalPrice: "$24.99" },
  ];

  const handlePurchase = () => {
    if (!selectedPackage) {
      toast.error("Please select a credit package first");
      return;
    }

    const packageToBuy = creditPackages.find(pkg => pkg.id === selectedPackage);
    if (!packageToBuy) return;

    // Simulate payment processing
    toast.success(`Successfully purchased ${packageToBuy.amount} credits!`);
    
    // Update user credits
    updateCredits(packageToBuy.amount);
    
    // Reset selection
    setSelectedPackage(null);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 container py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold game-font text-primary mb-4 text-center">
              Purchase Credits
            </h1>
            <p className="text-muted-foreground text-center mb-8">
              Buy credits to place bets in tic-tac-toe matches
            </p>

            <Card className="border-border bg-card mb-8">
              <CardHeader>
                <CardTitle className="text-xl">Your Balance</CardTitle>
                <CardDescription>Current available credits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center">
                  <div className="text-4xl font-bold text-primary">{user?.credits || 0}</div>
                  <div className="ml-2 text-muted-foreground">credits</div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {creditPackages.map((pkg) => (
                <Card 
                  key={pkg.id}
                  className={`cursor-pointer transition-all duration-300 hover:border-primary ${
                    selectedPackage === pkg.id ? "border-primary neon-border" : "border-border"
                  }`}
                  onClick={() => setSelectedPackage(pkg.id)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{pkg.amount} Credits</CardTitle>
                    <CardDescription>
                      <span className="line-through text-muted-foreground">{pkg.originalPrice}</span>
                      <span className="ml-2 text-primary font-bold">{pkg.price}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button 
                      variant={selectedPackage === pkg.id ? "default" : "outline"}
                      className="w-full"
                      onClick={() => setSelectedPackage(pkg.id)}
                    >
                      {selectedPackage === pkg.id ? "Selected" : "Select"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="flex justify-center">
              <Button 
                size="lg" 
                onClick={handlePurchase}
                disabled={selectedPackage === null}
                className="px-12"
              >
                Purchase Credits
              </Button>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
};

export default Credits;
