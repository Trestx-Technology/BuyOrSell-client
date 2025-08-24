export interface NavItem {
  id: string;
  name: string;
  children?: NavItem[];
}

export const motorsData: NavItem[] = [
  {
    id: "cars",
    name: "Cars",
    children: [
      {
        id: "toyota",
        name: "Toyota",
        children: [
          { id: "camry", name: "Camry" },
          { id: "corolla", name: "Corolla" },
          { id: "prius", name: "Prius" },
          { id: "rav4", name: "RAV4" },
        ],
      },
      {
        id: "mercedes-benz",
        name: "Mercedes-Benz",
        children: [
          { id: "c-class", name: "C-Class" },
          { id: "e-class", name: "E-Class" },
          { id: "glc", name: "GLC" },
          { id: "gla", name: "GLA" },
        ],
      },
      {
        id: "bmw",
        name: "BMW",
        children: [
          { id: "3-series", name: "3 Series" },
          { id: "5-series", name: "5 Series" },
          { id: "x3", name: "X3" },
          { id: "x5", name: "X5" },
        ],
      },
      {
        id: "ford",
        name: "Ford",
        children: [
          { id: "f-150", name: "F-150" },
          { id: "mustang", name: "Mustang" },
          { id: "explorer", name: "Explorer" },
          { id: "escape", name: "Escape" },
        ],
      },
      {
        id: "lexus",
        name: "Lexus",
        children: [
          { id: "rx", name: "RX" },
          { id: "es", name: "ES" },
          { id: "nx", name: "NX" },
          { id: "gx", name: "GX" },
        ],
      },
      {
        id: "chevrolet",
        name: "Chevrolet",
        children: [
          { id: "silverado", name: "Silverado" },
          { id: "equinox", name: "Equinox" },
          { id: "malibu", name: "Malibu" },
          { id: "tahoe", name: "Tahoe" },
        ],
      },
      {
        id: "land-rover",
        name: "Land Rover",
        children: [
          { id: "range-rover", name: "Range Rover" },
          { id: "discovery", name: "Discovery" },
          { id: "defender", name: "Defender" },
          { id: "evoque", name: "Evoque" },
        ],
      },
      {
        id: "hyundai",
        name: "Hyundai",
        children: [
          { id: "elantra", name: "Elantra" },
          { id: "sonata", name: "Sonata" },
          { id: "tucson", name: "Tucson" },
          { id: "santa-fe", name: "Santa Fe" },
          { id: "kona", name: "Kona" },
          { id: "palisade", name: "Palisade" },
        ],
      },
      {
        id: "audi",
        name: "Audi",
        children: [
          { id: "a4", name: "A4" },
          { id: "a6", name: "A6" },
          { id: "q3", name: "Q3" },
          { id: "q5", name: "Q5" },
          { id: "q7", name: "Q7" },
          { id: "rs6", name: "RS6" },
        ],
      },
      {
        id: "volkswagen",
        name: "Volkswagen",
        children: [
          { id: "golf", name: "Golf" },
          { id: "passat", name: "Passat" },
          { id: "tiguan", name: "Tiguan" },
          { id: "atlas", name: "Atlas" },
          { id: "jetta", name: "Jetta" },
        ],
      },
      {
        id: "honda",
        name: "Honda",
        children: [
          { id: "civic", name: "Civic" },
          { id: "accord", name: "Accord" },
          { id: "cr-v", name: "CR-V" },
          { id: "pilot", name: "Pilot" },
          { id: "odyssey", name: "Odyssey" },
        ],
      },
      {
        id: "nissan",
        name: "Nissan",
        children: [
          { id: "altima", name: "Altima" },
          { id: "sentra", name: "Sentra" },
          { id: "rogue", name: "Rogue" },
          { id: "murano", name: "Murano" },
          { id: "pathfinder", name: "Pathfinder" },
        ],
      },
      {
        id: "kia",
        name: "Kia",
        children: [
          { id: "forte", name: "Forte" },
          { id: "k5", name: "K5" },
          { id: "sportage", name: "Sportage" },
          { id: "telluride", name: "Telluride" },
          { id: "sorento", name: "Sorento" },
        ],
      },
      {
        id: "mazda",
        name: "Mazda",
        children: [
          { id: "mazda3", name: "Mazda3" },
          { id: "mazda6", name: "Mazda6" },
          { id: "cx-5", name: "CX-5" },
          { id: "cx-9", name: "CX-9" },
          { id: "mx-5", name: "MX-5 Miata" },
        ],
      },
      {
        id: "subaru",
        name: "Subaru",
        children: [
          { id: "impreza", name: "Impreza" },
          { id: "legacy", name: "Legacy" },
          { id: "forester", name: "Forester" },
          { id: "outback", name: "Outback" },
          { id: "wrx", name: "WRX" },
        ],
      },
      {
        id: "volvo",
        name: "Volvo",
        children: [
          { id: "s60", name: "S60" },
          { id: "s90", name: "S90" },
          { id: "xc40", name: "XC40" },
          { id: "xc60", name: "XC60" },
          { id: "xc90", name: "XC90" },
        ],
      },
      {
        id: "jaguar",
        name: "Jaguar",
        children: [
          { id: "xe", name: "XE" },
          { id: "xf", name: "XF" },
          { id: "f-pace", name: "F-Pace" },
          { id: "f-type", name: "F-Type" },
          { id: "i-pace", name: "I-Pace" },
        ],
      },
      {
        id: "porsche",
        name: "Porsche",
        children: [
          { id: "911", name: "911" },
          { id: "cayman", name: "Cayman" },
          { id: "boxster", name: "Boxster" },
          { id: "cayenne", name: "Cayenne" },
          { id: "macan", name: "Macan" },
          { id: "panamera", name: "Panamera" },
        ],
      },
      {
        id: "ferrari",
        name: "Ferrari",
        children: [
          { id: "f8", name: "F8 Tributo" },
          { id: "sf90", name: "SF90 Stradale" },
          { id: "roma", name: "Roma" },
          { id: "812", name: "812 Superfast" },
          { id: "296", name: "296 GTB" },
        ],
      },
      {
        id: "lamborghini",
        name: "Lamborghini",
        children: [
          { id: "huracan", name: "Huracán" },
          { id: "aventador", name: "Aventador" },
          { id: "urus", name: "Urus" },
          { id: "revuelto", name: "Revuelto" },
        ],
      },
    ],
  },
  {
    id: "rental-cars",
    name: "Rental Cars",
    children: [
      {
        id: "economy",
        name: "Economy",
        children: [
          { id: "toyota-yaris", name: "Toyota Yaris" },
          { id: "hyundai-accent", name: "Hyundai Accent" },
          { id: "kia-rio", name: "Kia Rio" },
        ],
      },
      {
        id: "compact",
        name: "Compact",
        children: [
          { id: "honda-civic", name: "Honda Civic" },
          { id: "toyota-corolla", name: "Toyota Corolla" },
          { id: "nissan-sentra", name: "Nissan Sentra" },
        ],
      },
      {
        id: "midsize",
        name: "Midsize",
        children: [
          { id: "toyota-camry", name: "Toyota Camry" },
          { id: "honda-accord", name: "Honda Accord" },
          { id: "nissan-altima", name: "Nissan Altima" },
        ],
      },
      {
        id: "luxury",
        name: "Luxury",
        children: [
          { id: "bmw-5-series", name: "BMW 5 Series" },
          { id: "audi-a6", name: "Audi A6" },
          { id: "mercedes-e-class", name: "Mercedes E-Class" },
        ],
      },
      {
        id: "electric",
        name: "Electric",
        children: [
          { id: "tesla-model-3", name: "Tesla Model 3" },
          { id: "nissan-leaf", name: "Nissan Leaf" },
          { id: "chevy-bolt", name: "Chevrolet Bolt" },
        ],
      },
      {
        id: "suv",
        name: "SUV",
        children: [
          { id: "toyota-rav4", name: "Toyota RAV4" },
          { id: "ford-escape", name: "Ford Escape" },
          { id: "honda-crv", name: "Honda CR-V" },
        ],
      },
    ],
  },
  {
    id: "new-cars",
    name: "New Cars",
    children: [
      {
        id: "sedans",
        name: "Sedans",
        children: [
          { id: "honda-civic-2025", name: "Honda Civic 2025" },
          { id: "toyota-corolla-2025", name: "Toyota Corolla 2025" },
        ],
      },
      {
        id: "suvs",
        name: "SUVs",
        children: [
          { id: "hyundai-tucson-2025", name: "Hyundai Tucson 2025" },
          { id: "kia-sportage-2025", name: "Kia Sportage 2025" },
        ],
      },
      {
        id: "trucks",
        name: "Trucks",
        children: [
          { id: "ford-f150-2025", name: "Ford F-150 2025" },
          { id: "chevy-silverado-2025", name: "Chevrolet Silverado 2025" },
        ],
      },
      {
        id: "convertibles",
        name: "Convertibles",
        children: [
          { id: "mazda-mx5-2025", name: "Mazda MX-5 2025" },
          { id: "bmw-z4-2025", name: "BMW Z4 2025" },
        ],
      },
      {
        id: "coupes",
        name: "Coupes",
        children: [
          { id: "audi-a5-2025", name: "Audi A5 2025" },
          { id: "ford-mustang-2025", name: "Ford Mustang 2025" },
        ],
      },
      {
        id: "electric",
        name: "Electric Vehicles",
        children: [
          { id: "tesla-model-s-2025", name: "Tesla Model S 2025" },
          { id: "lucid-air-2025", name: "Lucid Air 2025" },
        ],
      },
    ],
  },
  {
    id: "export-cars",
    name: "Export Cars",
    children: [
      {
        id: "international",
        name: "International",
        children: [
          { id: "german-brands", name: "German Brands" },
          { id: "japanese-brands", name: "Japanese Brands" },
        ],
      },
      {
        id: "domestic",
        name: "Domestic",
        children: [
          { id: "usa", name: "USA Market" },
          { id: "europe", name: "Europe Market" },
        ],
      },
      {
        id: "customs",
        name: "Customs Cleared",
        children: [
          { id: "cleared-uae", name: "Cleared in UAE" },
          { id: "cleared-africa", name: "Cleared in Africa" },
        ],
      },
    ],
  },
  {
    id: "motorcycles",
    name: "Motorcycles",
    children: [
      {
        id: "sport",
        name: "Sport",
        children: [
          { id: "yamaha-r1", name: "Yamaha R1" },
          { id: "yamaha-r6", name: "Yamaha R6" },
          { id: "kawasaki-ninja-zx10r", name: "Kawasaki Ninja ZX-10R" },
          { id: "kawasaki-ninja-zx6r", name: "Kawasaki Ninja ZX-6R" },
          { id: "honda-cbr1000rr", name: "Honda CBR1000RR" },
          { id: "honda-cbr600rr", name: "Honda CBR600RR" },
          { id: "suzuki-gsxr1000", name: "Suzuki GSX-R1000" },
          { id: "suzuki-gsxr750", name: "Suzuki GSX-R750" },
          { id: "bmw-s1000rr", name: "BMW S1000RR" },
          { id: "ducati-panigale-v4", name: "Ducati Panigale V4" },
          { id: "ktm-rc390", name: "KTM RC 390" },
          { id: "aprilia-rsv4", name: "Aprilia RSV4" },
        ],
      },
      {
        id: "cruiser",
        name: "Cruiser",
        children: [
          {
            id: "harley-davidson-sportster",
            name: "Harley Davidson Sportster",
          },
          {
            id: "harley-davidson-street-glide",
            name: "Harley Davidson Street Glide",
          },
          { id: "harley-davidson-fat-boy", name: "Harley Davidson Fat Boy" },
          { id: "indian-scout", name: "Indian Scout" },
          { id: "indian-chief", name: "Indian Chief" },
          { id: "yamaha-vstar", name: "Yamaha V-Star" },
          { id: "kawasaki-vulcan", name: "Kawasaki Vulcan" },
          { id: "honda-shadow", name: "Honda Shadow" },
          { id: "suzuki-boulevard", name: "Suzuki Boulevard" },
        ],
      },
      {
        id: "touring",
        name: "Touring",
        children: [
          { id: "honda-goldwing", name: "Honda Goldwing" },
          { id: "bmw-k1600gt", name: "BMW K1600GT" },
          { id: "bmw-r1250gs", name: "BMW R1250GS" },
          { id: "yamaha-fjr1300", name: "Yamaha FJR1300" },
          { id: "kawasaki-concours", name: "Kawasaki Concours" },
          { id: "ducati-multistrada", name: "Ducati Multistrada" },
          { id: "triumph-tiger", name: "Triumph Tiger" },
          {
            id: "harley-davidson-road-glide",
            name: "Harley Davidson Road Glide",
          },
          { id: "indian-roadmaster", name: "Indian Roadmaster" },
        ],
      },
      {
        id: "naked",
        name: "Naked/Street",
        children: [
          { id: "yamaha-mt07", name: "Yamaha MT-07" },
          { id: "yamaha-mt09", name: "Yamaha MT-09" },
          { id: "yamaha-mt10", name: "Yamaha MT-10" },
          { id: "kawasaki-z900", name: "Kawasaki Z900" },
          { id: "kawasaki-z1000", name: "Kawasaki Z1000" },
          { id: "honda-cb650r", name: "Honda CB650R" },
          { id: "honda-cb1000r", name: "Honda CB1000R" },
          { id: "suzuki-sv650", name: "Suzuki SV650" },
          { id: "suzuki-gsx-s1000", name: "Suzuki GSX-S1000" },
          { id: "bmw-f900r", name: "BMW F900R" },
          { id: "ducati-monster", name: "Ducati Monster" },
          { id: "ktm-duke-390", name: "KTM Duke 390" },
          { id: "ktm-duke-890", name: "KTM Duke 890" },
          { id: "triumph-street-triple", name: "Triumph Street Triple" },
          { id: "triumph-speed-triple", name: "Triumph Speed Triple" },
        ],
      },
      {
        id: "dirt",
        name: "Dirt/Off-Road",
        children: [
          { id: "ktm-450exc", name: "KTM 450 EXC" },
          { id: "ktm-250sx", name: "KTM 250 SX" },
          { id: "yamaha-wr250f", name: "Yamaha WR250F" },
          { id: "yamaha-yz450f", name: "Yamaha YZ450F" },
          { id: "honda-crf450r", name: "Honda CRF450R" },
          { id: "honda-crf250r", name: "Honda CRF250R" },
          { id: "kawasaki-kx450", name: "Kawasaki KX450" },
          { id: "kawasaki-kx250", name: "Kawasaki KX250" },
          { id: "suzuki-rmz450", name: "Suzuki RM-Z450" },
          { id: "suzuki-rmz250", name: "Suzuki RM-Z250" },
          { id: "husqvarna-tc250", name: "Husqvarna TC250" },
          { id: "husqvarna-fc450", name: "Husqvarna FC450" },
          { id: "beta-rr350", name: "Beta RR350" },
          { id: "gasgas-mc250", name: "GasGas MC250" },
        ],
      },
      {
        id: "adventure",
        name: "Adventure/Dual-Sport",
        children: [
          { id: "bmw-r1250gs", name: "BMW R1250GS" },
          { id: "bmw-f850gs", name: "BMW F850GS" },
          { id: "ktm-1290-super-adventure", name: "KTM 1290 Super Adventure" },
          { id: "ktm-790-adventure", name: "KTM 790 Adventure" },
          { id: "yamaha-xt1200z", name: "Yamaha XT1200Z Super Ténéré" },
          { id: "yamaha-xt660z", name: "Yamaha XT660Z Ténéré" },
          { id: "honda-africa-twin", name: "Honda Africa Twin" },
          { id: "honda-cb500x", name: "Honda CB500X" },
          { id: "kawasaki-versys-650", name: "Kawasaki Versys 650" },
          { id: "kawasaki-versys-1000", name: "Kawasaki Versys 1000" },
          { id: "suzuki-v-strom-650", name: "Suzuki V-Strom 650" },
          { id: "suzuki-v-strom-1000", name: "Suzuki V-Strom 1000" },
          { id: "ducati-multistrada", name: "Ducati Multistrada" },
          { id: "triumph-tiger-900", name: "Triumph Tiger 900" },
          { id: "triumph-tiger-1200", name: "Triumph Tiger 1200" },
        ],
      },
      {
        id: "electric",
        name: "Electric Bikes",
        children: [
          { id: "zero-s", name: "Zero S" },
          { id: "zero-fx", name: "Zero FX" },
          { id: "zero-sr", name: "Zero SR" },
          { id: "harley-livewire", name: "Harley Davidson LiveWire" },
          { id: "energica-eva", name: "Energica Eva" },
          { id: "lightning-strike", name: "Lightning Strike" },
          { id: "arc-vector", name: "ARC Vector" },
          { id: "cake-kalk", name: "CAKE Kalk" },
        ],
      },
      {
        id: "scooters",
        name: "Scooters",
        children: [
          { id: "vespa-gts", name: "Vespa GTS" },
          { id: "vespa-primavera", name: "Vespa Primavera" },
          { id: "honda-pcx150", name: "Honda PCX150" },
          { id: "honda-adv150", name: "Honda ADV150" },
          { id: "yamaha-xmax", name: "Yamaha XMAX" },
          { id: "yamaha-nmax", name: "Yamaha NMAX" },
          { id: "suzuki-burgman", name: "Suzuki Burgman" },
          { id: "kymco-ak550", name: "Kymco AK550" },
          { id: "sym-maxsym", name: "SYM MaxSym" },
        ],
      },
    ],
  },
  {
    id: "auto-accessories",
    name: "Auto Accessories & Parts",
    children: [
      {
        id: "tires",
        name: "Tires",
        children: [
          { id: "michelin", name: "Michelin" },
          { id: "bridgestone", name: "Bridgestone" },
          { id: "continental", name: "Continental" },
          { id: "goodyear", name: "Goodyear" },
          { id: "pirelli", name: "Pirelli" },
          { id: "dunlop", name: "Dunlop" },
          { id: "yokohama", name: "Yokohama" },
          { id: "hankook", name: "Hankook" },
          { id: "toyo", name: "Toyo" },
          { id: "falken", name: "Falken" },
        ],
      },
      {
        id: "batteries",
        name: "Batteries",
        children: [
          { id: "bosch", name: "Bosch" },
          { id: "exide", name: "Exide" },
          { id: "varta", name: "Varta" },
          { id: "optima", name: "Optima" },
          { id: "diehard", name: "DieHard" },
          { id: "interstate", name: "Interstate" },
          { id: "acdelco", name: "ACDelco" },
          { id: "everstart", name: "EverStart" },
          { id: "duracell", name: "Duracell" },
          { id: "energizer", name: "Energizer" },
        ],
      },
      {
        id: "oil",
        name: "Oil & Fluids",
        children: [
          { id: "castrol", name: "Castrol" },
          { id: "mobil-1", name: "Mobil 1" },
          { id: "valvoline", name: "Valvoline" },
          { id: "quaker-state", name: "Quaker State" },
          { id: "pennzoil", name: "Pennzoil" },
          { id: "royal-purple", name: "Royal Purple" },
          { id: "amsoil", name: "AMSOIL" },
          { id: "red-line", name: "Red Line" },
          { id: "lucas-oil", name: "Lucas Oil" },
          { id: "shell", name: "Shell" },
        ],
      },
      {
        id: "filters",
        name: "Filters",
        children: [
          { id: "mann-filter", name: "MANN Filter" },
          { id: "fram", name: "FRAM" },
          { id: "k-n", name: "K&N" },
          { id: "bosch", name: "Bosch" },
          { id: "mahle", name: "Mahle" },
          { id: "wix", name: "WIX" },
          { id: "purolator", name: "Purolator" },
          { id: "hastings", name: "Hastings" },
          { id: "baldwin", name: "Baldwin" },
          { id: "donaldson", name: "Donaldson" },
        ],
      },
      {
        id: "brakes",
        name: "Brakes",
        children: [
          { id: "brembo", name: "Brembo" },
          { id: "akebono", name: "Akebono" },
          { id: "raybesto", name: "Raybesto" },
          { id: "wagner", name: "Wagner" },
          { id: "centric", name: "Centric" },
          { id: "stoptech", name: "StopTech" },
          { id: "wilwood", name: "Wilwood" },
          { id: "baer", name: "Baer" },
          { id: "power-stop", name: "Power Stop" },
          { id: "hawk", name: "Hawk Performance" },
        ],
      },
      {
        id: "suspension",
        name: "Suspension",
        children: [
          { id: "monroe", name: "Monroe" },
          { id: "kyb", name: "KYB" },
          { id: "bilstein", name: "Bilstein" },
          { id: "koni", name: "Koni" },
          { id: "ohlins", name: "Öhlins" },
          { id: "tein", name: "Tein" },
          { id: "h-r", name: "H&R" },
          { id: "eibach", name: "Eibach" },
          { id: "tokico", name: "Tokico" },
          { id: "gabriel", name: "Gabriel" },
        ],
      },
      {
        id: "exhaust",
        name: "Exhaust Systems",
        children: [
          { id: "borla", name: "Borla" },
          { id: "magnaflow", name: "MagnaFlow" },
          { id: "flowmaster", name: "Flowmaster" },
          { id: "corsa", name: "Corsa" },
          { id: "injen", name: "Injen" },
          { id: "aem", name: "AEM" },
          { id: "hks", name: "HKS" },
          { id: "apexi", name: "Apexi" },
          { id: "tanabe", name: "Tanabe" },
          { id: "greddy", name: "Greddy" },
        ],
      },
      {
        id: "intake",
        name: "Air Intake Systems",
        children: [
          { id: "k-n", name: "K&N" },
          { id: "aem", name: "AEM" },
          { id: "injen", name: "Injen" },
          { id: "volant", name: "Volant" },
          { id: "spectre", name: "Spectre" },
          { id: "spectre-performance", name: "Spectre Performance" },
          { id: "mishimoto", name: "Mishimoto" },
          { id: "takeda", name: "Takeda" },
          { id: "aem", name: "AEM" },
          { id: "hps", name: "HPS" },
        ],
      },
      {
        id: "wheels",
        name: "Wheels & Rims",
        children: [
          { id: "bbs", name: "BBS" },
          { id: "enkei", name: "Enkei" },
          { id: "volk", name: "Volk Racing" },
          { id: "work", name: "Work Wheels" },
          { id: "ssr", name: "SSR" },
          { id: "rota", name: "Rota" },
          { id: "konig", name: "Konig" },
          { id: "advan", name: "Advan" },
          { id: "rays", name: "Rays Engineering" },
          { id: "oz-racing", name: "OZ Racing" },
        ],
      },
      {
        id: "lighting",
        name: "Lighting & LEDs",
        children: [
          { id: "philips", name: "Philips" },
          { id: "osram", name: "Osram" },
          { id: "hella", name: "Hella" },
          { id: "piaa", name: "PIAA" },
          { id: "rigid", name: "Rigid Industries" },
          { id: "baja-designs", name: "Baja Designs" },
          { id: "vision-x", name: "Vision X" },
          { id: "led-autolamps", name: "LED Autolamps" },
          { id: "sylvania", name: "Sylvania" },
          { id: "ge", name: "GE Lighting" },
        ],
      },
      {
        id: "audio",
        name: "Car Audio & Entertainment",
        children: [
          { id: "pioneer", name: "Pioneer" },
          { id: "kenwood", name: "Kenwood" },
          { id: "sony", name: "Sony" },
          { id: "alpine", name: "Alpine" },
          { id: "jbl", name: "JBL" },
          { id: "bose", name: "Bose" },
          { id: "harman-kardon", name: "Harman Kardon" },
          { id: "bang-olufsen", name: "Bang & Olufsen" },
          { id: "focal", name: "Focal" },
          { id: "kicker", name: "Kicker" },
        ],
      },
      {
        id: "interior",
        name: "Interior Accessories",
        children: [
          { id: "weathertech", name: "WeatherTech" },
          { id: "husky-liners", name: "Husky Liners" },
          { id: "covercraft", name: "Covercraft" },
          { id: "wet-okole", name: "Wet Okole" },
          { id: "corbeau", name: "Corbeau" },
          { id: "recaro", name: "Recaro" },
          { id: "sparco", name: "Sparco" },
          { id: "momo", name: "Momo" },
          { id: "grant", name: "Grant" },
          { id: "nrg", name: "NRG Innovations" },
        ],
      },
      {
        id: "exterior",
        name: "Exterior Accessories",
        children: [
          { id: "weathertech", name: "WeatherTech" },
          { id: "husky-liners", name: "Husky Liners" },
          { id: "covercraft", name: "Covercraft" },
          { id: "wet-okole", name: "Wet Okole" },
          { id: "corbeau", name: "Corbeau" },
          { id: "recaro", name: "Recaro" },
          { id: "sparco", name: "Sparco" },
          { id: "momo", name: "Momo" },
          { id: "grant", name: "Grant" },
          { id: "nrg", name: "NRG Innovations" },
        ],
      },
    ],
  },
  {
    id: "heavy-vehicles",
    name: "Heavy Vehicles",
    children: [
      {
        id: "trucks",
        name: "Trucks",
        children: [
          { id: "volvo-fh", name: "Volvo FH" },
          { id: "volvo-fm", name: "Volvo FM" },
          { id: "scania-r-series", name: "Scania R-Series" },
          { id: "scania-p-series", name: "Scania P-Series" },
          { id: "mercedes-actros", name: "Mercedes-Benz Actros" },
          { id: "mercedes-atego", name: "Mercedes-Benz Atego" },
          { id: "man-tgx", name: "MAN TGX" },
          { id: "man-tgs", name: "MAN TGS" },
          { id: "iveco-stralis", name: "Iveco Stralis" },
          { id: "iveco-daily", name: "Iveco Daily" },
          { id: "daf-xf", name: "DAF XF" },
          { id: "daf-cf", name: "DAF CF" },
          { id: "renault-t", name: "Renault T" },
          { id: "renault-k", name: "Renault K" },
          { id: "peterbilt-579", name: "Peterbilt 579" },
          { id: "peterbilt-389", name: "Peterbilt 389" },
          { id: "kenworth-t680", name: "Kenworth T680" },
          { id: "kenworth-w900", name: "Kenworth W900" },
          { id: "freightliner-cascadia", name: "Freightliner Cascadia" },
          { id: "freightliner-century", name: "Freightliner Century" },
        ],
      },
      {
        id: "buses",
        name: "Buses",
        children: [
          { id: "mercedes-citaro", name: "Mercedes-Benz Citaro" },
          { id: "mercedes-o500", name: "Mercedes-Benz O500" },
          { id: "volvo-9700", name: "Volvo 9700" },
          { id: "volvo-8900", name: "Volvo 8900" },
          { id: "volvo-7900", name: "Volvo 7900" },
          { id: "scania-omni", name: "Scania Omni" },
          { id: "scania-omnilink", name: "Scania OmniLink" },
          { id: "man-lions-city", name: "MAN Lion's City" },
          { id: "man-lions-coach", name: "MAN Lion's Coach" },
          { id: "iveco-urbanway", name: "Iveco Urbanway" },
          { id: "iveco-crossway", name: "Iveco Crossway" },
          { id: "setra-s-417", name: "Setra S 417" },
          { id: "setra-s-516", name: "Setra S 516" },
          { id: "neoplan-cityliner", name: "Neoplan Cityliner" },
          { id: "neoplan-skyliner", name: "Neoplan Skyliner" },
        ],
      },
      {
        id: "trailers",
        name: "Trailers",
        children: [
          { id: "flatbed", name: "Flatbed Trailer" },
          { id: "lowboy", name: "Lowboy Trailer" },
          { id: "step-deck", name: "Step Deck Trailer" },
          { id: "double-drop", name: "Double Drop Trailer" },
          { id: "extendable", name: "Extendable Trailer" },
          { id: "conestoga", name: "Conestoga Trailer" },
          { id: "curtain-side", name: "Curtain Side Trailer" },
          { id: "box-trailer", name: "Box Trailer" },
          { id: "refrigerated", name: "Refrigerated Trailer" },
          { id: "tank-trailer", name: "Tank Trailer" },
          { id: "bulk-trailer", name: "Bulk Trailer" },
          { id: "car-carrier", name: "Car Carrier Trailer" },
          { id: "logging-trailer", name: "Logging Trailer" },
          { id: "dump-trailer", name: "Dump Trailer" },
          { id: "grain-trailer", name: "Grain Trailer" },
        ],
      },
      {
        id: "construction",
        name: "Construction Equipment",
        children: [
          { id: "cat-excavator", name: "Caterpillar Excavator" },
          { id: "cat-bulldozer", name: "Caterpillar Bulldozer" },
          { id: "cat-wheel-loader", name: "Caterpillar Wheel Loader" },
          { id: "cat-motor-grader", name: "Caterpillar Motor Grader" },
          { id: "jcb-backhoe", name: "JCB Backhoe Loader" },
          { id: "jcb-excavator", name: "JCB Excavator" },
          { id: "jcb-wheel-loader", name: "JCB Wheel Loader" },
          { id: "komatsu-excavator", name: "Komatsu Excavator" },
          { id: "komatsu-bulldozer", name: "Komatsu Bulldozer" },
          { id: "komatsu-wheel-loader", name: "Komatsu Wheel Loader" },
          { id: "hitachi-excavator", name: "Hitachi Excavator" },
          { id: "hitachi-mini-excavator", name: "Hitachi Mini Excavator" },
          { id: "volvo-excavator", name: "Volvo Excavator" },
          { id: "volvo-wheel-loader", name: "Volvo Wheel Loader" },
          { id: "liebherr-excavator", name: "Liebherr Excavator" },
          { id: "liebherr-crane", name: "Liebherr Crane" },
        ],
      },
      {
        id: "agriculture",
        name: "Agricultural Machinery",
        children: [
          { id: "john-deere-tractor", name: "John Deere Tractor" },
          { id: "john-deere-combine", name: "John Deere Combine" },
          { id: "john-deere-sprayer", name: "John Deere Sprayer" },
          { id: "case-ih-tractor", name: "Case IH Tractor" },
          { id: "case-ih-combine", name: "Case IH Combine Harvester" },
          { id: "case-ih-sprayer", name: "Case IH Sprayer" },
          { id: "new-holland-tractor", name: "New Holland Tractor" },
          { id: "new-holland-combine", name: "New Holland Combine" },
          { id: "massey-ferguson-tractor", name: "Massey Ferguson Tractor" },
          { id: "massey-ferguson-combine", name: "Massey Ferguson Combine" },
          { id: "fendt-tractor", name: "Fendt Tractor" },
          { id: "claas-combine", name: "Claas Combine" },
          { id: "claas-tractor", name: "Claas Tractor" },
          { id: "kubota-tractor", name: "Kubota Tractor" },
          { id: "kubota-combine", name: "Kubota Combine" },
        ],
      },
      {
        id: "mining",
        name: "Mining Equipment",
        children: [
          { id: "cat-mining-truck", name: "Caterpillar Mining Truck" },
          { id: "cat-mining-excavator", name: "Caterpillar Mining Excavator" },
          { id: "komatsu-mining-truck", name: "Komatsu Mining Truck" },
          { id: "komatsu-mining-excavator", name: "Komatsu Mining Excavator" },
          { id: "liebherr-mining-truck", name: "Liebherr Mining Truck" },
          {
            id: "liebherr-mining-excavator",
            name: "Liebherr Mining Excavator",
          },
          { id: "belaz-mining-truck", name: "BelAZ Mining Truck" },
          { id: "terex-mining-truck", name: "Terex Mining Truck" },
        ],
      },
      {
        id: "forestry",
        name: "Forestry Equipment",
        children: [
          { id: "john-deere-forestry", name: "John Deere Forestry Equipment" },
          { id: "cat-forestry", name: "Caterpillar Forestry Equipment" },
          { id: "komatsu-forestry", name: "Komatsu Forestry Equipment" },
          { id: "valmet-forestry", name: "Valmet Forestry Equipment" },
          { id: "ponsse-forestry", name: "Ponsse Forestry Equipment" },
        ],
      },
    ],
  },
  {
    id: "boats",
    name: "Boats",
    children: [
      {
        id: "sailboats",
        name: "Sailboats",
        children: [
          { id: "beneteau", name: "Beneteau" },
          { id: "jeanneau", name: "Jeanneau" },
        ],
      },
      {
        id: "motorboats",
        name: "Motorboats",
        children: [
          { id: "bayliner", name: "Bayliner" },
          { id: "sea-ray", name: "Sea Ray" },
        ],
      },
      {
        id: "yachts",
        name: "Yachts",
        children: [
          { id: "azimut", name: "Azimut" },
          { id: "sunseeker", name: "Sunseeker" },
        ],
      },
      {
        id: "fishing",
        name: "Fishing Boats",
        children: [
          { id: "lund", name: "Lund" },
          { id: "tracker", name: "Tracker" },
        ],
      },
    ],
  },
  {
    id: "number-plates",
    name: "Number Plates",
    children: [
      {
        id: "standard",
        name: "Standard",
        children: [
          { id: "uae-standard", name: "UAE Standard" },
          { id: "us-standard", name: "US Standard" },
        ],
      },
      {
        id: "personalized",
        name: "Personalized",
        children: [
          { id: "custom-text", name: "Custom Text" },
          { id: "custom-number", name: "Custom Numbers" },
        ],
      },
      {
        id: "vintage",
        name: "Vintage",
        children: [
          { id: "classic-cars", name: "Classic Cars Plates" },
          { id: "collector-edition", name: "Collector Edition" },
        ],
      },
      {
        id: "custom",
        name: "Custom Designs",
        children: [
          { id: "gold-plated", name: "Gold Plated" },
          { id: "carbon-fiber", name: "Carbon Fiber" },
        ],
      },
    ],
  },
  {
    id: "electric-vehicles",
    name: "Electric Vehicles",
    children: [
      {
        id: "cars",
        name: "Cars",
        children: [
          { id: "tesla-model-x", name: "Tesla Model X" },
          { id: "mercedes-eqs", name: "Mercedes EQS" },
        ],
      },
      {
        id: "bikes",
        name: "Bikes",
        children: [
          { id: "revolt-rv400", name: "Revolt RV400" },
          { id: "ola-s1", name: "Ola S1" },
        ],
      },
      {
        id: "scooters",
        name: "Scooters",
        children: [
          { id: "niu-mqi", name: "NIU MQi" },
          { id: "ather-450x", name: "Ather 450X" },
        ],
      },
      {
        id: "trucks",
        name: "Trucks",
        children: [
          { id: "tesla-semi", name: "Tesla Semi" },
          { id: "rivian-r1t", name: "Rivian R1T" },
        ],
      },
    ],
  },
];

export const propertyData: NavItem[] = [
  {
    id: "residential",
    name: "Residential",
    children: [
      {
        id: "apartments",
        name: "Apartments",
        children: [
          { id: "studio", name: "Studio" },
          { id: "1-bedroom", name: "1 Bedroom" },
          { id: "2-bedroom", name: "2 Bedroom" },
          { id: "3-bedroom", name: "3 Bedroom" },
        ],
      },
      {
        id: "villas",
        name: "Villas",
        children: [
          { id: "2-bedroom-villa", name: "2 Bedroom Villa" },
          { id: "3-bedroom-villa", name: "3 Bedroom Villa" },
          { id: "4-bedroom-villa", name: "4 Bedroom Villa" },
          { id: "5-bedroom-villa", name: "5+ Bedroom Villa" },
        ],
      },
      {
        id: "townhouses",
        name: "Townhouses",
        children: [
          { id: "2-bedroom-townhouse", name: "2 Bedroom" },
          { id: "3-bedroom-townhouse", name: "3 Bedroom" },
          { id: "4-bedroom-townhouse", name: "4 Bedroom" },
        ],
      },
      {
        id: "penthouses",
        name: "Penthouses",
        children: [
          { id: "luxury-penthouse", name: "Luxury" },
          { id: "standard-penthouse", name: "Standard" },
        ],
      },
    ],
  },
  {
    id: "commercial",
    name: "Commercial",
    children: [
      { id: "offices", name: "Office Spaces" },
      { id: "retail", name: "Retail Spaces" },
      { id: "warehouses", name: "Warehouses" },
      { id: "industrial", name: "Industrial" },
    ],
  },
  {
    id: "land",
    name: "Land",
    children: [
      { id: "residential-land", name: "Residential Land" },
      { id: "commercial-land", name: "Commercial Land" },
      { id: "agricultural-land", name: "Agricultural Land" },
      { id: "investment-land", name: "Investment Land" },
    ],
  },
  {
    id: "short-term-rental",
    name: "Short Term Rental",
    children: [
      { id: "daily-rental", name: "Daily Rental" },
      { id: "weekly-rental", name: "Weekly Rental" },
      { id: "monthly-rental", name: "Monthly Rental" },
    ],
  },
];

export const jobsData: NavItem[] = [
  {
    id: "technology",
    name: "Technology",
    children: [
      {
        id: "software-development",
        name: "Software Development",
        children: [
          { id: "frontend-developer", name: "Frontend Developer" },
          { id: "backend-developer", name: "Backend Developer" },
          { id: "fullstack-developer", name: "Full Stack Developer" },
          { id: "mobile-developer", name: "Mobile Developer" },
        ],
      },
      {
        id: "data-science",
        name: "Data Science",
        children: [
          { id: "data-analyst", name: "Data Analyst" },
          { id: "data-scientist", name: "Data Scientist" },
          { id: "machine-learning", name: "Machine Learning Engineer" },
        ],
      },
      {
        id: "cybersecurity",
        name: "Cybersecurity",
        children: [
          { id: "security-analyst", name: "Security Analyst" },
          { id: "penetration-tester", name: "Penetration Tester" },
          { id: "security-engineer", name: "Security Engineer" },
        ],
      },
    ],
  },
  {
    id: "healthcare",
    name: "Healthcare",
    children: [
      { id: "doctors", name: "Doctors" },
      { id: "nurses", name: "Nurses" },
      { id: "pharmacists", name: "Pharmacists" },
      { id: "medical-technicians", name: "Medical Technicians" },
    ],
  },
  {
    id: "finance",
    name: "Finance",
    children: [
      { id: "accountants", name: "Accountants" },
      { id: "financial-analysts", name: "Financial Analysts" },
      { id: "banking", name: "Banking" },
      { id: "insurance", name: "Insurance" },
    ],
  },
  {
    id: "education",
    name: "Education",
    children: [
      { id: "teachers", name: "Teachers" },
      { id: "professors", name: "Professors" },
      { id: "tutors", name: "Tutors" },
      { id: "administrators", name: "Administrators" },
    ],
  },
  {
    id: "marketing",
    name: "Marketing",
    children: [
      { id: "digital-marketing", name: "Digital Marketing" },
      { id: "content-marketing", name: "Content Marketing" },
      { id: "social-media", name: "Social Media Marketing" },
      { id: "brand-management", name: "Brand Management" },
    ],
  },
];

export const classifiedsData: NavItem[] = [
  {
    id: "personal-services",
    name: "Personal Services",
    children: [
      {
        id: "beauty-wellness",
        name: "Beauty & Wellness",
        children: [
          { id: "hair-styling", name: "Hair Styling" },
          { id: "makeup", name: "Makeup" },
          { id: "massage", name: "Massage" },
          { id: "fitness-training", name: "Fitness Training" },
        ],
      },
      {
        id: "home-services",
        name: "Home Services",
        children: [
          { id: "cleaning", name: "Cleaning" },
          { id: "plumbing", name: "Plumbing" },
          { id: "electrical", name: "Electrical" },
          { id: "gardening", name: "Gardening" },
        ],
      },
      {
        id: "tutoring",
        name: "Tutoring",
        children: [
          { id: "academic-tutoring", name: "Academic Tutoring" },
          { id: "language-tutoring", name: "Language Tutoring" },
          { id: "music-lessons", name: "Music Lessons" },
          { id: "sports-coaching", name: "Sports Coaching" },
        ],
      },
    ],
  },
  {
    id: "business-services",
    name: "Business Services",
    children: [
      { id: "consulting", name: "Consulting" },
      { id: "legal-services", name: "Legal Services" },
      { id: "accounting", name: "Accounting" },
      { id: "marketing-services", name: "Marketing Services" },
    ],
  },
  {
    id: "events",
    name: "Events",
    children: [
      { id: "wedding-services", name: "Wedding Services" },
      { id: "party-planning", name: "Party Planning" },
      { id: "photography", name: "Photography" },
      { id: "catering", name: "Catering" },
    ],
  },
];

export const furnitureData: NavItem[] = [
  {
    id: "living-room",
    name: "Living Room",
    children: [
      {
        id: "sofas",
        name: "Sofas",
        children: [
          { id: "3-seater-sofa", name: "3 Seater" },
          { id: "2-seater-sofa", name: "2 Seater" },
          { id: "corner-sofa", name: "Corner Sofa" },
          { id: "recliner-sofa", name: "Recliner" },
        ],
      },
      {
        id: "tables",
        name: "Tables",
        children: [
          { id: "coffee-table", name: "Coffee Table" },
          { id: "side-table", name: "Side Table" },
          { id: "tv-stand", name: "TV Stand" },
          { id: "console-table", name: "Console Table" },
        ],
      },
      {
        id: "storage",
        name: "Storage",
        children: [
          { id: "bookshelf", name: "Bookshelf" },
          { id: "display-cabinet", name: "Display Cabinet" },
          { id: "sideboard", name: "Sideboard" },
        ],
      },
    ],
  },
  {
    id: "bedroom",
    name: "Bedroom",
    children: [
      {
        id: "beds",
        name: "Beds",
        children: [
          { id: "single-bed", name: "Single Bed" },
          { id: "double-bed", name: "Double Bed" },
          { id: "queen-bed", name: "Queen Bed" },
          { id: "king-bed", name: "King Bed" },
        ],
      },
      {
        id: "wardrobes",
        name: "Wardrobes",
        children: [
          { id: "built-in-wardrobe", name: "Built-in Wardrobe" },
          { id: "freestanding-wardrobe", name: "Freestanding Wardrobe" },
          { id: "walk-in-wardrobe", name: "Walk-in Wardrobe" },
        ],
      },
      {
        id: "dressers",
        name: "Dressers",
        children: [
          { id: "chest-of-drawers", name: "Chest of Drawers" },
          { id: "dressing-table", name: "Dressing Table" },
          { id: "nightstand", name: "Nightstand" },
        ],
      },
    ],
  },
  {
    id: "dining-room",
    name: "Dining Room",
    children: [
      { id: "dining-tables", name: "Dining Tables" },
      { id: "dining-chairs", name: "Dining Chairs" },
      { id: "buffets", name: "Buffets" },
      { id: "china-cabinets", name: "China Cabinets" },
    ],
  },
  {
    id: "office",
    name: "Office",
    children: [
      { id: "desks", name: "Desks" },
      { id: "office-chairs", name: "Office Chairs" },
      { id: "filing-cabinets", name: "Filing Cabinets" },
      { id: "bookcases", name: "Bookcases" },
    ],
  },
];

export const electronicsData: NavItem[] = [
  {
    id: "mobile-phones",
    name: "Mobile Phones",
    children: [
      {
        id: "smartphones",
        name: "Smartphones",
        children: [
          { id: "iphone", name: "iPhone" },
          { id: "samsung", name: "Samsung" },
          { id: "google-pixel", name: "Google Pixel" },
          { id: "oneplus", name: "OnePlus" },
        ],
      },
      {
        id: "tablets",
        name: "Tablets",
        children: [
          { id: "ipad", name: "iPad" },
          { id: "samsung-tablet", name: "Samsung Tablet" },
          { id: "amazon-fire", name: "Amazon Fire" },
        ],
      },
      {
        id: "accessories",
        name: "Accessories",
        children: [
          { id: "phone-cases", name: "Phone Cases" },
          { id: "screen-protectors", name: "Screen Protectors" },
          { id: "chargers", name: "Chargers" },
          { id: "headphones", name: "Headphones" },
        ],
      },
    ],
  },
  {
    id: "computers",
    name: "Computers",
    children: [
      {
        id: "laptops",
        name: "Laptops",
        children: [
          { id: "gaming-laptop", name: "Gaming Laptop" },
          { id: "business-laptop", name: "Business Laptop" },
          { id: "student-laptop", name: "Student Laptop" },
          { id: "macbook", name: "MacBook" },
        ],
      },
      {
        id: "desktops",
        name: "Desktops",
        children: [
          { id: "gaming-pc", name: "Gaming PC" },
          { id: "workstation", name: "Workstation" },
          { id: "all-in-one", name: "All-in-One" },
        ],
      },
      {
        id: "components",
        name: "Components",
        children: [
          { id: "processors", name: "Processors" },
          { id: "graphics-cards", name: "Graphics Cards" },
          { id: "memory", name: "Memory (RAM)" },
          { id: "storage", name: "Storage" },
        ],
      },
    ],
  },
  {
    id: "home-entertainment",
    name: "Home Entertainment",
    children: [
      { id: "tvs", name: "Televisions" },
      { id: "sound-systems", name: "Sound Systems" },
      { id: "gaming-consoles", name: "Gaming Consoles" },
      { id: "projectors", name: "Projectors" },
    ],
  },
  {
    id: "cameras",
    name: "Cameras",
    children: [
      { id: "dslr", name: "DSLR Cameras" },
      { id: "mirrorless", name: "Mirrorless Cameras" },
      { id: "action-cameras", name: "Action Cameras" },
      { id: "camera-lenses", name: "Camera Lenses" },
    ],
  },
];

export const communityData: NavItem[] = [
  {
    id: "events",
    name: "Events",
    children: [
      {
        id: "social-events",
        name: "Social Events",
        children: [
          { id: "parties", name: "Parties" },
          { id: "meetups", name: "Meetups" },
          { id: "networking", name: "Networking Events" },
          { id: "celebrations", name: "Celebrations" },
        ],
      },
      {
        id: "cultural-events",
        name: "Cultural Events",
        children: [
          { id: "festivals", name: "Festivals" },
          { id: "exhibitions", name: "Exhibitions" },
          { id: "performances", name: "Performances" },
          { id: "workshops", name: "Workshops" },
        ],
      },
      {
        id: "sports-events",
        name: "Sports Events",
        children: [
          { id: "tournaments", name: "Tournaments" },
          { id: "matches", name: "Matches" },
          { id: "races", name: "Races" },
          { id: "fitness-events", name: "Fitness Events" },
        ],
      },
    ],
  },
  {
    id: "groups",
    name: "Groups",
    children: [
      { id: "hobby-groups", name: "Hobby Groups" },
      { id: "professional-groups", name: "Professional Groups" },
      { id: "religious-groups", name: "Religious Groups" },
      { id: "support-groups", name: "Support Groups" },
    ],
  },
  {
    id: "activities",
    name: "Activities",
    children: [
      { id: "outdoor-activities", name: "Outdoor Activities" },
      { id: "indoor-activities", name: "Indoor Activities" },
      { id: "team-sports", name: "Team Sports" },
      { id: "individual-sports", name: "Individual Sports" },
    ],
  },
  {
    id: "volunteering",
    name: "Volunteering",
    children: [
      { id: "community-service", name: "Community Service" },
      { id: "environmental", name: "Environmental" },
      { id: "education", name: "Education" },
      { id: "healthcare", name: "Healthcare" },
    ],
  },
];

export const othersData: NavItem[] = [
  {
    id: "books-media",
    name: "Books & Media",
    children: [
      {
        id: "books",
        name: "Books",
        children: [
          { id: "fiction", name: "Fiction" },
          { id: "non-fiction", name: "Non-Fiction" },
          { id: "academic", name: "Academic" },
          { id: "children-books", name: "Children's Books" },
        ],
      },
      {
        id: "movies-music",
        name: "Movies & Music",
        children: [
          { id: "dvds", name: "DVDs" },
          { id: "blu-rays", name: "Blu-rays" },
          { id: "vinyl-records", name: "Vinyl Records" },
          { id: "cds", name: "CDs" },
        ],
      },
      {
        id: "magazines",
        name: "Magazines",
        children: [
          { id: "fashion-magazines", name: "Fashion" },
          { id: "lifestyle-magazines", name: "Lifestyle" },
          { id: "business-magazines", name: "Business" },
          { id: "sports-magazines", name: "Sports" },
        ],
      },
    ],
  },
  {
    id: "collectibles",
    name: "Collectibles",
    children: [
      { id: "coins", name: "Coins" },
      { id: "stamps", name: "Stamps" },
      { id: "trading-cards", name: "Trading Cards" },
      { id: "antiques", name: "Antiques" },
    ],
  },
  {
    id: "musical-instruments",
    name: "Musical Instruments",
    children: [
      { id: "string-instruments", name: "String Instruments" },
      { id: "wind-instruments", name: "Wind Instruments" },
      { id: "percussion", name: "Percussion" },
      { id: "keyboards", name: "Keyboards" },
    ],
  },
  {
    id: "sports-equipment",
    name: "Sports Equipment",
    children: [
      { id: "fitness-equipment", name: "Fitness Equipment" },
      { id: "team-sports-equipment", name: "Team Sports" },
      { id: "outdoor-equipment", name: "Outdoor Equipment" },
      { id: "water-sports", name: "Water Sports" },
    ],
  },
  {
    id: "tools-hardware",
    name: "Tools & Hardware",
    children: [
      { id: "hand-tools", name: "Hand Tools" },
      { id: "power-tools", name: "Power Tools" },
      { id: "garden-tools", name: "Garden Tools" },
      { id: "automotive-tools", name: "Automotive Tools" },
    ],
  },
];

// Main navigation data structure
export const navigationData = {
  motors: motorsData,
  property: propertyData,
  jobs: jobsData,
  classifieds: classifiedsData,
  furniture: furnitureData,
  electronics: electronicsData,
  community: communityData,
  others: othersData,
};

// Export all data for easy access
export default navigationData;
