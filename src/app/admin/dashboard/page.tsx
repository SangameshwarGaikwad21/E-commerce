"use client"
import Link from 'next/link'

const page = () => {

  

  return (
    <div> <Link href="/">Welcome To admin</Link>

      <div>
        <Link href="/admin/product/create">
          Create Product
        </Link>
      </div>
    </div>
  )
}

export default page