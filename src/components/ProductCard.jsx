import Link from "next/link";

export default function ProductCard({ product, addToCart }) {
  return (
    <div
      key={product._id || product.name}
      className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
    >
      <Link href={`/product/${product._id}`}>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-64 object-cover rounded-lg mb-4 cursor-pointer"
        />
      </Link>
      <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
      <p className="text-gray-500 text-sm">{product.description}</p>
      <div className="mt-4 flex justify-between items-center">
        <span className="text-lg font-bold text-gray-800">
          ₹{product.price}
        </span>
        <button
          onClick={() => addToCart(product)}
          className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-all duration-200"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
