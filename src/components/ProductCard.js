

const ProductCard = ({
    imageUrl,
    discount,
    name,
    newPrice,
    oldPrice,
}) => {
  return (
    <div className="relative m-2 md:m-5 flex max-w-[16rem] max-h-[39rem]  md:max-w-1/2 flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md">
      <div className="relative mx-3 mt-3 flex h-90 overflow-hidden rounded-xl">
        <img
          className="object-cover"
          src={imageUrl}
          width="330"
          height="495"
          alt="product image"
        />
        <span className="absolute top-0 left-0 m-2 rounded-full bg-black px-2 text-center text-sm font-medium text-white">
          {discount}% OFF
        </span>
      </div>
      <div className="mt-4 px-5 pb-4">
        <a href="#">
          <h5 className="no-underline text-sm tracking-tight text-slate-900 ">
            {name}
          </h5>
        </a>
        <div className="mt-2 mb-2 flex items-center justify-between">
          <p>
            <span className="text-xl font-bold text-slate-900">
              ${newPrice}
            </span>
            <span className="ml-2 text-sm text-slate-900 line-through">
              ${oldPrice}
            </span>
          </p>
         
        </div>
        <a
          href="#"
          className="flex no-underline items-center justify-center rounded-md bg-slate-900 px-5 py-2 text-center text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          
          Add to cart
        </a>
      </div>
    </div>
  )
}

export default ProductCard