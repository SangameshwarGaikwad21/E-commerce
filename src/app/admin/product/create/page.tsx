"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { useAppDispatch } from "@/redux/hooks"
import { createProduct } from "@/redux/fetures/productSlice"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function Page() {

  const dispatch = useAppDispatch()

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

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()

  const formData = new FormData()

  formData.append("title", form.title)
  formData.append("description", form.description)
  formData.append("price", String(form.price))
  formData.append("category", form.category)

  if (form.image) {
    formData.append("image", form.image)
  }

  dispatch(createProduct(formData))
}

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40 p-6">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg"
      >

        <Card className="shadow-xl border">

          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              Create Product
            </CardTitle>
          </CardHeader>

          <CardContent>

            <form onSubmit={handleSubmit} className="space-y-5">

              <div className="space-y-2">
                <Label>Product Title</Label>
                <Input
                  name="title"
                  placeholder="Enter product title"
                  value={form.title}
                  onChange={handleProductCreate}
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  name="description"
                  placeholder="Enter description"
                  value={form.description}
                  onChange={handleProductCreate}
                />
              </div>

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

              <div className="space-y-2">
                <Label>Product Image</Label>

                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />

                {preview && (
                  <motion.img
                    src={preview}
                    alt="preview"
                    className="w-full h-40 object-cover rounded-lg border"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                )}
              </div>

              <Button type="submit" className="w-full">
                Create Product
              </Button>

            </form>

          </CardContent>
        </Card>

      </motion.div>
    </div>
  )
}