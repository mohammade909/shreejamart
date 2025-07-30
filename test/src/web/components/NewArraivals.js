import React from 'react'

export default function NewArraivals() {
    const newArrivals = [
        {
          id: 1,
          category: "Dried Fruits",
          name: "Mixed Nuts Berries Pack",
          price: 55.0,
          oldPrice: 45.0,
          image: "/api/placeholder/200/200",
          rating: 5,
          tag: "SALE",
        },
        {
          id: 2,
          category: "Cookies",
          name: "Multi Grain Combo Cookies",
          price: 30.0,
          oldPrice: 35.0,
          image: "/api/placeholder/200/200",
          rating: 4,
          weight: "1kg",
          tag: "SALE",
        },
      ];
  return (
       
         <section className="mt-16">
         <div className="text-center mb-8">
           <h2 className="text-2xl font-semibold">New Arrivals</h2>
           <p className="text-gray-600 mt-2">
             Browse The Collection of Top Products
           </p>
         </div>

         <div className="grid grid-cols-5 gap-6">
           {newArrivals.map((product) => (
             <div key={product.id} className="bg-white rounded-lg shadow p-4">
               <div className="relative">
                 {product.tag && (
                   <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                     {product.tag}
                   </span>
                 )}
                 <img
                   src={product.image}
                   alt=""
                   className="w-full h-48 object-cover rounded"
                 />
               </div>
               <div className="mt-4">
                 <div className="text-sm text-gray-500">
                   {product.category}
                 </div>
                 <h3 className="font-medium mt-1">{product.name}</h3>
                 <div className="flex items-center mt-2">
                   <div className="flex text-yellow-400">
                     {"★".repeat(product.rating)}
                     {"☆".repeat(5 - product.rating)}
                   </div>
                 </div>
                 <div className="mt-2 flex items-center">
                   <span className="text-lg font-semibold">
                     ${product.price.toFixed(2)}
                   </span>
                   {product.oldPrice && (
                     <span className="ml-2 text-sm text-gray-500 line-through">
                       ${product.oldPrice.toFixed(2)}
                     </span>
                   )}
                 </div>
               </div>
             </div>
           ))}
         </div>
       </section>
  )
}
