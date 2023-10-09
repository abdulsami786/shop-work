

export function sortProductsByPrice(products, sortOrder) {
    return [...products].sort((a, b) => {
        if (sortOrder === 'asc') {
          return a.newPrice - b.newPrice;
        } else {
          return b.newPrice - a.newPrice;
        }
      });
}

export function sortProductsByDiscount(products, sortOrder) {
    return [...products].sort((a, b) => {
        if (sortOrder === 'asc') {
          return a.discount - b.discount;
        } else {
          return b.discount - a.discount;
        }
      });
}

export function sortProductsById(products, sortOrder) {
    return [...products].sort((a, b) => {
        if (sortOrder === 'asc') {
          return a.productID - b.productID;
        } else {
          return b.productID - a.productID;
        }
      });
 }