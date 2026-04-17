"use client";

import { Modal } from "@/components/ui_kits/Modal";
import { Button } from "@/components/ui_kits/Button";
import { Sparkles } from "lucide-react";
import { FEATURE_CONFIG, DEFAULT_CONFIG } from "@/lib/utils"


export function SubscribeModal({ open, onOpenChange, feature }) {
  const config = FEATURE_CONFIG[feature] || DEFAULT_CONFIG;

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Go pro!"
      description=""
    >
      <div className="flex flex-col items-center gap-5 text-center">

        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          {config.icon}
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold">{config.title}</h2>
          <p className="text-sm text-muted-foreground">{config.description}</p>
        </div>

        <div className="w-full bg-muted rounded-xl p-4 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            What you get
          </p>
          {config.perks.map((perk, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <span className="text-primary text-xs">✓</span>
              </div>
              <span>{perk}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-semibold text-primary">Subscribe to unlock</span>
        </div>

        <div className="flex gap-3 w-full">
          <Button
            variant="outline"
            className="flex-1 bg-transparent"
            onClick={() => onOpenChange(false)}
          >
            Maybe Later
          </Button>
          <Button className="flex-1 gap-2">
            <Sparkles className="h-4 w-4" />
            Upgrade Now
          </Button>
        </div>

      </div>
    </Modal>
  );
}