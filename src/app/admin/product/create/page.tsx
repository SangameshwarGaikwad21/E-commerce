"use client"
import React, { useState } from "react"
import { motion } from "framer-motion"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { createProduct } from "@/redux/fetures/productSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"

export default function Page() {

  const dispatch = useAppDispatch()
  const { createLoading } = useAppSelector((state) => state.product)

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: 0,
    category: "",
    image: null as File | null
  })

  const [preview, setPreview] = useState<string | null>(null)

  const handleProductCreate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setForm({
      ...form,
      [name]: name === "price" ? Number(value) : value
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setForm({ ...form, image: file })
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData()

    formData.append("title", form.title)
    formData.append("description", form.description)
    formData.append("price", String(form.price))
    formData.append("category", form.category)

    if (form.image) {
      formData.append("image", form.image)
    }

    try {
      await dispatch(createProduct(formData)).unwrap()
      toast.success("Product Created Successfully")

      setForm({
        title: "",
        description: "",
        price: 0,
        category: "",
        image: null
      })

      setPreview(null)

    } catch {
      toast.error("Failed to create product")
    }
  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 px-4 py-10">

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg sm:max-w-xl"
      >

        <Card className="bg-white/80 backdrop-blur-xl border border-gray-200 shadow-xl rounded-2xl">

          <CardHeader className="text-center space-y-2">

            <CardTitle className="text-2xl sm:text-3xl font-bold">
              Create Product
            </CardTitle>

            <p className="text-sm text-gray-500">
              Add a new product to your store
            </p>

          </CardHeader>

          <CardContent>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Title */}

              <div className="space-y-2">
                <Label>Product Title</Label>

                <Input
                  name="title"
                  placeholder="Enter product title"
                  value={form.title}
                  onChange={handleProductCreate}
                />
              </div>


              {/* Description */}

              <div className="space-y-2">
                <Label>Description</Label>

                <Input
                  name="description"
                  placeholder="Enter description"
                  value={form.description}
                  onChange={handleProductCreate}
                />
              </div>


              {/* Price + Category */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div className="space-y-2">
                  <Label>Price</Label>

                  <Input
                    name="price"
                    type="number"
                    placeholder="Enter price"
                    value={form.price}
                    onChange={handleProductCreate}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>

                  <Input
                    name="category"
                    placeholder="Enter category"
                    value={form.category}
                    onChange={handleProductCreate}
                  />
                </div>

              </div>


              {/* Image Upload */}

              <div className="space-y-3">

                <Label>Product Image</Label>

                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />

                {preview && (

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="overflow-hidden rounded-xl border"
                  >

                    <img
                      src={preview}
                      alt="preview"
                      className="w-full h-40 sm:h-44 object-cover"
                    />

                  </motion.div>

                )}

              </div>


              {/* Button */}

              <Button
                type="submit"
                disabled={createLoading}
                className="w-full h-11 bg-black text-white hover:bg-gray-900"
              >

                {createLoading ? "Creating Product..." : "Create Product"}

              </Button>

            </form>

          </CardContent>

        </Card>

      </motion.div>

    </div>

  )
}