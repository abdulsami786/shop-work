import React, { useEffect, useState } from 'react';
import ProductCard from './components/ProductCard';
import Button from './components/Button';

import { sortProductsByPrice,sortProductsByDiscount,sortProductsById } from './utils';
import Loader from './components/Loader';
import { collection, getDocs } from "firebase/firestore"; 
import { db } from './database/libs/firebase-config';
import { query, orderBy } from "firebase/firestore"; 
import { 
  
  getCountFromServer,startAt,endAt
} from 'firebase/firestore';

export default function Home() {
 

  const [products, setProducts] = useState([]);

  const [sortByPrice, setSortByPrice] = useState('asc'); 
  const [sortByDiscount, setSortByByDiscount] = useState('asc'); 
  const [sortById, setSortByID] = useState('asc'); 
  const [loading, setLoading] = useState(false); 
  const [pageLength, setPageLength] = useState(0); 
  const [pageNo, setPageNo] = useState(1); 


  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 12;


  useEffect(()=>{

    const getCount=(async()=>{
      const collectionRef = collection(db, 'products4');
      const snapshot = await getCountFromServer(collectionRef)
  
      const count = snapshot.data().count;
      setPageLength(count);
      console.log(count);
    })

   getCount();
  },[pageLength])


  useEffect(() => {
      setLoading(true);
   
    const fetchData = async () => {
      try {
      //   
        const newIndexOfFirstRecord = (pageNo - 1) * recordsPerPage + 1;
        const newIndexOfLastRecord = pageNo * recordsPerPage;
        const cacheKey = `page_${pageNo}`;
        const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
        
        const parsedData = JSON.parse(cachedData);
        setCurrentPage(pageNo);
        setProducts(parsedData);
        setLoading(false);
        console.log("Return from cache");
        return;
      }
  // Fetch data for the new page 
        const data = query(
        collection(db, "products4"),
        orderBy("p_id"),
        startAt(newIndexOfFirstRecord),
        endAt(newIndexOfLastRecord)
      );
        const querySnapshot = await getDocs(data);

        const productsData = [];
        querySnapshot.forEach((doc) => {
        const product = doc.data();
        productsData.push(product);
      });

  
      setCurrentPage(pageNo);
      setLoading(false);
      setProducts(productsData);
      localStorage.setItem(cacheKey, JSON.stringify(productsData));

  
      console.log("New Call");
      } catch (error) {
        console.error('Error fetching data: ', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [pageNo]);
  

  const handleSortByPrice = () => {
    
    const newSortOrder = sortByPrice === 'asc' ? 'desc' : 'asc';

    // Sort the products based on the price
    const sortedProducts= sortProductsByPrice(products, newSortOrder);
    setProducts(sortedProducts);
    setSortByPrice(newSortOrder);
  };

  const handleSortbyId = () => {
    const newSortOrder = sortById === 'asc' ? 'desc' : 'asc';

    // Sort the products based on their position in the JSON data
    const sortedProducts = sortProductsById(products, newSortOrder);
    setProducts(sortedProducts);
    setSortByID(newSortOrder);
  };


  const handleSortByDiscount = () => {
    const newSortOrder = sortByDiscount === 'asc' ? 'desc' : 'asc';
  
    const sortedProducts = sortProductsByDiscount(products, newSortOrder);
    setProducts(sortedProducts);
    setSortByByDiscount(newSortOrder);
  };

 

const nextPage = async () => {
  const newPage = currentPage + 1;

  if (newPage <= Math.ceil(pageLength / recordsPerPage)) {
    setPageNo(newPage);
  
  }
};

const prevPage = () => {
  if (currentPage > 1) {
    const newPage = currentPage - 1;
    setPageNo(newPage);
    
  }
};

const changePage = (pageNumber) => {
  if (pageNumber >= 1 && pageNumber <= Math.ceil(pageLength / recordsPerPage)) {
    setPageNo(pageNumber);
  
  }
};
// Calculate the range of page numbers to display (6 pages at a time)
const totalPages = Math.ceil(pageLength / recordsPerPage);

const pageRange = 6;
const startPage = Math.max(1, currentPage - Math.floor(pageRange / 2));
const endPage = Math.min(totalPages, startPage + pageRange - 1);

return (

<div className="ml-[10px] container mx-auto mt-2 ">
      <h1 className="text-xl font-semibold mb-5">Product List</h1>
    
      <Button
      onClick={handleSortbyId}
      label={`Sort by ${sortById === 'asc' ? 'Newest First' : 'Oldest First'}`}
      />

       <Button
       onClick={handleSortByPrice}
       label={`Sort by Price ${sortByPrice === 'asc' ? 'High to Low' : 'Low to High'}`}
       />
       <Button
       onClick={handleSortByDiscount}
       label={`Sort by Discount ${sortByDiscount === 'asc' ? 'High to Low' : 'Low to High'}`}
       />
     
      <div className="flex flex-wrap -mx-1">
        {loading? <Loader/> :(products.map((product , index) => (
          <ProductCard key={index} 
          imageUrl={product.imageUrl}
          name={product.name}
          discount={product.discount}
          newPrice={product.newPrice}
          oldPrice={product.oldPrice}
          />
        )))}
      </div>
      <div className="mt-5 flex justify-between mr-6">
   
        <Button
        onClick={prevPage}
        disabled={currentPage === 1}
        label='Previous Page'
        outline={true}
        />
        <div className="mb-1 flex justify-center">
        {/* Generate and render page numbers */}
        {Array.from({ length: endPage - startPage + 1 }, (_, index) => (
          <button
            key={startPage + index}
            onClick={() => changePage(startPage + index)}
            className={`mb-5 mx-1 px-3 py-1 rounded-md text-sm ${currentPage === startPage + index ? 'bg-blue-500 text-white' : 'hover:bg-blue-500 hover:text-white bg-gray-200 text-gray-700'} focus:outline-none`}
          >
            {startPage + index}
          </button>
        ))}
      </div>
       
        <Button
        onClick={nextPage}
        disabled={currentPage === Math.ceil(pageLength / recordsPerPage)}
        label='Next Page'
        outline={true}
        />
      </div>
  
    </div>
    
  );
}