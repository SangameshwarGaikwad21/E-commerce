import Link from "next/link"


const page = () => {

  

  return (    
    <div>
      <Link href="/">
          Admin Dashboard
      </Link>
        <Link href="/admin/product/create">
          Product       
        </Link>
    </div>
  )
}

export default page