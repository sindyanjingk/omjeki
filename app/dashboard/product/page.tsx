import ProductTable from "@/components/table/product-table";
import { getProducts } from "@/lib/action/product";
import { getSeller } from "@/lib/action/seller";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Page",
  description: "CRUD Product Page",
};

export default async function ProductPage() {
  const products = await getProducts();
  const sellers = await getSeller();
  const category = await prisma.category.findMany({
    where : {
      deletedAt : null
    }
  })
  return (
    <main className="p-4 w-screen md:w-[1190px]">
      <ProductTable category={category} sellers={sellers as any[]} initialProducts={products} />
    </main>
  );
}
