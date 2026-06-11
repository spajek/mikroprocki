// New materials database mapped exactly to "tylkozagadnienia_samomieso.txt"

export const theory = [
  {
    id: "pamiec_8051",
    title: "Organizacja wewnętrznej pamięci danych w Intelu 8051",
    desc: "Wewnętrzna pamięć danych (RAM) standardowego układu 8051 ma pojemność 128 bajtów (adresy od 00H do 7FH) i dzieli się na trzy bloki:\n* 00H-1FH: Cztery banki rejestrów roboczych (każdy bank zawiera 8 rejestrów R0-R7). Tryby adresowania: rejestrowe, bezpośrednie, pośrednie.\n* 20H-2FH: Obszar adresowany bitowo (16 bajtów, co daje 128 adresowalnych bitów od 00H do 7FH). Tryby adresowania: bitowe, bezpośrednie, pośrednie.\n* 30H-7FH: Pamięć ogólnego przeznaczenia (tzw. notes), służąca np. pod obszar stosu i definiowane zmienne. Tryby adresowania: bezpośrednie, pośrednie.\n* Powyżej adresu 7FH (od 80H do FFH) znajduje się obszar Rejestrów Specjalnych (SFR), dostępny wyłącznie poprzez adresowanie bezpośrednie.",
    details: [
      { label: "Banki rejestrów (00H-1FH)", text: "Cztery banki po 8 rejestrów roboczych R0-R7. Adresowane rejestrowo, bezpośrednio i pośrednio." },
      { label: "Adresowalny bitowo (20H-2FH)", text: "16 bajtów (128 bitów o adresach 00H-7FH). Adresowane bitowo, bezpośrednio i pośrednio." },
      { label: "Notes ogólny (30H-7FH)", text: "Pamięć na zmienne i stos. Adresowanie bezpośrednie i pośrednie." },
      { label: "Rejestry SFR (80H-FFH)", text: "Rejestry specjalne (np. ACC, B, SP, TCON, TMOD). Dostępne WYŁĄCZNIE poprzez adresowanie bezpośrednie." }
    ]
  },
  {
    id: "magistrale",
    title: "Budowa i przeznaczenie magistral",
    desc: "Magistrale w systemach mikroprocesorowych na przykładzie MC6800, MC68HC05, Intel 8051:\n* Magistrala adresowa: Jednokierunkowa ścieżka (od procesora do urządzeń). Wskazuje unikalny adres w pamięci lub układzie I/O. MC6800 i 8051 mają 16-bitową magistralę, pozwalającą zaadresować 64 KB pamięci.\n* Magistrala danych: Dwukierunkowa. Zapewnia transfer kodów instrukcji z pamięci do procesora oraz wymianę danych. W omawianych układach jest 8-bitowa.\n* Magistrala sterująca: Zespół sygnałów zarządzających cyklem przesyłu (np. sygnał odczytu/zapisu R/W, synchronizacja, przerwania).\n* Uwaga dla MC68HC05: Jest układem jednoukładowym. Nie ma standardowo wyprowadzonych fizycznych magistral adresowej i danych na piny zewnętrzne (są one wewnątrz struktury).",
    details: [
      { label: "Magistrala adresowa", text: "Jednokierunkowa, od CPU do pamięci/IO. MC6800 i 8051 mają 16-bitową (adresowanie do 64 KB)." },
      { label: "Magistrala danych", text: "Dwukierunkowa, 8-bitowa. Przesyła kody instrukcji oraz dane." },
      { label: "Magistrala sterująca", text: "Sygnały sterujące pracą systemu (R/W, zegar, przerwania IRQ/NMI/RST)." },
      { label: "MC68HC05", text: "Mikrokontroler jednoukładowy — magistrale są wewnątrz struktury i nie są wyprowadzone na piny zewnętrzne." }
    ]
  },
  {
    id: "minimalny_mc6800",
    title: "Minimalna konfiguracja sterownika z MC6800",
    desc: "Układ minimalny procesora Motorola MC6800 wymaga dodania zewnętrznych elementów pomocniczych:\n* Dwufazowego, niepokrywającego się generatora sygnału zegarowego (np. MC6875).\n* Zewnętrznej pamięci programu (ROM) z wektorami przerwań i kodem aplikacji.\n* Zewnętrznej pamięci danych (RAM) na operacje podręczne i układ stosu.\n* Ustawionego układu resetowania (dla sprzętowego zresetowania linii).",
    details: [
      { label: "Generator zegara", text: "Dwufazowy zegar, niepokrywające się sygnały faza 1 i faza 2 (np. układ scalony MC6875)." },
      { label: "Pamięć ROM", text: "Przechowuje stały kod programu oraz wektory przerwań i resetu w najwyższych adresach." },
      { label: "Pamięć RAM", text: "Zewnętrzna pamięć operacyjna na zmienne robocze oraz stos systemowy." },
      { label: "Układ Resetu", text: "Układ wymuszający stan niski na linii RESET po włączeniu zasilania w celu zainicjowania rejestru PC." }
    ]
  },
  {
    id: "rejestry_wew",
    title: "Rejestry wewnętrzne MC6800, MC68HC05, Intel 8051",
    desc: "Zestawienie rejestrów wewnętrznych w 3 architekturach:\n\nMC6800:\n* Akumulatory A i B (8-bit): Główne jednostki operujące z ALU.\n* Rejestr indeksowy X (16-bit): Wskaźnik do adresowania indeksowego.\n* Licznik rozkazów PC (16-bit): Definiuje adres kolejnej instrukcji.\n* Wskaźnik stosu SP (16-bit): Wskazuje wolny wierzchołek stosu.\n* CCR (8-bit): Flagi stanu (Z, C, N, V itp.).\n\nMC68HC05:\n* Uproszczony układ: jeden Akumulator A (8-bit), skrócony Rejestr indeksowy X (8-bit), ograniczony Wskaźnik Stosu SP, Licznik PC i mniejszy, 5-bitowy rejestr flag CCR.\n\nIntel 8051:\n* Akumulator A (8-bit): Fundamentalny rejestr ALU.\n* Rejestr B (8-bit): Pomocniczy rejestr przy mnożeniu i dzieleniu.\n* DPTR (16-bit): Wskaźnik danych do pamięci zewnętrznej lub programu.\n* PC (16-bit): Licznik rozkazów.\n* SP (8-bit): Wskaźnik stosu w wewnętrznej pamięci RAM.\n* PSW (8-bit): Flagi stanu i bity wyboru banku rejestrów roboczych.",
    details: [
      { label: "Rejestry MC6800", text: "Akumulatory A i B (8-bit), Rejestr indeksowy X (16-bit), PC (16-bit), SP (16-bit), CCR (8-bit)." },
      { label: "Rejestry MC68HC05", text: "Akumulator A (8-bit), rejestr X (8-bit), ograniczony SP, PC, oraz 5-bitowy CCR." },
      { label: "Rejestry Intel 8051", text: "Akumulator A (8-bit), rejestr B (8-bit), DPTR (16-bit), PC (16-bit), SP (8-bit), PSW (8-bit)." }
    ]
  },
  {
    id: "sygnaly_zew",
    title: "Sygnały zewnętrzne procesorów",
    desc: "Kluczowe piny i sygnały zewnętrzne wyprowadzone na obudowę:\n* MC6800: Magistrala adresowa (A0-A15), danych (D0-D7), linia R/W (kierunek zapisu/odczytu), VMA (ważność adresu), zegary faza 1 i faza 2, sygnały przerwań (IRQ, NMI) oraz RESET.\n* MC68HC05: Linie portów wejścia-wyjścia (PA, PB), piny oscylatora kwarcowego (OSC1, OSC2), zasilanie, pin przerwania zewnętrznego (IRQ) oraz RESET.\n* Intel 8051: Cztery porty 8-bitowe (P0-P3, gdzie P0/P2 służą jako magistrala adresu/danych, a P3 zawiera linie alternatywne jak RxD, TxD, INT0, INT1), ALE (zatrzask adresu), PSEN (zezwolenie na odczyt pamięci ROM zewnętrznej), EA (wybór pamięci wew/zew), XTAL1/XTAL2 (zegar), RST (reset).",
    details: [
      { label: "Magistrale sygnałów MC6800", text: "A0-A15, D0-D7, R/W (Read/Write), VMA (Valid Memory Address), zegar faza 1/2, IRQ, NMI, RESET." },
      { label: "Piny jednoukładowego MC68HC05", text: "Brak zew. magistral; linie I/O portów PA/PB, OSC1/OSC2 do kwarcu, IRQ i RESET." },
      { label: "Linie sterujące Intel 8051", text: "Porty P0-P3, ALE (Address Latch Enable), PSEN (Program Store Enable), EA (External Access), XTAL1/XTAL2, RST." }
    ]
  },
  {
    id: "organizacja_pamieci",
    title: "Organizacja pamięci (von Neumann vs Harvard)",
    desc: "Porównanie architektury pamięci w układach:\n* MC6800 / MC68HC05 (Architektura von Neumanna): Kod programu, zmienne w RAM i układy wejścia-wyjścia (I/O) są widoczne we wspólnej, ciągłej mapie pamięci o rozmiarze 64 KB. Pamięć RAM kładzie się na początku (strona zerowa), pośrodku znajdują się układy I/O, a pamięć ROM zlokalizowana jest na końcu przestrzeni adresowej, gdzie najwyższe adresy trzymają wektory przerwań i resetu.\n* Intel 8051 (Architektura Harvard): Przestrzenie kodu i danych są fizycznie rozdzielone. Istnieje adresowana 16-bitowo pamięć programu (ROM) oraz niezależna pamięć danych (RAM). Dostęp do nich jest realizowany osobnymi sygnałami (np. PSEN dla ROM, RD/WR dla zewnętrznego RAM).",
    details: [
      { label: "Von Neumann (MC6800)", text: "Wspólna mapa pamięci dla kodu, zmiennych (RAM) i I/O o rozmiarze 64 KB. RAM na początku (strona zerowa), ROM i wektory na końcu." },
      { label: "Harvard (Intel 8051)", text: "Fizycznie rozdzielone przestrzenie pamięci kodu (programu) i pamięci danych (RAM). Osobne szyny i sygnały sterujące." }
    ]
  },
  {
    id: "timer_mc68hc05",
    title: "Budowa układu czasowo-licznikowego w MC68HC05",
    desc: "Układ czasowy opiera się na 16-bitowym liczniku swobodnym (free-running counter), który zwiększa swoją wartość synchronicznie z zegarem systemowym. Układ obsługuje sprzętowo i programowo trzy zdarzenia:\n1. Przepełnienie licznika (Timer Overflow): Kiedy licznik zmienia wartość z $FFFF na $0000, układ automatycznie zapala flagę statusu i może zgłosić żądanie przerwania.\n2. Przechwycenie (Input Capture): Zewnętrzny sygnał (zbocze) na dedykowanym pinie zatrzaskuje aktualny stan licznika w rejestrze Input Capture, powiadamiając program flagą (służy do pomiaru czasu trwania impulsu lub częstotliwości).\n3. Porównanie (Output Compare): Program zapisuje zadaną wartość w rejestrze Output Compare. Gdy licznik zrówna się z tą wartością, sprzęt zapala flagę i może wywołać automatyczną zmianę stanu fizycznego pinu wyjściowego (generacja PWM, precyzyjne odmierzanie czasu).",
    details: [
      { label: "Licznik swobodny", text: "16-bitowy rejestr zliczający impulsy zegara systemowego od $0000 do $FFFF." },
      { label: "Przepełnienie (TOF)", text: "Przejście licznika $FFFF -> $0000 ustawia flagę TOF i opcjonalnie wywołuje przerwanie." },
      { label: "Przechwycenie (ICF)", text: "Zbocze na pinie wejściowym przepisuje wartość licznika do rejestru Input Capture (pomiar sygnałów)." },
      { label: "Porównanie (OCF)", text: "Zrównanie licznika z rejestrem Output Compare ustawia flagę OCF i może zmienić stan pinu wyjściowego." }
    ]
  },
  {
    id: "timer_8051",
    title: "Budowa układu czasowo-licznikowego w Intel 8051",
    desc: "W standardzie mikrokontrolera 8051 znajdują się dwa 16-bitowe układy timerów/liczników: Timer 0 i Timer 1. Każdy z nich składa się z dwóch niezależnych rejestrów 8-bitowych (starszego TH i młodszego TL). Pracą timerów sterują rejestry specjalne SFR:\n- TMOD: Rejestr konfiguracyjny (ustawia tryby pracy i funkcję timer/licznik).\n- TCON: Rejestr sterujący (flagi przepełnienia TFx oraz bity uruchamiające TRx).\n\nOmówienie Trybu 2 (8-bitowy z automatycznym przeładowaniem):\nMłodszy rejestr (TL) odlicza impulsy od 0 do FFH. Po przepełnieniu (przejście z FFH na 00H) układ sprzętowo zgłasza flagę przerwania (TF), a do rejestru TL automatycznie kopiowana jest stała początkowa przechowywana w starszym rejestrze (TH). Odliczanie natychmiast zaczyna się od nowa. Tryb ten służy do generowania stabilnych, cyklicznych częstotliwości, np. prędkości transmisji (baud rate) dla portu szeregowego.",
    details: [
      { label: "Struktura sprzętowa", text: "Dwa timery 16-bitowe (Timer 0 i Timer 1). Każdy składa się z rejestru TH (High) i TL (Low)." },
      { label: "Rejestr TMOD", text: "Ustawia tryb pracy (0-3) oraz decyduje, czy zliczamy zegar wewnętrzny (Timer) czy impulsy z pinu zewnętrznego (Counter)." },
      { label: "Rejestr TCON", text: "Zawiera bity uruchamiające TR0/TR1 oraz flagi przepełnienia TF0/TF1." },
      { label: "Tryb 2 (Autoreload)", text: "8-bitowy licznik TL. Po przepełnieniu sprzętowo ładuje wartość z rejestru TH do TL i zlicza od nowa. Używany np. do generowania prędkości portu szeregowego." }
    ]
  },
  {
    id: "stos",
    title: "Jak jest zbudowany stos i do czego służy [PEWNIAK]",
    desc: "Stos to specyficzna, dynamiczna sekcja w pamięci RAM mikrokontrolera, działająca w oparciu o architekturę kolejki LIFO (Last In, First Out) – dane zapisane jako ostatnie są odczytywane jako pierwsze (analogia do stosu talerzy w restauracji, gdzie nowy kładziesz na górę i ściągasz z góry). Pozycję wierzchołka stosu w pamięci stale monitoruje specjalny rejestr procesora — wskaźnik stosu SP (Stack Pointer).\n\nStos służy do:\n1. Przechowywania adresów powrotu, kiedy procesor wykonuje skok do podprogramu (np. bsr, jsr).\n2. Tymczasowego zapisu pełnego stanu procesora (rejestrów roboczych i flag CCR/PSW) podczas sprzętowej obsługi przerwań, co umożliwia bezproblemowy powrót do głównego programu.\n3. Roboczego przechowywania danych przez programistę za pomocą instrukcji zapisu (PSH / PUSH) i odczytu (PUL / POP).",
    details: [
      { label: "Struktura LIFO", text: "Last In, First Out (Ostatni wszedł, pierwszy wyszedł). Dane są dokładane i zdejmowane wyłącznie ze szczytu stosu." },
      { label: "Wskaźnik SP", text: "Rejestr przechowujący adres aktualnego wierzchołka stosu w pamięci RAM." },
      { label: "Adresy powrotu", text: "W momencie skoku do podprogramu, adres następnej instrukcji jest automatycznie odkładany na stos." },
      { label: "Obsługa przerwań", text: "Podczas przerwania sprzęt automatycznie ratuje rejestry procesora i flagi na stosie przed skokiem do procedury obsługi (ISR)." }
    ]
  },
  {
    id: "podprogram",
    title: "Jak jest zbudowany podprogram i do czego służy [PEWNIAK]",
    desc: "Podprogram to wydzielony, autonomiczny blok kodu zlokalizowany poza głównym programem (pętlą główną). Wywoływany jest za pomocą dedykowanych instrukcji wywołania (np. BSR - skok względny, JSR - skok bezwarunkowy). W momencie wywołania, procesor automatycznie zapisuje na stosie adres powrotu (adres komórki pamięci bezpośrednio za rozkazem wywołania), a następnie przenosi sterowanie pod adres podprogramu.\n\nPodprogram musi kończyć się specjalnym rozkazem powrotu RTS (Return from Subroutine). Wykonanie RTS powoduje ściągnięcie adresu powrotu ze stosu i wpisanie go z powrotem do licznika rozkazów PC, dzięki czemu procesor wznawia pracę w głównym kodzie dokładnie tam, skąd został wysłany. Służy do unikania powielania kodu w pamięci i wprowadzania czytelnej, modułowej struktury oprogramowania.",
    details: [
      { label: "Wywołanie podprogramu", text: "Instrukcje BSR lub JSR. Zapisują aktualny adres powrotu (PC) na stos i skaczą do etykiety podprogramu." },
      { label: "Działanie na stosie", text: "Stos przechowuje adres powrotu na czas wykonywania podprogramu. Umożliwia to zagnieżdżanie wywołań." },
      { label: "Rozkaz powrotu RTS", text: "Ostatnia instrukcja podprogramu. Zdejmuje 16-bitowy adres ze stosu i wpisuje go do rejestru PC." },
      { label: "Przeznaczenie", text: "Modułowość kodu, oszczędność pamięci ROM poprzez wielokrotne wywoływanie tego samego bloku instrukcji." }
    ]
  },
  {
    id: "wektor",
    title: "Co to jest i do czego służy wektor przerwań [PEWNIAK]",
    desc: "Wektor przerwań to predefiniowana komórka o sztywno określonym adresie fizycznym w pamięci ROM mikrokontrolera, która przechowuje adres podprogramu obsługi danego przerwania (ISR - Interrupt Service Routine). Występuje tu analogia do tablicy z numerami alarmowymi: w razie nagłego zdarzenia (np. reset, sygnał sprzętowy IRQ), procesor przerywa aktualne zadanie, zagląda pod przypisany adres wektora przerwania, odczytuje stamtąd wskaźnik adresowy i wykonuje skok do procedury obsługującej to zdarzenie.\n\nPo zakończeniu procedury ISR rozkazem powrotu z przerwania (RTI / RETI), stan rejestrów i licznik PC są pobierane ze stosu, a procesor wraca do wykonywania głównego programu.",
    details: [
      { label: "Stały adres w ROM", text: "Wektory znajdują się w ściśle określonym miejscu pamięci ROM (w MC6800 pod koniec obszaru, od $FFF0 do $FFFF)." },
      { label: "Wskaźnik adresowy", text: "Wektor nie zawiera kodu obsługi, lecz sam adres (wskaźnik) komórki pamięci, pod którą zaczyna się procedura obsługi (ISR)." },
      { label: "Powrót RTI / RETI", text: "Instrukcja na końcu ISR. Ściąga odłożone rejestry i adres PC ze stosu, wznawiając przerwany program." }
    ]
  }
];

export const addressingModes = {
  mc6800: [
    {
      name: "Domniemane (Rejestrowe / Implied)",
      desc: "Kod instrukcji sam w sobie określa na jakim rejestrze operuje, nie wymaga podawania dodatkowego adresu (np. INX - inkrementuj rejestr X). Rozkaz jest jednobajtowy i procesor nie musi pobierać adresu z pamięci.",
      example: "INX",
      comment: "inkrementuj rejestr indeksowy X o 1 (rejestr wskazany w opkodzie)"
    },
    {
      name: "Natychmiastowe (Immediate)",
      desc: "Stała wartość danych (argument) jest wpisana na sztywno w kodzie instrukcji, zaraz po opkodzie w pamięci programu (ROM). W asemblerze tryb ten poprzedza się znakiem #.",
      example: "LDAA #$12",
      comment: "załaduj do akumulatora A wartość szesnastkową $12 (tu i teraz)"
    },
    {
      name: "Bezpośrednie (Direct)",
      desc: "Instrukcja zawiera 8-bitowy adres, odwołując się do szybkiej tzw. strony zerowej pamięci RAM ($0000-$00FF). Pozwala to zaoszczędzić miejsce (rozkaz zajmuje 2 bajty) i przyspieszyć wykonanie.",
      example: "LDAA $12",
      comment: "załaduj do A zawartość pamięci spod 8-bitowego adresu $0012"
    },
    {
      name: "Rozszerzone (Extended)",
      desc: "Instrukcja przechowuje pełny, 16-bitowy adres komórki pamięci. Daje to dostęp do całej 64-kilobajtowej przestrzeni adresowej procesora ($0000-$FFFF), ale rozkaz zajmuje 3 bajty.",
      example: "LDAA $1234",
      comment: "załaduj do A zawartość pamięci spod 16-bitowego adresu $1234"
    },
    {
      name: "Indeksowe (Indexed)",
      desc: "Adres docelowy (efektywny) operandu wyliczany jest dynamicznie jako suma wartości 16-bitowego rejestru indeksowego X oraz 8-bitowego przesunięcia (offsetu bez znaku) zakodowanego w instrukcji.",
      example: "LDAA 5,X",
      comment: "załaduj do A zawartość pamięci spod adresu: rejestr X + 5"
    },
    {
      name: "Względne (Relative)",
      desc: "Stosowane wyłącznie w instrukcjach skoków warunkowych. Adres docelowy wyliczany jest poprzez dodanie do aktualnej zawartości Licznika Rozkazów (PC) 8-bitowego offsetu ze znakiem (kod U2). Pozwala to na przeskok w zakresie od -128 do +127 bajtów od adresu następnej instrukcji.",
      example: "BRA $0A",
      comment: "skocz bezwarunkowo o $0A bajtów w przód względem PC+2"
    }
  ],
  intel8051: [] // user deleted intel 8051 specific standalone addressing modes, they are mapped inside topic 2 now
};

export const codeExercises = [
  {
    id: "ex1_loop",
    processor: "MC6800",
    title: "A. Pętla oparta na rejestrze X (1-1000)",
    task: "Zbuduj pętlę w programie, w której będzie zwiększany rejestr X od wartości 1 do wartości 1000.",
    code: [
      { label: "LDX #1", comment: "Ładuje do X stałą wartość 1" },
      { label: "INX", comment: "Dodaje 1 do rejestru X (Inkrementacja) - etykieta pętli" },
      { label: "CPX #1000", comment: "Odejmuje 1000 od rejestru X i zmienia flagi (nie nadpisując samego X)" },
      { label: "BNE $FA", comment: "BNE (Branch Not Equal) - skok wstecz do INX (offset $FA = -6), dopóki flagi Z=0" }
    ],
    initialState: {
      registers: { A: 0, B: 0, X: 1, PC: 0x1000, SP: 0xFFF0, Flags: { Z: 0, N: 0 } },
      memory: {}
    },
    steps: [
      { op: "LDX #1", pc: 0x1000, regs: { X: 1, PC: 0x1003 }, desc: "Załadowanie wartości natychmiastowej 1 do rejestru indeksowego X." },
      { op: "INX", pc: 0x1003, regs: { X: 2, PC: 0x1004 }, desc: "Inkrementacja rejestru X (teraz wynosi 2)." },
      { op: "CPX #1000", pc: 0x1004, regs: { PC: 0x1007, Flags: { Z: 0, N: 0 } }, desc: "Porównanie X z 1000. X=2, więc wynik porównania jest różny od zera (Z = 0)." },
      { op: "BNE $FA", pc: 0x1007, regs: { PC: 0x1003 }, desc: "Z=0, więc warunek skoku BNE jest spełniony. PC skacze z powrotem do rozkazu INX (adres $1003)." }
    ]
  },
  {
    id: "ex2_mul3",
    processor: "MC6800",
    title: "B. Mnożenie przez 3 bez akumulatora (A = B * 3)",
    task: "Pomnóż wartość w akumulatorze B przez liczbę 3 i zapisz wynik do akumulatora A, pomiń przeniesienie (wykorzystaj przesunięcie arytmetyczne ASLA).",
    code: [
      { label: "TBA", comment: "Przerzuca kopię zmiennej z akumulatora B do akumulatora A" },
      { label: "ASLA", comment: "Arytmetyczne przesunięcie bitowe w lewo w akumulatorze A (mnożenie A = A * 2)" },
      { label: "ABA", comment: "Dodaje źródłową wartość z akumulatora B do aktualnego wyniku A (A = B * 2 + B = B * 3)" }
    ],
    initialState: {
      registers: { A: 0, B: 5, X: 0, PC: 0x1000, SP: 0xFFF0, Flags: { Z: 0 } },
      memory: {}
    },
    steps: [
      { op: "TBA", pc: 0x1000, regs: { A: 5, B: 5, PC: 0x1001 }, desc: "Przepisanie wartości rejestru B (5) do akumulatora A (teraz A = 5)." },
      { op: "ASLA", pc: 0x1001, regs: { A: 10, PC: 0x1002 }, desc: "Przesunięcie A w lewo. A = 5 * 2 = 10 (szesnastkowo $0A)." },
      { op: "ABA", pc: 0x1002, regs: { A: 15, B: 5, PC: 0x1003 }, desc: "Dodanie B (5) do A (10). Wynik wynosi 15 (szesnastkowo $0F), czyli 5 * 3." }
    ]
  },
  {
    id: "ex3_comp",
    processor: "MC6800",
    title: "C. Wybór większej liczby (do pamięci $1212)",
    task: "Porównaj dwie liczby w akumulatorach A i B, większą zapisz do komórki pamięci o adresie $1212.",
    code: [
      { label: "CBA", comment: "Porównuje akumulatory i zmienia flagi w rejestrze statusu (wykonuje A - B)" },
      { label: "BCC $05", comment: "Branch if Carry Clear (skok jeśli A >= B) o 5 bajtów do przodu (do STAA $1212)" },
      { label: "STAB $1212", comment: "B było większe - zapisz B do pamięci pod adres $1212" },
      { label: "BRA $03", comment: "BRA (Branch Always) - bezwarunkowy przeskok omijający zapis z akumulatora A" },
      { label: "STAA $1212", comment: "A było większe lub równe - zapisz A do pamięci pod adres $1212" },
      { label: "NOP", comment: "Pusta operacja oparcia skoku (koniec)" }
    ],
    initialState: {
      registers: { A: 12, B: 20, X: 0, PC: 0x1000, SP: 0xFFF0, Flags: { Z: 0, C: 0 } },
      memory: { "1212": 0 }
    },
    steps: [
      { op: "CBA", pc: 0x1000, regs: { PC: 0x1001, Flags: { Z: 0, C: 1 } }, desc: "Porównanie A (12) i B (20). Wynik A - B < 0, więc ustawiana jest flaga Carry (C = 1)." },
      { op: "BCC $05", pc: 0x1001, regs: { PC: 0x1003 }, desc: "BCC wymaga C=0. U nas C=1, więc warunek nie jest spełniony, skok nie następuje." },
      { op: "STAB $1212", pc: 0x1003, regs: { PC: 0x1006 }, mem: { "1212": 20 }, desc: "Zapis rejestru B (20) do komórki pamięci o adresie $1212." },
      { op: "BRA $03", pc: 0x1006, regs: { PC: 0x100B }, desc: "BRA: Bezwarunkowy skok o 3 bajty w przód, omijający instrukcję STAA (skok do NOP)." },
      { op: "NOP", pc: 0x100B, regs: { PC: 0x100C }, desc: "Pusta operacja, koniec programu." }
    ]
  },
  {
    id: "ex4_swap",
    processor: "MC6800",
    title: "D. Podprogram zamiany akumulatorów (SWAP)",
    task: "Napisz podprogram zamieniający miejscami liczby zapisane w akumulatorach A i B przy użyciu stosu.",
    code: [
      { label: "PSHA", comment: "Odkłada surową wartość A na wierzch stosu" },
      { label: "PSHB", comment: "Odkłada surową wartość B na wierzch stosu" },
      { label: "PULA", comment: "Ściąga aktualny wierzchołek stosu (czyli przed chwilą odłożone B) do rejestru A" },
      { label: "PULB", comment: "Ściąga następną wartość ze stosu (czyli odłożone wcześniej A) do rejestru B" },
      { label: "RTS", comment: "Return From Subroutine - powrót z podprogramu" }
    ],
    initialState: {
      registers: { A: 0xAA, B: 0xBB, X: 0, PC: 0x1000, SP: 0xFFF0, Flags: {} },
      memory: {}
    },
    steps: [
      { op: "PSHA", pc: 0x1000, regs: { SP: 0xFFEF, PC: 0x1001 }, mem: { "FFF0": 0xAA }, desc: "PSHA: Zapisanie akumulatora A ($AA) pod adres SP ($FFF0), zmniejszenie SP o 1." },
      { op: "PSHB", pc: 0x1001, regs: { SP: 0xFFEE, PC: 0x1002 }, mem: { "FFF0": 0xAA, "FFEF": 0xBB }, desc: "PSHB: Zapisanie akumulatora B ($BB) pod adres SP ($FFEF), zmniejszenie SP o 1." },
      { op: "PULA", pc: 0x1002, regs: { A: 0xBB, SP: 0xFFEF, PC: 0x1003 }, desc: "PULA: Zwiększenie SP o 1, odczyt ze stosu spod adresu $FFEF ($BB) do rejestru A." },
      { op: "PULB", pc: 0x1003, regs: { B: 0xAA, SP: 0xFFF0, PC: 0x1004 }, desc: "PULB: Zwiększenie SP o 1, odczyt ze stosu spod adresu $FFF0 ($AA) do rejestru B. Zamiana zakończona!" },
      { op: "RTS", pc: 0x1004, regs: { PC: 0x1005 }, desc: "RTS: Powrót z podprogramu do programu głównego." }
    ]
  }
];

export const flashcards = [
  {
    id: "fc1",
    category: "Tryby adresowania MC6800",
    front: "Domniemane (Rejestrowe / Implied) — MC6800",
    back: "Kod instrukcji sam w sobie określa na jakim rejestrze operuje, nie wymaga podawania dodatkowego adresu (np. INX - inkrementuj rejestr X). Rozkaz jest jednobajtowy, a procesor nie musi pobierać adresu z pamięci.",
    association: "Samo gęste. Rozkaz jest tak oczywisty, że sam w sobie wie, co ma robić. Nie musisz podawać mu żadnego adresu w pamięci.",
    keywords: ["kod", "sam w sobie", "rejestrze", "adresu", "inx", "jednobajtowy"]
  },
  {
    id: "fc2",
    category: "Tryby adresowania MC6800",
    front: "Natychmiastowe (Immediate) — MC6800",
    back: "Stała wartość danych (argument) jest wpisana na sztywno w kodzie instrukcji, zaraz po opkodzie. Poprzedza się ją znakiem # (np. LDAA #$12 - załaduj do akumulatora A wartość 12 Hex). Wartość stała zapisana jest bezpośrednio w pamięci programu (ROM) jako część instrukcji.",
    association: "Tu i teraz. Znak #. Zamiast mówić procesorowi 'idź pod adres X i weź stamtąd liczbę', dajesz mu tę liczbę od razu do ręki.",
    keywords: ["stała", "wpisana", "sztywno", "#", "ldaa", "immediate", "natychmiastowe"]
  },
  {
    id: "fc3",
    category: "Tryby adresowania MC6800",
    front: "Bezpośrednie (Direct) — MC6800",
    back: "Instrukcja zawiera 8-bitowy adres, odwołując się do szybkiej tzw. strony zerowej pamięci RAM ($0000-$00FF). Pozwala to zaoszczędzić miejsce (rozkaz zajmuje 2 bajty) i przyspieszyć wykonanie (np. LDAA $12).",
    association: "Szybki skrót. Kod używa tylko połówki adresu (8 bitów), żeby błyskawicznie dostać się do pierwszej strony pamięci.",
    keywords: ["8-bitowy", "strony zerowej", "ram", "$0000", "$00ff", "2 bajty", "bezpośrednie"]
  },
  {
    id: "fc4",
    category: "Tryby adresowania MC6800",
    front: "Rozszerzone (Extended) — MC6800",
    back: "Instrukcja przechowuje pełny, 16-bitowy adres komórki pamięci. Daje to dostęp do całej 64-kilobajtowej przestrzeni adresowej procesora ($0000-$FFFF), ale rozkaz jest trzybajtowy i wymaga pobrania pełnego adresu z pamięci programu (np. LDAA $1234).",
    association: "Pełny zasięg. Używasz długiego adresu, żeby sięgnąć w absolutnie każdy kąt całej pamięci procesora.",
    keywords: ["16-bitowy", "pełny", "$0000-$ffff", "całej", "przestrzeni", "rozszerzone"]
  },
  {
    id: "fc5",
    category: "Tryby adresowania MC6800",
    front: "Indeksowe (Indexed) — MC6800",
    back: "Adres docelowy (efektywny) operandu wyliczany jest dynamicznie jako suma wartości 16-bitowego rejestru indeksowego X oraz 8-bitowego przesunięcia (offsetu bez znaku) zakodowanego w instrukcji (np. LDAA 5,X).",
    association: "Baza + krok. Rejestr X to Twój punkt startowy, a w instrukcji podajesz tylko, o ile kroków od tego punktu masz się przesunąć.",
    keywords: ["indeksowego x", "suma", "przesunięcia", "offsetu", "5,x", "indeksowe"]
  },
  {
    id: "fc6",
    category: "Tryby adresowania MC6800",
    front: "Względne (Relative) — MC6800",
    back: "Stosowane wyłącznie w instrukcjach skoków warunkowych. Adres docelowy wyliczany jest poprzez dodanie do aktualnej zawartości Licznika Rozkazów (PC) 8-bitowego offsetu ze znakiem (kod U2). Zasięg skoku wynosi od -128 do +127 bajtów od adresu następnej instrukcji (np. BRA $0A).",
    association: "Skok względem siebie. Procesor nie skacze pod konkretny adres, tylko np. '10 kroków do przodu' od miejsca, w którym aktualnie stoi.",
    keywords: ["skoków warunkowych", "licznik rozkazów", "pc", "offsetu", "u2", "-128", "127", "względne"]
  },
  {
    id: "fc7",
    category: "Teoria 8051",
    front: "Organizacja wewnętrznej pamięci danych RAM w Intelu 8051",
    back: "Wewnętrzna pamięć RAM standardowego 8051 ma 128 bajtów (00H-7FH) i dzieli się na:\n- 00H-1FH: 4 banki rejestrów roboczych R0-R7 (adresowanie rejestrowe, bezpośrednie, pośrednie)\n- 20H-2FH: obszar adresowany bitowo (16 bajtów, 128 bitów do operacji logicznych)\n- 30H-7FH: pamięć ogólnego przeznaczenia (notes, stos, zmienne)\n- Obszar powyżej 7FH (80H-FFH) to Rejestry Specjalne (SFR) dostępne wyłącznie bezpośrednio.",
    association: "Cztery strefy RAM. Banki na dole, bity pośrodku, notatnik na górze, a rejestry systemowe (SFR) w chmurze powyżej 7FH.",
    keywords: ["128 bajtów", "00h-7fh", "banki rejestrów", "r0-r7", "adresowany bitowo", "sfr", "bezpośrednie"]
  },
  {
    id: "fc8",
    category: "Teoria Magistral",
    front: "Magistrale: adresowa, danych i sterująca w MC6800, MC68HC05, Intel 8051",
    back: "1. Magistrala adresowa: Jednokierunkowa (od CPU), wskazuje adres komórki. MC6800 i 8051 mają szynę 16-bitową (adresowanie do 64 KB).\n2. Magistrala danych: Dwukierunkowa, 8-bitowa. Służy do transferu kodów instrukcji oraz danych operacyjnych.\n3. Magistrala sterująca: Zespół sygnałów zarządzających (R/W, zegar, IRQ, RESET).\n* Uwaga: MC68HC05 to mikrokontroler jednoukładowy i nie ma wyprowadzonych magistral na piny zewnętrzne (są wewnątrz).",
    association: "Autostrady procesora. Adresowa (droga jednokierunkowa dla adresów), Danych (dwukierunkowa dla paczek danych), Sterująca (policja kierująca ruchem). HC05 ma je schowane wewnątrz.",
    keywords: ["adresowa", "jednokierunkowa", "danych", "dwukierunkowa", "sterująca", "r/w", "jednoukładowy"]
  },
  {
    id: "fc9",
    category: "Teoria Sterowników",
    front: "Minimalna konfiguracja sterownika mikroprocesorowego z MC6800",
    back: "Do działania układ wymaga zewnętrznych komponentów:\n1. Dwufazowego, niepokrywającego się generatora zegara systemowego (np. MC6875).\n2. Zewnętrznej pamięci ROM (program, wektory przerwań i resetu).\n3. Zewnętrznej pamięci RAM (stos, zmienne robocze).\n4. Układu RESET (sprzętowa inicjalizacja linii resetu po włączeniu zasilania).",
    association: "Cztery filary MC6800. Zegar (serce), ROM (mózg z wiedzą), RAM (notatnik podręczny), RESET (przycisk narodzin). MC6800 sam nie potrafi żyć bez tej paczki.",
    keywords: ["dwufazowego", "zegar", "mc6875", "rom", "ram", "reset"]
  },
  {
    id: "fc10",
    category: "Teoria Rejestrów",
    front: "Rejestry wewnętrzne MC6800, MC68HC05, Intel 8051",
    back: "- MC6800: Akumulatory A i B (8-bit), Rejestr indeksowy X (16-bit), PC (16-bit), SP (16-bit), CCR (8-bit).\n- MC68HC05: Akumulator A (8-bit), X (8-bit), SP (skrócony), PC, CCR (5-bit).\n- Intel 8051: Akumulator A (8-bit), Rejestr B (8-bit, do mnożenia/dzielenia), DPTR (16-bit), PC (16-bit), SP (8-bit), PSW (8-bit).",
    association: "Składniki rejestrowe. Motorola stawia na indeks X i akumulatory A/B. Intel 8051 na parę A/B, DPTR do pamięci zewnętrznej i wskaźnik SP w RAM.",
    keywords: ["akumulatory a i b", "x (16-bit)", "sp (16-bit)", "ccr", "dptr", "psw"]
  },
  {
    id: "fc11",
    category: "Teoria Stosu",
    front: "Budowa i przeznaczenie stosu [PEWNIAK]",
    back: "Stos to wydzielona sekcja w pamięci RAM mikrokontrolera działająca według architektury LIFO (Last In, First Out) – ostatni zapisany element odczytywany jest jako pierwszy. Pozycję wierzchołka monitoruje rejestr wskaźnika stosu SP (Stack Pointer).\nSłuży do:\n1. Zapisu adresów powrotu z podprogramów (bsr, jsr).\n2. Zapisywania rejestrów CPU i flag podczas przerwań.\n3. Tymczasowego przechowywania danych instrukcjami PSH / PUL.",
    association: "Stos talerzy w restauracji. Nowy talerz kładziesz na samą górę, ściągasz też z góry. SP to palec pokazujący najwyższy talerz.",
    keywords: ["lifo", "ram", "sp", "adresów powrotu", "podprogram", "przerwań", "psh", "pul"]
  },
  {
    id: "fc12",
    category: "Teoria Podprogramów",
    front: "Budowa i przeznaczenie podprogramu [PEWNIAK]",
    back: "Podprogram to wydzielony blok kodu poza główną pętlą. Wywoływany instrukcją JSR/BSR, która odkłada 16-bitowy adres powrotu (PC) na stos i skacze do kodu podprogramu. Kończy się rozkazem RTS (Return from Subroutine), który ściąga adres powrotu ze stosu do PC i wraca do głównego kodu. Zapobiega dublowaniu kodu i organizuje strukturę programu.",
    association: "Zlecenie pracownikowi. Wysyłasz go instrukcją JSR, on robi swoje i po przeczytaniu RTS wraca dokładnie w miejsce wywołania.",
    keywords: ["wydzielony", "jsr", "bsr", "powrotu", "stos", "rts", "dublowaniu"]
  },
  {
    id: "fc13",
    category: "Teoria Przerwań",
    front: "Co to jest i do czego służy wektor przerwań [PEWNIAK]",
    back: "Wektor przerwań to sztywny, predefiniowany adres w pamięci ROM. Przechowuje adres podprogramu obsługi przerwania (ISR). Gdy pojawia się przerwanie sprzętowe (np. IRQ), procesor automatycznie odkłada rejestry na stos, odczytuje z wektora adres ISR, skacze tam i go wykonuje. Procedura kończy się instrukcją RTI/RETI, wznawiającą przerwany program.",
    association: "Tablica alarmowa. Gdy syrena (przerwanie) wyje, procesor patrzy na tablicę (wektor), dowiaduje się pod jaki adres skoczyć (ISR) i biegnie tam ratować sytuację.",
    keywords: ["rom", "adres", "isr", "obsługi przerwania", "rti", "skok"]
  }
];

export const quizQuestions = [
  {
    id: "q1",
    question: "Wskaźnik stosu (SP) w procesorze MC6800 po wykonaniu instrukcji zapisu (PSHA/PSHB):",
    options: [
      "Jest automatycznie dekrementowany o 1",
      "Jest automatycznie inkrementowany o 1",
      "Pozostaje bez zmian",
      "Jest dekrementowany o 2"
    ],
    answer: 0,
    explanation: "W MC6800 stos rośnie w dół pamięci. Po wykonaniu zapisu (PSH) wskaźnik SP jest automatycznie dekrementowany (zmniejszany o 1)."
  },
  {
    id: "q2",
    question: "Który tryb adresowania w MC6800 wymaga użycia znaku # przed wartością stałą?",
    options: [
      "Bezpośrednie (Direct)",
      "Natychmiastowe (Immediate)",
      "Rozszerzone (Extended)",
      "Indeksowe (Indexed)"
    ],
    answer: 1,
    explanation: "Tryb natychmiastowy (Immediate) jest oznaczany znakiem #, a wartość argumentu jest wpisana bezpośrednio po kodzie operacji w ROM."
  },
  {
    id: "q3",
    question: "Gdzie w strukturze mapy pamięci von Neumanna (MC6800) leżą wektory przerwań i resetu?",
    options: [
      "Na samym początku (adresy $0000-$00FF)",
      "W obszarze rejestrów SFR",
      "Na samym końcu przestrzeni adresowej (np. $FFF0-$FFFF)",
      "Są rozproszone po całej pamięci RAM"
    ],
    answer: 2,
    explanation: "W architekturze von Neumanna wektory przerwań i resetu są umieszczone pod z góry ustalonymi najwyższymi adresami pamięci ROM (np. od $FFF0 do $FFFF)."
  },
  {
    id: "q4",
    question: "W jakim trybie działania timera w Intel 8051 następuje automatyczne przeładowanie wartości początkowej z rejestru TH do TL po przepełnieniu?",
    options: [
      "Tryb 0",
      "Tryb 1",
      "Tryb 2 (8-bitowy z automatycznym przeładowaniem)",
      "Tryb 3"
    ],
    answer: 2,
    explanation: "Tryb 2 to 8-bitowy timer z automatycznym przeładowaniem. Po przepełnieniu TL, stała początkowa z TH jest sprzętowo kopiowana do TL i odliczanie startuje od nowa."
  },
  {
    id: "q5",
    question: "Jaki jest rozmiar wskaźnika stosu (SP) w mikrokontrolerze Intel 8051?",
    options: [
      "16 bitów",
      "8 bitów",
      "5 bitów",
      "12 bitów"
    ],
    answer: 1,
    explanation: "Wskaźnik stosu SP w Intel 8051 jest rejestrem 8-bitowym, ponieważ stos tego procesora jest zlokalizowany w wewnętrznej pamięci RAM (zakres adresów 00H-7FH)."
  },
  {
    id: "q6",
    question: "Co robi instrukcja powrotu z podprogramu (RTS) w MC6800?",
    options: [
      "Ściąga ze stosu odłożone rejestry CCR i akumulatory",
      "Zmniejsza wskaźnik stosu SP o 2",
      "Ściąga ze stosu 16-bitowy adres powrotu i wpisuje go do licznika rozkazów PC",
      "Resetuje linie przerwania sprzętowego"
    ],
    answer: 2,
    explanation: "Instrukcja RTS (Return from Subroutine) zdejmuje ze stosu uprzednio odłożony 16-bitowy adres powrotu i wpisuje go do rejestru PC, co umożliwia wznowienie głównego programu."
  },
  {
    id: "q7",
    question: "Który z procesorów posiada wewnętrzne, niewyprowadzone na piny zewnętrzne magistrale adresową i danych?",
    options: [
      "MC6800",
      "Intel 8051",
      "MC68HC05",
      "Wszystkie powyższe"
    ],
    answer: 2,
    explanation: "MC68HC05 to mikrokontroler jednoukładowy, co oznacza, że magistrale danych i adresowa są zintegrowane wewnątrz struktury krzemowej i nie są wyprowadzone na zewnątrz."
  },
  {
    id: "q8",
    question: "Obszar pamięci RAM w Intel 8051 adresowany bezpośrednio bitowo rozciąga się w zakresie adresów:",
    options: [
      "00H do 1FH",
      "20H do 2FH",
      "30H do 7FH",
      "80H do FFH"
    ],
    answer: 1,
    explanation: "Obszar adresowany bitowo w standardowym 8051 to 16 bajtów w zakresie od 20H do 2FH, dając 128 adresowalnych pojedynczych bitów."
  }
];
