'use server';

import { ProductFormData } from '@/components/modal/product-modal';
import { prisma } from '@/lib/prisma';
import { put } from '@vercel/blob';

export async function getProducts() {
  return await prisma.product.findMany({
    where: { deletedAt: null },
    include: { seller: true, images : true },
  });
}

export async function createProduct(data: {
  name: string;
  price: number;
  quantity: number;
  sellerName: string;
  description?: string;
}) {
  return await prisma.product.create({ data });
}

export async function updateProduct(id: string, data: Partial<{
  name: string;
  price: number;
  quantity: number;
  sellerName: string;
  description?: string;
}>) {
  return await prisma.product.update({ where: { id }, data });
}

export async function deleteProduct(id: string) {
  return await prisma.product.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}


export async function addProductSellerImage(data: ProductFormData) {
  try {
    if (!data.image) {
      return {
        success: false,
        message: 'Image is required',
      };
    }


    const blob = await put(data.image.name, data.image, {
      access: 'public',
      allowOverwrite : true
    });

    console.log({blob});
    
    if (!blob.url) {
      return {
        success: false,
        message: 'Product not created, failed upload image',
      };
    }

    console.log({data});

    if (!data.sellerId) {
      return {
        success: false,
        message: 'Seller ID is required',
      };
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        price: +data.price,
        quantity: +data.quantity,
        description: data.description,
        sellerId: data.sellerId,
        sellerName : data?.sellerId,
        images: {
          create: {
            url: blob.url
          }
        }
      }
    })

    return {
      success: true,
      message: 'Product created',
      data: product,
    };
  } catch (error) {
    console.error('Error creating product:', error);
    return {
      success: false,
      message: 'Product not created',
    };
  }
}