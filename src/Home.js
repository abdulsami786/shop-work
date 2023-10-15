import React, { useEffect, useState } from 'react';
import ProductCard from './components/ProductCard';
import Button from './components/Button';
import axios from 'axios';
import { sortProductsByPrice,sortProductsByDiscount,sortProductsById } from './utils';
import Loader from './components/Loader';
import { collection, getDocs } from "firebase/firestore"; 
import { db } from './database/libs/firebase-config';
import { query, orderBy, limit } from "firebase/firestore"; 
import { 
  getFirestore,
  getCountFromServer,startAt,startAfter   
} from 'firebase/firestore';

export default function Home() {
 
  const [originalProducts, setOriginalProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [sortByPrice, setSortByPrice] = useState('asc'); 
  const [sortByDiscount, setSortByByDiscount] = useState('asc'); 
  const [sortById, setSortByID] = useState('asc'); 
  const [loading, setLoading] = useState(false); 
  const [pageLength, setPageLength] = useState(0); 
  const [lastVisible, setLastVisible] = useState([]); 

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 12;
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  //const currentRecords = products.slice(indexOfFirstRecord, indexOfLastRecord);
    console.log(recordsPerPage);
  useEffect(() => {
    setLoading(true);
    // const collectionRef = db.collection('products');
    // const snapshot = await collectionRef.count().get();
    // console.log(snapshot.data().count);
    const fetchData = async () => {
      try {
        const first = query(collection(db, "products"),limit(12));
        const querySnapshot = await getDocs(first);
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length-1])
        console.log("Last visible",lastVisible);

//         const lastVisible = querySnapshot.docs[querySnapshot.docs.length-1];
// console.log("last", lastVisible);



        //console.log('count: ', querySnapshot.data().count);
        //const querySnapshot = await getDocs(collection(db, "products"), limit(2));
        const collectionRef = collection(db, 'products');
        const snapshot = await getCountFromServer(collectionRef)

        const count = snapshot.data().count;
        setPageLength(count);
        console.log(count);
        //console.log(snapshot.data().count);

        // const q = query(collection(db, "products"), startAt(recordsPerPage * (currentPage - 1)), limit(12));

        const productsData = [];
        querySnapshot.forEach((doc) => {
          const product = doc.data();
          //console.log("product",product);
          productsData.push(product);
        });
  
        console.log(productsData); 
  
       
        setProducts(productsData);
        setLoading(false);
        setOriginalProducts(productsData);
      } catch (error) {
        console.error('Error fetching data: ', error);
        setLoading(false);
      }
    };
    console.log("Component mounted");
    fetchData();
  }, []);
  

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

  const changeData = async()=>{
    const data  = query(collection(db, "products"),
    orderBy("brand"),
    startAfter(lastVisible),
    limit(12));
    const querySnapshot = await getDocs(data);
    const productsData = [];
      querySnapshot.forEach((doc) => {
        const product = doc.data();
        //console.log("product",product);
        productsData.push(product);
      });

      //console.log(productsData); 

      setProducts(productsData);
      setOriginalProducts([...originalProducts, ...productsData]);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length-1])
  }

  const nextPage = async() => {
    if (currentPage < Math.ceil(pageLength / recordsPerPage)) {
      setCurrentPage(currentPage + 1);
     changeData();
    }
  };
  
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      const startIndex = (currentPage - 2) * recordsPerPage;
      const endIndex = (currentPage - 1) * recordsPerPage;
      const prevPageProducts = originalProducts.slice(startIndex, endIndex);
      
      setProducts(prevPageProducts);
    }
  };
  
// Function to handle changing the current page when a page number is clicked
const changePage = (pageNumber) => {
  if (pageNumber >= 1 && pageNumber <= Math.ceil(pageLength / recordsPerPage)) {
    setCurrentPage(pageNumber);
  }
};
// Calculate the range of page numbers to display (6 pages at a time)
const totalPages = Math.ceil(pageLength / recordsPerPage);
console.log("total pages",totalPages);
const pageRange = 6;
const startPage = Math.max(1, currentPage - Math.floor(pageRange / 2));
const endPage = Math.min(totalPages, startPage + pageRange - 1);

return (

<div className="ml-[10px] container mx-auto mt-2">
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
     
      <div className="flex flex-wrap -mx-2">
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
      <div className="mt-5 flex justify-between">
   
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