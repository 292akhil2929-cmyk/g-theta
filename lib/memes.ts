// Original Tenglish microcopy for the storefront. These are not film quotes.

export const addLines = [
  "Bag lo padindi bidda! 🛍️",
  "Adding chesko, tension enti mama?",
  "Cart ki kottha member vachadu 🎉",
  "Semma choice. Crowd approved 🔥",
  "Nee style ki full marks 💯",
  "Interval block item locked!",
]

export const removeLines = [
  "Teesesava? Sare, nee ishtam 😮‍💨",
  "Poyindi poneele. Next design choodu.",
  "Bag khaali aipothondi mari…",
  "Cart nunchi exit teesukunnadu 🚪",
  "Mind maarithe malli add cheyyi.",
]

export const emptyCartLines = [
  "Bag khaali ga undi… first-show mood ledha?",
  "Idi chaala empty ga undi bro. Shopping cheddama?",
  "Cart lo em ledu. Drop 01 choodu!",
]

export const checkoutLines = [
  "Order confirm ayyindi ra bidda! 🚀",
  "Shipping start ayyaka full hero entry chesthundi 😎",
  "Package pampisthunnam. Whistle ready ga unchuko!",
]

export const wishlistLines = [
  "Wishlist lo pettesav. Manam marchipomu 💛",
  "Save ayyindi. Tarvatha teesuko mari!",
]

export const subscribeLines = [
  "List lo padipoyav! First-show update direct ga vastundi 🎟️",
  "Done! Next drop news nee inbox ke.",
  "Fan club entry confirmed 🔔",
]

export function randomOf(list: string[]): string {
  return list[Math.floor(Math.random() * list.length)]
}
