import Image from "next/image";
import { useMemo, useState } from "react";

import useWishlistDispatch from "../hooks/useWishlistDispatch";

import useWishlistState from "../hooks/useWishlistState";

import VariantPicker from "./VariantPicker";

// Definir interfaces para un mejor tipado

interface VariantFile {
  type: string;

  preview_url: string; // ... otras propiedades de VariantFile
}

interface Variant {
  external_id: string;

  name: string;

  files: VariantFile[];

  currency: string;

  retail_price: number; // ... otras propiedades de Variant
}

interface ProductProps {
  id: string;

  name: string;

  variants: Variant[]; // ... otras propiedades de Product
}

const Product = ({ id, name, variants }: ProductProps) => {
  const { addItem } = useWishlistDispatch();

  const { isSaved }: { isSaved: (id: string) => boolean } = useWishlistState();

  const [firstVariant] = variants;

  const oneStyle = variants.length === 1;

  const [activeVariantExternalId, setActiveVariantExternalId] = useState(
    firstVariant.external_id
  ); // Usar useMemo para evitar cálculos repetidos

  const activeVariant = useMemo(() => {
    return variants.find((v) => v.external_id === activeVariantExternalId);
  }, [variants, activeVariantExternalId]);

  const activeVariantFile = useMemo(() => {
    return activeVariant?.files.find(({ type }) => type === "preview");
  }, [activeVariant]);

  const formattedPrice = useMemo(() => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",

      currency: activeVariant?.currency || "USD", // Proporcionar un valor por defecto
    }).format(activeVariant?.retail_price || 0); // Proporcionar un valor por defecto
  }, [activeVariant]);

  const addToWishlist = () => addItem({ id, name }); // Usar useMemo para evitar recalculaciones innecesarias

  const onWishlist = useMemo(() => isSaved(id), [isSaved, id]);

  return (
    <article className="border border-gray-200 rounded bg-white flex flex-col relative">
      <button
        aria-label="Add to wishlist"
        className="appearance-none absolute top-0 right-0 mt-3 mr-3 text-gray-300 focus:text-gray-500 hover:text-red-500 transition focus:outline-none"
        onClick={addToWishlist}>
      
        {onWishlist ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-6 h-6 fill-current text-red-500"
          >
             <path fill="none" d="M0 0H24V24H0z" />
            {" "}
            <path d="M12.001 4.529c2.349-2.109 5.979-2.039 8.242.228 2.262 2.268 2.34 5.88.236 8.236l-8.48 8.492-8.478-8.492c-2.104-2.356-2.025-5.974.236-8.236 2.265-2.264 5.888-2.34 8.244-.228z" />
            {" "}
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-6 h-6 fill-current"
          >
             <path fill="none" d="M0 0H24V24H0z" />
            {" "}
            <path d="M12.001 4.529c2.349-2.109 5.979-2.039 8.242.228 2.262 2.268 2.34 5.88.236 8.236l-8.48 8.492-8.478-8.492c-2.104-2.356-2.025-5.974.236-8.236 2.265-2.264 5.888-2.34 8.244-.228zm6.826 1.641c-1.5-1.502-3.92-1.563-5.49-.153l-1.335 1.198-1.336-1.197c-1.575-1.412-3.99-1.35-5.494.154-1.49 1.49-1.565 3.875-.192 5.451L12 18.654l7.02-7.03c1.374-1.577 1.299-3.959-.193-5.454z" />
            {" "}
          </svg>
        )}
        {" "}
      </button>
     {" "}
      <div className="flex items-center justify-center flex-1 sm:flex-shrink-0 w-full p-6">
        {" "}
        {activeVariantFile?.preview_url ? (
          <Image
            src={activeVariantFile?.preview_url || ""}
            width={250}
            height={250}
            alt={`${activeVariant?.name || "Product"} ${name}`}
            title={`${activeVariant?.name || "Product"} ${name}`}
          />
        ) : (
          <div className="w-64 h-64 flex items-center justify-center bg-gray-100 text-gray-400">
            Image Not Available {" "}
          </div>
        )}
        {" "}
      </div>
      {" "}
      <div className="flex-1 p-6 pt-0">
        {" "}
        <div className="text-center">
           <p className="mb-1 font-semibold text-gray-900">{name}</p>
           <p className="text-sm text-gray-500">{formattedPrice}</p>
          {" "}
        </div>
        {" "}
      </div>
      {" "}
      <div className="p-3 flex flex-col sm:flex-row justify-center items-center">
        {" "}
        <VariantPicker
          value={activeVariantExternalId}
          onChange={({
            target: { value },
          }: React.ChangeEvent<HTMLSelectElement>) =>
            setActiveVariantExternalId(value)
          }
          variants={variants}
          disabled={oneStyle}
        />
        {" "}
        <button
          className="snipcart-add-item w-full md:w-auto transition flex-shrink-0 py-2 px-4 border border-gray-300 hover:border-transparent shadow-sm text-sm font-medium bg-white text-gray-900 focus:text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:outline-none rounded"
          data-item-id={activeVariantExternalId}
          data-item-price={activeVariant?.retail_price || 0} // Asegúrate de tener una URL base configurada o proporciona una URL completa
          data-item-url={`https://your-domain.com/api/products/${activeVariantExternalId}`}
          data-item-description={activeVariant?.name}
          data-item-image={activeVariantFile?.preview_url}
          data-item-name={name}
        >
           Add to Cart {" "}
        </button>
        {" "}
      </div>
      {" "}
        </article>
      );
    };
  

export default Product;