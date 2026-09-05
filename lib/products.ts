export type Product = {
  id: string
  name: string
  code: string
  price: number
  colorFrom: string
  colorTo: string
  images?: string[]
  badge?: string
  sizes: string[]
  specs: { weight: string; fabric: string; fit: string }
}

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL"]

const specs = {
  weight: "480 GSM",
  fabric: "Brushed loopback cotton",
  fit: "Oversized / drop shoulder",
}

const product = (
  id: string,
  name: string,
  code: string,
  images: string[],
  badge: string,
  price = 3499
): Product => ({
  id,
  name,
  code,
  price,
  colorFrom: "#303132",
  colorTo: "#111213",
  images,
  badge,
  sizes: SIZES,
  specs,
})

export const products: Product[] = [
  product(
    "gt-harbour-hook",
    "Harbour Hook Hoodie",
    "GTH-001",
    ["/images/products/supplied-01.jpeg"],
    "Harbour cut"
  ),
  product(
    "gt-sudden-star",
    "Sudden Star Hoodie",
    "GTH-002",
    ["/images/products/supplied-02.jpeg", "/images/products/supplied-04.jpeg"],
    "Double feature"
  ),
  product(
    "gt-baavundi",
    "Baavundi Hoodie",
    "GTH-003",
    ["/images/products/supplied-03.jpeg"],
    "Boss approved"
  ),
  product(
    "gt-alaa-kadhu-raa",
    "Alaa Kadhu Raa Hoodie",
    "GTH-004",
    ["/images/products/supplied-05.jpeg"],
    "Instant reaction",
    3299
  ),
  product(
    "gt-roundtable",
    "Roundtable Hoodie",
    "GTH-005",
    ["/images/products/supplied-06.jpeg"],
    "Cult classic",
    3299
  ),
  product(
    "gt-squad-goals",
    "Squad Goals Hoodie",
    "GTH-006",
    ["/images/products/supplied-07.jpeg"],
    "Full cast"
  ),
  product(
    "gt-bomb-kumar",
    "Bomb Kumar Hoodie",
    "GTH-007",
    ["/images/products/supplied-08.jpeg"],
    "Interval block"
  ),
  product(
    "gt-nenu-ikkade",
    "Nenu Ikkade Hoodie",
    "GTH-008",
    ["/images/products/supplied-17.jpeg", "/images/products/supplied-09.jpeg"],
    "Double feature"
  ),
  product(
    "gt-zoonior",
    "Zoonior Hoodie",
    "GTH-009",
    ["/images/products/supplied-10.jpeg"],
    "Deep cut",
    3299
  ),
  product(
    "gt-egga",
    "Egga Hoodie",
    "GTH-010",
    ["/images/products/supplied-11.jpeg"],
    "Graphic special",
    3699
  ),
  product(
    "gt-pulkaa",
    "Pulkaa Hoodie",
    "GTH-011",
    ["/images/products/supplied-12.jpeg"],
    "Meme legend"
  ),
  product(
    "gt-godfatherly",
    "Stares Godfatherly Hoodie",
    "GTH-012",
    ["/images/products/supplied-13.jpeg"],
    "Boss energy"
  ),
  product(
    "gt-ayya-namaskaram",
    "Ayya Namaskaram Hoodie",
    "GTH-013",
    ["/images/products/supplied-14.jpeg"],
    "Front bench",
    3299
  ),
  product(
    "gt-mahesu",
    "Mahesu Hoodie",
    "GTH-014",
    ["/images/products/supplied-15.jpeg"],
    "Hero cut",
    3699
  ),
  product(
    "gt-baba-saab",
    "Baba Saab Hoodie",
    "GTH-015",
    ["/images/products/supplied-16.jpeg"],
    "Collector print",
    3699
  ),
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
    code: "GTH-X",
    price,
    colorFrom: c.colorFrom,
    colorTo: c.colorTo,
    badge: "Custom cut",
    sizes: SIZES,
    specs,
  }
}
