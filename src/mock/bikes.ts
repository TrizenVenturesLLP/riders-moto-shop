export interface BikeModel {
  brand: string;
  brandSlug: string;
  model: string;
  modelSlug: string;
  image?: string;
}

export const bikes: BikeModel[] = [
  {
    brand: "Royal Enfield",
    brandSlug: "royal-enfield",
    model: "Super Meteor 650",
    modelSlug: "super-meteor-650",
    image: "/mock/bikes/super-meteor-650.jpg",
  },
  {
    brand: "Royal Enfield",
    brandSlug: "royal-enfield",
    model: "Interceptor 650",
    modelSlug: "interceptor-650",
    image: "/mock/bikes/interceptor-650.jpg",
  },
  {
    brand: "KTM",
    brandSlug: "ktm",
    model: "Duke 390",
    modelSlug: "duke-390",
    image: "/mock/bikes/duke-390.jpg",
  },
];
