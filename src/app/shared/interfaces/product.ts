import { Pagination } from './pagination';

export interface Product {
  _id: string;
  title: string;
  description: string;
  issueDate: string;
  thumbnail: string;
  brand: string;
  stock: number;
  rating: number;
  warranty: number;
  images: string[];
  price: ProductPrice;
  category: ProductCategory;
}

export interface ProductPrice {
  current: number;
  currency: string;
  beforeDiscount: number;
  discountPercentage: number;
}

export interface ProductCategory {
  id: string;
  name: string;
  image: string;
}

export interface Products extends Pagination {
  products: Product[];
}
