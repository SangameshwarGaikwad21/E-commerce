import Footer from "@/components/Layout/Footer"
import Herosection from "@/components/Layout/Herosection"
import ProductList from "@/components/products/ProductsList"

const page = () => {

  return (
    <>
      <Herosection/>
      <ProductList/>

      <Footer/>
    </>
  )
}

export default page