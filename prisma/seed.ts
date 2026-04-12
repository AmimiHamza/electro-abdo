import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ── Clean existing data ────────────────────────────────────────────────────
  await prisma.activityLog.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.fAQ.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.heroBanner.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.adminUser.deleteMany();

  // ── Admin User ─────────────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await prisma.adminUser.create({
    data: { username: "admin", password: hashedPassword },
  });
  console.log("✅ Admin user created (username: admin, password: admin123)");

  // ── Categories ─────────────────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name_fr: "Smartphones",
        name_ar: "هواتف ذكية",
        name_en: "Smartphones",
        slug: "smartphones",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80",
        order: 1,
      },
    }),
    prisma.category.create({
      data: {
        name_fr: "Ordinateurs Portables",
        name_ar: "أجهزة الكمبيوتر المحمولة",
        name_en: "Laptops",
        slug: "laptops",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80",
        order: 2,
      },
    }),
    prisma.category.create({
      data: {
        name_fr: "Tablettes",
        name_ar: "أجهزة لوحية",
        name_en: "Tablets",
        slug: "tablets",
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80",
        order: 3,
      },
    }),
    prisma.category.create({
      data: {
        name_fr: "Audio & Son",
        name_ar: "الصوت والموسيقى",
        name_en: "Audio & Sound",
        slug: "audio",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
        order: 4,
      },
    }),
    prisma.category.create({
      data: {
        name_fr: "Télévisions",
        name_ar: "أجهزة التلفزيون",
        name_en: "Televisions",
        slug: "televisions",
        image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&q=80",
        order: 5,
      },
    }),
    prisma.category.create({
      data: {
        name_fr: "Accessoires",
        name_ar: "الإكسسوارات",
        name_en: "Accessories",
        slug: "accessories",
        image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&q=80",
        order: 6,
      },
    }),
  ]);

  const [smartphones, laptops, tablets, audio, televisions, accessories] = categories;
  console.log("✅ 6 categories created");

  // ── Products ───────────────────────────────────────────────────────────────
  const productData = [
    // ── Smartphones ──
    {
      name_fr: "Samsung Galaxy S24 Ultra",
      name_ar: "سامسونج جالاكسي S24 الترا",
      name_en: "Samsung Galaxy S24 Ultra",
      description_fr: "Le fleuron de Samsung avec stylet S Pen intégré, appareil photo 200MP et processeur Snapdragon 8 Gen 3. Expérience ultime en photographie mobile.",
      description_ar: "هاتف سامسونج الرائد مع قلم S Pen مدمج وكاميرا 200 ميجابكسل ومعالج Snapdragon 8 Gen 3. تجربة التصوير المحمول المثلى.",
      description_en: "Samsung's flagship with built-in S Pen, 200MP camera, and Snapdragon 8 Gen 3 processor. The ultimate mobile photography experience.",
      price: 12999,
      oldPrice: 14499,
      categoryId: smartphones.id,
      brand: "Samsung",
      tags: "5G,S Pen,200MP,Snapdragon",
      stock: 15,
      isNewArrival: true,
      isVisible: true,
      warranty: "1 an",
      specs: JSON.stringify({ Écran: "6.8\" Dynamic AMOLED 2X 120Hz", Processeur: "Snapdragon 8 Gen 3", RAM: "12 Go", Stockage: "256 Go", Caméra: "200+12+10+10 MP", Batterie: "5000 mAh", OS: "Android 14", "5G": "Oui" }),
      images: ["https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80"],
    },
    {
      name_fr: "iPhone 15 Pro Max",
      name_ar: "آيفون 15 برو ماكس",
      name_en: "iPhone 15 Pro Max",
      description_fr: "Le meilleur iPhone jamais conçu avec puce A17 Pro, titane et téléobjectif 5x. Performances exceptionnelles pour les créateurs.",
      description_ar: "أفضل آيفون تم تصميمه على الإطلاق مع شريحة A17 Pro والتيتانيوم وعدسة تيليفوتو 5x. أداء استثنائي للمبدعين.",
      description_en: "The best iPhone ever made with A17 Pro chip, titanium, and 5x telephoto lens. Exceptional performance for creators.",
      price: 14999,
      oldPrice: null,
      categoryId: smartphones.id,
      brand: "Apple",
      tags: "5G,A17 Pro,Titanium,USB-C",
      stock: 10,
      isNewArrival: true,
      isVisible: true,
      warranty: "1 an",
      specs: JSON.stringify({ Écran: "6.7\" Super Retina XDR OLED 120Hz", Processeur: "A17 Pro", RAM: "8 Go", Stockage: "256 Go", Caméra: "48+12+12 MP", Batterie: "4422 mAh", OS: "iOS 17", "5G": "Oui" }),
      images: ["https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80"],
    },
    {
      name_fr: "Xiaomi 14 Pro",
      name_ar: "شاومي 14 برو",
      name_en: "Xiaomi 14 Pro",
      description_fr: "Smartphone premium Xiaomi avec optique Leica, Snapdragon 8 Gen 3 et charge rapide 120W. Rapport qualité-prix imbattable.",
      description_ar: "هاتف شاومي المتميز بعدسات Leica ومعالج Snapdragon 8 Gen 3 وشحن سريع 120W. نسبة سعر-أداء لا تُضاهى.",
      description_en: "Xiaomi premium smartphone with Leica optics, Snapdragon 8 Gen 3 and 120W fast charging. Unbeatable value.",
      price: 9499,
      oldPrice: 10999,
      categoryId: smartphones.id,
      brand: "Xiaomi",
      tags: "5G,Leica,120W,Snapdragon",
      stock: 20,
      isNewArrival: false,
      isVisible: true,
      warranty: "1 an",
      specs: JSON.stringify({ Écran: "6.73\" LTPO AMOLED 120Hz", Processeur: "Snapdragon 8 Gen 3", RAM: "12 Go", Stockage: "256 Go", Caméra: "50+50+50 MP Leica", Batterie: "4880 mAh 120W", OS: "Android 14 MIUI 15", "5G": "Oui" }),
      images: ["https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600&q=80"],
    },
    {
      name_fr: "Samsung Galaxy A55 5G",
      name_ar: "سامسونج جالاكسي A55 5G",
      name_en: "Samsung Galaxy A55 5G",
      description_fr: "Smartphone milieu de gamme avec écran Super AMOLED 120Hz et triple caméra 50MP. Idéal pour le quotidien.",
      description_ar: "هاتف متوسط المدى مع شاشة Super AMOLED بمعدل 120 هرتز وكاميرا ثلاثية 50 ميجابكسل. مثالي للاستخدام اليومي.",
      description_en: "Mid-range smartphone with 120Hz Super AMOLED display and triple 50MP camera. Perfect for everyday use.",
      price: 4299,
      oldPrice: 4799,
      categoryId: smartphones.id,
      brand: "Samsung",
      tags: "5G,AMOLED,50MP",
      stock: 35,
      isNewArrival: false,
      isVisible: true,
      warranty: "1 an",
      specs: JSON.stringify({ Écran: "6.6\" Super AMOLED 120Hz", Processeur: "Exynos 1480", RAM: "8 Go", Stockage: "128 Go", Caméra: "50+12+5 MP", Batterie: "5000 mAh 25W", OS: "Android 14", "5G": "Oui" }),
      images: ["https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80"],
    },
    {
      name_fr: "Huawei Nova 12 Pro",
      name_ar: "هواوي نوفا 12 برو",
      name_en: "Huawei Nova 12 Pro",
      description_fr: "Design élégant avec appareil photo selfie 60MP et charge rapide 100W. Parfait pour les amateurs de selfies.",
      description_ar: "تصميم أنيق مع كاميرا سيلفي 60 ميجابكسل وشحن سريع 100W. مثالي لعشاق السيلفي.",
      description_en: "Elegant design with 60MP selfie camera and 100W fast charging. Perfect for selfie lovers.",
      price: 5999,
      oldPrice: 6999,
      categoryId: smartphones.id,
      brand: "Huawei",
      tags: "60MP Selfie,100W,Kirin",
      stock: 18,
      isNewArrival: true,
      isVisible: true,
      warranty: "1 an",
      specs: JSON.stringify({ Écran: "6.76\" OLED 120Hz", Processeur: "Kirin 8000", RAM: "12 Go", Stockage: "256 Go", Caméra: "50+8 MP + selfie 60MP", Batterie: "4600 mAh 100W", OS: "HarmonyOS 4" }),
      images: ["https://images.unsplash.com/photo-1603898037225-f0564e3e4c11?w=600&q=80"],
    },
    {
      name_fr: "Oppo Find X7",
      name_ar: "أوبو فايند X7",
      name_en: "Oppo Find X7",
      description_fr: "Flagship Oppo avec Hasselblad Camera, Dimensity 9300 et charge 100W SuperVOOC. Audio Hi-Res certifié.",
      description_ar: "هاتف أوبو الرائد مع كاميرا Hasselblad ومعالج Dimensity 9300 وشحن SuperVOOC بقوة 100W. صوت Hi-Res معتمد.",
      description_en: "Oppo flagship with Hasselblad Camera, Dimensity 9300 and 100W SuperVOOC charging. Certified Hi-Res Audio.",
      price: 8499,
      oldPrice: null,
      categoryId: smartphones.id,
      brand: "Oppo",
      tags: "5G,Hasselblad,SuperVOOC,Dimensity",
      stock: 12,
      isNewArrival: true,
      isVisible: true,
      warranty: "1 an",
      specs: JSON.stringify({ Écran: "6.82\" LTPO3 AMOLED 120Hz", Processeur: "Dimensity 9300", RAM: "16 Go", Stockage: "256 Go", Caméra: "50+64+6 MP Hasselblad", Batterie: "5000 mAh 100W", OS: "Android 14 ColorOS 14", "5G": "Oui" }),
      images: ["https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&q=80"],
    },

    // ── Laptops ──
    {
      name_fr: "MacBook Pro 14\" M3 Pro",
      name_ar: "ماك بوك برو 14 بوصة M3 برو",
      name_en: "MacBook Pro 14\" M3 Pro",
      description_fr: "Le MacBook Pro ultime avec puce M3 Pro, écran Liquid Retina XDR et autonomie incroyable de 18 heures. Pour les professionnels exigeants.",
      description_ar: "ماك بوك برو المثالي مع شريحة M3 Pro وشاشة Liquid Retina XDR وبطارية تدوم 18 ساعة. للمحترفين المتطلبين.",
      description_en: "The ultimate MacBook Pro with M3 Pro chip, Liquid Retina XDR display and incredible 18-hour battery. For demanding professionals.",
      price: 22999,
      oldPrice: 24999,
      categoryId: laptops.id,
      brand: "Apple",
      tags: "M3 Pro,Retina XDR,18h battery,macOS",
      stock: 8,
      isNewArrival: true,
      isVisible: true,
      warranty: "1 an",
      specs: JSON.stringify({ Écran: "14.2\" Liquid Retina XDR 120Hz", Processeur: "Apple M3 Pro 11 cœurs", RAM: "18 Go unifiée", Stockage: "512 Go SSD", GPU: "GPU 14 cœurs", Autonomie: "18 heures", Ports: "3x Thunderbolt 4, HDMI, SD, MagSafe", OS: "macOS Sonoma" }),
      images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80"],
    },
    {
      name_fr: "Dell XPS 15 OLED",
      name_ar: "ديل XPS 15 OLED",
      name_en: "Dell XPS 15 OLED",
      description_fr: "Ultrabook Dell avec écran OLED 3.5K 60Hz, Intel Core i9-13900H et RTX 4070. La référence pour les créatifs sous Windows.",
      description_ar: "حاسوب محمول ديل بشاشة OLED بدقة 3.5K و60 هرتز ومعالج Intel Core i9-13900H و RTX 4070. المرجع للمبدعين على Windows.",
      description_en: "Dell ultrabook with 3.5K 60Hz OLED display, Intel Core i9-13900H and RTX 4070. The Windows creative benchmark.",
      price: 19999,
      oldPrice: 21999,
      categoryId: laptops.id,
      brand: "Dell",
      tags: "OLED,RTX 4070,i9,Thunderbolt",
      stock: 6,
      isNewArrival: false,
      isVisible: true,
      warranty: "2 ans",
      specs: JSON.stringify({ Écran: "15.6\" OLED 3.5K 60Hz TouchScreen", Processeur: "Intel Core i9-13900H", RAM: "32 Go DDR5", Stockage: "1 To SSD NVMe", GPU: "NVIDIA RTX 4070 8Go", Batterie: "86 Wh", Poids: "1.86 kg", OS: "Windows 11 Pro" }),
      images: ["https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80"],
    },
    {
      name_fr: "HP Pavilion 15 Ryzen 7",
      name_ar: "HP باليون 15 رايزن 7",
      name_en: "HP Pavilion 15 Ryzen 7",
      description_fr: "Laptop polyvalent avec Ryzen 7 7730U, 16 Go RAM et SSD 512 Go. Parfait pour les étudiants et professionnels.",
      description_ar: "حاسوب محمول متعدد الاستخدامات مع Ryzen 7 7730U و16 جيجابايت رام و512 جيجابايت SSD. مثالي للطلاب والمهنيين.",
      description_en: "Versatile laptop with Ryzen 7 7730U, 16GB RAM and 512GB SSD. Perfect for students and professionals.",
      price: 7999,
      oldPrice: 8999,
      categoryId: laptops.id,
      brand: "HP",
      tags: "Ryzen 7,FHD,512GB SSD",
      stock: 22,
      isNewArrival: false,
      isVisible: true,
      warranty: "1 an",
      specs: JSON.stringify({ Écran: "15.6\" FHD IPS 250 nits", Processeur: "AMD Ryzen 7 7730U", RAM: "16 Go DDR4", Stockage: "512 Go SSD NVMe", GPU: "Radeon 780M intégrée", Batterie: "41 Wh", Poids: "1.75 kg", OS: "Windows 11 Home" }),
      images: ["https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&q=80"],
    },
    {
      name_fr: "Lenovo ThinkPad X1 Carbon",
      name_ar: "لينوفو ثينك باد X1 كاربون",
      name_en: "Lenovo ThinkPad X1 Carbon",
      description_fr: "Ultrabook business légendaire, 1.12 kg, écran IPS FHD, i7-1365U et autonomie 15 heures. Le meilleur laptop business.",
      description_ar: "الحاسوب المحمول الأعمال الأسطوري بوزن 1.12 كجم وشاشة IPS FHD ومعالج i7-1365U وبطارية 15 ساعة.",
      description_en: "Legendary business ultrabook, 1.12kg, IPS FHD screen, i7-1365U and 15-hour battery. The best business laptop.",
      price: 16499,
      oldPrice: null,
      categoryId: laptops.id,
      brand: "Lenovo",
      tags: "Business,Ultra-léger,i7,15h battery",
      stock: 9,
      isNewArrival: false,
      isVisible: true,
      warranty: "3 ans",
      specs: JSON.stringify({ Écran: "14\" IPS FHD 400 nits anti-reflets", Processeur: "Intel Core i7-1365U vPro", RAM: "16 Go LPDDR5", Stockage: "512 Go SSD NVMe", GPU: "Intel Iris Xe", Poids: "1.12 kg", Sécurité: "Match-on-Chip fingerprint, IR cam", OS: "Windows 11 Pro" }),
      images: ["https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80"],
    },
    {
      name_fr: "Asus ROG Zephyrus G14",
      name_ar: "أسوس ROG زيفيروس G14",
      name_en: "Asus ROG Zephyrus G14",
      description_fr: "Laptop gaming compact avec Ryzen 9 7940HS, RTX 4060 et écran QHD 165Hz. La bête gaming portable.",
      description_ar: "حاسوب محمول للألعاب مضغوط مع Ryzen 9 7940HS و RTX 4060 وشاشة QHD بمعدل 165 هرتز.",
      description_en: "Compact gaming laptop with Ryzen 9 7940HS, RTX 4060 and QHD 165Hz display. The portable gaming beast.",
      price: 14999,
      oldPrice: 16499,
      categoryId: laptops.id,
      brand: "Asus",
      tags: "Gaming,RTX 4060,QHD 165Hz,Ryzen 9",
      stock: 7,
      isNewArrival: true,
      isVisible: true,
      warranty: "2 ans",
      specs: JSON.stringify({ Écran: "14\" QHD 165Hz 500 nits", Processeur: "AMD Ryzen 9 7940HS", RAM: "16 Go DDR5", Stockage: "1 To SSD NVMe", GPU: "NVIDIA RTX 4060 8Go", Batterie: "76 Wh 100W", Poids: "1.65 kg", OS: "Windows 11 Home" }),
      images: ["https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&q=80"],
    },

    // ── Tablets ──
    {
      name_fr: "iPad Pro 12.9\" M2",
      name_ar: "آيباد برو 12.9 بوصة M2",
      name_en: "iPad Pro 12.9\" M2",
      description_fr: "La tablette la plus puissante avec puce M2, écran mini-LED Liquid Retina XDR et compatible Apple Pencil Pro.",
      description_ar: "الجهاز اللوحي الأكثر قوة مع شريحة M2 وشاشة mini-LED Liquid Retina XDR ومتوافق مع Apple Pencil Pro.",
      description_en: "The most powerful tablet with M2 chip, mini-LED Liquid Retina XDR display and compatible with Apple Pencil Pro.",
      price: 13999,
      oldPrice: null,
      categoryId: tablets.id,
      brand: "Apple",
      tags: "M2,mini-LED,ProMotion,Apple Pencil",
      stock: 11,
      isNewArrival: false,
      isVisible: true,
      warranty: "1 an",
      specs: JSON.stringify({ Écran: "12.9\" mini-LED Liquid Retina XDR 120Hz", Processeur: "Apple M2", RAM: "8 Go", Stockage: "256 Go", Caméra: "12 + 10 MP + LiDAR", Connectivité: "Wi-Fi 6E, Bluetooth 5.3, USB-C Thunderbolt", OS: "iPadOS 17" }),
      images: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80"],
    },
    {
      name_fr: "Samsung Galaxy Tab S9+",
      name_ar: "سامسونج جالاكسي تاب S9+",
      name_en: "Samsung Galaxy Tab S9+",
      description_fr: "Tablette Android premium avec écran Dynamic AMOLED 2X 120Hz, Snapdragon 8 Gen 2 et S Pen inclus.",
      description_ar: "جهاز لوحي Android متميز مع شاشة Dynamic AMOLED 2X بمعدل 120 هرتز ومعالج Snapdragon 8 Gen 2 وقلم S Pen مضمن.",
      description_en: "Premium Android tablet with Dynamic AMOLED 2X 120Hz display, Snapdragon 8 Gen 2 and included S Pen.",
      price: 11499,
      oldPrice: 12999,
      categoryId: tablets.id,
      brand: "Samsung",
      tags: "S Pen,AMOLED,DeX,5G",
      stock: 14,
      isNewArrival: true,
      isVisible: true,
      warranty: "1 an",
      specs: JSON.stringify({ Écran: "12.4\" Dynamic AMOLED 2X 120Hz", Processeur: "Snapdragon 8 Gen 2", RAM: "12 Go", Stockage: "256 Go", Caméra: "13+8 MP + 12 MP selfie", "S Pen": "Inclus", OS: "Android 13 One UI 5.1", Poids: "581 g" }),
      images: ["https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=600&q=80"],
    },
    {
      name_fr: "Xiaomi Pad 6 Pro",
      name_ar: "شاومي باد 6 برو",
      name_en: "Xiaomi Pad 6 Pro",
      description_fr: "Tablette performante avec Snapdragon 8+ Gen 1, écran 144Hz et haut-parleurs quad Dolby Atmos. Excellent rapport qualité-prix.",
      description_ar: "جهاز لوحي عالي الأداء مع Snapdragon 8+ Gen 1 وشاشة 144 هرتز وسماعات رباعية Dolby Atmos. نسبة سعر-أداء ممتازة.",
      description_en: "Powerful tablet with Snapdragon 8+ Gen 1, 144Hz display and quad Dolby Atmos speakers. Excellent value.",
      price: 5999,
      oldPrice: 6999,
      categoryId: tablets.id,
      brand: "Xiaomi",
      tags: "144Hz,Snapdragon,Dolby Atmos",
      stock: 25,
      isNewArrival: false,
      isVisible: true,
      warranty: "1 an",
      specs: JSON.stringify({ Écran: "11\" LCD IPS 144Hz 2800×1800", Processeur: "Snapdragon 8+ Gen 1", RAM: "8 Go", Stockage: "256 Go", Caméra: "50 MP + 20 MP selfie", Audio: "Quad speakers Dolby Atmos", OS: "Android 13 MIUI 14 Pad", Poids: "490 g" }),
      images: ["https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&q=80"],
    },

    // ── Audio ──
    {
      name_fr: "Sony WH-1000XM5",
      name_ar: "سوني WH-1000XM5",
      name_en: "Sony WH-1000XM5",
      description_fr: "Le meilleur casque à réduction de bruit du marché avec 30 heures d'autonomie et son Hi-Res Audio certifié.",
      description_ar: "أفضل سماعة لإلغاء الضوضاء في السوق مع 30 ساعة بطارية وصوت Hi-Res Audio معتمد.",
      description_en: "The best noise-cancelling headphones on the market with 30-hour battery and certified Hi-Res Audio.",
      price: 3799,
      oldPrice: 4299,
      categoryId: audio.id,
      brand: "Sony",
      tags: "ANC,Hi-Res,30h,Bluetooth 5.2",
      stock: 30,
      isNewArrival: false,
      isVisible: true,
      warranty: "1 an",
      specs: JSON.stringify({ Type: "Casque over-ear sans fil", "Réduction de bruit": "Oui (ANC adaptatif)", Autonomie: "30 heures", Codec: "LDAC, AAC, SBC", Bluetooth: "5.2 multipoint", Charge: "USB-C 3h + 10min = 5h", Poids: "250 g" }),
      images: ["https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&q=80"],
    },
    {
      name_fr: "AirPods Pro 2ème génération",
      name_ar: "إيربودز برو الجيل الثاني",
      name_en: "AirPods Pro 2nd Generation",
      description_fr: "Les écouteurs True Wireless Apple avec ANC adaptatif, audio spatial et boîtier MagSafe. L'expérience iPhone parfaite.",
      description_ar: "سماعات Apple True Wireless مع ANC التكيفية والصوت المكاني وعلبة MagSafe. التجربة المثالية مع iPhone.",
      description_en: "Apple True Wireless earbuds with adaptive ANC, spatial audio and MagSafe case. The perfect iPhone experience.",
      price: 2999,
      oldPrice: null,
      categoryId: audio.id,
      brand: "Apple",
      tags: "ANC,Spatial Audio,MagSafe,H2 Chip",
      stock: 40,
      isNewArrival: false,
      isVisible: true,
      warranty: "1 an",
      specs: JSON.stringify({ Type: "Écouteurs intra-auriculaires True Wireless", "Réduction de bruit": "ANC adaptatif H2", Autonomie: "6h + 24h avec boîtier", Codec: "AAC, aptX Adaptive", Bluetooth: "5.3 multipoint", Boîtier: "MagSafe + Lightning + sans fil", Résistance: "IPX4" }),
      images: ["https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&q=80"],
    },
    {
      name_fr: "JBL Charge 5",
      name_ar: "JBL شارج 5",
      name_en: "JBL Charge 5",
      description_fr: "Enceinte Bluetooth portable étanche IP67 avec 20 heures d'autonomie et PowerBank intégré. Le son JBL Pro partout.",
      description_ar: "مكبر صوت Bluetooth محمول مقاوم للماء IP67 مع 20 ساعة بطارية وبنك طاقة مدمج. صوت JBL Pro في كل مكان.",
      description_en: "Waterproof IP67 portable Bluetooth speaker with 20-hour battery and built-in PowerBank. JBL Pro sound everywhere.",
      price: 1799,
      oldPrice: 2099,
      categoryId: audio.id,
      brand: "JBL",
      tags: "IP67,20h,PowerBank,Bluetooth",
      stock: 45,
      isNewArrival: false,
      isVisible: true,
      warranty: "1 an",
      specs: JSON.stringify({ Type: "Enceinte Bluetooth portable", Puissance: "30W RMS", Autonomie: "20 heures", Bluetooth: "5.1 PartyBoost", Résistance: "IP67 (eau + poussière)", PowerBank: "Charge vos appareils", Poids: "960 g" }),
      images: ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80"],
    },
    {
      name_fr: "Bose QuietComfort 45",
      name_ar: "بوز كوايت كومفورت 45",
      name_en: "Bose QuietComfort 45",
      description_fr: "Casque légendaire Bose avec confort exceptionnel, ANC Quiet et Aware mode. 24 heures d'autonomie.",
      description_ar: "سماعة بوز الأسطورية مع راحة استثنائية ووضع ANC Quiet وAware mode. 24 ساعة بطارية.",
      description_en: "Legendary Bose headphones with exceptional comfort, Quiet ANC and Aware mode. 24-hour battery.",
      price: 3299,
      oldPrice: 3799,
      categoryId: audio.id,
      brand: "Bose",
      tags: "ANC,24h,Confort,Bluetooth 5.1",
      stock: 20,
      isNewArrival: false,
      isVisible: true,
      warranty: "1 an",
      specs: JSON.stringify({ Type: "Casque over-ear sans fil", "Réduction de bruit": "Oui (Quiet + Aware mode)", Autonomie: "24 heures", Codec: "aptX, AAC, SBC", Bluetooth: "5.1 multipoint", Charge: "USB-C 2.5h", Poids: "240 g" }),
      images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80"],
    },

    // ── Televisions ──
    {
      name_fr: "Samsung Neo QLED 4K 65\"",
      name_ar: "سامسونج نيو QLED 4K 65 بوصة",
      name_en: "Samsung Neo QLED 4K 65\"",
      description_fr: "Téléviseur Neo QLED 65 pouces avec Mini LED, Quantum HDR 32x et Gaming Hub. La révolution de l'image.",
      description_ar: "تلفزيون Neo QLED 65 بوصة مع Mini LED وQuantum HDR 32x وGaming Hub. ثورة الصورة.",
      description_en: "65-inch Neo QLED TV with Mini LED, Quantum HDR 32x and Gaming Hub. The image revolution.",
      price: 18999,
      oldPrice: 21999,
      categoryId: televisions.id,
      brand: "Samsung",
      tags: "4K,Neo QLED,HDR 32x,Gaming Hub",
      stock: 5,
      isNewArrival: false,
      isVisible: true,
      warranty: "2 ans",
      specs: JSON.stringify({ Taille: "65\"", Technologie: "Neo QLED Mini LED", Résolution: "4K UHD (3840×2160)", HDR: "Quantum HDR 32x", "Taux de rafraîchissement": "120Hz", "Gaming": "Gaming Hub, 4K 120Hz HDMI 2.1", OS: "Tizen", Ports: "4x HDMI 2.1, 3x USB" }),
      images: ["https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600&q=80"],
    },
    {
      name_fr: "LG OLED C3 55\"",
      name_ar: "LG OLED C3 55 بوصة",
      name_en: "LG OLED C3 55\"",
      description_fr: "La référence OLED avec noirs parfaits, Dolby Vision IQ et Dolby Atmos. Compatible gaming 4K 120Hz G-Sync.",
      description_ar: "المرجع في تقنية OLED مع السواد المثالي وDolby Vision IQ وDolby Atmos. متوافق مع الألعاب 4K 120Hz G-Sync.",
      description_en: "The OLED reference with perfect blacks, Dolby Vision IQ and Dolby Atmos. 4K 120Hz G-Sync gaming compatible.",
      price: 14999,
      oldPrice: 16999,
      categoryId: televisions.id,
      brand: "LG",
      tags: "OLED,Dolby Vision,120Hz,G-Sync",
      stock: 8,
      isNewArrival: true,
      isVisible: true,
      warranty: "2 ans",
      specs: JSON.stringify({ Taille: "55\"", Technologie: "OLED evo", Résolution: "4K UHD (3840×2160)", HDR: "Dolby Vision IQ, HDR10, HLG", "Taux de rafraîchissement": "120Hz G-Sync/FreeSync", OS: "webOS 23", Ports: "4x HDMI 2.1, 3x USB", Audio: "40W 2.2ch Dolby Atmos" }),
      images: ["https://images.unsplash.com/photo-1571415060716-baff5f717c37?w=600&q=80"],
    },
    {
      name_fr: "Hisense 4K ULED 55\"",
      name_ar: "هيسنس 4K ULED 55 بوصة",
      name_en: "Hisense 4K ULED 55\"",
      description_fr: "TV ULED Hisense Full Array Local Dimming, 144Hz et Dolby Vision. Excellent rapport qualité-prix.",
      description_ar: "تلفزيون ULED هيسنس مع Full Array Local Dimming و144Hz وDolby Vision. نسبة سعر-أداء ممتازة.",
      description_en: "Hisense ULED TV with Full Array Local Dimming, 144Hz and Dolby Vision. Excellent value.",
      price: 7999,
      oldPrice: 9499,
      categoryId: televisions.id,
      brand: "Hisense",
      tags: "4K,ULED,144Hz,Dolby Vision",
      stock: 12,
      isNewArrival: false,
      isVisible: true,
      warranty: "2 ans",
      specs: JSON.stringify({ Taille: "55\"", Technologie: "ULED Full Array Local Dimming", Résolution: "4K UHD", HDR: "Dolby Vision, HDR10+, HLG", "Taux de rafraîchissement": "144Hz VRR", OS: "VIDAA U7", Ports: "3x HDMI 2.1, 2x USB", Audio: "30W Dolby Atmos" }),
      images: ["https://images.unsplash.com/photo-1620503374956-c942862f0372?w=600&q=80"],
    },

    // ── Accessories ──
    {
      name_fr: "Apple Watch Series 9",
      name_ar: "ساعة آبل Series 9",
      name_en: "Apple Watch Series 9",
      description_fr: "La montre connectée Apple avec puce S9, écran Retina toujours actif et double tap. La santé au poignet.",
      description_ar: "الساعة الذكية من Apple مع شريحة S9 وشاشة Retina نشطة دائمًا وDouble Tap. الصحة على معصمك.",
      description_en: "Apple smartwatch with S9 chip, always-on Retina display and double tap. Health on your wrist.",
      price: 4499,
      oldPrice: 4999,
      categoryId: accessories.id,
      brand: "Apple",
      tags: "Santé,GPS,Waterproof,NFC,Double Tap",
      stock: 25,
      isNewArrival: true,
      isVisible: true,
      warranty: "1 an",
      specs: JSON.stringify({ Écran: "45mm LTPO OLED Always-On Retina", Processeur: "Apple S9 SiP", GPS: "Précision de deuxième génération", Santé: "ECG, SpO2, Température, Chute", Étanchéité: "50m (WR50) + poussière IP6X", Autonomie: "18 heures", Charge: "MagSafe", OS: "watchOS 10" }),
      images: ["https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80"],
    },
    {
      name_fr: "Chargeur Sans Fil 3-en-1 MagSafe",
      name_ar: "شاحن لاسلكي 3 في 1 MagSafe",
      name_en: "3-in-1 MagSafe Wireless Charger",
      description_fr: "Chargeur MagSafe 3-en-1 pour iPhone, Apple Watch et AirPods. 15W max. Design ultra-compact.",
      description_ar: "شاحن MagSafe ثلاثي في واحد لـ iPhone وApple Watch وAirPods. بقوة 15 واط. تصميم فائق الصغر.",
      description_en: "3-in-1 MagSafe charger for iPhone, Apple Watch and AirPods. 15W max. Ultra-compact design.",
      price: 899,
      oldPrice: 1099,
      categoryId: accessories.id,
      brand: "Belkin",
      tags: "MagSafe,15W,3-en-1,Sans fil",
      stock: 60,
      isNewArrival: false,
      isVisible: true,
      warranty: "2 ans",
      specs: JSON.stringify({ Compatibilité: "iPhone 12/13/14/15, Apple Watch, AirPods", Puissance: "15W MagSafe + 5W Watch + 5W AirPods", Câble: "USB-C 2m inclus", Adaptation: "Adaptateur secteur 30W inclus", Poids: "150 g" }),
      images: ["https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&q=80"],
    },
    {
      name_fr: "Batterie Externe 20000mAh 65W",
      name_ar: "بطارية خارجية 20000 مللي أمبير 65 واط",
      name_en: "20000mAh 65W Power Bank",
      description_fr: "Power Bank 20000 mAh avec charge rapide 65W PD, compatible laptop et smartphone. 3 ports USB-C + USB-A.",
      description_ar: "بنك طاقة 20000 مللي أمبير مع شحن سريع 65W PD ومتوافق مع الحاسوب المحمول والهاتف الذكي. 3 منافذ USB-C + USB-A.",
      description_en: "20000mAh power bank with 65W PD fast charging, laptop and smartphone compatible. 3 USB-C + USB-A ports.",
      price: 649,
      oldPrice: 799,
      categoryId: accessories.id,
      brand: "Anker",
      tags: "65W PD,20000mAh,Laptop,USB-C",
      stock: 80,
      isNewArrival: false,
      isVisible: true,
      warranty: "18 mois",
      specs: JSON.stringify({ Capacité: "20000 mAh", "Charge rapide": "65W USB-C Power Delivery", Ports: "2x USB-C + 1x USB-A QC 3.0", "Charge laptop": "Oui (jusqu'à 65W)", Poids: "440 g", Dimensions: "162×77×21 mm", Certifications: "CE, FCC, RoHS" }),
      images: ["https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&q=80"],
    },
    {
      name_fr: "Coque Samsung Galaxy S24 Ultra",
      name_ar: "جراب سامسونج جالاكسي S24 الترا",
      name_en: "Samsung Galaxy S24 Ultra Case",
      description_fr: "Coque de protection officielle Samsung Clear Case avec protection MIL-STD-810G. Transparente et élégante.",
      description_ar: "جراب الحماية الرسمي من سامسونج مع حماية MIL-STD-810G. شفاف وأنيق.",
      description_en: "Official Samsung Clear Case with MIL-STD-810G protection. Transparent and elegant.",
      price: 299,
      oldPrice: null,
      categoryId: accessories.id,
      brand: "Samsung",
      tags: "S24 Ultra,Protection,MIL-STD,S Pen",
      stock: 100,
      isNewArrival: false,
      isVisible: true,
      warranty: "6 mois",
      specs: JSON.stringify({ Compatibilité: "Samsung Galaxy S24 Ultra", Protection: "MIL-STD-810G (chutes 1.5m)", Matière: "Polycarbonate transparent + TPU", "Compatibilité S Pen": "Oui", Couleurs: "Transparent" }),
      images: ["https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&q=80"],
    },
    {
      name_fr: "Clavier Mécanique Gaming RGB",
      name_ar: "لوحة مفاتيح ميكانيكية للألعاب RGB",
      name_en: "RGB Mechanical Gaming Keyboard",
      description_fr: "Clavier mécanique TKL switches Red silencieux, rétroéclairage RGB 16M couleurs et hub USB intégré.",
      description_ar: "لوحة مفاتيح ميكانيكية TKL بمفاتيح حمراء صامتة وإضاءة خلفية RGB بـ16 مليون لون ومحور USB مدمج.",
      description_en: "TKL mechanical keyboard with silent Red switches, 16M color RGB backlight and built-in USB hub.",
      price: 1299,
      oldPrice: 1499,
      categoryId: accessories.id,
      brand: "Keychron",
      tags: "Gaming,Mécanique,RGB,TKL,Bluetooth",
      stock: 35,
      isNewArrival: false,
      isVisible: true,
      warranty: "1 an",
      specs: JSON.stringify({ Type: "TKL (Tenkeyless) 87 touches", Switches: "Gateron Red silencieux", Rétroéclairage: "RGB 16M couleurs per-key", Connexion: "USB-C + Bluetooth 5.1 3 appareils", Construction: "Aluminium CNC + POM Plate", OS: "Win / Mac / Linux", Poids: "850 g" }),
      images: ["https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&q=80"],
    },
  ];

  // Create products and their images
  const createdProducts: { id: string }[] = [];
  for (const p of productData) {
    const { images, specs, ...rest } = p;
    const product = await prisma.product.create({
      data: {
        ...rest,
        specs: specs ?? null,
        images: {
          create: images.map((url, order) => ({ url, order })),
        },
      },
    });
    createdProducts.push(product);
  }
  console.log(`✅ ${createdProducts.length} products created`);

  // ── Hero Banners ───────────────────────────────────────────────────────────
  await prisma.heroBanner.createMany({
    data: [
      {
        image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=1400&q=80",
        title_fr: "Nouveaux iPhone 15 Pro Max — Disponibles maintenant",
        title_ar: "آيفون 15 برو ماكس الجديد — متوفر الآن",
        title_en: "New iPhone 15 Pro Max — Available Now",
        link: "/fr/category/smartphones",
        order: 1,
        isActive: true,
      },
      {
        image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1400&q=80",
        title_fr: "Laptops Gaming — Jusqu'à -20%",
        title_ar: "حواسيب الألعاب — خصم حتى 20%",
        title_en: "Gaming Laptops — Up to 20% Off",
        link: "/fr/category/laptops",
        order: 2,
        isActive: true,
      },
      {
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1400&q=80",
        title_fr: "Audio Premium — Sony, Bose, Apple",
        title_ar: "صوت متميز — Sony، Bose، Apple",
        title_en: "Premium Audio — Sony, Bose, Apple",
        link: "/fr/category/audio",
        order: 3,
        isActive: true,
      },
    ],
  });
  console.log("✅ 3 hero banners created");

  // ── Offers ─────────────────────────────────────────────────────────────────
  // Use the first 3 smartphone product IDs for offer 1 and first 2 laptop IDs for offer 2
  const smartphoneIds = createdProducts.slice(0, 3).map((p) => p.id).join(",");
  const laptopIds = createdProducts.slice(6, 9).map((p) => p.id).join(",");

  await prisma.offer.createMany({
    data: [
      {
        title_fr: "Méga Soldes Smartphones",
        title_ar: "تخفيضات ضخمة على الهواتف",
        title_en: "Mega Smartphone Sales",
        productIds: smartphoneIds,
        discount: 15,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        isActive: true,
      },
      {
        title_fr: "Rentrée Laptops — Offres exclusives",
        title_ar: "عروض العودة للمدارس — لاب توب",
        title_en: "Back to School Laptop Deals",
        productIds: laptopIds,
        discount: 10,
        startDate: new Date(),
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
        isActive: true,
      },
    ],
  });
  console.log("✅ 2 offers created");

  // ── Testimonials ───────────────────────────────────────────────────────────
  await prisma.testimonial.createMany({
    data: [
      {
        name: "Karim B.",
        text_fr: "Service impeccable ! J'ai reçu mon iPhone 15 Pro en 24h, parfaitement emballé. Le prix était le meilleur que j'ai trouvé au Maroc.",
        text_ar: "خدمة لا تشوبها شائبة! استلمت آيفون 15 برو في 24 ساعة، معبأ بشكل مثالي. كان السعر أفضل ما وجدته في المغرب.",
        text_en: "Impeccable service! I received my iPhone 15 Pro in 24h, perfectly packaged. The price was the best I found in Morocco.",
        rating: 5,
      },
      {
        name: "Fatima Z.",
        text_fr: "J'ai commandé un MacBook Pro et j'ai été bluffée par la rapidité de livraison. Produit 100% authentique avec garantie. Je recommande vivement !",
        text_ar: "طلبت ماك بوك برو وبُهرت بسرعة التوصيل. منتج أصلي 100% مع ضمان. أوصي به بشدة!",
        text_en: "I ordered a MacBook Pro and was blown away by the delivery speed. 100% authentic product with warranty. Highly recommend!",
        rating: 5,
      },
      {
        name: "Amine M.",
        text_fr: "Très bon rapport qualité-prix sur les accessoires. Mon casque Sony WH-1000XM5 est arrivé en parfait état. Le service client est très réactif.",
        text_ar: "نسبة جودة-سعر ممتازة على الإكسسوارات. وصل سماعتي Sony WH-1000XM5 في حالة مثالية. خدمة العملاء سريعة الاستجابة.",
        text_en: "Great value on accessories. My Sony WH-1000XM5 arrived in perfect condition. Customer service is very responsive.",
        rating: 4,
      },
      {
        name: "Sara L.",
        text_fr: "Achat de Samsung Galaxy S24 Ultra, produit authentique et livraison rapide. Je suis cliente depuis 2 ans et toujours satisfaite !",
        text_ar: "اشتريت سامسونج جالاكسي S24 الترا، منتج أصلي وتوصيل سريع. أنا عميلة منذ سنتين ودائمًا راضية!",
        text_en: "Bought Samsung Galaxy S24 Ultra, authentic product and fast delivery. I've been a customer for 2 years and always satisfied!",
        rating: 5,
      },
      {
        name: "Youssef A.",
        text_fr: "Le meilleur shop en ligne pour l'électronique au Maroc. Prix compétitifs, livraison fiable, garantie respectée. Bravo l'équipe !",
        text_ar: "أفضل متجر إلكتروني للإلكترونيات في المغرب. أسعار تنافسية وتوصيل موثوق وضمان محترم. أحسنتم يا فريق!",
        text_en: "The best online electronics shop in Morocco. Competitive prices, reliable delivery, respected warranty. Well done team!",
        rating: 5,
      },
    ],
  });
  console.log("✅ 5 testimonials created");

  // ── FAQs ───────────────────────────────────────────────────────────────────
  await prisma.fAQ.createMany({
    data: [
      {
        question_fr: "Quels sont les délais de livraison ?",
        question_ar: "ما هي مواعيد التسليم؟",
        question_en: "What are the delivery times?",
        answer_fr: "Nous livrons dans tout le Maroc en 24 à 48 heures ouvrables. Casablanca, Rabat et Marrakech bénéficient d'une livraison le jour même pour toute commande passée avant 14h.",
        answer_ar: "نوصل في جميع أنحاء المغرب خلال 24 إلى 48 ساعة عمل. الدار البيضاء والرباط ومراكش يستفيدون من التوصيل في نفس اليوم لكل طلب قبل الساعة 2 ظهرًا.",
        answer_en: "We deliver throughout Morocco in 24 to 48 working hours. Casablanca, Rabat and Marrakech benefit from same-day delivery for any order placed before 2pm.",
        order: 1,
      },
      {
        question_fr: "Tous les produits sont-ils garantis ?",
        question_ar: "هل جميع المنتجات مضمونة؟",
        question_en: "Are all products guaranteed?",
        answer_fr: "Oui, tous nos produits sont 100% authentiques et bénéficient de la garantie officielle du fabricant (1 à 2 ans selon le produit). Nous fournissons une facture officielle avec chaque achat.",
        answer_ar: "نعم، جميع منتجاتنا أصلية 100% وتستفيد من الضمان الرسمي للشركة المصنعة (من 1 إلى 2 سنة حسب المنتج). نقدم فاتورة رسمية مع كل عملية شراء.",
        answer_en: "Yes, all our products are 100% authentic and benefit from the official manufacturer's warranty (1 to 2 years depending on the product). We provide an official invoice with each purchase.",
        order: 2,
      },
      {
        question_fr: "Comment passer une commande ?",
        question_ar: "كيف أضع طلبًا؟",
        question_en: "How do I place an order?",
        answer_fr: "Vous pouvez commander directement via notre site en ajoutant les produits au panier, puis en finalisant la commande par WhatsApp. Notre équipe vous contactera dans les 30 minutes pour confirmer.",
        answer_ar: "يمكنك الطلب مباشرة عبر موقعنا بإضافة المنتجات إلى السلة ثم إتمام الطلب عبر WhatsApp. سيتصل بك فريقنا في غضون 30 دقيقة للتأكيد.",
        answer_en: "You can order directly through our site by adding products to the cart, then finalizing the order via WhatsApp. Our team will contact you within 30 minutes to confirm.",
        order: 3,
      },
      {
        question_fr: "Quels modes de paiement acceptez-vous ?",
        question_ar: "ما طرق الدفع التي تقبلونها؟",
        question_en: "What payment methods do you accept?",
        answer_fr: "Nous acceptons le paiement à la livraison (cash), les virements bancaires et le paiement en ligne sécurisé par carte. Le paiement à la livraison est disponible dans toutes les villes du Maroc.",
        answer_ar: "نقبل الدفع عند الاستلام (نقدًا) والتحويلات البنكية والدفع الإلكتروني الآمن بالبطاقة. الدفع عند الاستلام متاح في جميع مدن المغرب.",
        answer_en: "We accept cash on delivery, bank transfers and secure online card payment. Cash on delivery is available in all cities of Morocco.",
        order: 4,
      },
      {
        question_fr: "Quelle est votre politique de retour ?",
        question_ar: "ما هي سياسة الإرجاع لديكم؟",
        question_en: "What is your return policy?",
        answer_fr: "Nous acceptons les retours dans les 7 jours suivant la réception pour tout produit défectueux ou non conforme. Le produit doit être dans son emballage d'origine. Contactez-nous par WhatsApp pour initier un retour.",
        answer_ar: "نقبل الإرجاع في غضون 7 أيام من الاستلام لأي منتج معيب أو غير مطابق. يجب أن يكون المنتج في عبوته الأصلية. تواصل معنا عبر WhatsApp لبدء الإرجاع.",
        answer_en: "We accept returns within 7 days of receipt for any defective or non-conforming product. The product must be in its original packaging. Contact us via WhatsApp to initiate a return.",
        order: 5,
      },
      {
        question_fr: "Livrez-vous à l'extérieur du Maroc ?",
        question_ar: "هل توصلون خارج المغرب؟",
        question_en: "Do you deliver outside Morocco?",
        answer_fr: "Actuellement, nous livrons uniquement au Maroc. Nous travaillons sur une solution de livraison internationale et vous tiendrons informés de son lancement.",
        answer_ar: "حاليًا، نوصل داخل المغرب فقط. نعمل على حل للتوصيل الدولي وسنعلمكم عند إطلاقه.",
        answer_en: "Currently, we only deliver within Morocco. We are working on an international delivery solution and will keep you informed of its launch.",
        order: 6,
      },
    ],
  });
  console.log("✅ 6 FAQs created");

  // ── Announcement ───────────────────────────────────────────────────────────
  await prisma.announcement.create({
    data: {
      text_fr: "🎉 Livraison gratuite pour toute commande supérieure à 1000 DH — Valable jusqu'à fin du mois !",
      text_ar: "🎉 توصيل مجاني لكل طلب يتجاوز 1000 درهم — صالح حتى نهاية الشهر!",
      text_en: "🎉 Free delivery for any order over 1000 DH — Valid until end of month!",
      isActive: true,
      bgColor: "#2563eb",
    },
  });
  console.log("✅ 1 announcement created");

  // ── Activity Log ───────────────────────────────────────────────────────────
  await prisma.activityLog.createMany({
    data: [
      { action: "SEED", details: "Database seeded with demo data" },
      { action: "ADMIN_CREATED", details: "Admin user created: admin" },
    ],
  });

  console.log("\n✅ Database seeding complete!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Admin credentials:");
  console.log("  Username: admin");
  console.log("  Password: admin123");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
