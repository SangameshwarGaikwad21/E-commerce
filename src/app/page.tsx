import Footer from "@/components/Layout/Footer"
import Herosection from "@/components/Layout/Herosection"
import ProductList from "@/components/products/ProductsList"

import Category from "@/components/Layout/Category"

const page = () => {

  return (
    <>
    <Herosection/>
      {/* <Category/> */}
      <ProductList/> 
      <Footer/>
    </>
  )
}

export default page