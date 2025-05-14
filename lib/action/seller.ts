'use server';
import { ReceiptRussianRubleIcon } from "lucide-react";
import { prisma } from "../prisma";
import { hash } from "bcrypt";

export async function getSeller() {
    return await prisma.seller.findMany({
        where: { deletedAt: null },
        include: {
            addresses: true,
            products: true
        },
    });
}

export async function createSeller({
    name,
    kabupaten,
    kecamatan,
    kelurahan,
    zip,
    keterangan,
    email,
    password
}: { name: string, kabupaten: string, kecamatan: string, kelurahan: string, zip: string, keterangan: string, email: string, password: string }) {
    const hashedPassword = await hash(password, 10);
    try {
        const seller =  await prisma.seller.create({
            data: {
                name,
                email,
                password: hashedPassword,
                addresses: {
                    create: {
                        kabupaten,
                        kecamatan,
                        kelurahan,
                        zip,
                        keterangan,
                    }
                }
            }
        })
        if(seller){
            return {
                success: true,
                message: 'Seller created',
            }
        }else{
            return {
                success: false,
                message: 'Seller not created',
            }
        }
    } catch (error) {
        console.error('Error creating seller:', error);
        return {
            success: false,
            message: 'Seller not created',
        }
    }

}

export async function updateSeller(id: string, {
    name,
    kabupaten,
    kecamatan,
    kelurahan,
    zip,
    keterangan,
    email,
    password,
    addressId,
}: { name: string, kabupaten: string, kecamatan: string, kelurahan: string, zip: string, keterangan: string, email: string, password: string, addressId: string }) {
    const hashedPassword = await hash(password, 10);
    return await prisma.seller.update({
        where: { id },
        data: {
            name,
            email,
            password: hashedPassword,
            addresses: {
                update: {
                    where: { id : addressId},
                    data: {
                        kabupaten,
                        kecamatan,
                        kelurahan,
                        zip,
                        keterangan,
                    }
                }
            }
        }
    })
}

export async function deleteSeller(id: string) {
    return await prisma.seller.update({
        where: { id },
        data: {
            deletedAt: new Date()
        }
    })
}