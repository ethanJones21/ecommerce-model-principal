interface gal {
  id: string;
  name: string;
}

interface varietiesItf {
  id: string;
  title: string;
  units: any[];
}

export interface ProductItf {
  id: string;
  name: string;
  slug: string;
  stars: number;
  cover: string;
  price: number;
  description: string;
  content: string;
  stock: number;
  varieties: varietiesItf[];
  category: number;
  nsales?: number;
  galery?: gal[];
  state?: string;
  active?: boolean;
}
