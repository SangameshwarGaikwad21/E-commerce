"use client"
import Link from 'next/link'

const page = () => {

  

  return (
    <div>Welcome To admin

      <div>
        <Link href="/admin/product/create">
          Create Product
        </Link>
      </div>
    </div>
  )
}

export default page