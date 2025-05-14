import ProductTable from "@/components/table/product-table";
import { getProducts } from "@/lib/action/product";
import { getSeller } from "@/lib/action/seller";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Page",
  description: "CRUD Product Page",
};

export default async function ProductPage() {
  const products = await getProducts();
  const sellers = await getSeller();
  return (
    <main className="p-4 w-screen md:w-[1190px]">
      <ProductTable sellers={sellers as any[]} initialProducts={products} />
    </main>
  );
}
