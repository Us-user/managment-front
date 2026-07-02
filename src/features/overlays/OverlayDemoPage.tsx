import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from '@/components/ui/drawer'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip'

export function OverlayDemoPage() {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmed, setConfirmed] = useState<string | null>(null)

  return (
    <TooltipProvider>
      <div className="mx-auto max-w-xl px-6 py-10 space-y-10">
        <div>
          <h1 className="text-xl font-semibold text-foreground mb-1">B4.2 — Overlays</h1>
          <p className="text-sm text-muted-foreground">
            Modal, Drawer, Confirm dialog, Tooltip — all Radix-based. Focus-trapped, ESC closes,
            accessible roles.
          </p>
        </div>

        {confirmed && (
          <p className="text-sm text-muted-foreground">
            Last action: <span className="font-medium text-foreground">{confirmed}</span>
          </p>
        )}

        {/* ── Modal ─────────────────────────────────────────────────── */}
        <section className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Modal
          </h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open modal</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit work item</DialogTitle>
                <DialogDescription>
                  Make changes to the work item below. Press ESC or click outside to cancel.
                </DialogDescription>
              </DialogHeader>
              <p className="text-sm text-muted-foreground py-2">
                (Form fields would go here in a real screen.)
              </p>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button onClick={() => setConfirmed('Modal — Save clicked')}>Save</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </section>

        {/* ── Drawer ────────────────────────────────────────────────── */}
        <section className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Drawer
          </h2>
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline">Open drawer</Button>
            </DrawerTrigger>
            <DrawerContent side="right" className="max-w-sm">
              <DrawerHeader>
                <DrawerTitle>Work item details</DrawerTitle>
                <DrawerDescription>
                  Slide-in panel. ESC closes. Focus is trapped inside.
                </DrawerDescription>
              </DrawerHeader>
              <div className="flex-1 px-6 py-4 text-sm text-muted-foreground">
                Detail content goes here.
              </div>
              <div className="px-6 pb-6">
                <DrawerClose asChild>
                  <Button
                    className="w-full"
                    onClick={() => setConfirmed('Drawer — Done clicked')}
                  >
                    Done
                  </Button>
                </DrawerClose>
              </div>
            </DrawerContent>
          </Drawer>
        </section>

        {/* ── Confirm dialog ────────────────────────────────────────── */}
        <section className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Confirm dialog
          </h2>
          <Button
            variant="destructive"
            onClick={() => setConfirmOpen(true)}
          >
            <Trash2 className="size-4" />
            Delete item
          </Button>
          <ConfirmDialog
            open={confirmOpen}
            onOpenChange={setConfirmOpen}
            title="Delete this item?"
            description="This action cannot be undone. The item will be permanently removed."
            confirmLabel="Delete"
            onConfirm={() => setConfirmed('Confirm dialog — Delete confirmed')}
          />
        </section>

        {/* ── Tooltip ───────────────────────────────────────────────── */}
        <section className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Tooltip
          </h2>
          <div className="flex gap-3 flex-wrap">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Delete">
                  <Trash2 className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete item</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Hover me</Button>
              </TooltipTrigger>
              <TooltipContent side="right">Tooltip on the right</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Bottom</Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Tooltip below</TooltipContent>
            </Tooltip>
          </div>
        </section>
      </div>
    </TooltipProvider>
  )
}
