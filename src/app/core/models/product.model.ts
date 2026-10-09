export type ProductUnit = 'kg' | 'un' | 'pacote' | 'garrafa' | 'lata' | 'peca';

export type ProductCategory = 
  | 'kits'
  | 'bovinos'
  | 'suinos'
  | 'aves'
  | 'linguicas-espetinhos'
  | 'bebidas'
  | 'carvao-acendedores'
  | 'sais-temperos'
  | 'acessorios';

export type MeatType = 'bovino' | 'suino' | 'frango' | 'misto' | 'outro';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  meatType?: MeatType;
  cutType?: string; // ex: Picanha, Alcatra, Costela, Ancho, etc.
  description: string;
  price: number; // Preço por kg ou unidade
  unit: ProductUnit;
  unitStep: number; // 0.5 for kg, 1 for un
  minUnit: number;
  maxUnit: number;
  imageUrl: string;
  inStock: boolean;
  stockQuantity: number;
  featured?: boolean;
  promotion?: {
    originalPrice: number;
    discountPercent: number;
    badgeText?: string;
  };
  details?: {
    origin?: string;
    maturation?: string;
    temperature?: 'Resfriado (Cru)' | 'Congelado' | 'Ambiente';
    servingGuide?: string; // ex: 350g por pessoa
    variableWeightAlert?: boolean; // Se o peso real varia na pesagem no açougue
  };
}

export interface CategoryInfo {
  id: ProductCategory;
  name: string;
  shortName: string;
  icon: string;
  description: string;
  bannerImage: string;
}
