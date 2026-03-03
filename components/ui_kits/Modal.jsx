"use client"

import * as Dialog from "@radix-ui/react-dialog"
import { X } from "lucide-react"

export function Modal({ open, onOpenChange, children, title, description }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <Dialog.Content className="fixed z-50 w-full max-w-lg left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-background border border-border rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            {title && <Dialog.Title className="text-lg font-bold">{title}</Dialog.Title>}
            <Dialog.Close asChild>
              <button className="p-1 hover:bg-muted rounded-lg transition-colors">
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>
          {description && (
            <Dialog.Description className="text-sm text-muted-foreground mb-4">
              {description}
            </Dialog.Description>
          )}
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}