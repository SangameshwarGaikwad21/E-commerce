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
        } catch (error) {
          toast.error("Failed to create product")
        }
      }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 p-6">

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl"
      >

    <Card className="bg-white/70 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-2xl">

      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-3xl font-bold tracking-tight">
          Create Product
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Add a new product to your store
        </p>
      </CardHeader>

      <CardContent>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label className="font-medium">Product Title</Label>
            <Input
              name="title"
              placeholder="Enter product title"
              value={form.title}
              onChange={handleProductCreate}
              className="h-11 rounded-lg"
            />
          </div>

        
          <div className="space-y-2">
            <Label className="font-medium">Description</Label>
            <Input
              name="description"
              placeholder="Enter description"
              value={form.description}
              onChange={handleProductCreate}
              className="h-11 rounded-lg"
            />
          </div>

    
          <div className="grid grid-cols-2 gap-4">

            <div className="space-y-2">
              <Label className="font-medium">Price</Label>
              <Input
                name="price"
                type="number"
                placeholder="Enter price"
                value={form.price}
                onChange={handleProductCreate}
                className="h-11 rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-medium">Category</Label>
              <Input
                name="category"
                placeholder="Enter category"
                value={form.category}
                onChange={handleProductCreate}
                className="h-11 rounded-lg"
              />
            </div>
          </div>
          <div className="space-y-3">
            <Label className="font-medium">Product Image</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="cursor-pointer"
            />

            {preview && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden rounded-xl border shadow-sm"
              >
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-44 object-cover hover:scale-105 transition duration-300"
                />
              </motion.div>
            )}
          </div>
          <Button
            type="submit"
            disabled={createLoading}
            className="w-full h-11 rounded-lg font-semibold bg-black text-white hover:bg-gray-900 transition"
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