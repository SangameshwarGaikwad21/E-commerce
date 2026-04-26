export interface Product {
  _id: string;          
  title: string;
  description: string;
  price: number;
  discount?: number;
  discountPrice?: number;
  category?: string;
  stock?: number;
  images: string[];
}
