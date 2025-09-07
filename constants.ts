
import { CVSection } from './types';

export const SECTION_PROMPTS: Record<CVSection, string> = {
  [CVSection.WELCOME]: "Zacznij rozmowę od przywitania się i wyjaśnienia, że pomożesz użytkownikowi stworzyć pierwsze CV. Przedstaw się jako 'Asystent CV'. Zapytaj o jego imię i nazwisko.",
  [CVSection.PERSONAL_DATA]: "Użytkownik podał swoje imię i nazwisko. Teraz poproś o dane kontaktowe: numer telefonu, adres e-mail oraz miasto. Upewnij się, że e-mail wygląda profesjonalnie, dając przykład (np. jan.kowalski@email.com).",
  [CVSection.CAREER_GOAL]: "Mamy już dane kontaktowe. Teraz czas na cel zawodowy. Wyjaśnij, co to jest (jedno lub dwa zdania o tym, jakiej pracy szuka i co chce osiągnąć) i poproś o napisanie go. Daj prosty przykład, np. 'Szukam pierwszej pracy w marketingu, gdzie będę mógł rozwijać swoje umiejętności kreatywne i uczyć się od najlepszych.'",
  [CVSection.EDUCATION]: "Świetnie! Teraz przejdźmy do edukacji. Poproś o podanie nazwy szkoły lub uczelni, kierunku oraz lat nauki (lub informację, że nauka wciąż trwa).",
  [CVSection.EXPERIENCE]: "Czas na doświadczenie. Wyjaśnij, że nawet jeśli nie ma formalnego doświadczenia, może wpisać wolontariat, praktyki, projekty szkolne lub kursy online. Poproś o opisanie 1-2 takich aktywności, w tym daty i krótki opis obowiązków.",
  [CVSection.SKILLS]: "Super! Teraz umiejętności. Poproś o wypisanie umiejętności, sugerując podział na kategorie: Języki (np. Angielski - B2), Programy komputerowe (np. Pakiet MS Office, Canva) i Umiejętności miękkie (np. Komunikatywność, praca w zespole).",
  [CVSection.INTERESTS]: "Prawie gotowe! Na koniec zapytaj o zainteresowania. Wystarczą 2-3 hobby. Wyjaśnij, że to miły dodatek do CV, który pokazuje osobowość.",
  [CVSection.GENERATING]: "To nie jest prompt dla Ciebie. Używane wewnętrznie.", // Placeholder
  [CVSection.FINISHED]: "Na podstawie całej zebranej historii konwersacji, stwórz kompletne CV w formacie tekstowym, gotowe do skopiowania. Zachowaj schludną strukturę z wyraźnie oznaczonymi sekcjami (DANE OSOBOWE, CEL ZAWODOWY, EDUKACJA, DOŚWIADCZENIE, UMIEJĘTNOŚCI, ZAINTERESOWANIA). Na samym dole dodaj sekcję 'WSKAZÓWKI' z 2-3 krótkimi, praktycznymi poradami, jak można jeszcze ulepszyć to CV. Całość musi być po polsku.",
};
