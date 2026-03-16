export interface SearchFilters {
  // Amazon filters
  exclude_incomplete?: boolean;
  exclude_multipacks?: boolean;
  exclude_hazmat?: boolean;
  amazon_price_min?: number;
  amazon_price_max?: number;
  unit_profit_min?: number;
  unit_profit_max?: number;
  roi_min?: number;
  roi_max?: number;
  monthly_profit_min?: number;
  monthly_profit_max?: number;
  monthly_sales_min?: number;
  monthly_sales_max?: number;
  asin_list?: string;
  // Amazon advanced
  bsr_max?: number;
  category?: string;
  marketplace?: string;
  keywords?: string;
  // Supplier filters
  country?: string;
  supplier_type?: string;
  suppliers?: string[];
  supplier_price_min?: number;
  supplier_price_max?: number;
  updated_recently?: string;
  ean_list?: string;
}

export interface ProductResult {
  id: string;
  title: string;
  asin?: string;
  ean?: string;
  image_url?: string;
  price: number;
  sale_price?: number;
  roi: number;
  margin: number;
  profit: number;
  monthly_sales?: number;
  monthly_profit?: number;
  bsr?: number;
  category?: string;
  brand?: string;
  marketplace?: string;
  competition_level?: string;
  supplier?: string;
  supplier_price?: number;
  source: string;
  found_at: string;
}

export interface ProductSearch {
  id: string;
  user_id: string;
  name: string;
  filters: SearchFilters;
  filters_hash: string;
  status: 'pending' | 'processing' | 'completed' | 'error' | 'cached';
  provider: string;
  results_count: number;
  cache_hit: boolean;
  processing_duration_ms?: number;
  error_message?: string;
  results_summary?: any;
  created_at: string;
  updated_at: string;
}

export interface SearchPreset {
  id: string;
  user_id: string;
  name: string;
  filters: SearchFilters;
  created_at: string;
  updated_at: string;
}

export interface SearchResponse {
  search_id: string;
  status: string;
  cache_hit: boolean;
  results: ProductResult[];
  results_count: number;
  processing_duration_ms: number;
  error?: string;
}

export const DEFAULT_FILTERS: SearchFilters = {};

export const MARKETPLACE_OPTIONS = [
  { value: 'amazon.fr', label: 'France' },
  { value: 'amazon.de', label: 'Allemagne' },
  { value: 'amazon.es', label: 'Espagne' },
  { value: 'amazon.it', label: 'Italie' },
  { value: 'amazon.co.uk', label: 'UK' },
  { value: 'amazon.com', label: 'US' },
];

export const COUNTRY_OPTIONS = [
  { value: 'all', label: 'Tous' },
  { value: 'BE', label: 'Belgique' },
  { value: 'CZ', label: 'République Tchèque' },
  { value: 'DE', label: 'Allemagne' },
  { value: 'ES', label: 'Espagne' },
  { value: 'FR', label: 'France' },
  { value: 'HU', label: 'Hongrie' },
  { value: 'IT', label: 'Italie' },
  { value: 'LT', label: 'Lituanie' },
  { value: 'NL', label: 'Pays-Bas' },
  { value: 'PL', label: 'Pologne' },
  { value: 'PT', label: 'Portugal' },
  { value: 'RO', label: 'Roumanie' },
  { value: 'SE', label: 'Suède' },
  { value: 'SK', label: 'Slovaquie' },
  { value: 'UK', label: 'Royaume-Uni' },
];

export const SUPPLIER_TYPE_OPTIONS = [
  { value: 'all', label: 'Tous' },
  { value: 'wholesale', label: 'Grossiste' },
  { value: 'distributor', label: 'Distributeur' },
  { value: 'manufacturer', label: 'Fabricant' },
  { value: 'liquidation', label: 'Liquidation' },
  { value: 'retail', label: 'Retail' },
];

export const SUPPLIER_OPTIONS = [
  '0815.eu', '1001hobbies.es', '1001hobbies.fr', '3ppharma.fr', '4gsm.com-de',
  '4gsm.com-es', '4gsm.com-fr', '4gsm.com-it', 'abacus.coop', 'abacus.coop-b2b',
  'acer.com-de', 'acer.com-es', 'acer.com-fr', 'acer.com-it', 'acer.com-uk',
  'achat-electrique.com', 'activecarestore.co.uk', 'aeg.co.uk', 'aeg.com.es',
  'aeg.de', 'aeg.fr', 'aeg.it', 'aessepiforniture.it', 'afede.com',
  'agustimestre.com', 'alfastore.de', 'alibebe.es', 'alijuguetes.es',
  'allesfuerzuhause.de', 'almacenespalacios.com', 'almacenesrubio.net',
  'alrossio.pt', 'alternate-b2b.de', 'alternate-b2b.es', 'alternate.de',
  'alternate.es', 'alternate.fr', 'alternate.it', 'alternate.nl', 'alza.cz',
  'alza.de', 'andrees-hsw.de', 'animallparadise.com', 'apohealth.de', 'aponeo.de',
  'appletonsweets.co.uk', 'aqua-store.fr', 'aquario.pt', 'argos.co.uk', 'arix.es',
  'ars24.com', 'artnaturals.com', 'asmc.es', 'atida.fr', 'auchan.fr', 'auchan.pt',
  'autourdebebe.com', 'babymarkt.com-de', 'babyone.de', 'babyprendas.com',
  'babys-mart.co.uk', 'banemo.de', 'barrabes.com', 'bauhaus.se', 'baumarkteu.de',
  'baur.de', 'bcd-jeux.fr', 'beaniegames.co.uk', 'beautyjulia.com', 'beautywelt.de',
  'bebe9.com', 'bell-italia.com', 'bellaffair.de', 'bergfreunde.de', 'berrybase.de',
  'bestprice.pt', 'biggreensmile.com', 'bijdegroothandel.com', 'bike-discount.de',
  'bitiba.be', 'bitiba.co.uk', 'bixoto.com', 'blaco.it', 'bloomling.uk', 'boc24.de',
  'bokus.com', 'bol.com', 'boomstore.de', 'boticinal.com', 'boticom.es', 'box.co.uk',
  'braun.com-es', 'braun.com-fr', 'braun.com-it', 'bresser.de', 'brewers.co.uk',
  'bricksdirect.co.uk', 'bricksdirect.de', 'bricksdirect.es', 'bricksdirect.fr',
  'bricksdirect.it', 'brickshop.eu', 'brickswelt.eu', 'brico-travo.com',
  'bricodepot.es', 'bricodepot.fr', 'bricodepot.pt', 'bricorama.fr',
  'britdeals.co.uk', 'buecher.de', 'bulevip.com', 'buysbest.co.uk', 'bygghemma.se',
  'bytecno.it', 'calumetphoto.de', 'camforpro.com', 'candyhero.com', 'canon.co.uk',
  'canon.de', 'canon.es', 'canon.fr', 'canon.it', 'careb2b.com', 'carethy.co.uk',
  'carethy.de', 'carethy.es', 'carethy.fr', 'carethy.it', 'carrefour.es',
  'caseking.de', 'castorama.fr', 'castroelectronica.pt', 'cclonline.com',
  'centralcosmetics.co.uk', 'centrojuguete.com', 'chegiochi.it',
  'chemistconnect.com', 'cherrycosmetics.co.uk', 'chicco.it', 'chipman.pt',
  'ck-modelcars.de', 'cld.eu', 'cleanstore.co.uk', 'clickbebe.es', 'clickclack.es',
  'cocktail-distribution.com', 'cocooncenter.co.uk', 'cocooncenter.com',
  'cocooncenter.de', 'cocooncenter.es', 'comet.it', 'comicstores.es',
  'comptoir-droguerie.fr', 'conrad.de', 'conrad.fr', 'continente.pt',
  'coolaccesorios.com', 'coolmod.com', 'coolshop.co.uk', 'coolshop.de',
  'cosibella-wholesale.com', 'cosmeticapartijen.nl', 'cosmeticexpress.com',
  'cosmeticsmegastore.com-de', 'cosmeticsmegastore.com-es',
  'cosmeticsmegastore.com-fr', 'cosmeticsmegastore.com-uk', 'cosmetis.com-de',
  'cosmetis.com-es', 'cosmetis.com-it', 'cosmetis.com-uk', 'costway.it',
  'cotebrico.fr', 'cpadistributor.com', 'craftyarts.co.uk',
  'cramptonandmoore.co.uk', 'cstech.store', 'currys.co.uk', 'currys.co.uk-b2b',
  'cutpricewholesaler.com', 'darty.pt', 'dcshoes.de', 'dcshoes.es', 'dcshoes.fr',
  'decathlon.co.uk', 'decathlon.de', 'decathlon.es', 'decathlon.fr', 'decathlon.it',
  'degriffstock.com', 'denk-outdoor.de', 'depau.es', 'deporte-outlet.es',
  'digitalo.de', 'digitalplace.pt', 'digitfoto.de', 'digitfoto.pt', 'dinotoys.nl',
  'dinydon.com', 'direct-powertools.co.uk', 'direct.asda.com',
  'directcosmetics.com', 'direkt.jacob.de', 'dis-ar.com', 'dispersajuguetes.com',
  'distritoys.es', 'diy.com', 'dkwholesale.com', 'dm.de', 'doctormartillo.es',
  'doema.es', 'donaghybros.co.uk', 'drako.it', 'dreamland.be', 'dreamsbaby.pt',
  'drim.es', 'drmax.it', 'drogisterijplus.nl', 'drogueriemoderne.com', 'dynos.es',
  'e-stayon.com', 'e-trena.de', 'e.leclerc', 'eany.io', 'eastpak.com-de',
  'eastpak.com-es', 'eastpak.com-fr', 'eastpak.com-it', 'eastpak.com-uk',
  'easypara.co.uk', 'easypara.com', 'easypara.es', 'eds-group.it', 'efarma.com',
  'elbbricks.com', 'elcorteingles.es', 'electricalworld.com', 'electricbricks.com',
  'electronic4you.de', 'electronis.de', 'electronorma.com', 'electropescador.pt',
  'electropolis.es', 'electrowifi.es', 'elektro4000.de', 'elettroaffare.it',
  'elettrocasa.it', 'elgiganten.se', 'elkar.eus', 'elpaisdejauja.es', 'elv.com',
  'enzinger.com', 'erregame.com', 'escentual.com', 'espritjeu.com', 'esseeffe.com',
  'esupply.co.uk', 'euronics.de', 'euronics.it', 'euronics.pt',
  'expert-technomarkt.de', 'expert.de', 'expert.es', 'expert.it', 'experteletro.pt',
  'fabiostore.it', 'fahrrad-xxl.de', 'fahrrad.de', 'farma2go.com',
  'farmacialoreto.es', 'farmacialoreto.it', 'farmacianorte.es',
  'farmaclubprime.com', 'farmaconvenienza.it', 'farmasave.it', 'fenwick.co.uk',
  'fishingtackleandbait.co.uk', 'fitadium.com', 'fixami.fr', 'flaconi.de',
  'fleurtations.uk.com', 'fnac.com', 'fnac.es', 'foto-erhardt.de', 'fotokoch.de',
  'frikimaz.es', 'funktionelles.de', 'gabona.com', 'gadcet.com', 'galaxus.de',
  'galaxus.fr', 'galeria.de', 'galileofarma.com', 'gamingoase.de', 'gatito.pl',
  'geekdo.pt', 'gibsonsgames.co.uk', 'giochidiclem.it', 'giochigiachi.it',
  'giocolandiagiocheria.it', 'giodicart.it', 'globaldata.pt', 'gomibo.de',
  'gomibo.es', 'gomibo.fr', 'gomibo.it', 'gotools.de', 'granfarma.it', 'greeno.ro',
  'grosbill.com', 'grupojupesa.es', 'haarshoppro.nl', 'hagebau.de', 'hairstore.fr',
  'hamleys.com', 'hammerarzt.de', 'hausunddach.de', 'hbv24.de', 'hispamicro.com',
  'hl-grosshandel.com', 'hmv.com', 'hogiesonline.co.uk', 'holacaracola.es',
  'homewareessentials.co.uk', 'hood.de', 'hoover-home.com-de', 'hoover-home.com-es',
  'hoover-home.com-fr', 'hoover-home.com-it', 'hoover-home.com-uk', 'hornbach.de',
  'hornbach.se', 'houseoffraser.co.uk', 'howleys.co.uk', 'hp.com-de', 'hp.com-fr',
  'hp.com-uk', 'huawei.com-de', 'huawei.com-es', 'huawei.com-fr', 'huawei.com-it',
  'huawei.com-uk', 'hugendubel.de', 'ibood.com-de', 'ibood.com-fr', 'ibood.com-nl',
  'ibs.it', 'idealo.de', 'idealo.es', 'idealo.fr', 'idealo.it', 'idirecto.es',
  'idufte.de', 'iglm.store', 'iherb.com-de', 'iherb.com-es', 'iherb.com-fr',
  'iherb.com-uk', 'ilcapricciostore.com', 'infortisa.com', 'inktweb.nl',
  'innet24.de', 'inovtel.pt', 'inpexopcion.com', 'inspiratrading.co.uk',
  'ioburo.fr', 'its.co.uk', 'jamarket.pt', 'joguiba.com', 'johnlewis.com',
  'jono-toys.nl', 'joueclub.fr', 'juegostetrakis.com', 'jugamos.es',
  'jugueterialapaz.com', 'jugueterialaperica.com', 'juguetesabracadabra.es',
  'juguetescarrion.com', 'juguetesdondino.com', 'juguetesmagda.com',
  'juguetesnidotoys.es', 'juguetespanre.com', 'juguetespedrosa.es',
  'juguetestiosam.com', 'juguetienda.es', 'juguetilandia.com', 'juguetilandia.de',
  'juguetilandia.fr', 'juguetilandia.it', 'juguettos.com', 'justmylook.com',
  'kalatex.shop', 'kalista-parfums.com', 'karactermania.com', 'kaufland.de',
  'keipper.shop', 'keroppa.com', 'kerrisontoys.co.uk', 'kidylusion.com',
  'kirchner24.de', 'kitstore.cz-es', 'kitstore.de', 'kitstore.fr', 'kitstore.it',
  'klemmshop.de', 'koempf24.de', 'kontrolsat.com', 'krybuy.com',
  'kuantokusta.pt', 'kyeroo.com', 'ladetergenza.com', 'lafeltrinelli.it',
  'lagranderecre.fr', 'laniustoys.com', 'lasante.net', 'latiendadirecta.es',
  'layer-grosshandel.de', 'lefeld.de', 'lego.com-de', 'lego.com-es', 'lego.com-fr',
  'lego.com-it', 'lego.com-uk', 'legusplay.com', 'lekia.se', 'leprechaun.es',
  'libreriatagore.es', 'lidl.de', 'lidl.es', 'lidl.fr', 'lifeinformatica.com',
  'ligatu.pt', 'littlewoods.com', 'lobbesjouet.fr', 'lojashampoo.pt',
  'ltt-versand.de', 'lucky-bricks.de', 'ludum.fr', 'lyko.com-de', 'madridhifi.com',
  'magicdisney.es', 'magicmadhouse.co.uk', 'magictoysgiocheria.it', 'makro.es',
  'makro.pt', 'manchatoys.com', 'mandmdirect.com', 'manomano.de', 'manomano.es',
  'manomano.fr', 'manomano.it', 'maqio.com', 'maquillalia.com',
  'markenbaumarkt24.de', 'maurysonline.it', 'maxizoo.be', 'mayalbolsos.es',
  'mcbuero.de', 'mediamarkt.be', 'mediamarkt.de', 'mediamarkt.es', 'mediamarkt.hu',
  'mediaworld.it', 'medimax.de', 'medion.com-de', 'mefarma.it', 'megasur.es',
  'melitosrl.com', 'menkind.co.uk', 'mercadoactual.es', 'miamland.com',
  'micromania.fr', 'mielectro.es', 'moby-dick.it', 'mondobrick.it', 'monoprix.fr',
  'movertix.com', 'mueller.de', 'multishop.pt', 'mxwholesale.co.uk',
  'my-origines.com-de', 'my-origines.com-es', 'my-origines.com-fr',
  'my-origines.com-it', 'my-origines.com-uk', 'myhappypara.com', 'nanochip.pt',
  'nda-toys.com', 'netto-online.de', 'nike.com-de', 'nike.com-es', 'nike.com-fr',
  'nike.com-it', 'nike.com-uk', 'nocibe.fr', 'notino.co.uk', 'notino.cz',
  'notino.de', 'notino.es', 'notino.fr', 'notino.hu', 'notino.it', 'notino.nl',
  'notino.pt', 'novaengel.com', 'novoatalho.pt', 'nuby.com-uk',
  'nx3arquitectura.com', 'obi.de', 'ociostock.com', 'office-partner.de',
  'officestationery.co.uk', 'ohfeliz.de', 'okazje.info.pl', 'okfarma.es',
  'ollo.it', 'on4tech.pt', 'onbit.pt', 'ondisc.pt', 'oportunidade24.pt',
  'orly.es', 'orologistock.com', 'osiander.de', 'osma-werm.com',
  'osma-werm.com-fr', 'otto.de', 'oupsmodel.com', 'overly.it', 'papelinho.pt',
  'papertiger.co.uk', 'parapharmacie-express.com', 'parapharmacielafayette.com',
  'parapharmatop.fr', 'parasanteonline.fr', 'paratamtam.com', 'parfuem365.de',
  'parfum.de', 'parfumdreams.co.uk', 'parfumdreams.de', 'parfumdreams.es',
  'parfumdreams.fr', 'parfumdreams.it', 'parfumgroup.de', 'parfumsclub.de',
  'partytuyyo.com', 'pascalcoste-shopping.com', 'passion132.com',
  'pccomponentes.com', 'pccomponentes.fr', 'pccomponentes.pt', 'pearl.fr',
  'perfumeprice.co.uk', 'perfumesclub.be', 'perfumesclub.co.uk',
  'perfumesclub.com', 'perfumesclub.fr', 'perfumesclub.it', 'petplanet.co.uk',
  'pharma-gdd.com', 'pharma24.pt', 'pharma360.fr', 'pharmacasse.fr',
  'pharmaciedesdrakkars.com', 'pharmaciefernandes.com', 'pharmaciepolygone.com',
  'pharmashopdiscount.com', 'philibertnet.com', 'philips-hue.com-de',
  'philips-hue.com-es', 'philips-hue.com-fr', 'philips-hue.com-it',
  'philips-hue.com-uk', 'picksport.de', 'pieper.de', 'pinocchiotoys.it',
  'pixelatoy.com', 'pixmania.com', 'plasticosur.com', 'playmobil.com-de',
  'playmobil.com-es', 'playmobil.com-fr', 'playmobil.com-it', 'playmobil.com-uk',
  'playmycenter.com', 'playox.de', 'plein.nl', 'pollin.de', 'poundfun.com',
  'poundwholesale.co.uk', 'prcdirect.co.uk', 'pressstart.pt', 'prezzoforte.it',
  'primeriti.es', 'primor.eu', 'primor.eu-fr', 'primor.eu-pt', 'probems.be',
  'proshop.de', 'proshop.se', 'provence-outillage.fr', 'pscstore.pt',
  'puma.com-de', 'puma.com-es', 'puma.com-fr', 'puma.com-uk',
  'puntorigenera.com', 'purepara.com', 'qogita.com', 'qogita.com-es',
  'qogita.com-fr', 'qogita.com-it', 'qogita.com-uk', 'qubbos.es',
  'qudobeauty.com', 'quercettistore.com', 'quiksilver.de', 'quiksilver.es',
  'quiksilver.fr', 'quzo.net', 'racetools.fr', 'radiopopular.pt',
  'rappelkiste-spielwaren.eu', 'rasppishop.de', 'recamania.com',
  'redcare-pharmacie.fr', 'redstring.es', 'regiojatek.hu', 'reichelt.de',
  'risparmiocasa.com', 'roccogiocattoli.eu', 'rofu.de', 'roldanjuguetes.com',
  'rollei.de', 'rosalar.pt', 'rossmann.de', 'ryman.co.uk', 'ryobitools.eu-uk',
  'sallybeauty.co.uk', 'samsonite.co.uk', 'samsonite.es', 'samsonite.fr',
  'samsonite.it', 'sanareva.co.uk', 'sanareva.es', 'sanareva.it', 'sanitino.it',
  'saturn.de', 'savers.co.uk', 'schork.shop', 'schuettewelt.de', 'senetic.co.uk',
  'servelec.pt', 'sherwoodmedia.es', 'shop-apotheke.com', 'shopincasa.it',
  'shoppalob2b.com', 'shoptimm.pt', 'sianwholesale.com', 'simpaticotech.it',
  'slrhut.co.uk', 'smdv.de', 'smythstoys.com-de', 'smythstoys.com-fr',
  'smythstoys.com-uk', 'sonicdirect.co.uk', 'sopo-onlineshop.de', 'spacenk.com',
  'spar-toys.de', 'speedpc.es', 'spielzeug-fuchs.de', 'sportfiskeprylar.se',
  'sportmarken24.de', 'sportsdirect.com', 'sportspar.de', 'sprintersports.com',
  'sprintersports.com-pt', 'staractionfigures.co.uk', 'steinehelden.de',
  'stockperfume.com', 'storline.com', 'storline.com-b2b', 'studio.co.uk',
  'suonostore.com', 'superarcade.es', 'superdrug.com', 'supergros.it',
  'supermercadodeljuguete.es', 'switchtechnology.pt', 'symphonya.eu',
  'tackleuk.co.uk', 'taschengelddieb.de', 'tatino.es', 'tcgfactory.com',
  'teddypharm.de', 'teddytoys.de', 'tek4life.pt', 'temo-elektro.de', 'tesco.com',
  'tesco.hu', 'thalia.de', 'thebluekid.es', 'thefragranceshop.co.uk',
  'therange.co.uk', 'thermopreen.eu', 'theworks.co.uk', 'thomas-philipps.de',
  'tickety-boo-toys.co.uk', 'tiendasmgi.es', 'tiendasuperjuguete.com',
  'tikodoco.com', 'todojuguete.es', 'todotaladros.com-de', 'todotaladros.com-es',
  'tondoseviersen.de', 'toner24.it', 'toolmax.nl', 'toolnation.de',
  'toolstoreuk.co.uk', 'topbaby.es', 'toymi.eu', 'toyplanet.com',
  'toys-for-fun.com', 'toyscenter.it', 'toysmaniatic.com', 'toysrus.es',
  'toysrus.pt', 'toytownstores.com', 'tradeinn.com-de', 'tradeinn.com-en',
  'tradeinn.com-es', 'tradeinn.com-fr', 'tradeinn.com-it', 'trena.fr', 'trena.it',
  'trony.it', 'troopertoys.com', 'trotec.com-de', 'trotec.com-es', 'trotec.com-fr',
  'trotec.com-it', 'trotec.com-uk', 'tuul.zone', 'ultrajeux.com', 'unieuro.it',
  'universpara.com', 'universpharmacie.fr', 'vearce.com', 'very.co.uk',
  'videooca.com', 'videooca.com-b2b', 'viking-direct.co.uk', 'visanta.com',
  'vitamin360.com-b2b', 'voelkner.de', 'weldricks.co.uk', 'werkzeugstore24.de',
  'westocklots.com', 'wmf.com', 'wonduu.com', 'workoutforless.co.uk',
  'worldofbears.com', 'worldofsweets.de', 'wowowtoys.co.uk', 'xfilesaversa.it',
  'xxl-deals.de', 'yachew.com', 'youget.pt', 'zapatos.es', 'zentrada.de',
  'zentrada.es', 'zentrada.fr', 'zentrada.it', 'ziwwie.com', 'zooplus.co.uk',
  'zooplus.de', 'zooplus.es', 'zooplus.fr', 'zooplus.nl', 'zurbrueggen.de',
  'zwilling.com-de', 'zwilling.com-es', 'zwilling.com-fr', 'zwilling.com-it',
  'zwilling.com-uk',
];

export const UPDATED_RECENTLY_OPTIONS = [
  { value: 'all', label: 'Tous' },
  { value: '24h', label: 'Dernières 24h' },
  { value: '3d', label: '3 derniers jours' },
  { value: '7d', label: '7 derniers jours' },
  { value: '14d', label: '14 derniers jours' },
  { value: '30d', label: '30 derniers jours' },
];

export const CATEGORY_OPTIONS = [
  'Electronics', 'Toys', 'Home & Kitchen', 'Sports', 'Beauty',
  'Books', 'Garden', 'Automotive', 'Pet Supplies', 'Office Products',
  'Health & Personal Care', 'Baby', 'Clothing', 'Grocery', 'Tools',
];
