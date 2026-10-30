/**
 * StreetPropertyListings — owns the hard-coded preview listing data.
 * It has no scene access and must not make visibility or UI decisions.
 */
export type StreetPropertyListing = {
  floor: number
  status: string
  rooms: string
  bathrooms: string
  price: string
}

export const STREET_PROPERTY_LISTINGS: StreetPropertyListing[] = [
  {floor: 1, status: "FOR SALE", rooms: "3 rooms", bathrooms: "2 bathrooms", price: "$780,000"},
  {floor: 3, status: "FOR RENT", rooms: "2 rooms", bathrooms: "1 bathroom", price: "$3,200 / month"},
  {floor: 8, status: "FOR SALE", rooms: "4 rooms", bathrooms: "3 bathrooms", price: "$1,250,000"},
]
