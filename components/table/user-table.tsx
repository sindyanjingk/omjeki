'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Trash, Pencil, Plus } from 'lucide-react';
import { createProduct, deleteProduct, updateProduct } from '@/lib/action/product';
import ProductModal from '../modal/product-modal';
import { Prisma } from '@prisma/client';
import { deleteSeller } from '@/lib/action/seller';
import SellerModal from '../modal/seller-modal';

export default function UserTable({ initialSeller }: { initialSeller: Prisma.UserWhereInput[] }) {
    const [modalOpen, setModalOpen] = useState(false);
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
                        <th className="p-2 text-left">Email</th>
                        <th className="p-2 text-left">Total Produk</th>
                        <th className="p-2 text-left">Kecamatan</th>
                        <th className="p-2 text-left">Kelurahan</th>
                        <th className="p-2 text-left">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {initialSeller.map((item, index) => (
                        <tr key={index} className="border-t">
                            <td className="p-2">{item.name as string || ""}</td>
                            <td className="p-2">{item.email as string || ""}</td>
                            {/* <td className="p-2">{(item?.products as any[])?.length || 0}</td>
                            <td className="p-2">{item?.addresses?.kecamatan as string || ""}</td>
                            <td className="p-2">{item?.addresses?.kelurahan as string || ""}</td> */}
                            <td className="p-2 flex gap-2">
                                <Button size="sm" onClick={() => {
                                    //   setEditingProduct(p);
                                    //   setModalOpen(true);
                                }}><Pencil className="w-4 h-4" /></Button>
                                <Button size="sm" variant="destructive" onClick={() => deleteSeller(item.id as string || "")}>
                                    <Trash className="w-4 h-4" />
                                </Button>
                            </td>
                        </tr>

                    ))}
                    {initialSeller.length === 0 && <tr>
                        <td colSpan={6} className="text-center py-4">
                            No Data
                        </td>
                    </tr>
                    }
                </tbody>
            </table>

            <SellerModal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                }}
                onSubmit={() => { }}
            />
        </div>
    );
}
