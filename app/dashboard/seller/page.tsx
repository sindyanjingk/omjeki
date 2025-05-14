import ProductTable from "@/components/table/product-table";
import SellerTable from "@/components/table/seller-table";
import { getProducts } from "@/lib/action/product";
import { getSeller } from "@/lib/action/seller";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Seller Page",
  description: "CRUD Seller Page",
};

export default async function SellerPage() {
  const seller = await getSeller();
  return (
    <main className="p-4 w-screen md:w-[1190px]">
      {/* <ProductTable initialProducts={products} /> */}
      <SellerTable initialSeller={seller as any}/>
    </main>
  );
}
