export const theory = [
  {
    id: "podprogram",
    title: "Podprogram (Subroutine)",
    desc: "Wydzielony, autonomiczny fragment kodu realizujący określone zadanie, który może być wywoływany wielokrotnie z różnych miejsc programu głównego. Główną zaletą stosowania podprogramów jest optymalizacja i oszczędność pamięci zajmowanej przez program.",
    details: [
      { label: "Punkt wejścia", text: "W języku asemblera początek podprogramu jest jednoznacznie określony przez dedykowaną etykietę." },
      { label: "Adres powrotu", text: "W momencie wywołania podprogramu, na stosie automatycznie zapisywany jest adres komórki pamięci zawierającej kolejną instrukcję programu głównego (PC+2 lub PC+3), do której procesor musi powrócić po zakończeniu podprogramu." },
      { label: "Rozkazy wywołania", text: "Rozkazy BSR (Branch to Subroutine - skok względny) i JSR (Jump to Subroutine - skok bezwarunkowy)." },
      { label: "Rozkaz powrotu", text: "Powrót z podprogramu wykonuje się za pomocą rozkazu RTS (Return from Subroutine) – adres powrotu jest odczytywany ze stosu i wpisywany do rejestru PC." }
    ]
  },
  {
    id: "stos",
    title: "Stos (Stack)",
    desc: "Wydzielony obszar pamięci operacyjnej RAM przeznaczony do tymczasowego przechowywania danych, funkcjonujący w oparciu o architekturę kolejki LIFO (Last In, First Out) – dane zapisane jako ostatnie są odczytywane jako pierwsze.",
    details: [
      { label: "Wskaźnik stosu (SP)", text: "Rejestr procesora (16-bitowy w M6800, 8-bitowy w 8051) wskazujący na aktualny wierzchołek (szczyt) stosu." },
      { label: "Operacje podstawowe", text: "Zapis realizowany jest instrukcją PUSH / PSH (zapisuje akumulator A lub B na stos), a odczyt instrukcją POP / PUL (pobiera dane ze stosu do rejestru)." },
      { label: "Kierunek wzrostu", text: "W procesorach M6800 stos rośnie w dół pamięci. Po zapisie każdego bajtu, wskaźnik SP jest automatycznie dekrementowany. Przy odczycie SP jest inkrementowany po pobraniu bajtu." },
      { label: "Zastosowanie", text: "Przechowywanie adresów powrotu z podprogramów, automatyczna obsługa rejestrów CPU podczas przerwań oraz tymczasowe zapamiętywanie stanów rejestrów przez programistę." }
    ]
  },
  {
    id: "wektor",
    title: "Wektor Przerwań (Interrupt Vector)",
    desc: "Komórka lub obszar w pamięci o stałym adresie fizycznym, w którym zapisany jest adres podprogramu obsługi danego przerwania (ISR - Interrupt Service Routine).",
    details: [
      { label: "Przeznaczenie", text: "Pozwala na obsługę nieprzewidywalnych w czasie sygnałów zewnętrznych lub wewnętrznych." },
      { label: "Sekwencja sprzętowa", text: "1. Flaga przerwania wchodzi w stan aktywny. 2. Wykonywanie programu jest wstrzymywane po bieżącej instrukcji. 3. Rejestry procesora są automatycznie odkładane na stos. 4. Procesor odczytuje adres ISR z wektora przerwań. 5. Następuje skok do ISR. 6. Instrukcja powrotu z przerwania (RTI / RETI) zdejmuje rejestry ze stosu i wznawia program." },
      { label: "Lokalizacja", text: "Wektory znajdują się w ustalonym obszarze pamięci RAM/ROM (np. na końcu przestrzeni adresowej)." }
    ]
  }
];

export const addressingModes = {
  mc6800: [
    {
      name: "Adresowanie podwójne (MC6800)",
      desc: "Specyficzny tryb kombinowany, w którym pierwszym operandem jest domyślnie akumulator (A lub B). Drugi operand jest wyznaczany za pomocą innego, standardowego trybu (natychmiastowego, bezpośredniego, rozszerzonego lub indeksowego).",
      example: "LDAA $25",
      comment: "przykład wykorzystania akumulatora A oraz adresu $25"
    },
    {
      name: "Adresowanie akumulatorów (MC6800)",
      desc: "Instrukcje jednobajtowe, gdzie operand znajduje się bezpośrednio w akumulatorze A lub B. Operacja ta wykonywana jest na rejestrze wewnętrznym A lub B. Dla instrukcji ściągania/wkładania na stos (PUL, PSH) jest to jedyny dostępny tryb.",
      example: "CLRA",
      comment: "wyczyszczenie akumulatora A"
    },
    {
      name: "Adresowanie Rejestrowe / Wewnętrzne / Inherent (MC6800)",
      desc: "Operand znajduje się wewnątrz określonego rejestru procesora, a informacja o nim jest sztywno zaszyta w samej mnemonice instrukcji. Operacja wykonywana jest na rejestrach specjalnych procesora (PC, SP, X). Rozkaz jest jednobajtowy, a procesor nie musi pobierać adresu z pamięci.",
      example: "INX",
      comment: "zwiększenie rejestru indeksowego X o 1"
    },
    {
      name: "Adresowanie Natychmiastowe / Immediate (MC6800)",
      desc: "Argumentem (dana stała) jest stała wartość liczbowa zapisana bezpośrednio zaraz za kodem operacji w pamięci ROM na kolejnych bajtach kodu operacji (2. lub 3. bajt). W asemblerze tryb ten rozpoznawany i oznaczany jest po znaku #.",
      example: "LDAA #$55",
      comment: "załaduj do akumulatora A wartość szesnastkową 55"
    },
    {
      name: "Adresowanie Bezpośrednie / Direct (MC6800)",
      desc: "Argumentem jest 8-bitowy adres pamięci (od $00 do $FF). Drugi bajt instrukcji zawiera pełny adres komórki pamięci. Pozwala to na szybki dostęp do tzw. strony zerowej pamięci RAM (gdzie starszy bajt adresu wynosi zawsze 00h), co przyspiesza wykonanie programu.",
      example: "LDAA $25",
      comment: "załaduj do A zawartość pamięci o adresie $0025"
    },
    {
      name: "Adresowanie Rozszerzone / Extended (MC6800)",
      desc: "Argumentem jest pełny, 16-bitowy adres absolutny pamięci (od $0000 do $FFFF). Instrukcja zawiera pełny, 16-bitowy adres fizyczny operandu umieszczony na drugim i trzecim bajcie instrukcji. Rozkaz jest trzybajtowy i pozwala na dostęp do pełnego obszaru pamięci.",
      example: "LDAB $2004",
      comment: "załaduj do B zawartość komórki o adresie $2004"
    },
    {
      name: "Adresowanie Indeksowe / Indexed (MC6800)",
      desc: "Adres efektywny operandu powstaje poprzez zsumowanie zawartości rejestru indeksowego (np. IX) z przesunięciem (offsetem) podanym w instrukcji. W asemblerze tryb ten oznaczany jest przez ,X lub sam symbol X.",
      example: "LDAA 5,X",
      comment: "załaduj do A zawartość pamięci spod adresu: rejestr X + 5"
    },
    {
      name: "Adresowanie Względne / Relative (MC6800)",
      desc: "Stosowane wyłącznie przy skokach (np. BRA, BSR) i skokach lokalnych. Adres docelowy wyznaczany jest jako 8-bitowe przesunięcie ze znakiem (offset w kodzie U2) względem aktualnej wartości licznika rozkazów (PC). Wyliczany jest według wzoru D = (PC + 2) + R, gdzie D to adres docelowy, PC to adres rozkazu, a R to przesunięcie. Zasięg skoku wynosi od -128 do +127 bajtów od adresu następnej instrukcji.",
      example: "BRA TARGET",
      comment: "skok bezwarunkowy do etykiety TARGET"
    },
    {
      name: "IMM, immediate - Natychmiastowe (M68HC05)",
      desc: "Tryb adresowania dla procesora Motorola 68HC05. Argument znajduje się bezpośrednio w kodzie programu.",
      example: "LDA #$55",
      comment: "załadowanie liczby 55H do akumulatora"
    },
    {
      name: "INH, inherent - Rejestrowe (M68HC05)",
      desc: "Tryb bez argumentów (dotyczy rejestrów CPU). Źródło i przeznaczenie określone są przez sam kod rozkazu.",
      example: "INCA",
      comment: "zwiększenie akumulatora o 1"
    },
    {
      name: "EXT, extended - Rozszerzone (M68HC05)",
      desc: "Tryb adresowania dla procesora Motorola 68HC05. Wykorzystuje 16-bitowy adres argumentu.",
      example: "LDA $3FF",
      comment: "załadowanie wartości komórki o adresie 03FFH do akumulatora"
    },
    {
      name: "DIR, direct page - Bezpośrednie (M68HC05)",
      desc: "Tryb adresowania dla procesora Motorola 68HC05. Wykorzystuje 8-bitowy adres argumentu.",
      example: "LDA $FF",
      comment: "załadowanie wartości komórki o adresie 00FFH do akumulatora"
    },
    {
      name: "IX, indexed - Indeksowe (M68HC05)",
      desc: "Rejestr X służy jako wskaźnik argumentu. Może występować jako tryb indeksowy z 0-, 1-, lub 2-bajtowym offsetem (przesunięciem).",
      example: "LDA 2,X",
      comment: "załadowanie wartości komórki o adresie będącym zawartością X zwiększonym o 2 do akumulatora"
    },
    {
      name: "REL, relative - Względne (M68HC05)",
      desc: "Tryb adresowania dla procesora Motorola 68HC05. Adres wynikowy liczony jest względem licznika PC. Wykorzystuje 8-bitowy offset ze znakiem i używany jest tylko w instrukcjach typu branch.",
      example: "BRA $7F",
      comment: "skok do instrukcji o adresie PC+2+$7F"
    }
  ],
  intel8051: [
    {
      name: "Adresowanie rejestrowe (Intel 8051)",
      desc: "Operandem instrukcji jest jeden z rejestrów R0..R7 z aktywnego banku rejestrów, akumulator, rejestr B lub wskaźnik danych DPTR. Operacje wykonywane są bezpośrednio na rejestrach roboczych procesora (np. ACC, DPTR, lub R0 do R7 z aktualnie wybranego banku rejestrów).",
      example: "MOV A, R0",
      comment: "przeniesienie zawartości rejestru R0 do akumulatora"
    },
    {
      name: "Adresowanie bezpośrednie (Intel 8051)",
      desc: "Operand jest jawnie podanym 8-bitowym adresem rejestru SFR, rejestru dolnego obszaru RAM lub bitu adresowalnego bezpośrednio. Adres komórki jest podany wprost w kodzie instrukcji. Umożliwia dostęp do pełnego obszaru wewnętrznego RAM (00h-FFh). W zakresie 0-127 (00h-7Fh) adresuje pamięć danych użytkownika, natomiast w zakresie 128-255 (80h-FFh) zapewnia wyłączny dostęp do rejestrów specjalnych (SFR).",
      example: "MOV A, 032H",
      comment: "przeniesienie zawartości komórki o adresie 032H do akumulatora"
    },
    {
      name: "Adresowanie natychmiastowe (Intel 8051)",
      desc: "Operand jest stałą (8 lub 16 bit.) umieszczoną w kodzie programu (pamięć ROM). Wartość stała zapisana jest bezpośrednio w pamięci programu jako część instrukcji, poprzedzana znakiem #.",
      example: "ADD A, #32H",
      comment: "dodanie do akumulatora liczby 32H"
    },
    {
      name: "Adresowanie pośrednie (Intel 8051)",
      desc: "Określenie adresu za pomocą zawartości R0 lub R1 (z aktywnego banku rejestrów) – odwołanie do przestrzeni 256 bajtów. Rejestr wskazuje nie na samą daną, lecz na adres komórki pamięci, w której ta dana się znajduje. Oznaczane symbolem @. Dla wewnętrznej pamięci RAM rolę wskaźników mogą pełnić wyłącznie rejestry R0 i R1, a dla pamięci zewnętrznej — 16-bitowy rejestr DPTR.",
      example: "MOV A, @R0",
      comment: "przeniesienie zawartości komórki o adresie zawartym w rejestrze R0 do akumulatora"
    },
    {
      name: "Adresowanie sumą zawartości rejestru bazowego i indeksowego (Intel 8051)",
      desc: "Służy do kopiowania bajtu z pamięci programu (ROM). Adres efektywny wyznaczany jest jako suma zawartości rejestru bazowego i indeksowego (A + DPTR lub A + PC).",
      example: "MOVC A, @A+DPTR",
      comment: "przeniesienie zawartości komórki pamięci programu o adresie zawartość A + DPTR do akumulatora"
    },
    {
      name: "Adresowanie względne / Relative (Intel 8051)",
      desc: "Wykorzystywane przy instrukcjach skoków i rozgałęzień. Adres docelowy obliczany jest dynamicznie jako suma aktualnego stanu Licznika Rozkazów (PC) oraz przesunięcia (offsetu). Jeśli instrukcja skoku znajduje się pod adresem $1000, to sam kod operacji zajmuje adres $1000, a offset ($02) zapisany jest pod $1001. Licznik PC automatycznie wskazuje na adres następnej instrukcji, czyli $1002. Stąd wyliczany jest skok efektywny: $1002 + $02 = $1004.",
      example: "BRA $02",
      comment: "skok efektywny do adresu $1004"
    },
    {
      name: "Adresowanie bezpośrednie bitów / Bit (Intel 8051)",
      desc: "Unikalna cecha architektury 8051 pozwalająca na bezpośrednie operowanie na pojedynczych bitach znajdujących się w specjalnym obszarze pamięci RAM (adresy bitowe 00h-7Fh) oraz w rejestrach SFR podzielnych przez 8.",
      example: "MOV C, ACC.7",
      comment: "przepisanie zawartości siódmego bitu akumulatora do flagi przeniesienia"
    }
  ]
};


export const codeExercises = [
  {
    id: "ex1_loop",
    processor: "MC6800",
    title: "Pętla zwielokrotniająca rejestr X",
    task: "Zbuduj pętlę w programie, w której będzie zwiększany rejestr X od wartości 1 do wartości 1000 ($03E8 szesnastkowo).",
    code: [
      { label: "LDX #$0001", comment: "Inicjalizacja rejestru X wartością 1" },
      { label: "INX", comment: "Zwiększenie rejestru indeksowego X o 1 (etykieta pętli)" },
      { label: "CPX #$1000", comment: "Porównanie rejestru X z wartością 1000 ($1000 w kodzie, rzeczywisty próg)" },
      { label: "BNE $FA", comment: "Skok względny w tył do rozkazu INX (przesunięcie $FA = -6 bajtów), jeśli nie równe" }
    ],
    initialState: {
      registers: { A: 0, B: 0, X: 1, PC: 0x1000, SP: 0xFFF0, Flags: { Z: 0, N: 0 } },
      memory: {}
    },
    steps: [
      { op: "LDX #$0001", pc: 0x1000, regs: { X: 1, PC: 0x1003 }, desc: "Załadowanie wartości natychmiastowej $0001 do rejestru X." },
      { op: "INX", pc: 0x1003, regs: { X: 2, PC: 0x1004 }, desc: "Inkrementacja rejestru X (teraz wynosi 2)." },
      { op: "CPX #$1000", pc: 0x1004, regs: { PC: 0x1007, Flags: { Z: 0, N: 0 } }, desc: "Porównanie X z $1000. X to 2, więc flaga Z = 0." },
      { op: "BNE $FA", pc: 0x1007, regs: { PC: 0x1003 }, desc: "BNE wykonuje skok, ponieważ Z = 0. PC skacze z powrotem do INX (adres $1003)." }
    ]
  },
  {
    id: "ex2_mul3",
    processor: "MC6800",
    title: "Mnożenie przez 3 bez akumulatora",
    task: "Pomnóż wartość w akumulatorze B przez liczbę 3 i zapisz wynik do akumulatora A, pomiń przeniesienie (użyj rejestru X jako licznika pętli).",
    code: [
      { label: "LDX #$0000", comment: "Wyczyszczenie licznika pętli X" },
      { label: "ABA", comment: "A = A + B (dodaj B do akumulatora A)" },
      { label: "INX", comment: "Zwiększ licznik pętli o 1" },
      { label: "CPX #$0003", comment: "Czy pętla wykonała się 3 razy?" },
      { label: "BNE $F9", comment: "Skok do ABA ($F9 = -7 bajtów) jeśli X != 3" }
    ],
    initialState: {
      registers: { A: 0, B: 5, X: 0, PC: 0x1000, SP: 0xFFF0, Flags: { Z: 0 } },
      memory: {}
    },
    steps: [
      { op: "LDX #$0000", pc: 0x1000, regs: { X: 0, PC: 0x1003 }, desc: "Załadowanie 0 do rejestru X. Akumulator B = 5 (wartość wejściowa), A = 0." },
      { op: "ABA", pc: 0x1003, regs: { A: 5, PC: 0x1004 }, desc: "ABA: Dodanie B (5) do A (0). A wynosi teraz 5." },
      { op: "INX", pc: 0x1004, regs: { X: 1, PC: 0x1005 }, desc: "Inkrementacja X (X = 1)." },
      { op: "CPX #$0003", pc: 0x1005, regs: { PC: 0x1008, Flags: { Z: 0 } }, desc: "Porównanie X z 3. Ponieważ X=1, flaga Z = 0." },
      { op: "BNE $F9", pc: 0x1008, regs: { PC: 0x1003 }, desc: "Z=0, więc skaczemy z powrotem do ABA (adres $1003)." }
    ]
  },
  {
    id: "ex3_comp",
    processor: "MC6800",
    title: "Wybór większej liczby (do $1212)",
    task: "Porównaj dwie liczby w akumulatorach A i B, większą zapisz do komórki pamięci o adresie $1212.",
    code: [
      { label: "CBA", comment: "Porównanie akumulatorów A i B (wykonuje A - B, ustawia flagi)" },
      { label: "BGE $08", comment: "Jeśli A >= B (flaga N xor V = 0), skocz o 8 bajtów do przodu (do STAA $1212)" },
      { label: "STAB $1212", comment: "Zapisz B do pamięci pod adres $1212 (bo B było większe)" },
      { label: "BRA $0B", comment: "Skok bezwarunkowy o 11 bajtów omijający zapis z A" },
      { label: "STAA $1212", comment: "Zapisz A do pamięci pod adres $1212" }
    ],
    initialState: {
      registers: { A: 12, B: 20, X: 0, PC: 0x1000, SP: 0xFFF0, Flags: { Z: 0, N: 1 } },
      memory: { "1212": 0 }
    },
    steps: [
      { op: "CBA", pc: 0x1000, regs: { PC: 0x1001, Flags: { Z: 0, N: 1 } }, desc: "Porównanie A (12) i B (20). Wynik ujemny, więc flaga N = 1 (A < B)." },
      { op: "BGE $08", pc: 0x1001, regs: { PC: 0x1003 }, desc: "BGE nie skacze, ponieważ N = 1 (A nie jest większe/równe B). Idziemy dalej." },
      { op: "STAB $1212", pc: 0x1003, regs: { PC: 0x1006 }, mem: { "1212": 20 }, desc: "STAB $1212: Zapis wartości B (20) do komórki $1212." },
      { op: "BRA $0B", pc: 0x1006, regs: { PC: 0x100B }, desc: "BRA: Skok bezwarunkowy omijający zapis z A (STAA $1212)." }
    ]
  },
  {
    id: "ex4_swap",
    processor: "MC6800",
    title: "Zamiana rejestrów A i B (podprogram)",
    task: "Napisz podprogram zamieniający miejscami liczby zapisane w akumulatorach A i B, używając komórki pamięci $1000 jako bufora.",
    code: [
      { label: "LDS #$FFF7", comment: "Inicjalizacja wskaźnika stosu SP" },
      { label: "BSR $08", comment: "Wywołanie podprogramu (skok o 8 bajtów do przodu, odkłada PC na stos)" },
      { label: "...", comment: "Dalsza część programu głównego" },
      { label: "STAA $1000", comment: "Początek podprogramu: zapisz A do bufora $1000" },
      { label: "TBA", comment: "Prześlij zawartość B do A (A = B)" },
      { label: "LDAB $1000", comment: "Załaduj do B zawartość bufora $1000 (B = stary A)" },
      { label: "RTS", comment: "Powrót z podprogramu (pobiera adres powrotu ze stosu do PC)" }
    ],
    initialState: {
      registers: { A: 0xAA, B: 0xBB, X: 0, PC: 0x1000, SP: 0xFFFF, Flags: {} },
      memory: { "1000": 0 }
    },
    steps: [
      { op: "LDS #$FFF7", pc: 0x1000, regs: { SP: 0xFFF7, PC: 0x1003 }, desc: "Ustawienie wskaźnika stosu SP na adres $FFF7." },
      { op: "BSR $08", pc: 0x1003, regs: { SP: 0xFFF5, PC: 0x100D }, mem: { "FFF6": 0x10, "FFF7": 0x05 }, desc: "BSR odkłada adres powrotu ($1005) na stos (zmniejszając SP o 2) i skacze do $100D (etykieta podprogramu)." },
      { op: "STAA $1000", pc: 0x100D, regs: { PC: 0x1010 }, mem: { "1000": 0xAA }, desc: "Zapis akumulatora A ($AA) do komórki pamięci $1000." },
      { op: "TBA", pc: 0x1010, regs: { A: 0xBB, PC: 0x1011 }, desc: "TBA: Skopiowanie zawartości B ($BB) do A. Teraz oba mają $BB." },
      { op: "LDAB $1000", pc: 0x1011, regs: { B: 0xAA, PC: 0x1014 }, desc: "LDAB: Załadowanie wartości z komórki $1000 ($AA) do B. Zamiana zakończona!" },
      { op: "RTS", pc: 0x1014, regs: { SP: 0xFFF7, PC: 0x1005 }, desc: "RTS: Pobranie adresu powrotu ze stosu ($1005), zwiększenie SP o 2 i skok z powrotem." }
    ]
  },
  {
    id: "ex5_sort",
    processor: "MC6800",
    title: "Sortowanie 3 liczb (bąbelkowe)",
    task: "W przestrzeni pamięci o adresie $2020 znajdują się 3 liczby 8-bitowe. Posortuj je od najmniejszej do największej.",
    code: [
      { label: "LDAA $2020", comment: "Pobierz 1. liczbę" },
      { label: "LDAB $2021", comment: "Pobierz 2. liczbę" },
      { label: "CBA", comment: "Porównaj (A - B)" },
      { label: "BMI $04", comment: "Jeśli A < B (N=1), są w dobrej kolejności, skocz omijając zamianę" },
      { label: "STAA $2021", comment: "Zamiana: zapisz A do $2021" },
      { label: "STAB $2020", comment: "zapisz B do $2020" },
      { label: "LDAA $2021", comment: "Pobierz nową 2. liczbę" },
      { label: "LDAB $2022", comment: "Pobierz 3. liczbę" },
      { label: "CBA", comment: "Porównaj (A - B)" },
      { label: "BMI $04", comment: "Jeśli A < B, są ok, skocz omijając zamianę" },
      { label: "STAA $2022", comment: "Zamiana: zapisz A do $2022" },
      { label: "STAB $2021", comment: "zapisz B do $2021" },
      { label: "LDAA $2020", comment: "Powtórne porównanie 1. i 2. elementu" },
      { label: "LDAB $2021", comment: "Pobierz 2. element" },
      { label: "CBA", comment: "Porównaj" },
      { label: "BMI $04", comment: "Jeśli ok, skocz na koniec" },
      { label: "STAA $2021", comment: "Zamiana" },
      { label: "STAB $2020", comment: "Zamiana" }
    ],
    initialState: {
      registers: { A: 0, B: 0, X: 0, PC: 0x1000, SP: 0xFFF0, Flags: {} },
      memory: { "2020": 45, "2021": 12, "2022": 30 }
    },
    steps: [
      { op: "LDAA $2020", pc: 0x1000, regs: { A: 45, PC: 0x1003 }, desc: "Załadowanie 1. liczby (45) do rejestru A." },
      { op: "LDAB $2021", pc: 0x1003, regs: { B: 12, PC: 0x1006 }, desc: "Załadowanie 2. liczby (12) do rejestru B." },
      { op: "CBA", pc: 0x1006, regs: { PC: 0x1007, Flags: { Z: 0, N: 0 } }, desc: "Porównanie A (45) i B (12). Wynik dodatni, więc N = 0 (45 > 12)." },
      { op: "BMI $04", pc: 0x1007, regs: { PC: 0x1009 }, desc: "N = 0, więc BMI nie wykonuje skoku. Nastąpi zamiana miejscami." },
      { op: "STAA $2021", pc: 0x1009, regs: { PC: 0x100C }, mem: { "2021": 45 }, desc: "Zapis A (45) pod adres $2021." },
      { op: "STAB $2020", pc: 0x100C, regs: { PC: 0x100F }, mem: { "2020": 12, "2021": 45 }, desc: "Zapis B (12) pod adres $2020. Liczby 45 i 12 zostały zamienione." }
    ]
  },
  {
    id: "ex6_gray",
    processor: "MC6800",
    title: "Konwersja Binarny -> Gray",
    task: "Przelicz liczbę z komórki pamięci $10 (binarnie) na kod Greya i zapisz wynik w komórce $11.",
    code: [
      { label: "LDAA $10", comment: "Pobierz liczbę binarną z komórki $10" },
      { label: "LSRA", comment: "Przesuń bity w rejestrze A o 1 pozycję w prawo (A = A / 2)" },
      { label: "EORA $10", comment: "Operacja XOR między przesuniętym A a oryginalną komórką $10" },
      { label: "STAA $11", comment: "Zapisz wynik w kodzie Greya do komórki $11" }
    ],
    initialState: {
      registers: { A: 0, B: 0, X: 0, PC: 0x1000, SP: 0xFFF0, Flags: {} },
      memory: { "10": 0b1101 } // 13 w systemie dziesiętnym
    },
    steps: [
      { op: "LDAA $10", pc: 0x1000, regs: { A: 13, PC: 0x1002 }, desc: "Pobranie wartości 13 (binarnie 1101) do akumulatora A." },
      { op: "LSRA", pc: 0x1002, regs: { A: 6, PC: 0x1003 }, desc: "Przesunięcie A w prawo (1101 -> 0110, czyli 6 dziesiętnie)." },
      { op: "EORA $10", pc: 0x1003, regs: { A: 11, PC: 0x1005 }, desc: "Operacja XOR: 0110 XOR 1101 = 1011 (czyli 11 dziesiętnie). Jest to reprezentacja Graya liczby 13." },
      { op: "STAA $11", pc: 0x1005, regs: { PC: 0x1007 }, mem: { "11": 11 }, desc: "Zapisanie kodu Greya (11 / 1011b) do komórki pamięci $11." }
    ]
  },
  {
    id: "ex7_bcd_sub",
    processor: "Intel8051",
    title: "Odejmowanie BCD z dopełnieniem do 10",
    task: "W rejestrach R0 i R1 znajdują się liczby BCD. Wykonaj odejmowanie R0 - R1 w systemie BCD przy użyciu metody dopełnienia do 10 i zapisz wynik do akumulatora A.",
    code: [
      { label: "MOV R0, #028h", comment: "R0 = 28 BCD (odjemna)" },
      { label: "MOV R1, #014h", comment: "R1 = 14 BCD (odjemnik)" },
      { label: "MOV A, #099h", comment: "Załaduj 99H do A (wyznaczenie dopełnienia do 9)" },
      { label: "SUBB A, R1", comment: "A = 99H - R1 (dopełnienie do 9 liczby R1)" },
      { label: "INC A", comment: "A = A + 1 (zamiana dopełnienia do 9 na dopełnienie do 10)" },
      { label: "ADD A, R0", comment: "Dodanie odjemnej R0 do dopełnienia do 10" },
      { label: "DA A", comment: "Korekcja dziesiętna wyniku dodawania BCD (Wynik: 14H)" }
    ],
    initialState: {
      registers: { A: 0, R0: 0, R1: 0, PC: 0x0000, Flags: { CY: 0 } },
      memory: {}
    },
    steps: [
      { op: "MOV R0, #028h", pc: 0x0000, regs: { R0: 0x28, PC: 0x0002 }, desc: "Załadowanie wartości 28H (BCD dla 28) do rejestru R0." },
      { op: "MOV R1, #014h", pc: 0x0002, regs: { R1: 0x14, PC: 0x0004 }, desc: "Załadowanie wartości 14H (BCD dla 14) do rejestru R1." },
      { op: "MOV A, #099h", pc: 0x0004, regs: { A: 0x99, PC: 0x0006 }, desc: "Załadowanie stałej 99H do akumulatora w celu wykonania dopełnienia." },
      { op: "SUBB A, R1", pc: 0x0006, regs: { A: 0x85, PC: 0x0007 }, desc: "SUBB: 99H - 14H = 85H (dopełnienie do 9)." },
      { op: "INC A", pc: 0x0007, regs: { A: 0x86, PC: 0x0008 }, desc: "Inkrementacja A: 85H + 1 = 86H (dopełnienie do 10)." },
      { op: "ADD A, R0", pc: 0x0008, regs: { A: 0xAE, PC: 0x0009 }, desc: "ADD: Dodanie R0 (28H) do A (86H). 86H + 28H = AEH." },
      { op: "DA A", pc: 0x0009, regs: { A: 0x14, PC: 0x000A, Flags: { CY: 1 } }, desc: "Korekcja dziesiętna (DA A): AEH korygowane jest do 14H (z przeniesieniem CY=1, które ignorujemy). Wynik odejmowania 28 - 14 = 14 BCD!" }
    ]
  }
];

export const flashcards = [
  {
    id: "fc1",
    category: "Pojęcia",
    front: "Co to jest Podprogram i do czego służy?",
    back: "Wydzielony, autonomiczny fragment kodu, realizujący konkretne zadanie. Pozwala na modułowość i oszczędność pamięci ROM (wiele wywołań w różnych miejscach). Wywoływany przez BSR/JSR, kończy się rozkazem RTS."
  },
  {
    id: "fc2",
    category: "Pojęcia",
    front: "Co to jest Stos i w jakiej kolejności działa?",
    back: "Wydzielony obszar pamięci RAM przeznaczony do tymczasowego przechowywania danych. Działa w kolejności LIFO (Last In, First Out). Wskazywany przez rejestr SP (Stack Pointer)."
  },
  {
    id: "fc3",
    category: "Pojęcia",
    front: "Do czego najczęściej służy Stos?",
    back: "1. Obsługa przerwań (zapis stanu rejestrów CPU).\n2. Wywoływanie podprogramów (zapis adresu powrotu).\n3. Tymczasowe przechowywanie danych programu."
  },
  {
    id: "fc4",
    category: "Pojęcia",
    front: "W którą stronę rośnie stos w MC6800 i jak zachowuje się SP?",
    back: "Stos rośnie 'w dół' (w stronę niższych adresów RAM). Przy zapisie (PSH) najpierw następuje zapis pod adres SP, a potem SP jest automatycznie dekrementowany. Przy odczycie (PUL) SP jest najpierw inkrementowany, a potem następuje odczyt."
  },
  {
    id: "fc5",
    category: "Pojęcia",
    front: "Co to jest Wektor Przerwań?",
    back: "Komórka lub stały obszar w pamięci o z góry określonym adresie, w którym zapisany jest adres podprogramu obsługi (ISR) danego przerwania. Umożliwia procesorowi skok do procedury obsługi po wystąpieniu przerwania."
  },
  {
    id: "fc6",
    category: "Asembler MC6800",
    front: "Jak rozróżnić adresowanie natychmiastowe od bezpośredniego w kodzie MC6800?",
    back: "W natychmiastowym używamy znaku '#', a argumentem jest stała liczba, np. LDAA #$55.\nW bezpośrednim brak '#', argumentem jest 8-bitowy adres w pamięci, np. LDAA $25."
  },
  {
    id: "fc7",
    category: "Asembler MC6800",
    front: "Czym różni się adresowanie bezpośrednie (Direct) od rozszerzonego (Extended) w MC6800?",
    back: "Bezpośrednie (Direct) używa 8-bitowego adresu i działa tylko w zakresie $00-$FF (strona zerowa, szybszy dostęp). Rozszerzone (Extended) używa pełnego 16-bitowego adresu ($0000-$FFFF) i instrukcja zajmuje 3 bajty zamiast 2."
  },
  {
    id: "fc8",
    category: "Asembler Intel 8051",
    front: "Jakie rejestry mogą pełnić rolę wskaźników przy adresowaniu pośrednim w wewnętrznym RAM w 8051?",
    back: "Wyłącznie rejestry robocze R0 i R1 z aktualnie wybranego banku rejestrów (oznaczane jako @R0 i @R1)."
  },
  {
    id: "fc9",
    category: "Asembler Intel 8051",
    front: "Na czym polega adresowanie bezpośrednie bitów w 8051?",
    back: "To unikalna cecha 8051 pozwalająca na wykonywanie operacji logicznych (np. ustawienie, wyczyszczenie, negacja) na pojedynczych bitach. Adresy bitowe znajdują się w RAM ($20-$2F) lub w rejestrach SFR (np. ACC.7)."
  },
  {
    id: "fc10",
    category: "Asembler MC6800",
    front: "Co oznacza instrukcja BNE $FA w kontekście pętli?",
    back: "BNE to 'Branch if Not Equal' (skok gdy flaga Z=0). Wartość $FA to 8-bitowe przesunięcie ze znakiem w kodzie U2. $FA = -6 dziesiętnie, co powoduje skok wstecz o 6 bajtów (zwykle na początek pętli)."
  },
  {
    id: "fc11",
    category: "Matematyka BCD",
    front: "Dlaczego po dodawaniu liczb BCD musimy użyć instrukcji korekcji (DA A / DAA)?",
    back: "Suma dwóch cyfr BCD może przekroczyć 9 lub wywołać przeniesienie półbajtowe. Instrukcja DA A koryguje wynik dodawania binarnego z powrotem do poprawnego formatu BCD poprzez dodanie wartości 6 do półbajtów, które przekroczyły 9."
  },
  {
    id: "fc12",
    category: "Matematyka BCD",
    front: "Jak wykonuje się odejmowanie BCD w 8051 bez dedykowanej instrukcji odejmowania BCD?",
    back: "Ponieważ nie ma bezpośredniej korekcji po odejmowaniu BCD, stosuje się dodanie dopełnienia do 10 liczby odejmowanej:\n1. Dopełnienie do 9 (99H - liczba).\n2. Dopełnienie do 10 (+1 do wyniku).\n3. Dodanie do odjemnej.\n4. Wykonanie korekcji DA A."
  }
];

export const quizQuestions = [
  {
    id: "q1",
    question: "Wskaźnik stosu (SP) w procesorze MC6800 po wykonaniu operacji zapisu (PUSH/PSH):",
    options: [
      "Jest automatycznie inkrementowany o 1",
      "Jest automatycznie dekrementowany o 1",
      "Pozostaje bez zmian",
      "Jest dekrementowany o 2"
    ],
    answer: 1,
    explanation: "W MC6800 stos rośnie w dół pamięci. Po zapisie każdego bajtu (instrukcją PSH) wskaźnik stosu (SP) jest automatycznie dekrementowany o 1."
  },
  {
    id: "q2",
    question: "Które rejestry mogą służyć jako wskaźniki przy adresowaniu pośrednim w wewnętrznym RAM dla mikrokontrolera 8051?",
    options: [
      "Dowolny rejestr R0-R7",
      "Tylko R0 i R1",
      "Tylko DPTR",
      "Tylko akumulator A"
    ],
    answer: 1,
    explanation: "Dla wewnętrznej pamięci RAM w 8051 rolę wskaźników przy adresowaniu pośrednim (oznaczanym @) mogą pełnić wyłącznie rejestry R0 i R1."
  },
  {
    id: "q3",
    question: "W trybie adresowania natychmiastowego (np. LDAA #$55) argument:",
    options: [
      "Znajduje się w komórce pamięci RAM o podanym adresie",
      "Jest rejestrem procesora",
      "Jest stałą zapisaną w kodzie programu (ROM) bezpośrednio po kodzie operacji",
      "Jest pobierany ze stosu"
    ],
    answer: 2,
    explanation: "W trybie natychmiastowym (oznaczonym symbolem #) dana jest częścią samej instrukcji i znajduje się bezpośrednio w pamięci programu (ROM)."
  },
  {
    id: "q4",
    question: "Co znajduje się w komórce pamięci zwanej 'Wektorem Przerwań'?",
    options: [
      "Kod maszynowy obsługi przerwania",
      "Adres podprogramu obsługi danego przerwania",
      "Liczba określająca priorytet przerwania",
      "Zabezpieczone rejestry procesora"
    ],
    answer: 1,
    explanation: "Wektor przerwań to komórka pamięci o stałym adresie, która przechowuje ADRES podprogramu obsługi przerwania (skąd procesor pobiera cel skoku po wystąpieniu przerwania)."
  },
  {
    id: "q5",
    question: "Do czego procesor MC6800 wykorzystuje stos przy skoku do podprogramu (JSR/BSR)?",
    options: [
      "Do zapamiętania stanu akumulatorów A i B",
      "Do zapisania adresu powrotu (rejestru PC)",
      "Do przekazania argumentów funkcji",
      "Stos nie jest wtedy używany"
    ],
    answer: 1,
    explanation: "Podczas wywoływania podprogramu (JSR/BSR) procesor odkłada na stos adres powrotu (zawartość rejestru PC zwiększoną o 2 lub 3), aby móc wrócić instrukcją RTS."
  },
  {
    id: "q6",
    question: "W trybie adresowania względnego (Relative) dla MC6800, zasięg skoku wynosi:",
    options: [
      "Od 0 do 255 bajtów w przód",
      "Od -128 do +127 bajtów od adresu następnej instrukcji",
      "W obrębie całej pamięci 64KB",
      "Tylko w obrębie strony zerowej (0-255)"
    ],
    answer: 1,
    explanation: "Adresowanie względne stosuje 8-bitowe przesunięcie (offset) ze znakiem w kodzie U2. Zasięg wynosi od -128 do +127 bajtów w stosunku do adresu następnego rozkazu."
  },
  {
    id: "q7",
    question: "Jaki jest cel stosowania instrukcji DA A (lub DAA) po operacji arytmetycznej na liczbach BCD?",
    options: [
      "Przeliczenie wyniku na system szesnastkowy",
      "Korekcja wyniku dodawania binarnego, aby odpowiadał poprawnej sumie w kodzie BCD",
      "Wyzerowanie flagi przeniesienia",
      "Przesunięcie wyniku o 4 bity w prawo"
    ],
    answer: 1,
    explanation: "DA A (Decimal Adjust Accumulator) koryguje wynik operacji binarnej dodawania do formatu BCD. Jeśli suma cyfr w półbajcie przekracza 9 lub wystąpiło przeniesienie pomocnicze, dodaje 6 do danego półbajtu."
  },
  {
    id: "q8",
    question: "Jak w kodzie asemblera 8051 oznacza się adresowanie pośrednie?",
    options: [
      "Przedrostkiem '#'",
      "Przyrostkiem 'H'",
      "Przedrostkiem '@'",
      "Nawiasami kwadratowymi '[ ]'"
    ],
    answer: 2,
    explanation: "Adresowanie pośrednie w architekturze 8051 oznacza się za pomocą symbolu '@', np. MOV A, @R0."
  },
  {
    id: "q9",
    question: "Aby odejąć liczby BCD w mikrokontrolerze 8051, należy zastosować dopełnienie do 10. Dopełnienie do 9 liczby dwucyfrowej BCD otrzymuje się poprzez:",
    options: [
      "Odjęcie tej liczby od 99H",
      "Dodanie do tej liczby 99H",
      "Zanegowanie wszystkich bitów liczby",
      "Odjęcie tej liczby od 100H"
    ],
    answer: 0,
    explanation: "Zgodnie z materiałami, dopełnienie do 9 dla dwucyfrowej liczby BCD tworzy się poprzez odjęcie jej od wartości 99H."
  },
  {
    id: "q10",
    question: "Tryb adresowania bezpośredniego strony zerowej (Direct / Page Zero) w MC6800:",
    options: [
      "Pozwala na adresowanie całej pamięci 64KB przy użyciu 8-bitowego adresu",
      "Ogranicza się do zakresu adresów $0000 - $00FF i skraca rozmiar rozkazu o 1 bajt",
      "Używa rejestru indeksowego X jako bazy",
      "Wymaga użycia wskaźnika stosu SP"
    ],
    answer: 1,
    explanation: "Tryb bezpośredni (Direct) w MC6800 pobiera 8-bitowy adres, co ogranicza go do strony zerowej ($00-$FF). Dzięki temu instrukcja zajmuje 2 bajty zamiast 3, co przyspiesza jej wykonanie."
  }
];
