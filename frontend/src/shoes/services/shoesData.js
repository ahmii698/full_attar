export const CATEGORIES = ["All", "Running", "Casual", "Sports", "Formal", "Sneakers", "Boots"];
export const GENDERS = ["All", "Male", "Female", "Unisex"];
export const SIZES = [7, 8, 9, 10, 11, 12, 13, 14];
export const COLORS = [
  { name: "black", hex: "#0a0a0a" },
  { name: "white", hex: "#ffffff" },
  { name: "grey", hex: "#6b6b6b" },
  { name: "beige", hex: "#d8c9a8" },
  { name: "red", hex: "#a80f16" },
  { name: "blue", hex: "#0b2f9f" },
];

export const SHOES = [
  { id: 1, name: "Air Max Dn", categories: ["Running", "Sneakers"], sub: "Running / Sneakers", gender: "Unisex", sizes: [7, 8, 9, 10, 11], colors: ["black", "white"], price: 24999, isNew: true, image: "/images/shoes/air-max-dn.jpg" },
  { id: 2, name: "Ultraboost 5.0", categories: ["Running", "Sports"], sub: "Running / Sports", gender: "Male", sizes: [8, 9, 10, 11, 12], colors: ["beige", "white"], price: 22499, isNew: true, image: "/images/shoes/ultraboost.jpg" },
  { id: 3, name: "Jordan 1 Retro", categories: ["Casual", "Sneakers"], sub: "Casual / Sneakers", gender: "Unisex", sizes: [7, 8, 9, 10, 11, 12], colors: ["black", "red"], price: 29999, isNew: true, image: "/images/shoes/jordan-1.jpg" },
  { id: 4, name: "Air Force 1", categories: ["Casual", "Sneakers"], sub: "Casual / Sneakers", gender: "Unisex", sizes: [7, 8, 9, 10, 11], colors: ["beige", "white"], price: 21999, isNew: true, image: "/images/shoes/air-force-1.jpg" },
  { id: 5, name: "Terrex Trail", categories: ["Sports", "Boots"], sub: "Sports / Outdoor", gender: "Male", sizes: [9, 10, 11, 12, 13], colors: ["black", "grey"], price: 25999, isNew: true, image: "/images/shoes/terrex-trail.jpg" },
  { id: 6, name: "Campus 00s", categories: ["Casual", "Sneakers"], sub: "Casual / Sneakers", gender: "Female", sizes: [7, 8, 9, 10], colors: ["white", "grey"], price: 19999, isNew: false, image: "/images/shoes/campus-00s.jpg" },
  { id: 7, name: "Oxford Leather", categories: ["Formal"], sub: "Formal / Shoes", gender: "Male", sizes: [8, 9, 10, 11, 12], colors: ["black"], price: 27499, isNew: true, image: "/images/shoes/oxford.jpg" },
  { id: 8, name: "Hiking Boots", categories: ["Boots"], sub: "Boots / Outdoor", gender: "Unisex", sizes: [8, 9, 10, 11, 12, 13, 14], colors: ["black", "beige"], price: 26999, isNew: false, image: "/images/shoes/hiking-boots.jpg" },
];