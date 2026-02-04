export interface PlaymobilProduct {
  id: string;
  reference: string;
  ean: string;
  designation: string;
  ecotaxe: string;
  colisage: number;
  stock: number;
  prixNetHT: number;
  pvmcTTC: number;
  imageUrl: string;
}

export const getStockStatus = (stock: number): string => {
  if (stock === 0) return 'RUPTURE';
  if (stock <= 10) return 'STOCK FAIBLE';
  return 'EN STOCK';
};

export const getStockBadgeColor = (stock: number): string => {
  if (stock === 0) return 'bg-red-100 text-red-800 border-red-300';
  if (stock <= 10) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
  return 'bg-green-100 text-green-800 border-green-300';
};

// Parse price string like "5.79 €" to number
const parsePrice = (priceStr: string): number => {
  if (!priceStr) return 0;
  const cleaned = priceStr.replace('€', '').replace(',', '.').trim();
  return parseFloat(cleaned) || 0;
};

// Parse stock value (handle comma-separated numbers like "1,256")
const parseStock = (stockStr: string): number => {
  if (!stockStr) return 0;
  const cleaned = stockStr.replace(',', '').trim();
  return parseInt(cleaned) || 0;
};

// Clean URL from markdown escapes
const cleanUrl = (url: string): string => {
  if (!url) return '';
  return url
    .replace(/\\_/g, '_')
    .replace(/\\:/g, ':')
    .replace(/<|>/g, '')
    .trim();
};

export const playmobilCatalogueProducts: PlaymobilProduct[] = [
  { id: "A1401821", reference: "5159", ean: "4008789051592", designation: "Playmobil 5159 - Moteur Submersible", ecotaxe: "0.08 €", colisage: 6, stock: 0, prixNetHT: 5.79, pvmcTTC: 9.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A1401/A1401821_01.jpg" },
  { id: "A1501471", reference: "5573", ean: "4008789055736", designation: "Playmobil 5573 - Maman avec Jumeaux et Landau", ecotaxe: "", colisage: 10, stock: 6, prixNetHT: 6.56, pvmcTTC: 10.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A1501/A1501471_01.jpg" },
  { id: "A1702409", reference: "6924", ean: "4008789069245", designation: "Playmobil 6924 - Barrage de Police", ecotaxe: "", colisage: 8, stock: 4, prixNetHT: 11.93, pvmcTTC: 19.99, imageUrl: "https://i.postimg.cc/P5p7hzVp/A1702409-1-03.jpg" },
  { id: "A1702411", reference: "5653", ean: "4008789056535", designation: "Playmobil 5653 - Valisette Vétérinaire", ecotaxe: "", colisage: 4, stock: 0, prixNetHT: 8.46, pvmcTTC: 14.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A1702/A1702411_01.jpg" },
  { id: "A1702722", reference: "6919", ean: "4008789069191", designation: "Playmobil 6919 - Commissariat de Police avec Prison", ecotaxe: "", colisage: 2, stock: 0, prixNetHT: 68.43, pvmcTTC: 113.99, imageUrl: "https://i.postimg.cc/Zn65bk9D/20210306005809-920d89c0-th.jpg" },
  { id: "A1801388", reference: "9103", ean: "4008789091031", designation: "Playmobil 9103 - Valisette Pique-Nique Familiale", ecotaxe: "", colisage: 4, stock: 59, prixNetHT: 11.81, pvmcTTC: 19.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A1801/A1801388_01.jpg" },
  { id: "A1901088", reference: "9322", ean: "4008789093226", designation: "Playmobil 9322 - Valisette Go Kart Racer", ecotaxe: "", colisage: 4, stock: 0, prixNetHT: 8.46, pvmcTTC: 14.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A1901/A1901088_01.jpg" },
  { id: "A1901710", reference: "9462", ean: "4008789094629", designation: "Playmobil 9462 - Caserne De Pompiers et Hélicoptère", ecotaxe: "", colisage: 2, stock: 0, prixNetHT: 68.43, pvmcTTC: 113.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A1901/A1901710_01.jpg" },
  { id: "A1901711", reference: "9463", ean: "4008789094636", designation: "Playmobil 9463 - Camion De Pompiers Et Échelle", ecotaxe: "", colisage: 2, stock: 0, prixNetHT: 54.58, pvmcTTC: 90.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A1901/A1901711_01.jpg" },
  { id: "A1901712", reference: "9464", ean: "4008789094643", designation: "Playmobil 9464 - Fourgon Intervention Pompiers", ecotaxe: "", colisage: 2, stock: 0, prixNetHT: 51.20, pvmcTTC: 85.50, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A1901/A1901712_01.jpg" },
  { id: "A2001289", reference: "70066", ean: "4008789700667", designation: "Playmobil 70066 - Porsche 911 Carrera 4S Police", ecotaxe: "", colisage: 4, stock: 4, prixNetHT: 40.80, pvmcTTC: 67.99, imageUrl: "https://i.postimg.cc/76VsXBhc/A2001289-1-01.jpg" },
  { id: "A2001309", reference: "70208", ean: "4008789702081", designation: "Playmobil 70208 - Chambre avec Espace de Couture", ecotaxe: "", colisage: 4, stock: 2, prixNetHT: 17.04, pvmcTTC: 29.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2001/A2001309_01.jpg" },
  { id: "A2001310", reference: "70210", ean: "4008789702104", designation: "Playmobil 70210 - Chambre de Bébé", ecotaxe: "", colisage: 4, stock: 5, prixNetHT: 11.93, pvmcTTC: 19.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2001/A2001310_01.jpg" },
  { id: "A2002192", reference: "70205", ean: "4008789702050", designation: "Playmobil 70205 - Grande Maison Traditionnelle", ecotaxe: "", colisage: 1, stock: 0, prixNetHT: 123.72, pvmcTTC: 205.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2002/A2002192_01.jpg" },
  { id: "A2002193", reference: "70206", ean: "4008789702067", designation: "Playmobil 70206 - Cuisine Familiale", ecotaxe: "", colisage: 3, stock: 1, prixNetHT: 17.04, pvmcTTC: 28.50, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2002/A2002193_01.jpg" },
  { id: "A2002194", reference: "70207", ean: "4008789702074", designation: "Playmobil 70207 - Salon avec Cheminée", ecotaxe: "", colisage: 5, stock: 0, prixNetHT: 13.32, pvmcTTC: 21.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2002/A2002194_01.jpg" },
  { id: "A2002195", reference: "70209", ean: "4008789702098", designation: "Playmobil 70209 - Chambre Enfant avec Canapé-Lit", ecotaxe: "", colisage: 8, stock: 7, prixNetHT: 11.93, pvmcTTC: 19.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2002/A2002195_01.jpg" },
  { id: "A2002196", reference: "70211", ean: "4008789702111", designation: "Playmobil 70211 - Salle de Bain avec Baignoire", ecotaxe: "", colisage: 5, stock: 1, prixNetHT: 11.97, pvmcTTC: 19.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2002/A2002196_01.jpg" },
  { id: "A2002264", reference: "70088", ean: "4008789700889", designation: "Playmobil 70088 - Famille et Camping-Car", ecotaxe: "", colisage: 2, stock: 0, prixNetHT: 43.08, pvmcTTC: 71.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2002/A2002264_01.jpg" },
  { id: "A2100944", reference: "70177", ean: "4008789701770", designation: "Playmobil 70177 - Volkswagen Coccinelle", ecotaxe: "", colisage: 4, stock: 0, prixNetHT: 27.53, pvmcTTC: 45.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2100/A2100944_01.jpg" },
  { id: "A2100991", reference: "70572", ean: "4008789705723", designation: "Playmobil 70572 - Policier Avec Moto et Voleur", ecotaxe: "", colisage: 4, stock: 4, prixNetHT: 11.93, pvmcTTC: 19.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2100/A2100991_01.jpg" },
  { id: "A2100994", reference: "70669", ean: "4008789706690", designation: "Playmobil 70669 - Équipe De 3 Policiers", ecotaxe: "", colisage: 6, stock: 6, prixNetHT: 7.29, pvmcTTC: 11.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2100/A2100994_01.jpg" },
  { id: "A2101535", reference: "70314", ean: "4008789703149", designation: "Playmobil 70314 - Valisette Ecole", ecotaxe: "", colisage: 4, stock: 5, prixNetHT: 11.81, pvmcTTC: 19.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2101/A2101535_01.jpg" },
  { id: "A2101546", reference: "70281", ean: "4008789702814", designation: "Playmobil 70281 - Parc de Jeux et Enfants", ecotaxe: "", colisage: 4, stock: 14, prixNetHT: 26.97, pvmcTTC: 44.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2101/A2101546_01.jpg" },
  { id: "A2101588", reference: "70569", ean: "4008789705693", designation: "Playmobil 70569 - Hélicoptère de Police et Parachutiste", ecotaxe: "", colisage: 4, stock: 19, prixNetHT: 23.53, pvmcTTC: 38.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2101/A2101588_01.jpg" },
  { id: "A2101590", reference: "70577", ean: "4008789705778", designation: "Playmobil 70577 - Karts Policier et Bandits", ecotaxe: "", colisage: 4, stock: 4, prixNetHT: 23.37, pvmcTTC: 38.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2101/A2101546_01.jpg" },
  { id: "A2101598", reference: "70642", ean: "4008789706423", designation: "Playmobil 70642 - Zeppelin Da Vanci Novelmore", ecotaxe: "", colisage: 2, stock: 12, prixNetHT: 30.31, pvmcTTC: 50.50, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2101/A2101588_01.jpg" },
  { id: "A2101599", reference: "70671", ean: "4008789706713", designation: "Playmobil 70671 - 3 Chevaliers Novelmore", ecotaxe: "", colisage: 6, stock: 0, prixNetHT: 7.29, pvmcTTC: 11.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2101/A2101599_01.jpg" },
  { id: "A2101600", reference: "70672", ean: "4008789706720", designation: "Playmobil 70672 - 3 Combattants Novelmore", ecotaxe: "", colisage: 6, stock: 7, prixNetHT: 7.29, pvmcTTC: 11.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2101/A2101600_01.jpg" },
  { id: "A2101666", reference: "70176", ean: "4008789701763", designation: "Playmobil 70176 - Volkswagen T1 Combi", ecotaxe: "", colisage: 4, stock: 0, prixNetHT: 34.34, pvmcTTC: 56.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2101/A2101666_01.jpg" },
  { id: "A2101789", reference: "70634", ean: "4008789706348", designation: "COURSE HOVERBOARD RETFUTUR", ecotaxe: "", colisage: 4, stock: 4, prixNetHT: 26.71, pvmcTTC: 44.50, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2101/A2101600_01.jpg" },
  { id: "A2103144", reference: "70610", ean: "4008789706102", designation: "Playmobil 70610 - Piscine avec Jet D'eau", ecotaxe: "", colisage: 4, stock: 4, prixNetHT: 26.97, pvmcTTC: 44.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2101/A2101666_01.jpg" },
  { id: "A2103383", reference: "70576", ean: "4008789705761", designation: "Playmobil 70576 - Calendrier De l'Avent Retour Vers Le Futur 3", ecotaxe: "", colisage: 4, stock: 10, prixNetHT: 26.59, pvmcTTC: 44.50, imageUrl: "https://i.postimg.cc/qqDmHz8x/A2103383-1-01.jpg" },
  { id: "A2103386", reference: "70778", ean: "4008789707789", designation: "Playmobil 70778 - Calendrier de l'Avent Novelmore", ecotaxe: "", colisage: 6, stock: 5, prixNetHT: 35.84, pvmcTTC: 59.99, imageUrl: "https://i.postimg.cc/SQg1MtwY/A2103386-1-01.jpg" },
  { id: "A2103840", reference: "70750", ean: "4008789707505", designation: "Playmobil 70750 - Fourgon Agence Tous Risques", ecotaxe: "", colisage: 2, stock: 5, prixNetHT: 55.71, pvmcTTC: 92.99, imageUrl: "https://i.postimg.cc/kGgjHxt5/A2103840-1-02.jpg" },
  { id: "A2103841", reference: "70578", ean: "4008789705785", designation: "Playmobil 70578 - Aston Martin D85 James Bond", ecotaxe: "", colisage: 4, stock: 6, prixNetHT: 55.45, pvmcTTC: 92.50, imageUrl: "https://i.postimg.cc/PrN3zQj3/A2103841-1-01.jpg" },
  { id: "A2103852", reference: "70804", ean: "4008789708045", designation: "Playmobil 70804 - Maison des Fées", ecotaxe: "", colisage: 4, stock: 12, prixNetHT: 17.94, pvmcTTC: 29.99, imageUrl: "https://i.postimg.cc/mgHmKZh7/A2103852-1-02.jpg" },
  { id: "A2201876", reference: "70922", ean: "4008789709226", designation: "Playmobil 70922 - Mercedes Benz 300 SL", ecotaxe: "", colisage: 4, stock: 6, prixNetHT: 47.71, pvmcTTC: 79.50, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2103/A2103841_01.jpg" },
  { id: "A2201884", reference: "70924", ean: "4008789709240", designation: "Playmobil 70924 - K2000 Kitt", ecotaxe: "0.08 €", colisage: 4, stock: 3, prixNetHT: 54.32, pvmcTTC: 90.50, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2201/A2201884_01.jpg" },
  { id: "A2202079", reference: "70601", ean: "4008789706010", designation: "Playmobil 70601 - Cyclistes Maman et Enfant SPE+", ecotaxe: "", colisage: 5, stock: 1256, prixNetHT: 3.20, pvmcTTC: 5.50, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2202/A2202079_01.jpg" },
  { id: "A2202084", reference: "70676", ean: "4008789706768", designation: "Playmobil 70676 - Set Cadeau Educatrice de Chiens", ecotaxe: "", colisage: 8, stock: 26, prixNetHT: 5.91, pvmcTTC: 9.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2202/A2202084_01.jpg" },
  { id: "A2202092", reference: "70817", ean: "4008789708175", designation: "Playmobil 70817 - Starter Pack Policier et Démineur", ecotaxe: "", colisage: 4, stock: 20, prixNetHT: 13.36, pvmcTTC: 22.50, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2202/A2202092_01.jpg" },
  { id: "A2202093", reference: "70818", ean: "4008789708182", designation: "Playmobil 70818 - Starter Pack Cabinet de Pédiatre", ecotaxe: "", colisage: 4, stock: 5, prixNetHT: 13.48, pvmcTTC: 22.50, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2202/A2202084_01.jpg" },
  { id: "A2202102", reference: "70921", ean: "4008789709219", designation: "Playmobil 70921 - Mini Cooper", ecotaxe: "", colisage: 4, stock: 12, prixNetHT: 33.64, pvmcTTC: 55.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2202/A2202092_01.jpg" },
  { id: "A2202255", reference: "70909", ean: "4008789709097", designation: "Playmobil 70909 - Starter Pack Agent et Scorpion", ecotaxe: "", colisage: 4, stock: 31, prixNetHT: 9.89, pvmcTTC: 16.50, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2202/A2202255_01.jpg" },
  { id: "A2202257", reference: "70905", ean: "4008789709059", designation: "Playmobil 70905 - Starter Pack Fée et Raton-Laveur", ecotaxe: "", colisage: 4, stock: 97, prixNetHT: 9.89, pvmcTTC: 16.50, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2202/A2202257_01.jpg" },
  { id: "A2202258", reference: "70908", ean: "4008789709080", designation: "Playmobil 70908 - Starter Pack Policier et Cambrioleur", ecotaxe: "", colisage: 4, stock: 20, prixNetHT: 9.99, pvmcTTC: 16.50, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2202/A2202258_01.jpg" },
  { id: "A2202266", reference: "70934", ean: "4008789709349", designation: "Playmobil 70934 - Légionnaires Romains Astérix", ecotaxe: "", colisage: 8, stock: 9, prixNetHT: 11.26, pvmcTTC: 18.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2202/A2202266_01.jpg" },
  { id: "A2202274", reference: "70931", ean: "4008789709318", designation: "Playmobil 70931 - Banquet Village Astérix", ecotaxe: "", colisage: 1, stock: 4, prixNetHT: 116.26, pvmcTTC: 193.99, imageUrl: "https://i.postimg.cc/yNCLKqSt/A2202274-1-02.jpg" },
  { id: "A2202280", reference: "70917", ean: "4008789709172", designation: "Playmobil 70917 - Pompier Chat Duck on Call", ecotaxe: "", colisage: 4, stock: 19, prixNetHT: 11.21, pvmcTTC: 18.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2202/A2202280_01.jpg" },
  { id: "A2202281", reference: "70918", ean: "4008789709189", designation: "Playmobil 70918 - Policière Animaux Duck on Call", ecotaxe: "", colisage: 4, stock: 10, prixNetHT: 11.21, pvmcTTC: 18.99, imageUrl: "https://i.postimg.cc/8P3yyfk1/A2202281-1-02.jpg" },
  { id: "A2202282", reference: "70915", ean: "4008789709158", designation: "Playmobil 70915 - Véhicule De Police Duck On Call", ecotaxe: "", colisage: 3, stock: 9, prixNetHT: 25.38, pvmcTTC: 42.50, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2202/A2202280_01.jpg" },
  { id: "A2202305", reference: "70928", ean: "4008789709288", designation: "Playmobil 70928 - Robo Dino de Combat", ecotaxe: "", colisage: 3, stock: 9, prixNetHT: 28.97, pvmcTTC: 48.50, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2202/A2202281_01.jpg" },
  { id: "A2202317", reference: "70825", ean: "4008789708250", designation: "Playmobil 70825 - Maisonnette Bat Fairies", ecotaxe: "", colisage: 4, stock: 12, prixNetHT: 17.94, pvmcTTC: 29.99, imageUrl: "https://i.postimg.cc/tgd2Cr3T/A2202317-1-02.jpg" },
  { id: "A2202320", reference: "70936", ean: "4008789709363", designation: "Playmobil 70936 - Ambulance avec Secouriste et Blessés", ecotaxe: "", colisage: 2, stock: 4, prixNetHT: 50.94, pvmcTTC: 84.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2202/A2202320_01.jpg" },
  { id: "A2202331", reference: "70929", ean: "4008789709295", designation: "Playmobil 70929 - Véhicule de Tir pour Dino Mine", ecotaxe: "", colisage: 4, stock: 6, prixNetHT: 14.58, pvmcTTC: 24.50, imageUrl: "https://i.postimg.cc/c6qn3WZN/81-POm-WXExp-L-AC-UF1000-1000-QL80.jpg" },
  { id: "A2202341", reference: "70930", ean: "4008789709301", designation: "Playmobil 70930 - Mine Cruiser", ecotaxe: "", colisage: 8, stock: 9, prixNetHT: 11.26, pvmcTTC: 18.99, imageUrl: "https://i.postimg.cc/k4nwVxsy/A2202341-1-02.jpg" },
  { id: "A2202349", reference: "70879", ean: "4008789708793", designation: "Playmobil 70879 - Champion de Boxe SPE+", ecotaxe: "", colisage: 5, stock: 80, prixNetHT: 3.20, pvmcTTC: 5.50, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2202/A2202349_01.jpg" },
  { id: "A2202758", reference: "70985", ean: "4008789709851", designation: "Playmobil 70985 - Maison Transportable", ecotaxe: "", colisage: 2, stock: 2, prixNetHT: 33.35, pvmcTTC: 55.50, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2202/A2202758_01.jpg" },
  { id: "A2202760", reference: "71006", ean: "4008789710062", designation: "Playmobil 71006 - Calendrier de l'Avent Wiltopia", ecotaxe: "", colisage: 5, stock: 7, prixNetHT: 29.39, pvmcTTC: 48.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2202/A2202349_01.jpg" },
  { id: "A2202767", reference: "71012", ean: "4008789710123", designation: "Playmobil 71012 - Fourmiliers Wiltopia", ecotaxe: "", colisage: 8, stock: 0, prixNetHT: 13.29, pvmcTTC: 21.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2202/A2202767_01.jpg" },
  { id: "A2202770", reference: "71020", ean: "4008789710208", designation: "Playmobil 71020 - Ferrari SP90 Stradale", ecotaxe: "", colisage: 4, stock: 0, prixNetHT: 47.71, pvmcTTC: 79.50, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2202/A2202770_01.jpg" },
  { id: "A2202779", reference: "71031", ean: "4008789710314", designation: "Playmobil 71031 - Chariot Fée et Phénix", ecotaxe: "", colisage: 2, stock: 10, prixNetHT: 43.92, pvmcTTC: 72.99, imageUrl: "https://i.postimg.cc/hjpsVf3R/A2202779-1-02.jpg" },
  { id: "A2202783", reference: "71049", ean: "4008789710499", designation: "Playmobil 71049 - Eléphanteau Wiltopia", ecotaxe: "", colisage: 4, stock: 1, prixNetHT: 6.59, pvmcTTC: 10.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2202/A2202783_01.jpg" },
  { id: "A2202789", reference: "71055", ean: "4008789710550", designation: "Playmobil 71055 - Tigra Wiltopia", ecotaxe: "", colisage: 4, stock: 1, prixNetHT: 5.27, pvmcTTC: 8.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2202/A2202789_01.jpg" },
  { id: "A2202792", reference: "71058", ean: "4008789710581", designation: "Playmobil 71058 - Tortue Géante Wiltopia", ecotaxe: "", colisage: 4, stock: 0, prixNetHT: 5.27, pvmcTTC: 8.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2202/A2202792_01.jpg" },
  { id: "A2202793", reference: "71059", ean: "4008789710598", designation: "Playmobil 71059 - Aigle Wiltopia", ecotaxe: "", colisage: 4, stock: 0, prixNetHT: 3.96, pvmcTTC: 6.50, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2202/A2202789_01.jpg" },
  { id: "A2202794", reference: "71060", ean: "4008789710604", designation: "Playmobil 71060 - Panda Wiltopia", ecotaxe: "", colisage: 4, stock: 4, prixNetHT: 3.96, pvmcTTC: 6.50, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2202/A2202794_01.jpg" },
  { id: "A2202799", reference: "71065", ean: "4008789710659", designation: "Playmobil 71065 - Ecureuils Wiltopia", ecotaxe: "", colisage: 9, stock: 10, prixNetHT: 2.65, pvmcTTC: 4.50, imageUrl: "https://i.postimg.cc/WpdY07j9/1999964491g00.jpg" },
  { id: "A2202809", reference: "71074", ean: "4008789710741", designation: "Playmobil 71074 - Bébé Orang-Outan", ecotaxe: "", colisage: 9, stock: 30, prixNetHT: 2.65, pvmcTTC: 4.50, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2202/A2202809_01.jpg" },
  { id: "A2202818", reference: "71080", ean: "4008789710802", designation: "Playmobil 71080 - Wuwei Et Jun Dragons", ecotaxe: "", colisage: 3, stock: 6, prixNetHT: 44.18, pvmcTTC: 73.50, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2202/A2202818_01.jpg" },
  { id: "A2202819", reference: "71081", ean: "4008789710819", designation: "Playmobil 71081 - Thunder Et Tom Dragons", ecotaxe: "0.08 €", colisage: 3, stock: 0, prixNetHT: 37.25, pvmcTTC: 61.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2202/A2202819_01.jpg" },
  { id: "A2202822", reference: "71082", ean: "4008789710826", designation: "Playmobil 71082 - Plowhorn et D'Angelo Dragons", ecotaxe: "", colisage: 3, stock: 0, prixNetHT: 33.64, pvmcTTC: 55.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2202/A2202822_01.jpg" },
  { id: "A2202825", reference: "71083", ean: "4008789710833", designation: "Playmobil 71083 - Feathers et Alex Dragons", ecotaxe: "", colisage: 2, stock: 0, prixNetHT: 28.97, pvmcTTC: 48.50, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2202/A2202825_01.jpg" },
  { id: "A2202827", reference: "71084", ean: "4008789710840", designation: "Playmobil 71084 - Icaris Lab Dragons", ecotaxe: "", colisage: 2, stock: 0, prixNetHT: 25.90, pvmcTTC: 42.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2202/A2202827_01.jpg" },
  { id: "A2202828", reference: "71085", ean: "4008789710857", designation: "Playmobil 71085 - Icaris Quad Dragons", ecotaxe: "", colisage: 5, stock: 11, prixNetHT: 14.62, pvmcTTC: 24.50, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2202/A2202828_01.jpg" },
  { id: "A2202837", reference: "71092", ean: "4008789710925", designation: "Playmobil 71092 - Policier et Quad", ecotaxe: "", colisage: 5, stock: 379, prixNetHT: 7.27, pvmcTTC: 11.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2202/A2202837_01.jpg" },
  { id: "A2204114", reference: "71160", ean: "4008789711601", designation: "Playmobil 71160 - Astérix la Chasse aux Sangliers", ecotaxe: "", colisage: 4, stock: 78, prixNetHT: 13.29, pvmcTTC: 21.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2204/A2204114_01.jpg" },
  { id: "A2204334", reference: "71096", ean: "4008789710963", designation: "Playmobil 71096 - Naruto", ecotaxe: "", colisage: 8, stock: 294, prixNetHT: 5.24, pvmcTTC: 8.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2204/A2204334_01.jpg" },
  { id: "A2204335", reference: "71097", ean: "4008789710970", designation: "Playmobil 71097 - Sasuke Naruto", ecotaxe: "", colisage: 8, stock: 207, prixNetHT: 4.59, pvmcTTC: 7.50, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2204/A2204335_01.jpg" },
  { id: "A2204336", reference: "71098", ean: "4008789710987", designation: "Playmobil 71098 - Sakura Naruto", ecotaxe: "", colisage: 8, stock: 17, prixNetHT: 4.59, pvmcTTC: 7.50, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2204/A2204336_01.jpg" },
  { id: "A2204337", reference: "71099", ean: "4008789710994", designation: "Playmobil 71099 - Kakashi Naruto", ecotaxe: "", colisage: 8, stock: 68, prixNetHT: 4.59, pvmcTTC: 7.50, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2204/A2204337_01.jpg" },
  { id: "A2204338", reference: "71101", ean: "4008789711014", designation: "Playmobil 71101 - Tobi Naruto", ecotaxe: "", colisage: 8, stock: 37, prixNetHT: 4.59, pvmcTTC: 7.50, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2204/A2204338_01.jpg" },
  { id: "A2204340", reference: "71105", ean: "4008789711052", designation: "Playmobil 71105 - Yamato Naruto", ecotaxe: "", colisage: 8, stock: 25, prixNetHT: 4.59, pvmcTTC: 7.50, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2204/A2204340_01.jpg" },
  { id: "A2204341", reference: "71106", ean: "4008789711069", designation: "Playmobil 71106 - Hidan Naruto", ecotaxe: "", colisage: 8, stock: 56, prixNetHT: 4.59, pvmcTTC: 7.50, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2204/A2204341_01.jpg" },
  { id: "A2204342", reference: "71113", ean: "4008789711137", designation: "Playmobil 71113 - Iruka Naruto", ecotaxe: "", colisage: 8, stock: 26, prixNetHT: 4.59, pvmcTTC: 7.50, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2204/A2204342_01.jpg" },
  { id: "A2204343", reference: "71115", ean: "4008789711151", designation: "Playmobil 71115 - Shizune Naruto", ecotaxe: "", colisage: 8, stock: 67, prixNetHT: 4.59, pvmcTTC: 7.50, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2204/A2204343_01.jpg" },
  { id: "A2204344", reference: "71117", ean: "4008789711175", designation: "Playmobil 71117 - Kisame Naruto", ecotaxe: "", colisage: 8, stock: 61, prixNetHT: 4.59, pvmcTTC: 7.50, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2204/A2204344_01.jpg" },
  { id: "A2204345", reference: "71118", ean: "4008789711182", designation: "Playmobil 71118 - Rock Lee Naruto", ecotaxe: "", colisage: 8, stock: 34, prixNetHT: 4.59, pvmcTTC: 7.50, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2204/A2204345_01.jpg" },
  { id: "A2301754", reference: "70640", ean: "4008789706409", designation: "Playmobil 70640 - Citroën 2 CV", ecotaxe: "", colisage: 4, stock: 6, prixNetHT: 33.55, pvmcTTC: 55.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2301/A2301754_01.jpg" },
  { id: "A2301756", reference: "70980", ean: "4008789709806", designation: "Playmobil 70980 - Secouristes", ecotaxe: "", colisage: 5, stock: 9, prixNetHT: 20.02, pvmcTTC: 33.50, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2301/A2301756_01.jpg" },
  { id: "A2301758", reference: "71079", ean: "4008789710796", designation: "Playmobil 71079 - Deltaplane", ecotaxe: "", colisage: 4, stock: 6, prixNetHT: 13.41, pvmcTTC: 22.50, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2301/A2301754_01.jpg" },
  { id: "A2301760", reference: "71161", ean: "4008789711618", designation: "Playmobil 71161 - Pizzaiolo", ecotaxe: "", colisage: 5, stock: 6, prixNetHT: 3.20, pvmcTTC: 5.50, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2301/A2301760_01.jpg" },
  { id: "A2301761", reference: "71162", ean: "4008789711625", designation: "Playmobil 71162 - Policier et Chien de Recherche", ecotaxe: "", colisage: 5, stock: 467, prixNetHT: 3.20, pvmcTTC: 5.50, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2301/A2301761_01.jpg" },
  { id: "A2301762", reference: "71163", ean: "4008789711632", designation: "Playmobil 71163 - Bénévole Ramassage des Déchets SPE+", ecotaxe: "", colisage: 5, stock: 17, prixNetHT: 3.20, pvmcTTC: 5.50, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2301/A2301762_01.jpg" },
  { id: "A2301764", reference: "71165", ean: "4008789711656", designation: "Playmobil 71165 - Joueur de Fléchettes SPE+", ecotaxe: "", colisage: 5, stock: 110, prixNetHT: 3.20, pvmcTTC: 5.50, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2301/A2301764_01.jpg" },
  { id: "A2301768", reference: "71204", ean: "4008789712042", designation: "Playmobil 71204 - Véhicule de Secours", ecotaxe: "", colisage: 5, stock: 24, prixNetHT: 16.60, pvmcTTC: 27.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2301/A2301768_01.jpg" },
  { id: "A2301769", reference: "71205", ean: "4008789712059", designation: "Playmobil 71205 - Urgentiste avec Moto", ecotaxe: "", colisage: 5, stock: 23, prixNetHT: 13.25, pvmcTTC: 21.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2301/A2301769_01.jpg" },
  { id: "A2301774", reference: "71249", ean: "4008789712493", designation: "Playmobil 71249 - Tracteur avec Citerne", ecotaxe: "", colisage: 4, stock: 21, prixNetHT: 23.53, pvmcTTC: 38.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2301/A2301774_01.jpg" },
  { id: "A2301775", reference: "71251", ean: "4008789712516", designation: "Playmobil 71251 - Randonneurs et Alpagas", ecotaxe: "", colisage: 4, stock: 14, prixNetHT: 13.29, pvmcTTC: 21.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2301/A2301769_01.jpg" },
  { id: "A2301776", reference: "71252", ean: "4008789712523", designation: "Playmobil 71252 - Enfant Enclos Lapins Country", ecotaxe: "", colisage: 8, stock: 0, prixNetHT: 9.95, pvmcTTC: 16.50, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2301/A2301776_01.jpg" },
  { id: "A2301777", reference: "71253", ean: "4008789712530", designation: "Playmobil 71253 - Apiculteur et Enfant", ecotaxe: "", colisage: 9, stock: 88, prixNetHT: 5.27, pvmcTTC: 8.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2301/A2301777_01.jpg" },
  { id: "A2301828", reference: "71114", ean: "4008789711144", designation: "Playmobil 71114 - Tsunade Naruto", ecotaxe: "", colisage: 8, stock: 84, prixNetHT: 4.59, pvmcTTC: 7.50, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2301/A2301828_01.jpg" },
  { id: "A2301912", reference: "71078", ean: "4008789710789", designation: "Playmobil 71078 - Voiture Vintage Couple", ecotaxe: "", colisage: 4, stock: 42, prixNetHT: 13.48, pvmcTTC: 22.50, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2301/A2301912_01.jpg" },
  { id: "A2302030", reference: "71255", ean: "4008789712554", designation: "Playmobil 71255 - Starter Pack Agent et Voleur", ecotaxe: "", colisage: 8, stock: 0, prixNetHT: 9.95, pvmcTTC: 16.50, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2302/A2302030_01.jpg" },
  { id: "A2302032", reference: "71257", ean: "4008789712578", designation: "Playmobil 71257 - Starter Pack Secouriste et Gyrophare", ecotaxe: "", colisage: 8, stock: 24, prixNetHT: 9.95, pvmcTTC: 16.50, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2302/A2302032_01.jpg" },
  { id: "A2302036", reference: "71100", ean: "4008789711007", designation: "Playmobil 71100 - Rikudo Mode Ermite Naruto", ecotaxe: "", colisage: 8, stock: 41, prixNetHT: 5.24, pvmcTTC: 8.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2302/A2302036_01.jpg" },
  { id: "A2302037", reference: "71103", ean: "4008789711038", designation: "Playmobil 71103 - Gaara Naruto", ecotaxe: "", colisage: 8, stock: 10, prixNetHT: 5.24, pvmcTTC: 8.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2302/A2302032_01.jpg" },
  { id: "A2302038", reference: "71104", ean: "4008789711045", designation: "Playmobil 71104 - Madara Naruto", ecotaxe: "", colisage: 8, stock: 33, prixNetHT: 5.24, pvmcTTC: 8.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2302/A2302038_01.jpg" },
  { id: "A2302039", reference: "71107", ean: "4008789711076", designation: "Playmobil 71107 - Shikamaru Naruto", ecotaxe: "", colisage: 8, stock: 13, prixNetHT: 5.24, pvmcTTC: 8.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2302/A2302037_01.jpg" },
  { id: "A2302040", reference: "71108", ean: "4008789711083", designation: "Playmobil 71108 - Pain Naruto", ecotaxe: "", colisage: 8, stock: 12, prixNetHT: 5.24, pvmcTTC: 8.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2302/A2302038_01.jpg" },
  { id: "A2302041", reference: "71109", ean: "4008789711090", designation: "Playmobil 71109 - Minato Naruto", ecotaxe: "", colisage: 8, stock: 15, prixNetHT: 5.24, pvmcTTC: 8.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2302/A2302039_01.jpg" },
  { id: "A2302042", reference: "71110", ean: "4008789711106", designation: "Playmobil 71110 - Hinata Naruto", ecotaxe: "", colisage: 8, stock: 9, prixNetHT: 4.59, pvmcTTC: 7.50, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2302/A2302040_01.jpg" },
  { id: "A2302043", reference: "71111", ean: "4008789711113", designation: "Playmobil 71111 - Gai Maito Naruto", ecotaxe: "", colisage: 8, stock: 4, prixNetHT: 4.59, pvmcTTC: 7.50, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2302/A2302041_01.jpg" },
  { id: "A2302046", reference: "71119", ean: "4008789711199", designation: "Playmobil 71119 - Asuma Naruto", ecotaxe: "", colisage: 8, stock: 4, prixNetHT: 4.59, pvmcTTC: 7.50, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2302/A2302042_01.jpg" },
  { id: "A2302053", reference: "71198", ean: "4008789711984", designation: "Playmobil 71198 - Violoniste", ecotaxe: "", colisage: 6, stock: 98, prixNetHT: 2.31, pvmcTTC: 3.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2302/A2302053_01.jpg" },
  { id: "A2302055", reference: "71200", ean: "4008789712004", designation: "Playmobil 71200 - Combattante avec Lance", ecotaxe: "", colisage: 6, stock: 51, prixNetHT: 2.31, pvmcTTC: 3.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2302/A2302055_01.jpg" },
  { id: "A2302057", reference: "71248", ean: "4008789712486", designation: "Playmobil 71248 - Petite Ferme", ecotaxe: "", colisage: 2, stock: 0, prixNetHT: 41.07, pvmcTTC: 68.50, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2302/A2302057_01.jpg" },
  { id: "A2302058", reference: "71250", ean: "4008789712509", designation: "Playmobil 71250 - Boutique de la Ferme", ecotaxe: "", colisage: 4, stock: 3, prixNetHT: 19.97, pvmcTTC: 33.50, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2302/A2302058_01.jpg" },
  { id: "A2401272", reference: "71351", ean: "4008789713513", designation: "Playmobil 71351 - Ranch De La Cascade", ecotaxe: "", colisage: 2, stock: 3, prixNetHT: 94.92, pvmcTTC: 157.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2401/A2401272_01.jpg" },
  { id: "A2401273", reference: "71352", ean: "4008789713520", designation: "Playmobil 71352 - Vétérinaire Et Centre de Thérapie", ecotaxe: "", colisage: 2, stock: 1, prixNetHT: 47.45, pvmcTTC: 78.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2401/A2401273_01.jpg" },
  { id: "A2401274", reference: "71353", ean: "4008789713537", designation: "Playmobil 71353 - A.Whisper Avec Box Pour Chevaux", ecotaxe: "", colisage: 4, stock: 3, prixNetHT: 26.74, pvmcTTC: 44.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2401/A2401274_01.jpg" },
  { id: "A2401275", reference: "71354", ean: "4008789713544", designation: "Playmobil 71354 - I.Lioness Aire De Lavage", ecotaxe: "", colisage: 5, stock: 2, prixNetHT: 23.40, pvmcTTC: 38.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2401/A2401275_01.jpg" },
  { id: "A2401276", reference: "71355", ean: "4008789713551", designation: "Playmobil 71355 - Z.Blaze et Parcours D'Obstacles", ecotaxe: "", colisage: 8, stock: 15, prixNetHT: 16.50, pvmcTTC: 27.50, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2401/A2401276_01.jpg" },
  { id: "A2401277", reference: "71356", ean: "4008789713568", designation: "Playmobil 71356 - 3 Chevaux M.Quarter Horse", ecotaxe: "", colisage: 4, stock: 37, prixNetHT: 13.20, pvmcTTC: 21.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2401/A2401277_01.jpg" },
  { id: "A2401278", reference: "71357", ean: "4008789713575", designation: "Playmobil 71357 - Maréchal Ferrant", ecotaxe: "", colisage: 8, stock: 737, prixNetHT: 9.89, pvmcTTC: 16.50, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2401/A2401278_01.jpg" },
  { id: "A2401279", reference: "71358", ean: "4008789713582", designation: "Playmobil 71358 - Ellie Sawdust", ecotaxe: "", colisage: 6, stock: 144, prixNetHT: 6.56, pvmcTTC: 10.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2401/A2401279_01.jpg" },
  { id: "A2401280", reference: "71359", ean: "4008789713599", designation: "Playmobil 71359 - Tourelle Enchantée", ecotaxe: "", colisage: 2, stock: 2, prixNetHT: 61.02, pvmcTTC: 101.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2401/A2401280_01.jpg" },
  { id: "A2401281", reference: "71360", ean: "4008789713605", designation: "Playmobil 71360 - Nurserie Dans Les Nuages", ecotaxe: "", colisage: 2, stock: 3, prixNetHT: 30.09, pvmcTTC: 49.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2401/A2401281_01.jpg" },
  { id: "A2401398", reference: "71436", ean: "4008789714367", designation: "Playmobil 71436 - Porsche 911 Carrera RS 27", ecotaxe: "", colisage: 4, stock: 4, prixNetHT: 40.55, pvmcTTC: 67.50, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2401/A2401398_01.jpg" },
  { id: "A2404099", reference: "71591", ean: "4008789715913", designation: "Playmobil 71591 - Voiture De Police Collector", ecotaxe: "", colisage: 5, stock: 5, prixNetHT: 16.00, pvmcTTC: 26.99, imageUrl: "https://i.postimg.cc/bJNHYqYC/A2404099-1-02.jpg" },
  { id: "A2404104", reference: "71607", ean: "4008789716071", designation: "Playmobil 71607 - Maison D'Architecte", ecotaxe: "", colisage: 2, stock: 2, prixNetHT: 95.80, pvmcTTC: 159.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2404/A2404104_01.jpg" },
  { id: "A2404127", reference: "71641", ean: "4008789716415", designation: "Playmobil 71641 - Championne d'Équitation", ecotaxe: "", colisage: 6, stock: 375, prixNetHT: 6.61, pvmcTTC: 10.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2404/A2404127_01.jpg" },
  { id: "A1601886", reference: "6043", ean: "4008789060433", designation: "Playmobil 6043 - Fourgon De Police Avec Sirène", ecotaxe: "", colisage: 3, stock: 75, prixNetHT: 26.53, pvmcTTC: 43.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2401/A2401430_01.jpg" },
  { id: "A1702866", reference: "6865", ean: "4008789068651", designation: "Playmobil 6865 - Ecole Avec Salle De Classe", ecotaxe: "", colisage: 2, stock: 74, prixNetHT: 27.68, pvmcTTC: 45.99, imageUrl: "http://imagespdm.wdkpartner.com/_VISUELS/A2401/A2401431_01.jpg" },
];
