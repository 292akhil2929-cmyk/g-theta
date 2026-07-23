export type Product = {
  id: string
  name: string
  code: string
  price: number
  colorFrom: string
  colorTo: string
  sizes: string[]
  specs: { weight: string; fabric: string; fit: string }
}

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL"]

const specs = {
  weight: "480 GSM",
  fabric: "Brushed loopback cotton",
  fit: "Oversized / drop shoulder",
}

export const products: Product[] = [
  {
    id: "gt-baavundi",
    name: "Baavundi Hoodie",
    code: "GΘ-001",
    price: 3499,
    colorFrom: "#20252b",
    colorTo: "#070809",
    sizes: SIZES,
    specs,
  },
  {
    id: "gt-manakenduku",
    name: "Manakenduku Hoodie",
    code: "GΘ-002",
    price: 3299,
    colorFrom: "#dd4134",
    colorTo: "#77150f",
    sizes: SIZES,
    specs,
  },
  {
    id: "gt-anthega",
    name: "Anthe Ga Hoodie",
    code: "GΘ-003",
    price: 3299,
    colorFrom: "#eee4d3",
    colorTo: "#9c8c73",
    sizes: SIZES,
    specs,
  },
  {
    id: "gt-ayyayyo",
    name: "Ayyayyo Hoodie",
    code: "GΘ-004",
    price: 3299,
    colorFrom: "#f5cb45",
    colorTo: "#b77a0b",
    sizes: SIZES,
    specs,
  },
  {
    id: "gt-sideeye",
    name: "Side Eye Hoodie",
    code: "GΘ-005",
    price: 3499,
    colorFrom: "#747d45",
    colorTo: "#30351c",
    sizes: SIZES,
    specs,
  },
  {
    id: "gt-interval",
    name: "Interval Block Hoodie",
    code: "GΘ-006",
    price: 3699,
    colorFrom: "#7a1e20",
    colorTo: "#260809",
    sizes: SIZES,
    specs,
  },
]

export type Colorway = {
  name: string
  hex: string
  colorFrom: string
  colorTo: string
}

export const COLORWAYS: Colorway[] = [
  { name: "Black", hex: "#17171b", colorFrom: "#1b1b20", colorTo: "#08080a" },
  { name: "Cream", hex: "#e8ded0", colorFrom: "#eee4d3", colorTo: "#9c8c73" },
  { name: "Red", hex: "#d83a2e", colorFrom: "#dd4134", colorTo: "#77150f" },
  { name: "Yellow", hex: "#f5cb45", colorFrom: "#f5cb45", colorTo: "#b77a0b" },
  { name: "Olive", hex: "#68713f", colorFrom: "#747d45", colorTo: "#30351c" },
]

export function colorwayToProduct(c: Colorway, price = 3499): Product {
  return {
    id: `gt-hoodie-${c.name.toLowerCase()}`,
    name: `G Theta Hoodie — ${c.name}`,
    code: "GΘ-X",
    price,
    colorFrom: c.colorFrom,
    colorTo: c.colorTo,
    sizes: SIZES,
    specs,
  }
}
