/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from "./types";

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Classic Spiral Bound Notebook (A4, 200 Pages)",
    price: 120,
    description: "Premium quality white pages with sturdy spiral binding. Perfect for students, engineering drawings, and comprehensive notes.",
    photo: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&q=80&w=600",
    category: "Stationery",
  },
  {
    id: "prod-2",
    name: "Standard Mathematics & Algebra Textbook",
    price: 350,
    description: "Comprehensive guide to mathematics and algebra with solved examples and exercises. Essential for board exams.",
    photo: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=600",
    category: "Books",
  },
  {
    id: "prod-3",
    name: "Matte Black Fountain Pen with Ink Set",
    price: 250,
    description: "Elegant matte black fountain pen with fine nib. Comes with a smooth-flowing blue ink bottle and premium gift box.",
    photo: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&q=80&w=600",
    category: "Stationery",
  },
  {
    id: "prod-4",
    name: "Fancy Unicorn LED Sparkle Keychain",
    price: 80,
    description: "Adorable unicorn keychain that glows with sparkling multi-colored LED lights at the press of a button. Popular fancy gift item.",
    photo: "https://images.unsplash.com/photo-1594732806283-bc9fa157e096?auto=format&fit=crop&q=80&w=600",
    category: "Fancy Items",
  },
  {
    id: "prod-5",
    name: "Designer Silk Thread Bangles Set (12 pcs)",
    price: 180,
    description: "Handcrafted ethnic bangles decorated with golden beads and silk thread. Exquisite design, perfect for weddings and festive occasions.",
    photo: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600",
    category: "Fancy Items",
  },
  {
    id: "prod-6",
    name: "Complete Geometry Instrument Box",
    price: 150,
    description: "High-precision mechanical compass, dividers, set squares, ruler, eraser, and pencil. Built for engineering and math students.",
    photo: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600",
    category: "Stationery",
  },
  {
    id: "prod-7",
    name: "Wonders of the World - Illustrated Encyclopedia",
    price: 499,
    description: "An educational marvel featuring 3D visuals and immersive facts about ancient, modern, and natural wonders around the globe.",
    photo: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=600",
    category: "Books",
  },
  {
    id: "prod-8",
    name: "Handcrafted Antique Wooden Showpiece Watch",
    price: 650,
    description: "Vintage-style analog desk clock embedded inside a hand-carved solid mahogany frame. Elevates living space aesthetics.",
    photo: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=600",
    category: "Fancy Items",
  }
];

export interface EducationQuote {
  quote: string;
  author: string;
}

export const EDUCATION_QUOTES: EducationQuote[] = [
  {
    quote: "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.",
    author: "Malcolm X"
  },
  {
    quote: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
    author: "Dr. Seuss"
  },
  {
    quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
    author: "Mahatma Gandhi"
  },
  {
    quote: "Books are a uniquely portable magic.",
    author: "Stephen King"
  },
  {
    quote: "Education is not the filling of a pail, but the lighting of a fire.",
    author: "W.B. Yeats"
  }
];

export const CATEGORIES = ["All", "Books", "Stationery", "Fancy Items"];
