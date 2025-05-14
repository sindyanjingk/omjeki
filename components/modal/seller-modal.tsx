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
import { createSeller } from '@/lib/action/seller';

export interface SellerFormData {
  name: string;
  email? : string;
  password? : string
  kabupaten?: string;
  kecamatan?: string;
  kelurahan?: string;
  zip?: string;
  keterangan?: string;
}

interface SellerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SellerFormData) => void;
}

export default function SellerModal({ isOpen, onClose, onSubmit }: SellerModalProps) {
  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<SellerFormData>({
    defaultValues: {
      name: '',
      email : "",
      password : "",
      kabupaten: '',
      kecamatan: '',
      kelurahan: '',
      zip: '',
      keterangan: '',
    },
  });

  const onFormSubmit = async (data: SellerFormData) => {
    const response = await createSeller(data as any);
    if(response.success){
        toast.success("Seller berhasil ditambahkan")
        window.location.reload()
    }else{
        toast.error(response.message)
    }
    // onSubmit(data);
    // reset();
    // setPreviewImage(null);
    // onClose();
    reset()
    onClose()
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <ScrollArea className="h-[500px] rounded-md border p-4">
          <DialogHeader>
            <DialogTitle className='mb-4'>{'Tambah Seller'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
            
            <Controller
              name="name"
              control={control}
              rules={{ required: "Name is required" }}
              render={({ field }) => (
                <Input placeholder="Name" {...field} />
              )}
            />
            {errors.name && <span className="text-sm text-red-500">Name is required</span>}

            <Controller
              name="email"
              control={control}
              rules={{ required: true, min: 0 }}
              render={({ field }) => (
                <Input type="text" placeholder="Email" {...field} />
              )}
            />
            {errors.email && <span className="text-sm text-red-500">Email is required</span>}

            <Controller
              name="password"
              control={control}
              rules={{ required: true, min: 6 }}
              render={({ field }) => (
                <Input type="text" placeholder="Password" {...field} />
              )}
            />
            {errors.password && <span className="text-sm text-red-500">{errors?.password.message || ""}</span>}


            <Controller
              name="kabupaten"
              control={control}
              render={({ field }) => (
                <Input placeholder="Kabupaten" {...field} />
              )}
            />

            <Controller
              name="kecamatan"
              control={control}
              render={({ field }) => (
                <Input placeholder="Kecamatan" {...field} />
              )}
            />

            <Controller
              name="kelurahan"
              control={control}
              render={({ field }) => (
                <Input placeholder="Kelurahan" {...field} />
              )}
            />

            <Controller
              name="zip"
              control={control}
              render={({ field }) => (
                <Input type="number" placeholder="Kode POS" {...field} />
              )}
            />

            <Controller
              name="keterangan"
              control={control}
              render={({ field }) => (
                <Input placeholder="Keterangan" {...field} />
              )}
            />

            <Button type="submit" className="w-full flex items-center gap-x-4">
              {
                isSubmitting ?
                <Loader2Icon className='animate-spin'/> :
                "Submit"
              }
            </Button>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}