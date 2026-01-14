import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { DialogClose } from "@radix-ui/react-dialog"

export function CancelModal({ modalOpen, onClose, onConfirm, objectId, objectName }) {
    return (
        <Dialog open={modalOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Confirm cancellation</DialogTitle>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" >Back</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button variant="destructive" type="submit" onClick={() => onConfirm(objectId)}>Cancel {objectName}</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
