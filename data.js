// ==========================================================================
// data.js - Baza Wiedzy Medycznej, Cytatów i Osiągnięć dla NoSmoking
// Wsparcie dla dwóch trybów: 🚬 Tradycyjne Papierosy & 💨 E-papierosy (Vaping)
// ==========================================================================

const APP_DATA = {
  // ========================================================================
  // KATEGORIA 1: PAPIEROSY TRADYCYJNE (TYTOŃ SPALANY)
  // ========================================================================
  cigarettes: {
    id: "cigarettes",
    name: "Papierosy Tradycyjne",
    shortName: "Papierosy",
    icon: "🚬",
    accentColor: "#10b981",
    themeClass: "theme-cigarettes",
    statusText: "Wolny od dymu tytoniowego",
    quitActionLabel: "Zgasiłem ostatniego papierosa już teraz!",
    defaultSettings: {
      quitDate: "2026-10-19T00:00:00",
      cigsPerDay: 20,
      packPrice: 19.50, // PLN za paczkę 20 sztuk
      currency: "zł",
      yearsSmoked: 7,
      tarPerCig: 10, // mg substancji smolistych na papieros
      nicotinePerCig: 0.8 // mg nikotyny na papieros
    },

    // 14 Medycznych Etapów Regeneracji po Rzuceniu Palenia Tradycyjnego
    healthMilestones: [
      {
        id: "c_20m",
        title: "Normalizacja tętna i ciśnienia tętniczego",
        shortTitle: "Tętno i ciśnienie",
        timeSeconds: 20 * 60,
        timeFormatted: "20 minut",
        icon: "❤️",
        category: "serce",
        description: "Zaledwie 20 minut po zgaszeniu ostatniego papierosa tętno oraz ciśnienie tętnicze krwi zaczynają wracać do normy. Naczynia krwionośne przestają się kurczyć pod wpływem nikotyny, a temperatura Twoich dłoni i stóp wzrasta.",
        scientificBenefit: "Spadek obciążenia lewej komory serca o około 15%."
      },
      {
        id: "c_8h",
        title: "Spadek tlenku węgla (CO) i dotlenienie komórek",
        shortTitle: "Tlenek węgla (CO)",
        timeSeconds: 8 * 60 * 60,
        timeFormatted: "8 godzin",
        icon: "🫁",
        category: "krew",
        description: "Trujący tlenek węgla (czad) uwalnia się z hemoglobiny. Poziom CO we krwi spada o ponad 50%, a nasycenie krwi tlenem (saturacja) wraca do idealnego poziomu fizjologicznego. Twoje mięśnie i mózg otrzymują pełną dawkę życiodajnego tlenu.",
        scientificBenefit: "Zwiększenie saturacji tlenu (SpO2) o 2-4 punkty procentowe."
      },
      {
        id: "c_24h",
        title: "Gwałtowny spadek ryzyka ostrego zawału serca",
        shortTitle: "Ryzyko zawału spada",
        timeSeconds: 24 * 60 * 60,
        timeFormatted: "24 godziny (1 doba)",
        icon: "⚡",
        category: "serce",
        description: "Jedna pełna doba! Prawdopodobieństwo wystąpienia nagłego zawału mięśnia sercowego zaczyna gwałtownie spadać. Płuca rozpoczynają wielkie sprzątanie – zaczynają usuwać nagromadzony śluz, pył i resztki dymu tytoniowego.",
        scientificBenefit: "Zmniejszenie agregacji płytek krwi i skłonności do zakrzepów."
      },
      {
        id: "c_48h",
        title: "Nikotyna = 0% we krwi & Odrodzenie zmysłów",
        shortTitle: "Koniec nikotyny we krwi",
        timeSeconds: 48 * 60 * 60,
        timeFormatted: "48 godzin (2 dni)",
        icon: "👃",
        category: "zmysły",
        description: "Przełomowy moment! Nikotyna została w 100% zmetabolizowana i wydalona z Twojego krwioobiegu. Uszkodzone zakończenia nerwowe w nosie i na języku zaczynają się regenerować. Kawa, owoce i zapach świeżego powietrza smakują i pachną intensywniej niż kiedykolwiek!",
        scientificBenefit: "Wzrost wrażliwości kubków smakowych o ponad 40%."
      },
      {
        id: "c_72h",
        title: "Rozkurcz oskrzeli i szczyt naturalnej energii",
        shortTitle: "Łatwiejsze oddychanie",
        timeSeconds: 72 * 60 * 60,
        timeFormatted: "72 godziny (3 dni)",
        icon: "💨",
        category: "płuca",
        description: "Fizyczny szczyt głodu minął! Twoje oskrzela i pęcherzyki płucne rozluźniają się, co ułatwia głęboki oddech. Zwiększa się objętość płuc, a wchodzenie po schodach przestaje wywoływać zadyszkę. Poziom naturalnej energii wzrasta.",
        scientificBenefit: "Wzrost FEV1 (natężonej objętości wydechowej pierwszosekundowej)."
      },
      {
        id: "c_1w",
        title: "Pierwszy tydzień wolności & Koniec fizycznego głodu",
        shortTitle: "1 tydzień wolności",
        timeSeconds: 7 * 24 * 60 * 60,
        timeFormatted: "7 dni",
        icon: "🛡️",
        category: "ogólne",
        description: "Badania dowodzą, że osoby, które wytrzymały pierwsze 7 dni bez papierosa, mają aż 9-krotnie większe szanse na trwałe pożegnanie z nałogiem na całe życie! Twój sen staje się głębszy, a poranki są pozbawione poczucia ciężkości w klatce piersiowej.",
        scientificBenefit: "Unormowanie poziomu dopaminy w układzie nagrody."
      },
      {
        id: "c_2w",
        title: "Radykalna poprawa krążenia obwodowego",
        shortTitle: "Lepsze krążenie",
        timeSeconds: 14 * 24 * 60 * 60,
        timeFormatted: "14 dni (2 tygodnie)",
        icon: "🩸",
        category: "krew",
        description: "Krew płynie swobodnie nawet do najmniejszych naczyń włosowatych. Twoja skóra odzyskuje zdrowy, promienny koloryt, cienie pod oczami bledną, a komórki skóry są lepiej nawodnione i dotlenione.",
        scientificBenefit: "Wzrost przepływu krwi w naczyniach mikroskopowych o 25-30%."
      },
      {
        id: "c_1m",
        title: "Regeneracja rzęsek w płucach & Oczyszczenie dróg oddechowych",
        shortTitle: "Odbudowa rzęsek płucnych",
        timeSeconds: 30 * 24 * 60 * 60,
        timeFormatted: "1 miesiąc",
        icon: "🌲",
        category: "płuca",
        description: "Kluczowy proces: mikroskopijne rzęski (cilia) wyściełające Twoje drogi oddechowe w pełni odrastają i odzyskują zdolność falowania! Zaczynają aktywnie wymiatać zalegające toksyny, pył i śluz. Kaszel palacza i duszności całkowicie ustępują, a płuca stają się odporne na infekcje.",
        scientificBenefit: "Pełne przywrócenie transportu śluzowo-rzęskowego (mucociliary clearance)."
      },
      {
        id: "c_3m",
        title: "Wzrost wydolności płuc do 30% i stabilizacja nastroju",
        shortTitle: "Wydolność płuc +30%",
        timeSeconds: 90 * 24 * 60 * 60,
        timeFormatted: "3 miesiące",
        icon: "🏃",
        category: "płuca",
        description: "Pojemność życiowa płuc wzrasta nawet o 30%. Bieg, rower czy intensywny trening nie sprawiają problemu. Neurobiologicznie receptory nikotynowe w mózgu (nAChR) uległy wygaszeniu do poziomu osoby niepalącej. Nie potrzebujesz już nikotyny, by radzić sobie ze stresem.",
        scientificBenefit: "Zmniejszenie gęstości receptorów nikotynowych w korze mózgowej."
      },
      {
        id: "c_6m",
        title: "Odzyskanie spokoju psychicznego & Czyste oskrzela",
        shortTitle: "Spadek stresu i lęku",
        timeSeconds: 180 * 24 * 60 * 60,
        timeFormatted: "6 miesięcy",
        icon: "🧘",
        category: "ogólne",
        description: "Wbrew powszechnemu mitowi, palacze doświadczają przewlekłego podwyższonego poziomu lęku i stresu. Po 6 miesiącach bez dymu Twój średni poziom kortyzolu jest znacznie niższy niż w czasach palenia. Zapomniałeś już o panicznym szukaniu paczki w kieszeni.",
        scientificBenefit: "Obniżenie spoczynkowego poziomu hormonów stresu o 20%."
      },
      {
        id: "c_1y",
        title: "Ryzyko choroby wieńcowej serca spada o 50%!",
        shortTitle: "Ryzyko choroby serca -50%",
        timeSeconds: 365 * 24 * 60 * 60,
        timeFormatted: "1 rok",
        icon: "🏆",
        category: "serce",
        description: "Wielkie medyczne święto! Ryzyko rozwoju choroby niedokrwiennej serca oraz zawału spada o całą połowę w porównaniu z osobą kontynuującą palenie. Twoje serce zostało dosłownie uratowane przed miażdżycą wywołaną toksynami.",
        scientificBenefit: "Cofnięcie wczesnych zmian zapalnych w śródbłonku tętnic."
      },
      {
        id: "c_5y",
        title: "Ryzyko udaru mózgu równe osobie niepalącej",
        shortTitle: "Ryzyko udaru = niepalący",
        timeSeconds: 5 * 365 * 24 * 60 * 60,
        timeFormatted: "5 lat",
        icon: "🧠",
        category: "ogólne",
        description: "Ryzyko udaru mózgu spada do poziomu osoby, która nigdy w życiu nie zapaliła papierosa! Ponadto ryzyko raka jamy ustnej, gardła, krtani i pęcherza moczowego zmniejsza się aż o 50%.",
        scientificBenefit: "Pełna regeneracja elastyczności naczyń mózgowych."
      },
      {
        id: "c_10y",
        title: "Ryzyko raka płuc spada o ponad 50%",
        shortTitle: "Ryzyko raka płuc -50%",
        timeSeconds: 10 * 365 * 24 * 60 * 60,
        timeFormatted: "10 lat",
        icon: "🧬",
        category: "płuca",
        description: "Ryzyko zgonu z powodu raka płuc jest o połowę niższe niż u palacza. Komórki z mutacjami przednowotworowymi zostały w większości zastąpione nowymi, zdrowymi komórkami nabłonka.",
        scientificBenefit: "Spadek ryzyka nowotworów trzustki, nerek i pęcherza."
      },
      {
        id: "c_15y",
        title: "Serce jak u człowieka, który nigdy nie palił",
        shortTitle: "Pełne zrównanie z niepalącym",
        timeSeconds: 15 * 365 * 24 * 60 * 60,
        timeFormatted: "15 lat",
        icon: "👑",
        category: "serce",
        description: "Ostateczne zwycięstwo! Ryzyko choroby wieńcowej serca i nagłego zgonu z przyczyn sercowo-naczyniowych jest identyczne jak u osoby, która nigdy nie trzymała papierosa w ustach. Twoje ciało całkowicie się odrodziło.",
        scientificBenefit: "Maksymalna oczekiwana długość życia odzyskana."
      }
    ],

    // Mity o Paleniu Tradycyjnym
    mythsVsFacts: [
      {
        myth: "Papieros pomaga mi się zrelaksować i radzić sobie ze stresem.",
        fact: "FAŁSZ: Nikotyna to silny stymulant, który podnosi tętno i ciśnienie krwi. Pozorne 'rozluźnienie' to wyłącznie zaspokojenie głodu nikotynowego wywołanego przez spadek poziomu leku po poprzednim papierosie. Osoby niepalące mają statystycznie niższy poziom stresu niż palacze!"
      },
      {
        myth: "Paliłem tak długo, że moje płuca i tak się już nie zregenerują.",
        fact: "FAŁSZ: Ludzkie ciało posiada zdumiewające zdolności regeneracyjne. Już po miesiącu odrastają rzęski w płucach, a po roku ryzyko chorób serca spada o 50%. Korzyści zdrowotne pojawiają się bez względu na to, ile lat paliłeś."
      },
      {
        myth: "Jeden mały papieros do kawy lub piwa nic nie zepsuje.",
        fact: "FAŁSZ: 'Tylko jeden dymek' to najczęstsza pułapka nawrotu. Jeden papieros natychmiast reaktywuje do 50% uśpionych receptorów nikotynowych w mózgu i zmusza organizm do przejścia przez fizyczny głód od nowa. Powiedz sobie: 'Zero kompromisów'."
      },
      {
        myth: "Po rzuceniu palenia na pewno drastycznie przytyję.",
        fact: "FAŁSZ: Przybieranie na wadze wynika z mylenia głodu nikotynowego z głodem żołądkowym i 'zajadania' nudy. Trzymając pod ręką szklankę wody, gumy do żucia oraz świeże warzywa, zachowasz idealną wagę."
      },
      {
        myth: "Lekkie papierosy (Slim / Light) są mniej szkodliwe.",
        fact: "FAŁSZ: Palacze papierosów 'light' zaciągają się mocniej i głębiej, aby dostarczyć organizmowi wymaganą dawkę nikotyny. Toksyczne substancje smoliste wnikają wtedy jeszcze głębiej w pęcherzyki płucne."
      }
    ],

    tips: [
      {
        title: "Głębokie oddychanie (Metoda 4-7-8)",
        desc: "Wdychaj powietrze przez nos przez 4 sekundy, zatrzymaj na 7 sekund, powoli wydychaj ustami przez 8 sekund. Obniża puls w 60 sekund."
      },
      {
        title: "Szklanka lodowatej wody przez rurkę",
        desc: "Zaspokaja nawyk oralny dłoni i ust, a zimna woda pobudza nerw błędny, natychmiast wyciszając układ współczulny."
      },
      {
        title: "Zmień natychmiast otoczenie",
        desc: "Jeśli głód dopadł Cię przy biurku lub w fotelu – wstań, wyjdź do innego pokoju, umyj zęby lub wyjdź na 5-minutowy energiczny spacer."
      },
      {
        title: "Zajmij dłonie",
        desc: "Skorzystaj z wirtualnego pękacza bąbelków w zakładce SOS, użyj antystresowej piłeczki lub kostki Rubika."
      }
    ]
  },

  // ========================================================================
  // KATEGORIA 2: E-PAPIEROSY / VAPING (SOLE NIKOTYNOWE, PODY, LIQUIDY)
  // ========================================================================
  vape: {
    id: "vape",
    name: "E-papierosy & Vaping",
    shortName: "E-papierosy",
    icon: "💨",
    accentColor: "#8b5cf6",
    themeClass: "theme-vape",
    statusText: "Wolny od aerozoli i soli nikotynowych",
    quitActionLabel: "Schowałem e-papierosa i liquidy już teraz!",
    defaultSettings: {
      quitDate: "2026-10-19T00:00:00",
      bottlePrice10ml: 18.00, // PLN za buteleczkę 10ml liquidu (lub koszt 1 jednorazówki/wkładu)
      mlPerDay: 3.5, // ml płynu wypalanego dziennie (np. 1 buteleczka 10ml na niecałe 3 dni)
      nicotineStrengthMg: 18, // moc w mg/ml (np. 18-20 mg sól nikotynowa lub 6-12 mg freebase)
      puffsPerDay: 350, // szacowana liczba zaciągnięć (puffów) dziennie
      currency: "zł",
      yearsVaped: 3
    },

    // 10 Dedykowanych Medycznych Etapów Regeneracji po Rzuceniu E-papierosów
    healthMilestones: [
      {
        id: "v_20m",
        title: "Spadek nagłego uderzenia ciśnienia po soli nikotynowej",
        shortTitle: "Tętno i skurcz naczyń",
        timeSeconds: 20 * 60,
        timeFormatted: "20 minut",
        icon: "❤️",
        category: "serce",
        description: "Sole nikotynowe wchłaniają się do krwioobiegu w 7 sekund, wywołując gwałtowny skurcz mikronaczyń. Zaledwie 20 minut po odstawieniu e-papierosa tętno stabilizuje się, a naczynia wieńcowe rozszerzają się, przywracając prawidłowy dopływ tlenu do serca.",
        scientificBenefit: "Spadek stężenia katecholamin (adrenaliny i noradrenaliny) we krwi o 20%."
      },
      {
        id: "v_12h",
        title: "Normalizacja tlenku azotu (NO) & Regeneracja śródbłonka",
        shortTitle: "Naprawa naczyń krwionośnych",
        timeSeconds: 12 * 60 * 60,
        timeFormatted: "12 godzin",
        icon: "🩸",
        category: "krew",
        description: "Aerozol z e-papierosów hamuje produkcję tlenku azotu (NO) – kluczowej cząsteczki rozszerzającej naczynia. Po 12 godzinach komórki śródbłonka naczyniowego rozpoczynają intensywną autonaprawę. Krew znowu swobodnie dociera do mózgu.",
        scientificBenefit: "Poprawa wskaźnika rozszerzalności zależnej od przepływu (FMD) w tętnicach."
      },
      {
        id: "v_24h",
        title: "Ustąpienie podrażnienia gardła i suchości śluzówki (Vape Throat)",
        shortTitle: "Koniec podrażnienia gardła",
        timeSeconds: 24 * 60 * 60,
        timeFormatted: "24 godziny (1 doba)",
        icon: "💧",
        category: "zmysły",
        description: "Glikol propylenowy (PG) i gliceryna roślinna (VG) to silne substancje higroskopijne, które drastycznie odwadniają nabłonek gardła i krtani. Po 24 godzinach bez oparów błona śluzowa odzyskuje naturalną barierę ochronną, a uporczywe drapanie i poranna chrypa znikają.",
        scientificBenefit: "Przywrócenie prawidłowego pH i nawilżenia śluzówki jamy ustnej."
      },
      {
        id: "v_48h",
        title: "Sole nikotynowe = 0% & Likwidacja 'Vaper’s Tongue'",
        shortTitle: "Smak i węch wracają do normy",
        timeSeconds: 48 * 60 * 60,
        timeFormatted: "48 godzin (2 dni)",
        icon: "👅",
        category: "zmysły",
        description: "Koniec zjawiska 'Vaper’s Tongue' (utraty smaku spowodowanej chemicznym przebodźcowaniem sztucznymi aromatami owocowymi i chłodzikami WS-23). Sole nikotynowe zostały w 100% zmetabolizowane przez wątrobę i nerki. Naturalne jedzenie zaczyna smakować wielowymiarowo!",
        scientificBenefit: "Pełny reset receptorów smakowych i węchowych."
      },
      {
        id: "v_72h",
        title: "Pęcherzyki płucne wolne od mikrokropelek glikolu i gliceryny",
        shortTitle: "Lżejsze, głębokie oddychanie",
        timeSeconds: 72 * 60 * 60,
        timeFormatted: "72 godziny (3 dni)",
        icon: "💨",
        category: "płuca",
        description: "Płuca przestają być zalewane chemicznym aerozolem. Ścianki pęcherzyków płucnych oczyszczają się z mikroskopijnych warstw kondensatu glikolowego, co umożliwia swobodną dyfuzję tlenu. Znika uczucie ciężaru i ucisku w klatce piersiowej.",
        scientificBenefit: "Zwiększenie objętości oddechowej płuc i spadek oporu dróg oddechowych."
      },
      {
        id: "v_2w",
        title: "Oczyszczenie płuc z metali ciężkich (Nikiel, Chrom, Ołów)",
        shortTitle: "Usunięcie pyłów z grzałki",
        timeSeconds: 14 * 24 * 60 * 60,
        timeFormatted: "14 dni (2 tygodnie)",
        icon: "🛡️",
        category: "płuca",
        description: "Badania spektrometryczne dowodzą, że grzałki e-papierosów uwalniają nanocząstki metali (nikiel, ołów, cyna, chrom). Po 2 tygodniach drogi oddechowe skutecznie usuwają te toksyczne osady. Ustępuje poranny świszczący oddech i płytki odruch kaszlu.",
        scientificBenefit: "Spadek poziomu markerów stanu zapalnego (IL-6, TNF-alpha) w oskrzelach."
      },
      {
        id: "v_1m",
        title: "Pełna regeneracja makrofagów płucnych & Ochrona przed EVALI",
        shortTitle: "Odzyskana odporność płuc",
        timeSeconds: 30 * 24 * 60 * 60,
        timeFormatted: "1 miesiąc",
        icon: "🌲",
        category: "płuca",
        description: "Aerozol z e-papierosów paraliżował makrofagi pęcherzykowe – główne komórki układu odpornościowego w płucach. Po miesiącu odzyskują one 100% sprawności w pożeraniu bakterii i wirusów. Ryzyko ostrego uszkodzenia płuc wywołanego e-papierosami (EVALI) spada niemal do zera.",
        scientificBenefit: "Normalizacja zdolności fagocytarnej makrofagów pęcherzykowych."
      },
      {
        id: "v_3m",
        title: "Neurobiologiczny reset mózgu & Koniec 'odruchu smoczka'",
        shortTitle: "Wygaszenie receptorów w mózgu",
        timeSeconds: 90 * 24 * 60 * 60,
        timeFormatted: "3 miesiące",
        icon: "🧠",
        category: "ogólne",
        description: "Użytkownicy e-papierosów zmagają się z silnym uzależnieniem behawioralnym – sięganiem po urządzenie co 2-3 minuty (tzw. 'smoczek dla dorosłych'). Po 3 miesiącach gęstość receptorów nikotynowych w korze mózgowej wraca do normy. Odzyskujesz pełne skupienie, a Twój sen staje się głęboki i nieprzerywany.",
        scientificBenefit: "Zmniejszenie gęstości receptorów nAChR i wyrównanie poziomu dopaminy."
      },
      {
        id: "v_6m",
        title: "Oskrzeliki wolne od przewlekłego stanu zapalnego",
        shortTitle: "Koniec ryzyka Popcorn Lung",
        timeSeconds: 180 * 24 * 60 * 60,
        timeFormatted: "6 miesięcy",
        icon: "🏃",
        category: "płuca",
        description: "Aromaty chemiczne (w tym dwuacetyl i aldehydy) wywołują zwężenie najdrobniejszych oskrzelików. Po 6 miesiącach bez vapingu tkanka płucna w pełni się goi. Wydolność tlenowa przy bieganiu, rowerze czy pływaniu wzrasta o 25-30%.",
        scientificBenefit: "Ochrona przed zarostowym zapaleniem oskrzelików (tzw. płucem popcornowym)."
      },
      {
        id: "v_1y",
        title: "Serce, naczynia i płuca jak u człowieka, który nigdy nie wapował",
        shortTitle: "Pełna wolność od chemii",
        timeSeconds: 365 * 24 * 60 * 60,
        timeFormatted: "1 rok",
        icon: "👑",
        category: "serce",
        description: "Wielkie medyczne zwycięstwo! Ryzyko mikroudarów mózgu, uszkodzenia zastawek serca i przewlekłego stanu zapalnego tętnic wraca do poziomu osoby wolnej od nałogów. Twój układ oddechowy i nerwowy są czyste i w pełni odrodzone.",
        scientificBenefit: "Maksymalna elastyczność naczyń i całkowite odtrucie tkanek."
      }
    ],

    // Mity o E-papierosach i Vapingu
    mythsVsFacts: [
      {
        myth: "E-papieros to tylko nieszkodliwa para wodna i zapach owoców.",
        fact: "FAŁSZ: To nie para wodna, lecz gęsty chemiczny aerozol zawierający glikol propylenowy, glicerynę, toksyczne aldehydy (formaldehyd, akroleinę) oraz podgrzane nanocząstki metali ciężkich z grzałki (nikiel, ołów, chrom, cyna)."
      },
      {
        myth: "E-papierosy są bezpieczniejsze, więc mogę zaciągać się bez przerwy w pokoju i przy komputerze.",
        fact: "FAŁSZ: Brak dymu i popiołu prowadzi do zjawiska 'chain-vaping' (ciągłego trzymania urządzenia w ustach jak smoczek). W rezultacie vaperzy dostarczają do mózgu wielokrotnie wyższe dawki czystej nikotyny na dobę niż tradycyjni palacze, co buduje potężniejsze uzależnienie psychiczne i fizyczne."
      },
      {
        myth: "Sól nikotynowa (Nic Salt) jest łagodniejsza i zdrowsza dla organizmu.",
        fact: "FAŁSZ: Sole nikotynowe mają obniżone pH dzięki dodatkowi kwasu benzoesowego. Dzięki temu nie drapią w gardło ('throat hit'), co pozwala producentom pakować ogromne dawki (np. 20 mg/ml), które wchłaniają się do mózgu w 7 sekund – szybciej i agresywniej niż jakikolwiek papieros!"
      },
      {
        myth: "Kolorowe jednorazówki to nowoczesny, nieszkodliwy gadżet lifestylowy.",
        fact: "FAŁSZ: Jednorazówki zawierają maksymalne dopuszczalne dawki soli nikotynowej, syntetyczne chłodziki (WS-23) znieczulające krtań oraz często słabej jakości grzałki, które przy końcówce płynu przypalają watę, wydzielając rakotwórczy tlenek węgla i akroleinę."
      },
      {
        myth: "Vaping nie ma żadnego wpływu na zęby, dziąsła i cerę.",
        fact: "FAŁSZ: Glikol i gliceryna silnie wysuszają jamę ustną (kserostomia), niszcząc naturalną florę bakteryjną śliny. Sprzyja to szybkiemu rozwojowi próchnicy, zapaleniu dziąseł, cofaniu się linii dziąseł i nieświeżemu oddechowi."
      }
    ],

    tips: [
      {
        title: "Przełam odruch dłoń-usta (Hand-to-mouth reflex)",
        desc: "Vaperzy dotykają ust urządzeniem setki razy dziennie. Trzymaj w dłoni butelkę z wodą ze słomką, antystresową piłeczkę lub żuj wykałaczkę miętową."
      },
      {
        title: "Wyrzuć cały sprzęt, kable i liquidy",
        desc: "Nie zostawiaj poda w szufladzie 'na czarną godzinę'. Jeśli urządzenie leży w zasięgu ręki, impuls pokona silną wolę. Wyrzuć je lub oddaj do punktu elektrośmieci."
      },
      {
        title: "Żuj mocne gumy mentolowe lub cynamonowe",
        desc: "Dają intensywne uczucie orzeźwienia i chłodu w gardle ('throat hit'), którego mózg szukał w aerozolu z e-papierosa – ale bez chemii i nikotyny."
      },
      {
        title: "Pij 2-3 litry wody dziennie",
        desc: "Glikol propylenowy silnie odwadniał Twój organizm. Picie wody przyspiesza wypłukiwanie metabolitów nikotyny i nawadnia wysuszoną śluzówkę gardła."
      }
    ]
  },

  // ========================================================================
  // WSPÓLNE DANE DLA OBU KATEGORII
  // ========================================================================
  shared: {
    // Uniwersalna baza cytatów motywacyjnych
    motivationalQuotes: [
      {
        text: "Nikotyna niczego Ci nie daje. Ona tylko na krótką chwilę łagodzi głód i niepokój, który sama przed chwilą wywołała.",
        author: "Allen Carr",
        category: "psychologia"
      },
      {
        text: "Największą potęgą człowieka jest panowanie nad samym sobą. Kto pokonał siebie, pokonał cały świat.",
        author: "Seneka Młodszy",
        category: "stoicyzm"
      },
      {
        text: "Głód nikotynowy to tylko fala na oceanie. Rośnie, osiąga szczyt, a potem sama opada. Nie musisz z nią walczyć – wystarczy, że na niej przepłyniesz.",
        author: "Technika Urge Surfing (Mindfulness)",
        category: "technika"
      },
      {
        text: "Każda niewypalona sztuka i każdy odrzucony puff to mała cegiełka do Twojego nowego, czystego życia. Bądź dumny z każdej minuty wolności.",
        author: "Psychologia Behawioralna",
        category: "motywacja"
      },
      {
        text: "Nie rezygnujesz z żadnej nagrody ani przyjemności. Odzyskujesz wolność, zapach, zdrowie, szacunek do siebie i pieniądze.",
        author: "Neurobiologia Uzależnień",
        category: "psychologia"
      },
      {
        text: "Zamiast myśleć: 'Już nigdy w życiu', powiedz sobie: 'Nie zapalę dzisiaj. W tej jednej godzinie wybieram czysty oddech'.",
        author: "Zasada Jednego Dnia",
        category: "technika"
      },
      {
        text: "Twoje ciało ma niezwykłą zdolność samoleczenia. Daj mu tylko spokój, a ono naprawi szkody wyrządzone dymem i aerozolami.",
        author: "Medycyna Regeneracyjna",
        category: "zdrowie"
      },
      {
        text: "Prawdziwa odwaga to nie brak pokus, lecz działanie wbrew nim.",
        author: "Marek Aureliusz",
        category: "stoicyzm"
      },
      {
        text: "Głód nikotynowy trwa zazwyczaj od 3 do 5 minut. Wypij szklankę zimnej wody, weź 10 głębokich oddechów i spójrz na zegarek – fala minie.",
        author: "Złota Zasada 3 Minut",
        category: "technika"
      },
      {
        text: "Nie jesteś osobą, która próbuje rzucić. Jesteś osobą niepalącą, która z szacunkiem dba o swoje serce, mózg i płuca.",
        author: "James Clear ('Atomowe Nawyki')",
        category: "tożsamość"
      },
      {
        text: "Najlepszy moment na zmianę był rok temu. Drugi najlepszy moment jest TERAZ.",
        author: "Mądrość Wschodu",
        category: "motywacja"
      },
      {
        text: "Zaoszczędzone pieniądze to nie tylko cyfry na koncie – to wolność, podróże i spokój ducha, których nie puścisz z dymem ani z parą.",
        author: "Psychologia Finansowa",
        category: "finanse"
      }
    ],

    // System Grywalizacji - Osiągnięcia i Odznaki
    achievements: [
      {
        id: "ach_start",
        title: "Godzina Zero",
        description: "Podjąłeś decyzję i rozpocząłeś drogę ku wolności.",
        icon: "🚀",
        tier: "bronze",
        checkUnlocked: (stats) => stats.secondsElapsed >= 1
      },
      {
        id: "ach_24h",
        title: "Pierwsza Doba",
        description: "Przetrwałeś pierwsze 24 godziny bez dymu i aerozoli!",
        icon: "⭐",
        tier: "bronze",
        checkUnlocked: (stats) => stats.secondsElapsed >= 24 * 3600
      },
      {
        id: "ach_3d",
        title: "Czysta Krew (Nikotyna 0%)",
        description: "3 dni (72 godziny) – nikotyna w 100% zniknęła z Twojego organizmu.",
        icon: "✨",
        tier: "bronze",
        checkUnlocked: (stats) => stats.secondsElapsed >= 72 * 3600
      },
      {
        id: "ach_7d",
        title: "Tydzień ze Stali",
        description: "Cały tydzień wolności. Twoje szanse na trwały sukces wzrosły 9-krotnie!",
        icon: "🛡️",
        tier: "silver",
        checkUnlocked: (stats) => stats.secondsElapsed >= 7 * 24 * 3600
      },
      {
        id: "ach_14d",
        title: "Świeży Oddech",
        description: "2 tygodnie bez zaciągania. Lepsze krążenie i dotlenienie komórek.",
        icon: "💎",
        tier: "silver",
        checkUnlocked: (stats) => stats.secondsElapsed >= 14 * 24 * 3600
      },
      {
        id: "ach_21d",
        title: "Nowy Nawyk Mózgu",
        description: "21 dni – bariera nowego stylu życia bez nikotyny pokonana.",
        icon: "🧠",
        tier: "silver",
        checkUnlocked: (stats) => stats.secondsElapsed >= 21 * 24 * 3600
      },
      {
        id: "ach_1m",
        title: "Oczyszczone Płuca",
        description: "Miesiąc wolności! Regeneracja rzęsek i makrofagów w płucach.",
        icon: "🫁",
        tier: "gold",
        checkUnlocked: (stats) => stats.secondsElapsed >= 30 * 24 * 3600
      },
      {
        id: "ach_3m",
        title: "Mistrz Samokontroli",
        description: "3 miesiące – wydolność oddechowa wzrosła o 30%, wygaszenie receptorów.",
        icon: "🏅",
        tier: "gold",
        checkUnlocked: (stats) => stats.secondsElapsed >= 90 * 24 * 3600
      },
      {
        id: "ach_1y",
        title: "Legenda Wolności",
        description: "Cały rok bez nałogu! Ryzyko powikłań sercowych spadło o połowę.",
        icon: "👑",
        tier: "platinum",
        checkUnlocked: (stats) => stats.secondsElapsed >= 365 * 24 * 3600
      },
      {
        id: "ach_save_100",
        title: "Pierwsza Stówka",
        description: "Zaoszczędziłeś swoje pierwsze 100 zł na czystym oddechu!",
        icon: "💵",
        tier: "bronze",
        checkUnlocked: (stats) => stats.moneySaved >= 100
      },
      {
        id: "ach_save_500",
        title: "Skarbonka Rośnie",
        description: "500 zł zostało w Twoim portfelu zamiast u producentów nikotyny.",
        icon: "💰",
        tier: "silver",
        checkUnlocked: (stats) => stats.moneySaved >= 500
      },
      {
        id: "ach_save_2000",
        title: "Finansowy Geniusz",
        description: "Zaoszczędziłeś ponad 2 000 zł! Czas zrealizować cel ze Skarbca.",
        icon: "🏖️",
        tier: "gold",
        checkUnlocked: (stats) => stats.moneySaved >= 2000
      },
      {
        id: "ach_cravings_5",
        title: "Poskramiacz Fal",
        description: "Przetrwałeś 5 ostrych fal głodu dzięki technice SOS i oddychaniu.",
        icon: "🌊",
        tier: "silver",
        checkUnlocked: (stats) => (stats.cravingsSurfed || 0) >= 5
      }
    ],

    // Domyślne cele na liście marzeń
    defaultGoals: [
      {
        id: "g_1",
        name: "Wykwintna kolacja w restauracji",
        cost: 250,
        icon: "🍽️"
      },
      {
        id: "g_2",
        name: "Bezprzewodowe słuchawki z ANC",
        cost: 700,
        icon: "🎧"
      },
      {
        id: "g_3",
        name: "Weekendowy relaks w hotelu ze SPA",
        cost: 1400,
        icon: "💆"
      },
      {
        id: "g_4",
        name: "Wymarzona podróż lub wakacje",
        cost: 4500,
        icon: "✈️"
      }
    ]
  }
};

// Udostępnij globalnie
window.APP_DATA = APP_DATA;
