import { getTourMinPrice } from './src/utils/pricing';

const mockTour = {
  title: "City Tour Rio Completo!",
  price: 318.58,
  pricing_model: 'dynamic',
  price_1_person: 318.58,
  price_2_people: 280,
  price_3_6_people: 250,
  price_7_19_people: 220,
};

console.log("Mock Tour Price:", getTourMinPrice(mockTour as any));
