export interface Product {
  id: string;
  title: string;
  titleEn: string;
  price: number;
  description: string;
  image: string;
  rating: number;
  categoryId: string;
  specs: { [key: string]: string };
  colors: string[];
  stock: number;
  discountPercentage?: number;
  features: string[];
}

export interface Category {
  id: string;
  title: string;
  slug: string;
  iconName: string; // Used to reference Lucide icons dynamically
}

export interface CartItem {
  id: string; // Needs to be generated with composite `productId-color`
  product: Product;
  quantity: number;
  selectedColor: string;
}

export interface CustomerInfo {
  fullName: string;
  phone: string;
  address: string;
  postalCode: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  date: string;
  totalAmount: number;
  discountApplied: number;
  status: 'pending' | 'preparing' | 'shipped' | 'delivered';
  customerInfo: CustomerInfo;
  trackingNumber: string;
}

export interface PromoCode {
  code: string;
  discountPercent: number;
  description: string;
}
