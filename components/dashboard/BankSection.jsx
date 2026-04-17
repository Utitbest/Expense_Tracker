"use client"
import React, { useState } from "react";
import { Button } from "@/components/ui_kits/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui_kits/Card";
import { Plus, Shield, Trash2, CheckCircle2 } from "lucide-react";
import { SubscribeModal } from "@/components/dashboard/SubscribeModal";

const linkedCards = [
  {
    id: 1,
    type: "Visa",
    last4: "4242",
    name: "John's Visa",
    status: "connected",
    color: "#1A1F71",
  },
  {
    id: 2,
    type: "Mastercard",
    last4: "5555",
    name: "Business Card",
    status: "connected",
    color: "#EB001B",
  },
  {
    id: 3,
    type: "American Express",
    last4: "3782",
    name: "Premium Card",
    status: "pending",
    color: "#006FCF",
  },
];

export function BankLinkingSection() {
  const [cards, setCards] = useState(linkedCards);
  const [showLinkingFlow, setShowLinkingFlow] = useState(false);
  const [subscribeModal, setSubscribeModal] = useState({ open: false, feature: "" });
  const openSubscribeModal = (feature) => {
    setSubscribeModal({ open: true, feature });
  };
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <svg
            className="h-5 w-5 text-primary"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <rect x="2" y="5" width="20" height="12" rx="1" strokeWidth="2" />
            <path d="M2 10h20" strokeWidth="2" />
          </svg>
          <div className="flex-1">
            <CardTitle>Bank Cards & Accounts</CardTitle>
            <CardDescription>
              Link your financial accounts for automatic transaction sync
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showLinkingFlow ? (
          <div className="bg-muted p-6 rounded-lg border-2 border-dashed border-border">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Secure Bank Connection</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Click below to securely connect your bank account. Your
                  credentials are never shared with us.
                </p>
              </div>
              <div className="space-y-2">
                <Button className="w-full">Connect Bank Account</Button>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => setShowLinkingFlow(false)}
                >
                  Cancel
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                We support connections with 10,000+ banks worldwide using
                bank-grade encryption
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* <div className="space-y-3">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div
                        className="w-12 h-8 rounded flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: card.color }}
                      >
                        {card.type.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{card.name}</p>
                          {card.status === "connected" && (
                            <CheckCircle2 className="h-4 w-4 text-accent" />
                          )}
                          {card.status === "pending" && (
                            <div className="px-2 py-1 bg-yellow-500/10 text-yellow-700 text-xs rounded">
                              Pending
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {card.type} ending in {card.last4}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div> */}

            <Button
              onClick={() => {
                // setShowLinkingFlow(true)
                openSubscribeModal()
              }}
              variant="outline"
              className="w-full gap-2 bg-transparent"
            >
              <Plus className="h-4 w-4" />
              Link New Card or Account
            </Button>
          </>
        )}

        {!showLinkingFlow && (
          <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
            <p className="text-sm text-foreground">
              <span className="font-semibold">Secure & Private:</span> Your
              financial data is encrypted and never shared. We only access
              transaction history for reconciliation.
            </p>
          </div>
        )}
      </CardContent>
      <SubscribeModal
        open={subscribeModal.open}
        onOpenChange={(val) => setSubscribeModal({ ...subscribeModal, open: val })}
        feature={subscribeModal.feature}
      /> 
    </Card>
  );
}
