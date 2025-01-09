import Product from "./Product";

import { FC } from "react";

interface Product {
  id: string;
  // Add other product properties here
}

interface ProductGridProps {
  products: Product[];
}

const ProductGrid: FC<ProductGridProps> = ({ products }) => {
  if (!products || products.length === 0) return null;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <Product name={""} variants={[]} key={product.id} {...product} />
      ))}
    </div>
  );
};

export default ProductGrid;
