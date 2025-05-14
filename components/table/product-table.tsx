'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Trash, Pencil, Plus, EyeIcon } from 'lucide-react';
import { createProduct, deleteProduct, updateProduct } from '@/lib/action/product';
import ProductModal from '../modal/product-modal';
import { Prisma } from '@prisma/client';
import ShowProductModal from '../modal/product/show-product-modal';
import UpdateProductModal from '../modal/product/update-product';

export default function ProductTable({ initialProducts, sellers }: { initialProducts: Prisma.ProductWhereInput[], sellers: Prisma.SellerWhereInput[] }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [showOpen, setShowOpen] = useState(false);
  const [showEdit, setIsEdit] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Prisma.ProductWhereInput | null>(null);

  const transformSellers = sellers.map((item) => ({
    label: String(item.name || ""),
    value: String(item.id || "")
  }))

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
    window.location.reload();
  }


  return (
    <div className='w-full'>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Product List</h1>
        <Button onClick={() => setModalOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add</Button>
      </div>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Price</th>
            <th className="p-2 text-left">Qty</th>
            <th className="p-2 text-left">Seller</th>
            <th className="p-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {initialProducts.map((p, index) => (
            <tr key={index} className="border-t">
              <td className="p-2">{p.name as string || ""}</td>
              <td className="p-2">{p.price as string || ""}</td>
              <td className="p-2">{p.quantity as string || ""}</td>
              <td className="p-2">{p.seller?.name as string || ""}</td>
              <td className="p-2 flex gap-2">
                <Button size="sm" onClick={() => {
                  setSelectedProduct(p);
                  setIsEdit(true);
                 }}>
                  <Pencil className="w-4 h-4" /></Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(p.id as string || "")}>
                  <Trash className="w-4 h-4" />
                </Button>
                <Button size={"sm"} variant={"outline"} onClick={() => {
                  setSelectedProduct(p)
                  setShowOpen(true)
                }}>
                  <EyeIcon className='w-4 h-4' />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <UpdateProductModal
        sellers={transformSellers}
        isOpen={showEdit}
        onClose={() => {
          setIsEdit(false);
        }}
        product={selectedProduct!}
      />
      <ShowProductModal
        isOpen={showOpen}
        onClose={() => {
          setShowOpen(false);
        }}
        product={selectedProduct!}
      />

      <ProductModal
        sellers={transformSellers}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
        onSubmit={() => { }}
      />
    </div>
  );
}