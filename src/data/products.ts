import { Product } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'ckennedy-equinox-lycra',
    name: "C'Kennedy Kinetic Lycra Short",
    subtitle: 'Short de sport stretch',
    category: 'urbain',
    price: 69600,
    priceFcfa: 69600,
    season: 'Collection 2025',
    badge: 'Sport',
    images: {
      primary:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBmM6LbdJibSnRtWz8WgLoZSRmLeY9znEO9HEO_SI8rLuMdO3x8XKbwKRFBSzQGgC3BUMiEhfo305ZxKv_iHeJ95zkbATlBAEMd3bAnyndiE2UpnYK6yPuIHGIM0XmfEbt3zqw7d3pvih476R4cD6mEkGfaTQqWBjIYiYONTNDmy-6W1umEL4AT-8-2s8L8m4ybWJ_qvEbd7BMjBIzUEMnDs3SEJusQ-idDofqld-Jf7_zXQ735J4kYgg',
      detail:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA3q7qHNwhKvG6MGegJaHIEPiR63TL91AH-bfzNJmUmxWWkqZSXNdT1Tk8aMyYuo4No7gdLT-tgAoduFn4gioNG_WHTHwn4kHX2KFUTJzfWFbK_NyaT2qgi1mguJqj3XP8j2tyD4xI35cwE8uU25IMHTPO8R4Alvpd4xN7ePSb34XqlegSysxUPk4L13wNaqqKd1PnaT1FYBRPrlPFcFz48XSm2t9MQ7nti99n4VaLt16QYsY_iWDnbqQ',
      cartThumbnail:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB099eRj5rfbbjAnUN3O5KhYeAp0MPLzlAJGfHeQV6Ay_Qvj-jl8hDhdfSra0WoFiMCKlgUe9bySWakiuzFMwvCE6JUxCl5GCPMM6ouwVlp0nWq-zN3l6M_l8PH6xls17x6caSLo1O4wsXQgS0nr3qJeLg06L5Y4P4nGe0OnztLthRRj7yq2B1JqIrjACsUIZ6J30LbQ-lk7xMbT38rKBKaeVzCXqgmrok2D0ZYI4G-j0RUSH7XMt97Aw',
    },
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Slate Charcoal', hex: '#26292B' },
      { name: 'Onyx Black', hex: '#111315' },
    ],
    description:
      "Le short C'Kennedy pensé pour bouger : tissu stretch léger qui suit chaque mouvement, sèche vite et reste agréable même sous la chaleur. Idéal pour la salle, le footing du matin ou un look sport décontracté au quotidien.",
    specs: [
      '4-way kinetic compression fabric',
      'Anti-chafe flatlock seams with bonded hem',
      'Internal smartphone bounce-free pocket',
      'Antimicrobial silver-ion yarn treatment',
    ],
    inStock: true,
    rating: 4.9,
    reviewsCount: 148,
  },
  {
    id: 'ckennedy-tactical-sand-hoodie',
    name: 'Tactical Sand Heavy Hoodie',
    subtitle: 'Sweat à capuche épais',
    category: 'urbain',
    price: 88800,
    priceFcfa: 88800,
    season: 'Collection 2025',
    badge: 'Urbain',
    images: {
      primary:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCuwd7vcgzC2Ap6WDyKelDkq0xTKn80eFahQJbjIqOG_mQt6KI6ex3zxk2NwRoWMZl6wjEx2PmSxWGm-3o8rLwKeQGKqI7ZxfkrGAyemkqzDdF0yoAK3S7OcbjHa0lWBusrLS77fWUMQQLrMByfl3w45sxWPmIj3PrOEeeYqRJEDDgceUilbYnwf47vTCrWCmb100wMhtsq22nMknjTIpHcMm32exUXIwAbI6UFAKS_aXAEtj344h43jA',
      secondary:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAPtSxzs12VCf4H39uQCkntddojHlf7eiOmuVIFEa-RtnFj1ilmELFWTpGlxDQbAfsN1abfqATKdRfsKUqTZXBQlGZxDdIoTzp3cOo7Gvkre0nekuFBFHFEvnHT7BBq3q5AiwGQW7e-h9FwQSBoErpnnpSVz9YjTr7z-Hij--QY-S71BRmxUSi3wezwyD4OFNMLGyyOmFZ8qX3K1jug3rC-Mq1UKic6r7kACQ1cf0FUVWHS9gejsk-9uw',
      cartThumbnail:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCuwd7vcgzC2Ap6WDyKelDkq0xTKn80eFahQJbjIqOG_mQt6KI6ex3zxk2NwRoWMZl6wjEx2PmSxWGm-3o8rLwKeQGKqI7ZxfkrGAyemkqzDdF0yoAK3S7OcbjHa0lWBusrLS77fWUMQQLrMByfl3w45sxWPmIj3PrOEeeYqRJEDDgceUilbYnwf47vTCrWCmb100wMhtsq22nMknjTIpHcMm32exUXIwAbI6UFAKS_aXAEtj344h43jA',
    },
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Desert Sand', hex: '#A39988' },
      { name: 'Onyx Black', hex: '#111315' },
    ],
    description:
      "Le hoodie signature C'Kennedy : coton épais et doux, coupe ample et capuche bien tenue. Une grande poche ventrale pour garder téléphone et clés à portée de main. La pièce urbaine à porter en soirée, en voyage ou sous la clim.",
    specs: [
      'Heavyweight 500 GSM French Terry',
      'Articulated raglan shoulder seams',
      'Concealed YKK zippered pocket within kangaroo pouch',
      'Ribbed side expansion gussets for overhead lifts',
    ],
    inStock: true,
    rating: 4.8,
    reviewsCount: 92,
  },
  {
    id: 'ckennedy-cargo-pant',
    name: 'High-Density Cargo Pant',
    subtitle: 'Pantalon cargo coupe moderne',
    category: 'urbain',
    price: 97200,
    priceFcfa: 97200,
    season: 'Collection 2025',
    badge: 'Best-seller',
    images: {
      primary:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDK91hKq21xjhK5mFcMpsCUgH5M5nRH1uLpCDIjul3Yt9g8pu-oETK7lCgxnDg3PTFMnbOoAAhZ35Kk4CIAxUSNG7o_fNRXpkpkfevkwv21m1rbahYyqtWYmQTuE13YCS3IoKwH8G8Iuh5u94n9IwXnmFVTRZGv8OdPy0TCLAEN4ZndV2VgzyBNaiY3BE1YRvvCHNWlSZ-OF2ujI4SUq4kBghzKVV-v7jERedaESwAlK_OE2rbp-boEDg',
      secondary:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCC_n5PnNViZHqNDnFAGpkOvnudjJE5RNiDjRuTAtYPmMfGoU0jCWcsSI9vOMNO9qEYwZ96jO0Mpaa7NtES23Y49_PpvDyqTZtij6lix4cafnSuvBFjxniHI_jhGQF0LjDM-b6GwicwNSR2jsiSuzYrbhLpuaKVRCh5--oT1AEJ11T8WcFQg6p_xMxN1rjyXc6MgXzpwnyyyse0tU5KIkl4FvG6qFxkVGWfZ_CfWXJpFs6MUEwzF4I8ug',
      cartThumbnail:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBmcZyjKxjHDwojjYlyvDRulMSsa8lK1JmINId0fGdkUsMgaxfivO2u7ioASJ6wX40J_wCWuN4Ek6mzdIdOOlsSn_on-Oem-6SiwmqCDdV7WK8-hf4LCP2shg-nAygbuAIVAF8uiHDWfq-vzxjtDeTzi1zDTkyIzdeKeMw-P8OPkVV4_zwgwD0Q1ImFtNGxlKvSQbhUX-hXBAOfO5ITtsAnDm6hUG4gL0YEp2h8LNn6QRBarGLIO0rEfA',
    },
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Dark Slate', hex: '#2C3033' },
      { name: 'Field Olive', hex: '#3B4036' },
      { name: 'Deep Burgundy', hex: '#421E23' },
    ],
    description:
      "Un cargo solide et stylé, taillé dans une toile résistante qui garde sa tenue au fil des lavages. Poches latérales pratiques, coupe ajustée en bas de jambe : il se porte aussi bien avec des baskets qu'avec une chemise pour un look urbain soigné.",
    specs: [
      'DWR water-repellent Cordura® stretch weave',
      'Dual magnetic cargo flap pockets with drainage eyelets',
      'Ergonomic 3D knee articulation',
      'Custom aluminum cinch belt hardware included',
    ],
    inStock: true,
    rating: 5.0,
    reviewsCount: 210,
  },
  {
    id: 'ckennedy-windshell-anorak',
    name: 'Windshell Anorak V2',
    subtitle: 'Coupe-vent léger anti-pluie',
    category: 'urbain',
    price: 104400,
    priceFcfa: 104400,
    season: 'Saison des pluies',
    badge: 'Nouveau',
    images: {
      primary:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBCkQK-XDXhfOmL9qBIcuq5zrfEKDu4aVCYceMqWbyB2ySvzirtlWtkSRH9dTvp1I5NU0E8XDPyan6MfJJdRnAAa988-WWVsJE2CvtdqlcaWHwSYdAYTD8piZxC65mqSiVMB8cHUX-KHgKAkTB0xwb-HLEn0eA6WFTLOzUoa6tqxKDb_ZTRc7YHp2G5i8072RDyOGHJhIQIYCcNdfoGyysibDt34ZXMxxEo9uhJHf318DjFxz867Wey2Q',
      secondary:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuChljkf_8h1HypVqT8_oMexhjh6zvuNpuq1Bu1fmZS9NKZ64Y8h9Q9ife5I5Ow9bg2CmM89TmUXtRzsqJ97fJC95WgM5T7PTzHLXNqfTtqciIxUblaE-EMdLRLuAefCmWZ7-sSvWaavV3xw2CuoXiEXPy5OAoJ8lzyI4sv2Tj-doA6CcUjXM5WguVeCJSlClOJvAcyzgy6M9Hl12cSGCQaSKWOUKx0LCnpQg0_6URXHgsQ6kKwHp3GYIg',
      cartThumbnail:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBCkQK-XDXhfOmL9qBIcuq5zrfEKDu4aVCYceMqWbyB2ySvzirtlWtkSRH9dTvp1I5NU0E8XDPyan6MfJJdRnAAa988-WWVsJE2CvtdqlcaWHwSYdAYTD8piZxC65mqSiVMB8cHUX-KHgKAkTB0xwb-HLEn0eA6WFTLOzUoa6tqxKDb_ZTRc7YHp2G5i8072RDyOGHJhIQIYCcNdfoGyysibDt34ZXMxxEo9uhJHf318DjFxz867Wey2Q',
    },
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Silver Reflective', hex: '#CBD2D6' },
      { name: 'Matte Jet', hex: '#151719' },
    ],
    description:
      "Le coupe-vent C'Kennedy qui vous suit partout pendant la saison des pluies : ultra léger, il protège des averses et du vent sans tenir chaud. Il se replie facilement dans un sac et ses détails réfléchissants assurent votre visibilité le soir.",
    specs: [
      'Micro-ripstop nylon with 10K hydrostatic head rating',
      'Laser-perforated heat exhaust zones',
      'Packs entirely into self-contained chest pouch',
      'Helmet-compatible cinched hood with brim stabilizer',
    ],
    inStock: true,
    rating: 4.9,
    reviewsCount: 88,
  },
  {
    id: 'ckennedy-modular-sling',
    name: 'Tactical Modular Sling 01',
    subtitle: 'Sacoche bandoulière',
    category: 'accessories',
    price: 69600,
    priceFcfa: 69600,
    season: 'Toute saison',
    badge: 'Populaire',
    images: {
      primary:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBmcZyjKxjHDwojjYlyvDRulMSsa8lK1JmINId0fGdkUsMgaxfivO2u7ioASJ6wX40J_wCWuN4Ek6mzdIdOOlsSn_on-Oem-6SiwmqCDdV7WK8-hf4LCP2shg-nAygbuAIVAF8uiHDWfq-vzxjtDeTzi1zDTkyIzdeKeMw-P8OPkVV4_zwgwD0Q1ImFtNGxlKvSQbhUX-hXBAOfO5ITtsAnDm6hUG4gL0YEp2h8LNn6QRBarGLIO0rEfA',
      cartThumbnail:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBmcZyjKxjHDwojjYlyvDRulMSsa8lK1JmINId0fGdkUsMgaxfivO2u7ioASJ6wX40J_wCWuN4Ek6mzdIdOOlsSn_on-Oem-6SiwmqCDdV7WK8-hf4LCP2shg-nAygbuAIVAF8uiHDWfq-vzxjtDeTzi1zDTkyIzdeKeMw-P8OPkVV4_zwgwD0Q1ImFtNGxlKvSQbhUX-hXBAOfO5ITtsAnDm6hUG4gL0YEp2h8LNn6QRBarGLIO0rEfA',
    },
    sizes: [],
    colors: [
      { name: 'Silver Reflective', hex: '#CBD2D6' },
      { name: 'Stealth Black', hex: '#181A1C' },
    ],
    description:
      "La sacoche C'Kennedy pour sortir les mains libres : téléphone, portefeuille, clés et écouteurs trouvent leur place. Fermeture rapide, tissu résistant à l'eau et sangle réglable pour la porter en bandoulière ou sur la poitrine.",
    specs: [
      'Cordura® 500D Ballistic Nylon',
      'German-engineered Fidlock® magnetic fastener',
      'AquaGuard® weatherproof sealed zippers',
      'Breathable 3D spacer mesh rear padding',
    ],
    inStock: true,
    rating: 5.0,
    reviewsCount: 164,
  },
  {
    id: 'ckennedy-ninja-balaclava-hoodie',
    name: 'Ninja Balaclava Thermal Hoodie',
    subtitle: 'Hoodie cagoule intégrée',
    category: 'urbain',
    price: 81000,
    priceFcfa: 81000,
    season: 'Collection 2025',
    badge: 'Édition limitée',
    images: {
      primary:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAT1f7JiZtB37fWHdAwTm_1Zr-UfiPTR2NTQOqRGSygzv06mJcv2r7A2gQ0Sx-CvmDNg4L-6DMlwvbJu6ei4Nn9Nk8UQpCuVYkNH1p_R7AwcKqvf8aVQYwCFxj1siy_3t7UQeaMaqhUpP5uj124ba1Yzy4pH3uVCuCc5TN1q6NlKYNYz3wVVYTsGJb2gyhUDqoHnAZmh51FMo59q5bHwWOdqEDA8hAwh298FcaU0w_C7xN8Z8paoDcfxQ',
      secondary:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCNlPJxqsaST0u1xX8gsQ7XgB3XtD-2SWsjQ4MV_f_K_MHxEXrd6zCuqcSeJaDUvo4ru0mg5nVcWxZNvPWYAxjIMV2Ws-tsKNjTCe8_5ipn9ZzLUkD8iz8KdFz6zvyLUkCTJ-9wy2BeHMrnWcZemtQmIN15ryF1hz8NuSxk6XxGW2kw7oxiCyeIJgSCNxLn_k_s_FiCTuRG4pvdRHNSYuk7Vf8yIpCidExX5MTyNBfA_1CVp0kQkhlgNQ',
      cartThumbnail:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAT1f7JiZtB37fWHdAwTm_1Zr-UfiPTR2NTQOqRGSygzv06mJcv2r7A2gQ0Sx-CvmDNg4L-6DMlwvbJu6ei4Nn9Nk8UQpCuVYkNH1p_R7AwcKqvf8aVQYwCFxj1siy_3t7UQeaMaqhUpP5uj124ba1Yzy4pH3uVCuCc5TN1q6NlKYNYz3wVVYTsGJb2gyhUDqoHnAZmh51FMo59q5bHwWOdqEDA8hAwh298FcaU0w_C7xN8Z8paoDcfxQ',
    },
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Onyx Black', hex: '#111315' },
      { name: 'Slate Gray', hex: '#3C4043' },
    ],
    description:
      "Le hoodie au caractère fort de C'Kennedy : sa cagoule intégrée se relève en un geste pour un style streetwear affirmé. Matière douce et confortable, coupe près du corps et passe-pouces aux manches. Une édition qui ne passe pas inaperçue.",
    specs: [
      'Polartec® Power Grid thermal fleece',
      'Dual-function retractable wind mask',
      'Thumbhole cuffs for secure glove seal',
      'Ergonomic athletic contoured fit',
    ],
    inStock: true,
    rating: 4.9,
    reviewsCount: 114,
  },
  {
    id: 'ckennedy-cordura-field-jacket',
    name: 'Cordura® Ripstop Field Jacket',
    subtitle: 'Veste élégante coupe structurée',
    category: 'classique',
    price: 132000,
    priceFcfa: 132000,
    season: 'Collection 2025',
    badge: 'Signature',
    images: {
      primary: '/images/hero-2.jpg',
      cartThumbnail: '/images/hero-2.jpg',
    },
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Matte Asphalt', hex: '#1E2124', imageUrl: '/images/hero-2.jpg' },
      { name: 'Grizzly Tan', hex: '#7A6B58', imageUrl: '/images/hero-1.png' }, // Fallback to show change
    ],
    description:
      "La veste signature de la gamme Classique C'Kennedy : une coupe structurée qui affine la silhouette et des finitions soignées. Elle habille aussi bien une tenue de bureau qu'un look de sortie, pour une élégance moderne en toute occasion.",
    specs: [
      'Cordura® 500D ripstop exterior shell',
      'Internal backpack carry suspension straps',
      '6 exterior sealed gear pockets',
      'Dual bidirectional front zipper storm placket',
    ],
    inStock: true,
    rating: 5.0,
    reviewsCount: 76,
  },
  {
    id: 'ckennedy-aero-windbreaker',
    name: 'Aero-Mesh Half-Zip Windbreaker',
    subtitle: 'Veste légère demi-zip',
    category: 'classique',
    price: 93000,
    priceFcfa: 93000,
    season: 'Collection 2025',
    badge: 'Élégance',
    images: {
      primary: '/images/hero-3.png',
      cartThumbnail: '/images/hero-3.png',
    },
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Onyx Black', hex: '#111315', imageUrl: '/images/hero-3.png' },
      { name: 'Ghost White', hex: '#EBEFEF', imageUrl: '/images/hero-1.png' }, // Fallback to show change
    ],
    description:
      "Légère et respirante, cette veste demi-zip C'Kennedy apporte une touche chic à toutes vos tenues. Son tissu laisse passer l'air pour rester à l'aise malgré la chaleur, et sa coupe épurée se marie facilement avec un pantalon habillé comme avec un jean.",
    specs: [
      'Micro-filament aero weave fabric',
      'Ergonomic women’s kinetic cut',
      'Elasticated cinched waist and thumbloops',
      "Reflective C'Kennedy barcode logo on reverse neck",
    ],
    inStock: true,
    rating: 4.9,
    reviewsCount: 132,
  },
];
