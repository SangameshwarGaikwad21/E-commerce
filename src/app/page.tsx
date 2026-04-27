import Footer from "@/components/Layout/Footer"
import Herosection from "@/components/Layout/Herosection"
import ProductList from "@/components/products/ProductsList"
import Category from "@/app/category/page"
import PromoBanner from "@/components/Layout/PromoBanner"

const page = () => {

  return (
    <>
      <Herosection/>
      <Category/>
      <PromoBanner/>
      <ProductList/> 
      <Footer/>
    </>
  )
}

export default page
