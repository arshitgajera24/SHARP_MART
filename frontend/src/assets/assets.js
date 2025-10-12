import basket_icon from './basket_icon.webp'
import logo_navbar from './logo_navbar.webp'
import search_icon from './search_icon.webp'
import add_icon_white from './add_icon_white.webp'
import add_icon_green from './add_icon_green.webp'
import remove_icon_red from './remove_icon_red.webp'
import app_store from './app_store.webp'
import play_store from './play_store.webp'
import linkedin_icon from './linkedin_icon.webp'
import facebook_icon from './facebook_icon.webp'
import twitter_icon from './twitter_icon.webp'
import cross_icon from './cross_icon.webp'
import selector_icon from './selector_icon.webp'
import rating_starts from './rating_starts.webp'
import profile_icon from './profile_icon.webp'
import bag_icon from './bag_icon.webp'
import logout_icon from './logout_icon.webp'
import parcel_icon from './parcel_icon.webp'
import about_logo from "./about_logo.webp"
import contact from "./contact.webp"
import home_bg from "./home_bg.webp"
import logo_footer from "./logo_footer.webp"
import logo_header from "./logo_header.webp"
import title_logo from "./title_logo.webp"
import login from "./login.webp"
import bakery from "../../public/products/bakery.webp"
import bottles from "../../public/products/bottles.webp"
import dairy_product from "../../public/products/dairy_product.webp"
import fresh_fruits from "../../public/products/fresh_fruits.webp"
import grain from "../../public/products/grain.webp"
import instant from "../../public/products/instant.webp"
import organic_vegitable from "../../public/products/organic_vegitable.webp"

export const assets = {
    logo_navbar,
    basket_icon,
    search_icon,
    rating_starts,
    add_icon_green,
    add_icon_white,
    remove_icon_red,
    app_store,
    play_store,
    linkedin_icon,
    facebook_icon,
    twitter_icon,
    cross_icon,
    selector_icon,
    profile_icon,
    logout_icon,
    bag_icon,
    parcel_icon,
    about_logo,
    contact,
    home_bg,
    logo_footer,
    logo_header,
    title_logo,
    login,
    bakery,
    bottles,
    dairy_product,
    fresh_fruits,
    grain,
    instant,
    organic_vegitable,
}

export const categoryList = [
    {
        categoryName: "Organic Veggies",
        categoryImage: organic_vegitable,
        category: "Vegetables",
    },
    {
        categoryName: "Fresh Fruits",
        categoryImage: fresh_fruits,
        category: "Fruits",
    },
    {
        categoryName: "Cold Drinks",
        categoryImage: bottles,
        category: "Drinks",
    },
    {
        categoryName: "Dairy Products",
        categoryImage: dairy_product,
        category: "Dairy",
    },
    {
        categoryName: "Bakery & Breads",
        categoryImage: bakery,
        category: "Bakery",
    },
    {
        categoryName: "Grains & Cereals",
        categoryImage: grain,
        category: "Grains",
    },
    {
        categoryName: "Instant Foods",
        categoryImage: instant,
        category: "Instant",
    },
]

export const food_list = [
  {
    "id": 1,
    "category": "Vegetables",
    "name": "Potato 500g",
    "price": 35,
    "original_price": 40,
    "image": "https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/tzibj2ntsnbn4e0u5kwv.png",
    "ratings": 4.5,
    "stock": 60,
    "description": "Fresh and organic, Best for fries and curry, Farm-picked"
  },
  {
    "id": 2,
    "category": "Vegetables",
    "name": "Tomato 1kg",
    "price": 28,
    "original_price": 30,
    "image": "https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/kdbfytxisrjymgy0ubhk.png",
    "ratings": 4.2,
    "stock": 40,
    "description": "Juicy and ripe, Perfect for salads and sauces, Rich in Vitamin C"
  },
  {
    "id": 3,
    "category": "Vegetables",
    "name": "Carrot 500g",
    "price": 44,
    "original_price": 50,
    "image": "https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/ceqgisupuizyste9aifg.png",
    "ratings": 4.3,
    "stock": 35,
    "description": "Crunchy and sweet, Good for eyesight, Ideal for snacking"
  },
  {
    "id": 4,
    "category": "Vegetables",
    "name": "Spinach 500g",
    "price": 15,
    "original_price": 20,
    "image": "https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/bhrtl76sscvmeiq4kchm.png",
    "ratings": 4.0,
    "stock": 25,
    "description": "Leafy green, High in iron, Used in various Indian dishes"
  },
  {
    "id": 5,
    "category": "Vegetables",
    "name": "Onion 500g",
    "price": 45,
    "original_price": 50,
    "image": "https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/wnvtwlm2tphqburhsmyc.png",
    "ratings": 4.1,
    "stock": 50,
    "description": "Everyday essential, Adds flavor to meals, Farm fresh"
  },
  {
    "id": 6,
    "category": "Fruits",
    "name": "Apple 1kg",
    "price": 90,
    "original_price": 100,
    "image": "https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/pjt1y6xdo46tluemhf0o.png",
    "ratings": 4.6,
    "stock": 20,
    "description": "Crisp and sweet, High in fiber, Imported quality"
  },
  {
    "id": 7,
    "category": "Fruits",
    "name": "Orange 1kg",
    "price": 75,
    "original_price": 90,
    "image": "https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/r1wxfortw5h12g7egx7k.png",
    "ratings": 4.3,
    "stock": 30,
    "description": "Citrus delight, Rich in Vitamin C, Juicy and tangy"
  },
  {
    "id": 8,
    "category": "Fruits",
    "name": "Banana 1kg",
    "price": 45,
    "original_price": 50,
    "image": "https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/dsnmko6gqtyw31okby80.png",
    "ratings": 4.4,
    "stock": 70,
    "description": "Instant energy, Soft and sweet, Ideal for breakfast"
  },
  {
    "id": 9,
    "category": "Fruits",
    "name": "Mango 1kg",
    "price": 140,
    "original_price": 160,
    "image": "https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/nb1mpxuo4fdcik6ey5yj.png",
    "ratings": 4.7,
    "stock": 15,
    "description": "King of fruits, Seasonal special, Deliciously juicy"
  },
  {
    "id": 10,
    "category": "Fruits",
    "name": "Grapes 500g",
    "price": 65,
    "original_price": 70,
    "image": "https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/jsmb7caaokhnyci2coga.png",
    "ratings": 4.2,
    "stock": 55,
    "description": "Sweet and seedless, Easy to snack, Good for digestion"
  },
  {
    "id": 11,
    "category": "Dairy",
    "name": "Amul Milk 1L",
    "price": 55,
    "original_price": 60,
    "image": "https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/ooamzy497lhsj2gjuwby.png",
    "ratings": 4.5,
    "stock": 100,
    "description": "Pure cow milk, Rich in calcium, Freshly packed daily"
  },
  {
    "id": 12,
    "category": "Dairy",
    "name": "Paneer 200g",
    "price": 85,
    "original_price": 90,
    "image": "https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/vihqr6wquv57byurvz46.png",
    "ratings": 4.6,
    "stock": 40,
    "description": "Soft and fresh, Perfect for curries, Protein-rich"
  },
  {
    "id": 13,
    "category": "Dairy",
    "name": "Eggs 12 pcs",
    "price": 85,
    "original_price": 90,
    "image": "https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/cnjrpbcnqesqxy1wr30g.png",
    "ratings": 4.5,
    "stock": 70,
    "description": "Farm fresh, High in protein, Perfect breakfast option"
  },
  {
    "id": 14,
    "category": "Dairy",
    "name": "Cheese 200g",
    "price": 130,
    "original_price": 140,
    "image": "https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/gek3mmiig3lixlkpxks8.png",
    "ratings": 4.6,
    "stock": 20,
    "description": "Creamy and rich, Ideal for pizza and pasta, Long shelf life"
  },
  {
    "id": 15,
    "category": "Drinks",
    "name": "Coca-Cola 1.5L",
    "price": 75,
    "original_price": 80,
    "image": "https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/eljxcdud6fduwfim5rdx.png",
    "ratings": 4.5,
    "stock": 80,
    "description": "Chilled refreshment, Great with meals, Party favorite"
  },
  {
    "id": 16,
    "category": "Drinks",
    "name": "Fanta 1L",
    "price": 65,
    "original_price": 70,
    "image": "https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/nexecd3mgyzrpeun1bee.png",
    "ratings": 4.3,
    "stock": 65,
    "description": "Orange flavored fizz, Cool and tasty, Family drink"
  },
  {
    "id": 17,
    "category": "Drinks",
    "name": "Sprite 1.5L",
    "price": 60,
    "original_price": 65,
    "image": "https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/daiglpvgna1dlhjplbve.png",
    "ratings": 4.4,
    "stock": 50,
    "description": "Lemon lime soda, No caffeine, Crisp and clear taste"
  },
  {
    "id": 18,
    "category": "Drinks",
    "name": "7 Up 1.5L",
    "price": 70,
    "original_price": 75,
    "image": "https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/qt1ypzsoqni12ghf2ryp.png",
    "ratings": 4.4,
    "stock": 60,
    "description": "Refreshing drink, Great with snacks, Popular brand"
  },
  {
    "id": 19,
    "category": "Instant",
    "name": "Maggi Noodles 280g",
    "price": 50,
    "original_price": 55,
    "image": "https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/dsep7owmwvfrukzbslqo.png",
    "ratings": 4.5,
    "stock": 90,
    "description": "Ready in 2 minutes, Tasty and spicy, Favorite snack"
  },
  {
    "id": 20,
    "category": "Instant",
    "name": "Knorr Cup Soup 70g",
    "price": 30,
    "original_price": 35,
    "image": "https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/vnzb2qbwtpab5gnqvx0f.png",
    "ratings": 4.2,
    "stock": 45,
    "description": "Quick meal, Hot and tasty, Great for winters"
  },
  {
    "id": 21,
    "category": "Bakery",
    "name": "Brown Bread 400g",
    "price": 35,
    "original_price": 40,
    "image": "https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/vy1xa7zovcu22smzapzv.png",
    "ratings": 4.4,
    "stock": 55,
    "description": "Whole wheat, High fiber, Fresh and soft"
  },
  {
    "id": 22,
    "category": "Bakery",
    "name": "Butter Croissant 100g",
    "price": 45,
    "original_price": 50,
    "image": "https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/zvoeqbvrbrt7atqj0dbu.png",
    "ratings": 4.3,
    "stock": 30,
    "description": "Flaky layers, Buttery flavor, Perfect for breakfast"
  },
  {
    "id": 23,
    "category": "Grains",
    "name": "Basmati Rice 5kg",
    "price": 520,
    "original_price": 550,
    "image": "https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/evuovl2nlwdjukosfz23.png",
    "ratings": 4.5,
    "stock": 40,
    "description": "Long grain, Aromatic taste, Ideal for biryani"
  },
  {
    "id": 24,
    "category": "Grains",
    "name": "Brown Rice 1kg",
    "price": 110,
    "original_price": 120,
    "image": "https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/dboutcrkdjhoxcvbbqne.png",
    "ratings": 4.2,
    "stock": 25,
    "description": "Healthy choice, Low glycemic index, Rich in fiber"
  },
  {
    "id": 25,
    "category": "Grains",
    "name": "Organic Quinoa 500g",
    "price": 420,
    "original_price": 450,
    "image": "https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/cxrrgnf12xuhkr4dyhi2.png",
    "ratings": 4.6,
    "stock": 15,
    "description": "Superfood, High protein, Gluten free"
  },
  {
    "id": 26,
    "category": "Grains",
    "name": "Wheat Flour 5kg",
    "price": 230,
    "original_price": 250,
    "image": "https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/ooitbkcjcky0gkjmkatb.png",
    "ratings": 4.5,
    "stock": 60,
    "description": "Made from quality wheat, Soft rotis, No added chemicals"
  },
  {
    "id": 27,
    "category": "Grains",
    "name": "Barley 1kg",
    "price": 140,
    "original_price": 150,
    "image": "https://raw.githubusercontent.com/avinashdm/gs-images/main/greencart/spb5sgy8g24rned9nwog.png",
    "ratings": 4.4,
    "stock": 20,
    "description": "Great for digestion, Used in soups, High fiber content"
  }
]
