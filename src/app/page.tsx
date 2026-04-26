import Footer from "@/components/Layout/Footer"
import Herosection from "@/components/Layout/Herosection"
import ProductList from "@/components/products/ProductsList"
// import Category from "@/app/category/page"

const page = () => {

  return (
    <>
      {/* <Category/> */}
      <Herosection/>
      <ProductList/> 
      <Footer/>
    </>
  )
}

export default page