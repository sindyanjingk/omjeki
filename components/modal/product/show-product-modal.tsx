import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Prisma } from '@prisma/client';
import React from 'react'

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Prisma.ProductWhereInput
}

export default function ShowProductModal({
    isOpen,
    onClose,
    product
}: ProductModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{product?.name as string || ""}</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 text-md">
                    <div>{product?.description as string || ""}</div>
                </div>
                <div className="text-md">Seller : {product?.seller?.name as string || ""} </div>
                <div className="text-md">Price : {product?.price as number || 0} </div>
                <div className="text-md">Quantity : {product?.quantity as number || 0} </div>
            </DialogContent>
        </Dialog>
    )
}
