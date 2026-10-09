import { Product, CategoryInfo } from '../models/product.model';
import { Store } from '../models/store.model';
import { DeliveryOption, Address } from '../models/address.model';
import { Coupon } from '../models/coupon.model';

export const MOCK_CATEGORIES: CategoryInfo[] = [
  {
    id: 'kits',
    name: 'Kits de Churrasco',
    shortName: 'Kits',
    icon: 'fire',
    description: 'Monte seu kit personalizado ou escolha kits prontos para o seu churrasco.',
    bannerImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'bovinos',
    name: 'Carnes Bovinas (Cruas)',
    shortName: 'Bovinos',
    icon: 'meat-bovino',
    description: 'Cortes nobres e tradicionais in natura, rigorosamente selecionados.',
    bannerImage: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'suinos',
    name: 'Carnes Suínas (Cruas)',
    shortName: 'Suínos',
    icon: 'meat-suino',
    description: 'Costelinhas, pancetas e cortes suínos frescos para grelha e defumação.',
    bannerImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'aves',
    name: 'Aves & Frango (Cru)',
    shortName: 'Frangos',
    icon: 'chicken',
    description: 'Coração de frango para espeto, coxinha da asa e sobrecoxas desossadas.',
    bannerImage: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'linguicas-espetinhos',
    name: 'Linguiças & Espetinhos Crus',
    shortName: 'Linguiças',
    icon: 'sausage',
    description: 'Linguiças artesanais toscanas, com queijo coalho e espetinhos montados in natura.',
    bannerImage: 'https://images.unsplash.com/photo-1597393353415-b3730f3719fe?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'bebidas',
    name: 'Cervejas & Bebidas',
    shortName: 'Bebidas',
    icon: 'beer',
    description: 'Cervejas artesanais, pilsen puro malte, refrigerantes e água mineral.',
    bannerImage: 'https://images.unsplash.com/photo-1608270191763-71829633e08f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'carvao-acendedores',
    name: 'Carvão & Acendedores',
    shortName: 'Carvão',
    icon: 'charcoal',
    description: 'Carvão vegetal selecionado, briquetes e acendedores em gel e bastão.',
    bannerImage: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sais-temperos',
    name: 'Sal Grosso & Sal de Parrilla',
    shortName: 'Sais e Temperos',
    icon: 'salt',
    description: 'Sal de parrilla chimichurri, sal grosso e dry rubs especiais para churrasco.',
    bannerImage: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'acessorios',
    name: 'Temperos & Acessórios',
    shortName: 'Acessórios',
    icon: 'knife',
    description: 'Tábuas nobres, grelhas em inox, pegadores com trava e facas especiais.',
    bannerImage: 'https://images.unsplash.com/photo-1588165171080-c89acfa5a259?auto=format&fit=crop&w=800&q=80'
  }
];

export const MOCK_PRODUCTS: Product[] = [
  // --- CARNES BOVINAS CRUAS ---
  {
    id: 'bov-01',
    name: 'Picanha Angus Prime (Crua in Natura)',
    category: 'bovinos',
    meatType: 'bovino',
    cutType: 'Picanha',
    description: 'Capa de gordura uniforme, marmoreio excepcional. Peça in natura resfriada para churrasco premium.',
    price: 98.90,
    unit: 'kg',
    unitStep: 0.5,
    minUnit: 0.5,
    maxUnit: 10,
    imageUrl: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    stockQuantity: 45,
    featured: true,
    promotion: {
      originalPrice: 115.00,
      discountPercent: 14,
      badgeText: 'Mais Vendida'
    },
    details: {
      origin: 'Raça Angus Selecionada',
      temperature: 'Resfriado (Cru)',
      servingGuide: 'Aprox. 350g por adulto',
      variableWeightAlert: true
    }
  },
  {
    id: 'bov-02',
    name: 'Ancho Bife de Costela Angus (Cru)',
    category: 'bovinos',
    meatType: 'bovino',
    cutType: 'Ancho',
    description: 'Corte nobre do lombo bovino com olho de gordura central. Suculência e maciez incomparáveis.',
    price: 84.90,
    unit: 'kg',
    unitStep: 0.5,
    minUnit: 0.5,
    maxUnit: 8,
    imageUrl: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    stockQuantity: 30,
    featured: true,
    details: {
      origin: 'Novilho Jovem Angus',
      temperature: 'Resfriado (Cru)',
      servingGuide: 'Ideal para grelha bem quente'
    }
  },
  {
    id: 'bov-03',
    name: 'Fraldinha Red Meat para Churrasco (Crua)',
    category: 'bovinos',
    meatType: 'bovino',
    cutType: 'Fraldinha',
    description: 'Fibras longas e sabor intenso. Limpa de membrana e com capa de gordura perfeita para brasa.',
    price: 59.90,
    unit: 'kg',
    unitStep: 0.5,
    minUnit: 0.5,
    maxUnit: 12,
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    stockQuantity: 28,
    featured: false,
    details: {
      origin: 'Bovino Selecionado',
      temperature: 'Resfriado (Cru)',
      servingGuide: 'Cortar contra a fibra'
    }
  },
  {
    id: 'bov-04',
    name: 'Contra-Filé Grill Angus (Cru)',
    category: 'bovinos',
    meatType: 'bovino',
    cutType: 'Contra-Filé',
    description: 'Chorizo em bifes grossos ou peça inteira in natura para selar na grelha.',
    price: 68.50,
    unit: 'kg',
    unitStep: 0.5,
    minUnit: 0.5,
    maxUnit: 10,
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    stockQuantity: 50,
    featured: true,
    details: {
      origin: 'Angus Certificado',
      temperature: 'Resfriado (Cru)'
    }
  },
  {
    id: 'bov-05',
    name: 'Costela Bovina em Tiras Janela (Crua)',
    category: 'bovinos',
    meatType: 'bovino',
    cutType: 'Costela',
    description: 'Corte tradicional de churrasco gaúcho. Tiras com carne macia e gordura entremeada.',
    price: 49.90,
    unit: 'kg',
    unitStep: 1.0,
    minUnit: 1.0,
    maxUnit: 15,
    imageUrl: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    stockQuantity: 22,
    featured: false,
    details: {
      origin: 'Bovino Sulista',
      temperature: 'Resfriado (Cru)',
      servingGuide: 'Ideal para fogo lento na grelha superior'
    }
  },
  {
    id: 'bov-06',
    name: 'Maminha Grill Resfriada (Crua)',
    category: 'bovinos',
    meatType: 'bovino',
    cutType: 'Maminha',
    description: 'Peça inteira crua, maciez extrema e suculência garantida para o espeto ou grelha.',
    price: 62.90,
    unit: 'kg',
    unitStep: 0.5,
    minUnit: 0.5,
    maxUnit: 8,
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    stockQuantity: 18,
    featured: false
  },

  // --- CARNES SUÍNAS CRUAS ---
  {
    id: 'sui-01',
    name: 'Costelinha Suína Barbecue Cut (Crua)',
    category: 'suinos',
    meatType: 'suino',
    cutType: 'Costelinha',
    description: 'Costelinha suína limpa in natura em manta inteira, ideal para assar lentamente.',
    price: 38.90,
    unit: 'kg',
    unitStep: 0.5,
    minUnit: 0.5,
    maxUnit: 10,
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    stockQuantity: 35,
    featured: true,
    details: {
      origin: 'Suíno Selecionado',
      temperature: 'Resfriado (Cru)'
    }
  },
  {
    id: 'sui-02',
    name: 'Panceta Suína em Mantas (Crua)',
    category: 'suinos',
    meatType: 'suino',
    cutType: 'Panceta',
    description: 'Barriga suína in natura com couro fino para pururuca perfeita na brasa.',
    price: 34.50,
    unit: 'kg',
    unitStep: 0.5,
    minUnit: 0.5,
    maxUnit: 10,
    imageUrl: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    stockQuantity: 25,
    featured: false
  },
  {
    id: 'sui-03',
    name: 'Picanha Suína Especial (Crua)',
    category: 'suinos',
    meatType: 'suino',
    cutType: 'Picanha Suína',
    description: 'Corte magro e macio com capa de gordura suave, in natura para grelhar.',
    price: 39.90,
    unit: 'kg',
    unitStep: 0.5,
    minUnit: 0.5,
    maxUnit: 6,
    imageUrl: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    stockQuantity: 15,
    featured: false
  },

  // --- AVES E FRANGO (CRU) ---
  {
    id: 'ave-01',
    name: 'Coração de Frango Selecionado (Cru)',
    category: 'aves',
    meatType: 'frango',
    cutType: 'Coração',
    description: 'Corações de frango higienizados e resfriados in natura, prontos para espetar.',
    price: 36.90,
    unit: 'kg',
    unitStep: 0.5,
    minUnit: 0.5,
    maxUnit: 8,
    imageUrl: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    stockQuantity: 40,
    featured: true,
    promotion: {
      originalPrice: 42.00,
      discountPercent: 12,
      badgeText: 'Oferta da Semana'
    },
    details: {
      origin: 'Avícola Certificada',
      temperature: 'Resfriado (Cru)'
    }
  },
  {
    id: 'ave-02',
    name: 'Coxinha da Asa (Drumet) Resfriada (Crua)',
    category: 'aves',
    meatType: 'frango',
    cutType: 'Drumet',
    description: 'Coxinhas da asa de frango frescas in natura, ideais para marinar e dourar.',
    price: 24.90,
    unit: 'kg',
    unitStep: 0.5,
    minUnit: 0.5,
    maxUnit: 12,
    imageUrl: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    stockQuantity: 50,
    featured: false
  },
  {
    id: 'ave-03',
    name: 'Sobrecoxa Desossada para Grelha (Crua)',
    category: 'aves',
    meatType: 'frango',
    cutType: 'Sobrecoxa',
    description: 'Sobrecoxa sem osso mantendo a pele para suculência na brasa in natura.',
    price: 27.90,
    unit: 'kg',
    unitStep: 0.5,
    minUnit: 0.5,
    maxUnit: 10,
    imageUrl: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    stockQuantity: 30,
    featured: false
  },

  // --- LINGUIÇAS & ESPETINHOS CRUS ---
  {
    id: 'ling-01',
    name: 'Linguiça Toscana Artesanal com Ervas (Crua)',
    category: 'linguicas-espetinhos',
    meatType: 'misto',
    cutType: 'Linguiça Toscana',
    description: '100% pernil suíno com tempero do Mané, embutida em tripa natural in natura.',
    price: 32.90,
    unit: 'kg',
    unitStep: 0.5,
    minUnit: 0.5,
    maxUnit: 15,
    imageUrl: 'https://images.unsplash.com/photo-1597393353415-b3730f3719fe?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    stockQuantity: 60,
    featured: true,
    details: {
      origin: 'Produção Própria Mané',
      temperature: 'Resfriado (Cru)'
    }
  },
  {
    id: 'ling-02',
    name: 'Linguiça de Pernil com Queijo Coalho (Crua)',
    category: 'linguicas-espetinhos',
    meatType: 'suino',
    cutType: 'Linguiça Recheada',
    description: 'Cubos generosos de queijo coalho que derretem na brasa in natura.',
    price: 44.90,
    unit: 'kg',
    unitStep: 0.5,
    minUnit: 0.5,
    maxUnit: 10,
    imageUrl: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    stockQuantity: 35,
    featured: true
  },
  {
    id: 'ling-03',
    name: 'Pacote Espetinho Bovino Cru (Pacote c/ 5 un)',
    category: 'linguicas-espetinhos',
    meatType: 'bovino',
    cutType: 'Espetinho',
    description: 'Cubos de alcatra nobre selecionada em espeto de bambu cru in natura.',
    price: 29.90,
    unit: 'pacote',
    unitStep: 1,
    minUnit: 1,
    maxUnit: 10,
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    stockQuantity: 20,
    featured: false
  },

  // --- CARVÃO & ACENDEDORES ---
  {
    id: 'carv-01',
    name: 'Carvão Vegetal Eucalipto Premium 3kg',
    category: 'carvao-acendedores',
    description: 'Carvão 100% reflorestamento, pedaços grandes, sem faíscas e com brasa duradoura.',
    price: 19.90,
    unit: 'pacote',
    unitStep: 1,
    minUnit: 1,
    maxUnit: 10,
    imageUrl: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    stockQuantity: 80,
    featured: true
  },
  {
    id: 'carv-02',
    name: 'Carvão Briquete de Alta Densidade 5kg',
    category: 'carvao-acendedores',
    description: 'Briquetes prensados de longa duração. Mantém temperatura uniforme por mais de 3 horas.',
    price: 34.90,
    unit: 'pacote',
    unitStep: 1,
    minUnit: 1,
    maxUnit: 8,
    imageUrl: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    stockQuantity: 40,
    featured: false
  },
  {
    id: 'carv-03',
    name: 'Acendedor em Gel de Álcool 500ml',
    category: 'carvao-acendedores',
    description: 'Acendimento rápido, limpo, sem fumaça e sem alterar o cheiro do churrasco.',
    price: 12.90,
    unit: 'un',
    unitStep: 1,
    minUnit: 1,
    maxUnit: 6,
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    stockQuantity: 65,
    featured: true
  },
  {
    id: 'carv-04',
    name: 'Acendedor Bastão Sólido Ecológico (Caixa c/ 10)',
    category: 'carvao-acendedores',
    description: 'Bastões de cera vegetal e serragem. Queima constante de 10 minutos.',
    price: 9.90,
    unit: 'pacote',
    unitStep: 1,
    minUnit: 1,
    maxUnit: 8,
    imageUrl: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    stockQuantity: 50,
    featured: false
  },

  // --- SAIS & TEMPEROS ---
  {
    id: 'sal-01',
    name: 'Sal de Parrilla Especial com Chimichurri 500g',
    category: 'sais-temperos',
    description: 'Granulometria média ideal para grelha com ervas desidratadas argentinas.',
    price: 18.90,
    unit: 'un',
    unitStep: 1,
    minUnit: 1,
    maxUnit: 10,
    imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    stockQuantity: 70,
    featured: true
  },
  {
    id: 'sal-02',
    name: 'Sal Grosso Tradicional para Churrasco 1kg',
    category: 'sais-temperos',
    description: 'Cristais puros e uniformes de sal marinho iodado para churrasqueira.',
    price: 7.50,
    unit: 'un',
    unitStep: 1,
    minUnit: 1,
    maxUnit: 10,
    imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    stockQuantity: 90,
    featured: false
  },
  {
    id: 'sal-03',
    name: 'Sal de Parrilla com Alho Frito Crocante 500g',
    category: 'sais-temperos',
    description: 'Sal entrefino com flocos crocantes de alho frito. Realça o sabor de qualquer corte.',
    price: 19.90,
    unit: 'un',
    unitStep: 1,
    minUnit: 1,
    maxUnit: 8,
    imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    stockQuantity: 45,
    featured: false
  },
  {
    id: 'sal-04',
    name: 'Dry Rub Mané Especial para Carnes Bovinas 180g',
    category: 'sais-temperos',
    description: 'Mix artesanal de páprica defumada, açúcar mascavo, pimenta preta e especiarias.',
    price: 22.00,
    unit: 'un',
    unitStep: 1,
    minUnit: 1,
    maxUnit: 6,
    imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    stockQuantity: 30,
    featured: false
  },

  // --- BEBIDAS ---
  {
    id: 'beb-01',
    name: 'Cerveja Artesanal IPA Mané 600ml',
    category: 'bebidas',
    description: 'Cerveja artesanal com amargor equilibrado, notas cítricas e lúpulos nobres (6.2% ABV).',
    price: 18.90,
    unit: 'garrafa',
    unitStep: 1,
    minUnit: 1,
    maxUnit: 24,
    imageUrl: 'https://images.unsplash.com/photo-1608270191763-71829633e08f?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    stockQuantity: 120,
    featured: true,
    details: {
      temperature: 'Resfriado (Cru)',
      servingGuide: 'Venda proibida para menores de 18 anos'
    }
  },
  {
    id: 'beb-02',
    name: 'Cerveja Pilsen Puro Malte 350ml (Lata)',
    category: 'bebidas',
    description: 'Leve, refrescante e perfeita para acompanhar a fumaça da brasa (4.8% ABV).',
    price: 5.50,
    unit: 'lata',
    unitStep: 1,
    minUnit: 1,
    maxUnit: 48,
    imageUrl: 'https://images.unsplash.com/photo-1608270191763-71829633e08f?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    stockQuantity: 200,
    featured: true
  },
  {
    id: 'beb-03',
    name: 'Cerveja Weissbier de Trigo 500ml',
    category: 'bebidas',
    description: 'Cerveja de trigo encorpada com aromas frutados de banana e cravo.',
    price: 16.50,
    unit: 'garrafa',
    unitStep: 1,
    minUnit: 1,
    maxUnit: 18,
    imageUrl: 'https://images.unsplash.com/photo-1608270191763-71829633e08f?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    stockQuantity: 40,
    featured: false
  },
  {
    id: 'beb-04',
    name: 'Refrigerante Guaraná Antarctica Lata 350ml',
    category: 'bebidas',
    description: 'Refrigerante sabor guaraná clássico gelado.',
    price: 4.50,
    unit: 'lata',
    unitStep: 1,
    minUnit: 1,
    maxUnit: 24,
    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    stockQuantity: 100,
    featured: false
  },
  {
    id: 'beb-05',
    name: 'Água Mineral com Gás 500ml',
    category: 'bebidas',
    description: 'Água mineral gaseificada natural.',
    price: 3.50,
    unit: 'garrafa',
    unitStep: 1,
    minUnit: 1,
    maxUnit: 24,
    imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    stockQuantity: 80,
    featured: false
  },

  // --- ACESSÓRIOS & UTENSÍLIOS ---
  {
    id: 'ace-01',
    name: 'Tábua de Madeira Nobre Gravada Mané (45x30cm)',
    category: 'acessorios',
    description: 'Tábua maciça de Muiracatiara tratada com óleo mineral. Canaleta profunda para sucos da carne.',
    price: 129.00,
    unit: 'un',
    unitStep: 1,
    minUnit: 1,
    maxUnit: 4,
    imageUrl: 'https://images.unsplash.com/photo-1588165171080-c89acfa5a259?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    stockQuantity: 12,
    featured: true
  },
  {
    id: 'ace-02',
    name: 'Pegador de Carne Inox com Trava 40cm',
    category: 'acessorios',
    description: 'Aço inoxidável reforçado com trava de segurança para manusear carnes sem furar a fibra.',
    price: 39.90,
    unit: 'un',
    unitStep: 1,
    minUnit: 1,
    maxUnit: 5,
    imageUrl: 'https://images.unsplash.com/photo-1588165171080-c89acfa5a259?auto=format&fit=crop&w=600&q=80',
    inStock: true,
    stockQuantity: 25,
    featured: false
  }
];

export const MOCK_STORES: Store[] = [
  {
    id: 'store-centro',
    name: 'Boutique Mané - Loja Matriz Centro',
    tradeName: 'Delivery Mané Centro',
    address: 'Av. Central do Churrasco, 1250',
    neighborhood: 'Centro',
    city: 'Florianópolis',
    state: 'SC',
    zipCode: '88010-000',
    phone: '(48) 3322-8899',
    openingHours: 'Segunda a Sábado: 08:00 às 20:00 | Domingo: 08:00 às 15:00',
    isOpenNow: true,
    distanceKm: 2.4,
    availablePickupDays: ['Hoje', 'Amanhã', 'Sábado', 'Domingo'],
    timeSlots: [
      '09:00 - 10:30',
      '11:00 - 12:30',
      '13:00 - 14:30',
      '15:00 - 16:30',
      '17:00 - 18:30',
      '19:00 - 20:00'
    ],
    pickupInstructions: 'Apresente o número do pedido e documento com foto no balcão "Retirada Rápida Mané". Suas carnes são mantidas em câmara fria até a sua chegada.'
  },
  {
    id: 'store-sul',
    name: 'Boutique Mané - Unidade Sul da Ilha',
    tradeName: 'Delivery Mané Sul',
    address: 'Rod. Dr. Antônio Luiz Moura Gonzaga, 420',
    neighborhood: 'Rio Tavares / Campeche',
    city: 'Florianópolis',
    state: 'SC',
    zipCode: '88048-300',
    phone: '(48) 3338-7711',
    openingHours: 'Terça a Sábado: 08:30 às 20:00 | Domingo: 08:30 às 15:00',
    isOpenNow: true,
    distanceKm: 7.8,
    availablePickupDays: ['Hoje', 'Amanhã', 'Sábado', 'Domingo'],
    timeSlots: [
      '10:00 - 11:30',
      '12:00 - 13:30',
      '14:00 - 15:30',
      '16:00 - 17:30',
      '18:00 - 19:30'
    ],
    pickupInstructions: 'Estacionamento exclusivo em frente à loja. Dirija-se ao caixa de retiradas expressas.'
  }
];

export const MOCK_DELIVERY_OPTIONS: DeliveryOption[] = [
  {
    id: 'del-express',
    name: 'Entrega Expressa Churrasco',
    description: 'Carnes embaladas em caixas térmicas refrigeradas. Chega em até 45-60 min.',
    estimatedTime: '45 a 60 minutos',
    fee: 14.90,
    isExpress: true
  },
  {
    id: 'del-scheduled',
    name: 'Entrega Padrão Programada',
    description: 'Escolha a janela do dia que preferir para receber com frete econômico.',
    estimatedTime: 'Hoje até as 19h',
    fee: 9.90,
    isExpress: false
  }
];

export const MOCK_COUPONS: Coupon[] = [
  {
    code: 'MANE10',
    description: '10% de desconto no seu primeiro pedido de churrasco',
    discountType: 'percentage',
    value: 10,
    minOrderValue: 80,
    active: true
  },
  {
    code: 'FIMDESEMANA',
    description: 'R$ 15 OFF em compras acima de R$ 150',
    discountType: 'fixed',
    value: 15,
    minOrderValue: 150,
    active: true
  },
  {
    code: 'FRETEMANE',
    description: 'Frete grátis em compras acima de R$ 200',
    discountType: 'fixed',
    value: 14.90,
    minOrderValue: 200,
    active: true
  }
];

export const MOCK_DEFAULT_ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    name: 'Minha Casa',
    zipCode: '88015-100',
    street: 'Rua das Palmeiras',
    number: '340',
    complement: 'Apto 402 Bloco B',
    neighborhood: 'Agronômica',
    city: 'Florianópolis',
    state: 'SC',
    referencePoint: 'Próximo à pracinha',
    isDefault: true
  },
  {
    id: 'addr-2',
    name: 'Espaço Churrasco / Sítio',
    zipCode: '88062-000',
    street: 'Estrada Geral da Lagoa',
    number: '890',
    neighborhood: 'Lagoa da Conceição',
    city: 'Florianópolis',
    state: 'SC',
    referencePoint: 'Portão de madeira com placa do sítio',
    isDefault: false
  }
];
