'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { addProductSellerImage } from '@/lib/action/product';
import { ScrollArea } from '../ui/scroll-area';
import { useForm, Controller } from 'react-hook-form';
import { Loader2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select';

export interface ProductFormData {
  id?: string;
  name: string;
  price: number;
  quantity: number;
  description?: string;
  sellerId?: string;
  image?: File | null;
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => void;
  sellers: { label: string; value: string }[];
}

export default function ProductModal({ isOpen, onClose, onSubmit, sellers }: ProductModalProps) {
  const { control, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm<ProductFormData>({
    defaultValues: {
      name: '',
      price: 0,
      quantity: 0,
      description: '',
      sellerId: '',
      image: null,
    },
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const onFormSubmit = async (data: ProductFormData) => {
    const response = await addProductSellerImage(data);
    if(response.success){
      toast.success("Product berhasil ditambahkan")
      window.location.reload()
    }else{
      toast.error(response.message || "Gagal menambahkan product")
    }
    reset();
    setPreviewImage(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <ScrollArea className="h-[500px] rounded-md border p-4">
          <DialogHeader>
            <DialogTitle className='mb-4'>{'Tambah Produk'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            <Label>Nama Produk</Label>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Name is required" }}
              render={({ field }) => (
                <Input placeholder="Name" {...field} />
              )}
            />
            {errors.name && <span className="text-sm text-red-500">Name is required</span>}

            <Label>Harga Produk</Label>
            <Controller
              name="price"
              control={control}
              rules={{ required: true, min: 0 }}
              render={({ field }) => (
                <Input type="number" placeholder="Price" {...field} />
              )}
            />
            {errors.price && <span className="text-sm text-red-500">Price is required</span>}

            <Label>Stok Produk</Label>
            <Controller
              name="quantity"
              control={control}
              rules={{ required: true, min: 0 }}
              render={({ field }) => (
                <Input type="number" placeholder="Quantity" {...field} />
              )}
            />
            {errors.quantity && <span className="text-sm text-red-500">Quantity is required</span>}

            <Label>Deskripsi Produk</Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Input placeholder="Description" {...field} />
              )}
            />

            <Label>Seller</Label>
            <Controller
              control={control}
              name="sellerId"
              defaultValue=""
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">Pilih Seller</SelectTrigger>
                  <SelectContent>
                    {sellers.map((item) => (
                      <SelectItem value={item.value} key={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Foto Produk</label>
              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setPreviewImage(URL.createObjectURL(file));
                    setValue('image', file);
                  }
                }}
                className="w-full text-sm text-gray-500 border border-gray-300 rounded-lg p-2"
              />
              {previewImage && (
                <div className="mt-2">
                  <img src={previewImage} alt="Preview" className="w-32 h-32 object-cover" />
                </div>
              )}
            </div>

            <Button type="submit" className="w-full flex items-center gap-x-4">
              {
                isSubmitting ?
                  <Loader2Icon className='animate-spin' /> :
                  "Submit"
              }
            </Button>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}